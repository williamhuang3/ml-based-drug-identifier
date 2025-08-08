#William Huang
#DrugPredict - Bioinformatics Data Project
#Refactored for Flask API integration

import logging
import pandas as pd
import numpy as np
from chembl_webresource_client.new_client import new_client
from rdkit import Chem
from rdkit.Chem import Descriptors, Lipinski
import sys
import os
sys.path.append(os.path.dirname(__file__))
from lipinski_plots import lipinski_plots as lp
from numpy.random import seed
from scipy.stats import mannwhitneyu
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_selection import VarianceThreshold
import seaborn as sns
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for web
import matplotlib.pyplot as plt
import os
import subprocess

# Configure logging
logger = logging.getLogger(__name__)

# Reduce ChemBL client logging verbosity
logging.getLogger('chembl_webresource_client').setLevel(logging.WARNING)
logging.getLogger('urllib3').setLevel(logging.WARNING)

def get_data_directory(subdir=None):
    """
    Get the path to the data directory
    
    Args:
        subdir (str): Subdirectory within data (e.g., 'processed', 'outputs')
        
    Returns:
        str: Path to the data directory
    """
    base_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
    if subdir:
        return os.path.join(base_dir, subdir)
    return base_dir

def retrievedata_for_target(target_name, limit='1000'):
    """
    Retrieve data for a specific target from ChemBL database
    
    Args:
        target_name (str): Target name or ChemBL ID (if starts with CHEMBL, treated as ID)
        limit (str): Number of compounds to retrieve ('all' for all available)
        
    Returns:
        tuple: (pd.DataFrame, str, str) - (data, original_target_name, chembl_id)
    """
    try:
        logger.info(f"Searching for target: {target_name}")
        
        target = new_client.target
        original_target_name = target_name  # Store the original name for display
        
        # Check if target_name is a ChemBL ID (starts with CHEMBL)
        if target_name.upper().startswith('CHEMBL'):
            # Use the ID directly
            selected_target = target_name.upper()
            logger.info(f"Using provided ChemBL ID: {selected_target}")
            # For ChemBL IDs, try to get the human-readable name
            try:
                target_details = target.get(selected_target)
                if target_details and 'pref_name' in target_details:
                    original_target_name = target_details['pref_name']
            except:
                # If we can't get the name, keep the ChemBL ID
                pass
        else:
            # Search by name and select first result
            target_query = target.search(target_name)
            targets = pd.DataFrame.from_dict(target_query)
            
            if targets.empty:
                raise ValueError(f"No targets found for: {target_name}")
                
            selected_target = targets.target_chembl_id[0]
            logger.info(f"Found target by name search: {selected_target}")
            # Keep the original human-readable name
        
        activity = new_client.activity
        activity_query = activity.filter(target_chembl_id=selected_target).filter(standard_type="IC50")
        
        # Apply limit if specified
        if limit == 'all':
            logger.info("Retrieving all available compounds (no limit)")
            res = activity_query
        else:
            limit_int = int(limit)
            logger.info(f"Limiting to {limit_int} compounds")
            res = activity_query[:limit_int]
        
        df = pd.DataFrame.from_dict(res)
        
        if df.empty or len(df) < 10:
            raise ValueError(f"Insufficient IC50 data for target: {target_name} (found {len(df)} compounds, minimum 10 required)")
            
        logger.info(f"Retrieved {len(df)} compounds for {original_target_name}")
        return df, original_target_name, selected_target
        
    except Exception as e:
        logger.error(f"Failed to retrieve data for {target_name}: {str(e)}")
        raise

def preprocess_data(df):
    """
    Preprocess the raw ChemBL data
    
    Args:
        df (pd.DataFrame): Raw ChemBL data
        
    Returns:
        pd.DataFrame: Preprocessed data
    """
    logger.info("Starting data preprocessing...")
    
    initial_count = len(df)
    
    # Remove NAs in standard_value
    df = df[df.standard_value.notna()]
    logger.info(f"After removing NA values: {len(df)} compounds")
    
    # Remove zero IC50 values
    df = df.loc[df.standard_value != '0.0']
    logger.info(f"After removing zero IC50: {len(df)} compounds")
    
    # Keep only compounds with canonical SMILES
    df = df[df.canonical_smiles.notna()]
    logger.info(f"After requiring SMILES: {len(df)} compounds")
    
    # Remove duplicates based on canonical SMILES
    df = df.drop_duplicates(['canonical_smiles'])
    logger.info(f"After removing duplicates: {len(df)} compounds")
    
    # Select only needed columns
    df = df[['molecule_chembl_id', 'canonical_smiles', 'standard_value']]
    
    if df.empty:
        raise ValueError("No compounds remaining after preprocessing")
        
    logger.info(f"Preprocessing complete: {initial_count} → {len(df)} compounds")
    return df

