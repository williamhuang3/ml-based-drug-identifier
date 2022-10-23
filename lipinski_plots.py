#William Huang
#Bioinformatics Data Project
#Dependencies: ChemBL and rdkit (conda install -c rdkit rdkit -y)
import seaborn as sns
sns.set(style='ticks')
import matplotlib.pyplot as plt

class lipinski_plots:
    df = 0

    def __init__(self, df):
        self.df = df

    def bar_graph(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.countplot(x='class', data=df, edgecolor='black')

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('Frequency', fontsize=14, fontweight='bold')
        plt.show
        plt.savefig('plot_bioactivity_class.pdf')

    def scatter_plot(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.scatterplot(x='MW', y='LogP', data=df, hue='class', size='pIC50', edgecolor='black', alpha=0.7)

        plt.xlabel('MW', fontsize=14, fontweight='bold')
        plt.ylabel('LogP', fontsize=14, fontweight='bold')
        plt.legend(bbox_to_anchor=(1.05, 1), loc=2, borderaxespad=0)
        plt.savefig('plot_MW_vs_LogP.pdf')

    def pIC_50_plot(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='pIC50', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('pIC50 value', fontsize=14, fontweight='bold')

        plt.savefig('plot_ic50.pdf')

    def mol_weight(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='MW', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('MW', fontsize=14, fontweight='bold')

        plt.savefig('plot_MW.pdf')

    def logP(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='LogP', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('LogP', fontsize=14, fontweight='bold')

        plt.savefig('plot_LogP.pdf')

    def num_hdonors(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='NumHDonors', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('NumHDonors', fontsize=14, fontweight='bold')

        plt.savefig('plot_NumHDonors.pdf')

    def num_hacceptors(self, df):
        plt.figure(figsize=(5.5, 5.5))

        sns.boxplot(x='class', y='NumHAcceptors', data=df)

        plt.xlabel('Bioactivity class', fontsize=14, fontweight='bold')
        plt.ylabel('NumHAcceptors', fontsize=14, fontweight='bold')

        plt.savefig('plot_NumHAcceptors.pdf')