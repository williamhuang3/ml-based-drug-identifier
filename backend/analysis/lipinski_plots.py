#William Huang
#Bioinformatics Data Project
#Dependencies: ChemBL and rdkit (conda install -c rdkit rdkit -y)
import seaborn as sns
sns.set(style='ticks')
import matplotlib.pyplot as plt
import os

class lipinski_plots:
    df = 0

    def __init__(self, df):
        self.df = df
        # Create output directory if it doesn't exist
        self.output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'outputs')
        os.makedirs(self.output_dir, exist_ok=True)

    def bar_graph(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.countplot(x='class', data=df, edgecolor='black')

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('Frequency', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'plot_bioactivity_class.png'), dpi=300, bbox_inches='tight')
        plt.close()

    def scatter_plot(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.scatterplot(x='MW', y='LogP', data=df, hue='class', size='pIC50', edgecolor='black', alpha=0.7)

        plt.xlabel('MW', fontsize=14, fontweight='bold')
        plt.ylabel('LogP', fontsize=14, fontweight='bold')
        plt.legend(bbox_to_anchor=(1.05, 1), loc=2, borderaxespad=0)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'plot_MW_vs_LogP.png'), dpi=300, bbox_inches='tight')
        plt.close()

    def pIC_50_plot(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='pIC50', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('pIC50 value', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'plot_ic50.png'), dpi=300, bbox_inches='tight')
        plt.close()

    def mol_weight(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='MW', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('MW', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'plot_MW.png'), dpi=300, bbox_inches='tight')
        plt.close()

    def logP(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='LogP', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('LogP', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'plot_LogP.png'), dpi=300, bbox_inches='tight')
        plt.close()

    def num_hdonors(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='NumHDonors', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('NumHDonors', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'plot_NumHDonors.png'), dpi=300, bbox_inches='tight')
        plt.close()

    def num_hacceptors(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='NumHAcceptors', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('NumHAcceptors', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'plot_NumHAcceptors.png'), dpi=300, bbox_inches='tight')
        plt.close()

    def prediction_scatter(self, experimental_pic50, predicted_pic50):
        """Create scatter plot of experimental vs predicted pIC50 values"""
        plt.figure(figsize=(6, 6))
        
        # Create scatter plot
        plt.scatter(experimental_pic50, predicted_pic50, alpha=0.6, edgecolors='black')
        
        # Add diagonal line for perfect prediction
        min_val = min(min(experimental_pic50), min(predicted_pic50))
        max_val = max(max(experimental_pic50), max(predicted_pic50))
        plt.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2, label='Perfect prediction')
        
        # Labels and formatting
        plt.xlabel('Experimental pIC50', fontsize=14, fontweight='bold')
        plt.ylabel('Predicted pIC50', fontsize=14, fontweight='bold')
        plt.title('Experimental vs Predicted pIC50', fontsize=16, fontweight='bold')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        # Save plot
        plt.savefig(os.path.join(self.output_dir, 'predicted_experimental_pIC50.png'), dpi=300, bbox_inches='tight')
        plt.close()