def labelcompounds_data(df):
    """
    Label compounds based on IC50 values and clean SMILES
    
    Args:
        df (pd.DataFrame): Preprocessed data
        
    Returns:
        pd.DataFrame: Labeled data with cleaned SMILES
    """
    logger.info("Labeling compounds by bioactivity...")
    
    # Classify compounds based on IC50 thresholds
    bioactivity_threshold = []
    for ic50_value in df.standard_value:
        ic50_float = float(ic50_value)
        if ic50_float >= 10000:
            bioactivity_threshold.append("inactive")
        elif ic50_float <= 1000:
            bioactivity_threshold.append("active")
        else:
            bioactivity_threshold.append("intermediate")
    
    # Add bioactivity class
    bioactivity_class = pd.Series(bioactivity_threshold, name='class')
    df = df.reset_index(drop=True)
    df = pd.concat([df, bioactivity_class], axis=1)
    
    # Clean SMILES - take longest fragment
    cleaned_smiles = []
    for smiles in df.canonical_smiles:
        # Split by '.' and take the longest fragment
        fragments = str(smiles).split('.')
        longest_fragment = max(fragments, key=len)
        cleaned_smiles.append(longest_fragment)
    
    df['canonical_smiles'] = cleaned_smiles
    
    # Count by class
    class_counts = df['class'].value_counts()
    logger.info(f"Compound classification: {class_counts.to_dict()}")
    
    return df

def add_lipinski_descriptors(df):
    """
    Calculate and add Lipinski descriptors
    
    Args:
        df (pd.DataFrame): Data with cleaned SMILES
        
    Returns:
        pd.DataFrame: Data with Lipinski descriptors
    """
    logger.info("Calculating Lipinski descriptors...")
    
    descriptors_data = []
    failed_smiles = 0
    
    for smiles in df.canonical_smiles:
        try:
            mol = Chem.MolFromSmiles(smiles)
            if mol is not None:
                mw = Descriptors.MolWt(mol)
                logp = Descriptors.MolLogP(mol)
                hdonors = Lipinski.NumHDonors(mol)
                hacceptors = Lipinski.NumHAcceptors(mol)
                
                descriptors_data.append([mw, logp, hdonors, hacceptors])
            else:
                # Use default values for failed SMILES
                descriptors_data.append([np.nan, np.nan, np.nan, np.nan])
                failed_smiles += 1
        except Exception as e:
            descriptors_data.append([np.nan, np.nan, np.nan, np.nan])
            failed_smiles += 1
    
    if failed_smiles > 0:
        logger.warning(f"Failed to calculate descriptors for {failed_smiles} compounds")
    
    # Create descriptors DataFrame
    descriptors_df = pd.DataFrame(
        descriptors_data, 
        columns=["MW", "LogP", "NumHDonors", "NumHAcceptors"]
    )
    
    # Combine with original data
    result_df = pd.concat([df.reset_index(drop=True), descriptors_df], axis=1)
    
    # Remove rows with NaN descriptors
    result_df = result_df.dropna()
    
    logger.info(f"Lipinski descriptors calculated for {len(result_df)} compounds")
    return result_df

def process_ic50_values(df):
    """
    Normalize IC50 values and convert to pIC50
    
    Args:
        df (pd.DataFrame): Data with descriptors
        
    Returns:
        pd.DataFrame: Data with normalized IC50 and pIC50
    """
    logger.info("Processing IC50 values...")
    
    # Normalize IC50 values
    normalized_values = []
    for value in df['standard_value']:
        val_float = float(value)
        if val_float > 100000000:
            val_float = 100000000
        normalized_values.append(val_float)
    
    df['standard_value_norm'] = normalized_values
    
    # Convert to pIC50
    pic50_values = []
    for norm_value in df['standard_value_norm']:
        molar = norm_value * (10 ** -9)  # Convert nM to M
        pic50 = -np.log10(molar)
        pic50_values.append(pic50)
    
    df['pIC50'] = pic50_values
    
    # Remove the intermediate normalized column
    df = df.drop('standard_value_norm', axis=1)
    
    logger.info("IC50 processing complete")
    return df

