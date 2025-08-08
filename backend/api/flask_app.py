from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS
import logging
import pandas as pd
import numpy as np
import os
import json
import time
from datetime import datetime
import traceback
import threading
from queue import Queue

# Import your analysis functions
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.analysis.main import (
    run_complete_analysis_pipeline
)

app = Flask(__name__)

# Configure CORS for production
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=allowed_origins)  # Enable CORS for Next.js frontend

# Configure logging
log_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, 'drugpredict.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Reduce ChemBL client logging verbosity
logging.getLogger('chembl_webresource_client').setLevel(logging.WARNING)
logging.getLogger('urllib3').setLevel(logging.WARNING)

# Global progress tracking
progress_store = {}

class ProgressTracker:
    def __init__(self, task_id):
        self.task_id = task_id
        self.current_step = 'starting'
        self.progress = 0
        self.status = 'running'
        self.message = 'Initializing analysis...'
        progress_store[task_id] = self
    
    def update(self, step, progress, message):
        self.current_step = step
        self.progress = progress
        self.message = message
        logger.info(f"Progress {self.task_id}: {step} - {progress}% - {message}")
    
    def complete(self, results=None):
        self.status = 'complete'
        self.progress = 100
        self.current_step = 'complete'
        self.message = 'Analysis completed successfully'
        if results:
            self.results = results
    
    def error(self, error_message):
        self.status = 'error'
        self.message = error_message

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "DrugPredict API"
    })

@app.route('/outputs/<filename>')
def serve_output_file(filename):
    """Serve generated plot files"""
    try:
        # Define the outputs directory path - relative to root project directory
        outputs_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'outputs')
        file_path = os.path.join(outputs_dir, filename)
        
        logger.info(f"Attempting to serve file: {file_path}")
        logger.info(f"File exists: {os.path.exists(file_path)}")
        
        # Check if file exists
        if os.path.exists(file_path):
            return send_file(file_path, mimetype='image/png')
        else:
            # List files in directory for debugging
            if os.path.exists(outputs_dir):
                files = os.listdir(outputs_dir)
                logger.info(f"Available files in outputs directory: {files}")
            else:
                logger.error(f"Outputs directory does not exist: {outputs_dir}")
            return jsonify({"error": "File not found"}), 404
            
    except Exception as e:
        logger.error(f"Error serving file {filename}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/targets/search', methods=['GET'])
def search_targets():
    """
    Autocomplete endpoint for target suggestions
    Query parameter: ?q=search_term
    Returns: List of matching targets with metadata
    """
    try:
        query = request.args.get('q', '').strip()
        
        if not query or len(query) < 2:
            return jsonify({"suggestions": []})
        
        logger.info(f"Searching targets for: {query}")
        
        # Import ChemBL client
        from chembl_webresource_client.new_client import new_client
        
        # Search for targets with a limit
        target = new_client.target
        target_query = target.search(query).only(['target_chembl_id', 'pref_name', 'organism', 'target_type'])[:10]
        targets_df = pd.DataFrame.from_dict(target_query)
        
        if targets_df.empty:
            return jsonify({"suggestions": []})
        
        # Format suggestions
        suggestions = []
        for _, row in targets_df.head(10).iterrows():  # Limit to top 10
            suggestion = {
                "id": row.get('target_chembl_id', ''),
                "name": row.get('pref_name', ''),
                "organism": row.get('organism', ''),
                "type": row.get('target_type', ''),
                "description": row.get('pref_name', '')
            }
            suggestions.append(suggestion)
        
        return jsonify({"suggestions": suggestions})
        
    except Exception as e:
        logger.error(f"Target search failed: {str(e)}")
        return jsonify({"suggestions": []})

@app.route('/api/progress/<task_id>', methods=['GET'])
def get_progress(task_id):
    """
    Get progress for a specific analysis task
    """
    tracker = progress_store.get(task_id)
    if not tracker:
        return jsonify({"error": "Task not found"}), 404
    
    response = {
        "taskId": task_id,
        "status": tracker.status,
        "currentStep": tracker.current_step,
        "progress": tracker.progress,
        "message": tracker.message
    }
    
    if tracker.status == 'complete' and hasattr(tracker, 'results'):
        response["results"] = tracker.results
    
    return jsonify(response)

@app.route('/api/search', methods=['POST'])
def analyze_target():
    """
    Main analysis endpoint - starts analysis and returns task ID for progress tracking
    Expects: {"target": "target_name", "limit": "1000"}
    Returns: Task ID for progress tracking
    """
    try:
        data = request.get_json()
        target_name = data.get('target')
        limit = data.get('limit', '1000')  # Default to 1000 if not specified
        
        if not target_name:
            return jsonify({"error": "Target parameter is required"}), 400
        
        # Generate unique task ID
        task_id = f"{target_name}_{limit}_{int(time.time())}"
        
        # Start analysis in background thread
        def run_analysis():
            tracker = ProgressTracker(task_id)
            try:
                logger.info(f"Starting analysis for target: {target_name} with limit: {limit}")
                results = run_complete_analysis(target_name, limit, tracker)
                tracker.complete(results)
                logger.info(f"Analysis completed for target: {target_name}")
            except Exception as e:
                logger.error(f"Analysis failed: {str(e)}")
                tracker.error(str(e))
        
        # Start background thread
        thread = threading.Thread(target=run_analysis)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            "taskId": task_id,
            "status": "started",
            "message": "Analysis started. Use the task ID to check progress."
        })
        
    except Exception as e:
        logger.error(f"Failed to start analysis: {str(e)}")
        return jsonify({
            "error": "Failed to start analysis",
            "message": str(e)
        }), 500

