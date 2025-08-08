# DrugPredict

A full-stack bioinformatics application that combines Python-based molecular analysis with a modern React/Next.js web interface for AI-powered drug discovery and compound evaluation.

## Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.8+** with conda/pip
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/williamhuang3/ml-based-drug-identifier.git
cd ml-based-drug-identifier
```

2. **Set up Python environment**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Or using conda
conda install -c rdkit rdkit -y
conda install -c conda-forge bash
```

3. **Set up Node.js environment**
```bash
# Install frontend dependencies
npm install
```

4. **Start the development servers**
```bash
# Option 1: Start both servers together
npm run dev-full

# Option 2: Start servers separately (two terminals)
npm run flask-dev    # Terminal 1: Flask backend
npm run dev          # Terminal 2: Next.js frontend
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) (frontend) or [http://localhost:5001](http://localhost:5001) (API)

## Usage

### Web Interface

1. **Start the application** with `npm run dev`
2. **Enter a target name** (e.g., "Coronavirus", "EGFR") or ChemBL ID
3. **Click "Search & Analyze"** to run the analysis pipeline
4. **View results** in the organized tabs:
   - **Overview**: Summary statistics and target information
   - **Compounds**: Detailed compound data table
   - **Statistics**: Mann-Whitney U test results
   - **Visualizations**: Molecular descriptor plots
   - **ML Predictions**: Random Forest regression results

### Command Line (Python)

```bash
# Run the Python analysis directly
python main.py
```

Follow the prompts to:
1. Enter a biological target for analysis
2. Wait for ChemBL data retrieval and processing
3. Run PaDEL descriptor calculation: `bash padel.sh`
4. View generated plots and statistical results

## 📊 Analysis Pipeline

1. **Target Query**: Search ChemBL database for compounds targeting specific proteins
2. **Data Preprocessing**: Filter and clean compound data, remove duplicates
3. **Bioactivity Classification**: Label compounds based on IC50 thresholds
4. **Molecular Descriptors**: Calculate Lipinski descriptors using RDKit
5. **Statistical Testing**: Perform Mann-Whitney U tests between active/inactive groups
6. **Visualization**: Generate box plots, scatter plots, and distribution charts
7. **Machine Learning**: Train Random Forest model using PaDEL descriptors
8. **Prediction**: Generate IC50 predictions and evaluate model performance

## 🎯 Key Metrics

- **IC50 Classification Thresholds**:
  - Active: ≤ 1,000 nM
  - Intermediate: 1,000 - 10,000 nM  
  - Inactive: ≥ 10,000 nM

- **Lipinski Descriptors**:
  - Molecular Weight (MW)
  - Lipophilicity (LogP)
  - Hydrogen Bond Donors
  - Hydrogen Bond Acceptors

- **Model Performance Metrics**:
  - R² Score (coefficient of determination)
  - RMSE (Root Mean Square Error)
  - MAE (Mean Absolute Error)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **William Huang** - Project Creator
- **Data Professor** (YouTube) - Inspiration and tutorials
- **ChemBL Database** - Compound and bioactivity data

---