def perform_statistical_analysis(df):
    """
    Perform Mann-Whitney U tests for each descriptor
    
    Args:
        df (pd.DataFrame): Final processed data
        
    Returns:
        dict: Statistical test results
    """
    logger.info("Performing statistical analysis...")
    
    # Filter to active and inactive only
    testing_df = df[df['class'] != 'intermediate']
    
    if len(testing_df) == 0:
        logger.warning("No active/inactive compounds for statistical testing")
        return {"mannWhitneyTests": [], "summary": {}}
    
    descriptors = ['pIC50', 'MW', 'LogP', 'NumHDonors', 'NumHAcceptors']
    test_results = []
    
    for descriptor in descriptors:
        try:
            result = mannwhitney_test(testing_df, descriptor)
            test_results.append({
                "descriptor": descriptor,
                "statistic": float(result['Statistics'].iloc[0]),
                "pValue": float(result['p'].iloc[0]),
                "interpretation": result['Interpretation'].iloc[0]
            })
            logger.info(f"Mann-Whitney test for {descriptor}: p={result['p'].iloc[0]:.2e}")
        except Exception as e:
            logger.error(f"Failed Mann-Whitney test for {descriptor}: {str(e)}")
    
    # Summary statistics
    class_counts = df['class'].value_counts()
    summary = {
        "activeCount": int(class_counts.get('active', 0)),
        "inactiveCount": int(class_counts.get('inactive', 0)),
        "intermediateCount": int(class_counts.get('intermediate', 0))
    }
    
    return {
        "mannWhitneyTests": test_results,
        "summary": summary
    }

def mannwhitney_test(df_2class, descriptor):
    """
    Perform Mann-Whitney U test for a specific descriptor
    """
    seed(1)
    
    # Get active and inactive groups
    active = df_2class[df_2class['class'] == 'active'][descriptor]
    inactive = df_2class[df_2class['class'] == 'inactive'][descriptor]
    
    if len(active) == 0 or len(inactive) == 0:
        raise ValueError(f"Insufficient data for {descriptor} comparison")
    
    # Perform test
    stat, p = mannwhitneyu(active, inactive)
    
    # Interpret results
    alpha = 0.05
    interpretation = 'Different distribution (reject H0)' if p <= alpha else 'Same distribution (fail to reject H0)'
    
    results = pd.DataFrame({
        'Descriptor': [descriptor],
        'Statistics': [stat],
        'p': [p],
        'alpha': [alpha],
        'Interpretation': [interpretation]
    })
    
    # Save individual result
    processed_dir = get_data_directory('processed')
    os.makedirs(processed_dir, exist_ok=True)
    filename = os.path.join(processed_dir, f'mannwhitneyu_{descriptor}.csv')
    results.to_csv(filename, index=False)
    
    return results

def generate_plots(df):
    """
    Generate all visualization plots
    
    Args:
        df (pd.DataFrame): Final processed data
        
    Returns:
        list: List of generated plot information
    """
    logger.info("Generating visualization plots...")
    
    # Filter for plotting (exclude intermediate for some plots)
    plot_df = df[df['class'] != 'intermediate']
    
    try:
        # Initialize plotting class
        plotter = lp(plot_df)
        
        # Generate plots
        plot_info = []
        
        # Bioactivity class distribution
        plotter.bar_graph(plot_df)
        plot_info.append({
            "name": "Bioactivity Class Distribution",
            "description": "Count of compounds by bioactivity classification",
            "imagePath": "/outputs/plot_bioactivity_class.png",
            "type": "bar"
        })
        
        # Scatter plot MW vs LogP
        plotter.scatter_plot(plot_df)
        plot_info.append({
            "name": "Molecular Weight vs LogP",
            "description": "Relationship between molecular weight and lipophilicity",
            "imagePath": "/outputs/plot_MW_vs_LogP.png",
            "type": "scatter"
        })
        
        # pIC50 distribution
        plotter.pIC_50_plot(plot_df)
        plot_info.append({
            "name": "pIC50 Distribution",
            "description": "Box plot of pIC50 values by bioactivity class",
            "imagePath": "/outputs/plot_ic50.png",
            "type": "box"
        })
        
        # Molecular weight distribution
        plotter.mol_weight(plot_df)
        plot_info.append({
            "name": "Molecular Weight Distribution",
            "description": "Box plot of molecular weights by bioactivity class",
            "imagePath": "/outputs/plot_MW.png",
            "type": "box"
        })
        
        # LogP distribution
        plotter.logP(plot_df)
        plot_info.append({
            "name": "LogP Distribution",
            "description": "Box plot of LogP values by bioactivity class",
            "imagePath": "/outputs/plot_LogP.png",
            "type": "box"
        })
        
        # H-donors distribution
        plotter.num_hdonors(plot_df)
        plot_info.append({
            "name": "Hydrogen Donors Distribution",
            "description": "Box plot of H-bond donors by bioactivity class",
            "imagePath": "/outputs/plot_NumHDonors.png",
            "type": "box"
        })
        
        # H-acceptors distribution
        plotter.num_hacceptors(plot_df)
        plot_info.append({
            "name": "Hydrogen Acceptors Distribution",
            "description": "Box plot of H-bond acceptors by bioactivity class",
            "imagePath": "/outputs/plot_NumHAcceptors.png",
            "type": "box"
        })
        
        logger.info(f"Generated {len(plot_info)} plots")
        return plot_info
        
    except Exception as e:
        logger.error(f"Plot generation failed: {str(e)}")
        return []