def run_complete_analysis(target_name, limit='1000', tracker=None):
    """
    Run the complete analysis pipeline and return structured results
    """
    try:
        if tracker:
            tracker.update('retrieving', 10, 'Starting data retrieval from ChemBL...')
        
        # Run the complete analysis pipeline with the specified limit
        df_final, display_target_name, target_id, stats_results, plot_results, ml_results = run_complete_analysis_pipeline(target_name, limit, tracker)
        
        if tracker:
            tracker.update('finalizing', 95, 'Compiling final results...')
        
        # Compile results - use display_target_name for user-friendly display
        results = compile_results(display_target_name, target_id, df_final, stats_results, plot_results, ml_results, limit)
        
        return results
        
    except Exception as e:
        logger.error(f"Analysis pipeline failed: {str(e)}")
        raise

def compile_results(target_name, target_id, df_final, stats_results, plot_results, ml_results, limit='1000'):
    """Compile all analysis results into the expected format"""
    
    # Count compounds by class
    class_counts = df_final['class'].value_counts().to_dict()
    
    # Prepare compound data (limit to first 100 for performance)
    compounds = []
    for _, row in df_final.head(100).iterrows():
        compounds.append({
            "id": row['molecule_chembl_id'],
            "smiles": row['canonical_smiles'],
            "ic50": float(row['standard_value']),
            "pic50": float(row['pIC50']),
            "classification": row['class'],
            "mw": float(row['MW']),
            "logp": float(row['LogP']),
            "hdonors": int(row['NumHDonors']),
            "hacceptors": int(row['NumHAcceptors'])
        })
    
    # Convert relative plot URLs to absolute URLs
    base_url = os.getenv('BASE_URL', 'https://ml-based-drug-identifier.onrender.com')
    absolute_plots = []
    for plot in plot_results:
        plot_copy = plot.copy()
        if plot_copy.get('imagePath', '').startswith('/outputs/'):
            plot_copy['imagePath'] = base_url + plot_copy['imagePath']
        absolute_plots.append(plot_copy)
    
    # Convert regression plot URL in ML results to absolute
    ml_results_copy = ml_results.copy()
    if ml_results_copy.get('regressionPlot') and ml_results_copy['regressionPlot'].get('imagePath'):
        if ml_results_copy['regressionPlot']['imagePath'].startswith('/outputs/'):
            ml_results_copy['regressionPlot']['imagePath'] = base_url + ml_results_copy['regressionPlot']['imagePath']
    
    logger.info(f"Converted {len(absolute_plots)} plot URLs to absolute paths with base: {base_url}")
    
    return {
        "success": True,
        "targetName": target_name,
        "targetId": target_id,
        "dataLimit": limit,
        "totalCompounds": len(df_final),
        "activeCompounds": class_counts.get('active', 0),
        "inactiveCompounds": class_counts.get('inactive', 0),
        "intermediateCompounds": class_counts.get('intermediate', 0),
        "compounds": compounds,
        "statistics": stats_results,
        "plots": absolute_plots,
        "predictions": ml_results_copy,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