def run_ml_analysis(df):
    """
    Run machine learning analysis with Random Forest
    
    Args:
        df (pd.DataFrame): Final processed data
        
    Returns:
        dict: ML results and metrics
    """
    logger.info("Starting machine learning analysis...")
    
    try:
        # Prepare data for PaDEL descriptors
        processed_dir = get_data_directory('processed')
        os.makedirs(processed_dir, exist_ok=True)
        
        df_selection = df[['canonical_smiles', 'molecule_chembl_id']]
        smi_file = os.path.join(processed_dir, 'molecule.smi')
        df_selection.to_csv(smi_file, sep='\t', index=False, header=False)
        
        # Run PaDEL descriptor calculation
        logger.info("Calculating PaDEL descriptors...")
        result = subprocess.run(['bash', 'scripts/padel.sh'], capture_output=True, text=True, timeout=300)
        
        if result.returncode != 0:
            logger.warning("PaDEL calculation failed, using simplified ML analysis")
            return run_simplified_ml(df)
        
        # Load PaDEL descriptors
        descriptors_file = os.path.join(processed_dir, 'descriptors_output.csv')
        if not os.path.exists(descriptors_file):
            logger.warning("PaDEL output not found, using simplified ML analysis")
            return run_simplified_ml(df)
        
        X = pd.read_csv(descriptors_file).drop(columns=['Name'])
        Y = df['pIC50']
        
        # Feature selection
        selector = VarianceThreshold(threshold=(.8 * (1 - .8)))
        X_selected = selector.fit_transform(X)
        
        # Train-test split
        X_train, X_test, Y_train, Y_test = train_test_split(X_selected, Y, test_size=0.2, random_state=42)
        
        # Train Random Forest
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, Y_train)
        
        # Make predictions
        predictions = model.predict(X_test)
        
        # Calculate metrics
        r2_score = model.score(X_test, Y_test)
        mse = np.mean((Y_test - predictions) ** 2)
        mae = np.mean(np.abs(Y_test - predictions))
        rmse = np.sqrt(mse)
        
        # Generate regression plot
        generate_regression_plot(Y_test, predictions)
        
        logger.info(f"ML analysis complete. R² = {r2_score:.3f}")
        
        return {
            "metrics": {
                "r2Score": float(r2_score),
                "mse": float(mse),
                "mae": float(mae),
                "rmse": float(rmse)
            },
            "modelInfo": {
                "algorithm": "Random Forest Regressor",
                "nEstimators": 100,
                "features": int(X_selected.shape[1]),
                "trainingSize": 80,  # 80% training split
                "testSize": 20       # 20% test split
            },
            "regressionPlot": {
                "name": "Predicted vs Experimental pIC50",
                "description": "Scatter plot showing model predictions against experimental values with perfect prediction line",
                "imagePath": "/outputs/predicted_experimental_pIC50.png"
            }
        }
        
    except Exception as e:
        logger.error(f"ML analysis failed: {str(e)}")
        return run_simplified_ml(df)

def run_simplified_ml(df):
    """
    Simplified ML analysis using only Lipinski descriptors
    """
    logger.info("Running simplified ML with Lipinski descriptors only...")
    
    try:
        # Use only Lipinski descriptors
        X = df[['MW', 'LogP', 'NumHDonors', 'NumHAcceptors']]
        Y = df['pIC50']
        
        # Train-test split
        X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)
        
        # Train Random Forest
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, Y_train)
        
        # Make predictions
        predictions = model.predict(X_test)
        
        # Calculate metrics
        r2_score = model.score(X_test, Y_test)
        mse = np.mean((Y_test - predictions) ** 2)
        mae = np.mean(np.abs(Y_test - predictions))
        rmse = np.sqrt(mse)
        
        # Generate regression plot
        generate_regression_plot(Y_test, predictions)
        
        return {
            "metrics": {
                "r2Score": float(r2_score),
                "mse": float(mse),
                "mae": float(mae),
                "rmse": float(rmse)
            },
            "modelInfo": {
                "algorithm": "Random Forest Regressor (Lipinski only)",
                "nEstimators": 100,
                "features": 4,
                "trainingSize": 80,  # 80% training split
                "testSize": 20       # 20% test split
            },
            "regressionPlot": {
                "name": "Predicted vs Experimental pIC50",
                "description": "Scatter plot showing model predictions against experimental values with perfect prediction line",
                "imagePath": "/outputs/predicted_experimental_pIC50.png"
            }
        }
        
    except Exception as e:
        logger.error(f"Simplified ML analysis failed: {str(e)}")
        return {
            "metrics": {"r2Score": 0.0, "mse": 0.0, "mae": 0.0, "rmse": 0.0},
            "modelInfo": {"algorithm": "Failed", "nEstimators": 0, "features": 0, "trainingSize": 0, "testSize": 0},
            "regressionPlot": None
        }

def generate_regression_plot(y_test, predictions):
    """Generate and save regression plot"""
    try:
        plt.figure(figsize=(10, 10))
        plt.scatter(y_test, predictions, alpha=0.4)
        
        # Add perfect prediction line
        min_val = min(min(y_test), min(predictions))
        max_val = max(max(y_test), max(predictions))
        plt.plot([min_val, max_val], [min_val, max_val], 'r--', alpha=0.8)
        
        plt.xlabel('Experimental pIC50', fontsize=14, fontweight='bold')
        plt.ylabel('Predicted pIC50', fontsize=14, fontweight='bold')
        plt.title('Predicted vs Experimental pIC50', fontsize=16, fontweight='bold')
        
        # Save plot to data/outputs directory
        output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'outputs')
        os.makedirs(output_dir, exist_ok=True)
        plt.savefig(os.path.join(output_dir, 'predicted_experimental_pIC50.png'), dpi=300, bbox_inches='tight')
        plt.close()
        
        logger.info("Regression plot saved")
        
    except Exception as e:
        logger.error(f"Failed to generate regression plot: {str(e)}")

# Utility function for API
def run_complete_analysis_pipeline(target_name, limit='1000', tracker=None):
    """
    Main function to run the complete analysis pipeline
    """
    logger.info(f"Starting complete analysis for: {target_name} with limit: {limit}")
    
    # Step 1: Retrieve data
    if tracker:
        tracker.update('retrieving', 15, f'Searching ChemBL database for {target_name}...')
    df_raw, display_target_name, target_id = retrievedata_for_target(target_name, limit)
    
    # Step 2: Preprocess
    if tracker:
        tracker.update('preprocessing', 25, 'Cleaning and filtering compound data...')
    df_preprocessed = preprocess_data(df_raw)
    
    # Step 3: Label compounds
    if tracker:
        tracker.update('labeling', 35, 'Classifying compounds by bioactivity...')
    df_labeled = labelcompounds_data(df_preprocessed)
    
    # Step 4: Add descriptors
    if tracker:
        tracker.update('descriptors', 50, 'Computing molecular properties and Lipinski descriptors...')
    df_with_descriptors = add_lipinski_descriptors(df_labeled)
    
    # Step 5: Process IC50
    if tracker:
        tracker.update('analysis', 60, 'Processing IC50 values and performing statistical analysis...')
    df_final = process_ic50_values(df_with_descriptors)
    
    # Save final dataset
    processed_dir = get_data_directory('processed')
    os.makedirs(processed_dir, exist_ok=True)
    final_dataset_path = os.path.join(processed_dir, 'bioactivity_final.csv')
    df_final.to_csv(final_dataset_path, index=False)
    logger.info(f"Final dataset saved to: {final_dataset_path}")
    
    # Step 6: Statistical analysis
    if tracker:
        tracker.update('analysis', 70, 'Performing Mann-Whitney U tests...')
    stats_results = perform_statistical_analysis(df_final)
    
    # Step 7: Generate plots
    if tracker:
        tracker.update('plotting', 80, 'Creating visualization plots and charts...')
    plot_results = generate_plots(df_final)
    
    # Step 8: ML analysis (after plots for proper progress order)
    if tracker:
        tracker.update('ml', 90, 'Training Random Forest model and making predictions...')
    ml_results = run_ml_analysis(df_final)
    
    logger.info("Analysis pipeline completed successfully")
    
    return df_final, display_target_name, target_id, stats_results, plot_results, ml_results
