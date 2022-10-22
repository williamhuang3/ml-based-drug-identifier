#William Huang
#Bioinformatics Data Project
#Dependencies: ChemBL and rdkit (conda install -c rdkit rdkit -y)
# Bash: conda install -c conda-forge bash
import pandas as pd
import numpy as np
from chembl_webresource_client.new_client import new_client
from rdkit import Chem
from rdkit.Chem import Descriptors, Lipinski
from lipinski_plots import lipinski_plots as lp
from numpy.random import seed
from numpy.random import randn
from scipy.stats import mannwhitneyu
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_selection import VarianceThreshold
import seaborn as sns
sns.set(style='ticks')
import matplotlib.pyplot as plt


#this function retrieves data (compounds and their molecular info) for a specific target (e.g coronavirus)
def retrievedata():
    target = new_client.target
    target_query = target.search('CHEMBL325')
    targets = pd.DataFrame.from_dict(target_query)
    selected_target = targets.target_chembl_id[0]
    print(selected_target)
    activity = new_client.activity
    res = activity.filter(target_chembl_id=selected_target).filter(standard_type="IC50")
    print(len(res))
    df = pd.DataFrame.from_dict(res)
    if df.empty or len(df) < 25:
        print("This data frame has little to no IC50 values.")
        return
    preprocess(df)

#this function preprocesses the data by subsetting to a
def preprocess(df):
    #subset for non NAs
    subset = df[df.standard_value.notna()]
    print(len(subset))
    #subset for non 0 IC50
    subset = subset.loc[subset.standard_value != '0.0']
    print(len(subset))
    #subset for those with canonical smiles data
    subset = subset[df.canonical_smiles.notna()]
    #drop duplicates
    subset = subset.drop_duplicates(['canonical_smiles'])

    #we only want the chem ID, canonical smiles info, and the IC50
    selection = ['molecule_chembl_id', 'canonical_smiles', 'standard_value']
    subset = subset[selection]

    #now we label compounds based on their activity
    labelcompounds(subset)


#This function labels compounds based on their IC50: inactive, active, or intermediate and "cleans"
#canonical smiles data for the longest segment in between '.'s
def labelcompounds(df):
    bioactivity_threshold = []
    for i in df.standard_value:
        if float(i) >= 10000:
            bioactivity_threshold.append("inactive")
        elif float(i) <= 1000:
            bioactivity_threshold.append("active")
        else:
            bioactivity_threshold.append("intermediate")

    #turn the list into a series
    bioactivity_class = pd.Series(bioactivity_threshold, name='class')
    df.reset_index(drop=True, inplace=True)

    #adds the class column to df
    labeled = pd.concat([df, bioactivity_class], axis=1)

    #removes the current canonical smiles
    labeled_no_smiles = labeled.drop(columns='canonical_smiles')
    smiles = []

    #get the highlighted parts of the canonical smiles data
    for i in df.canonical_smiles.tolist():
        cpd = str(i).split('.')
        cpd_longest = max(cpd, key=len)
        smiles.append(cpd_longest)

    #adding the highlighted parts of can. smiles data
    smiles = pd.Series(smiles, name='canonical_smiles')
    df_cleaned_smiles = pd.concat([labeled_no_smiles, smiles], axis=1)

    #now, we evaluate based on lipinski descriptors
    evaluate_drug(labeled, df_cleaned_smiles)

#this function uses the 5 lipinski descriptors to evaluate the compounds via a Mann-whitney test
# and graphs the data with matplotlib
def evaluate_drug(df, df_cleaned_smiles):

    #appends lipinski descriptors to dataframe
    df_lipinski = lipinski_descriptors(df_cleaned_smiles.canonical_smiles)
    df_combined = pd.concat([df, df_lipinski], axis=1)

    #normalizes the IC50
    df_normal = norm_values(df_combined)
    #turns IC50 to pIC50
    df_final = to_pIC50(df_normal)

    #saves final data to csv for reference
    df_final.to_csv('bioactivity_final.csv', index=False)

    #testing_df subsets for active and inactive values
    testing_df = df_final[df_final['class'] != 'intermediate']
    lipinskiplot = lp(testing_df)
    lipinskiplot.bar_graph(testing_df)
    lipinskiplot.scatter_plot(testing_df)
    lipinskiplot.pIC_50_plot(testing_df)
    print(mannwhitney(df, testing_df, 'pIC50'))
    lipinskiplot.mol_weight(testing_df)
    print(mannwhitney(df, testing_df, 'MW'))
    lipinskiplot.logP(testing_df)
    print(mannwhitney(df, testing_df, 'LogP'))
    lipinskiplot.num_hdonors(testing_df)
    print(mannwhitney(df, testing_df, 'NumHDonors'))
    lipinskiplot.num_hacceptors(testing_df)
    print(mannwhitney(df, testing_df, 'NumHAcceptors'))

# changes IC50 to pIC50
def to_pIC50(input):
    pIC50 = []

    for i in input['standard_value_norm']:
        molar = i * (10 ** -9)  # Converts nM to M
        pIC50.append(-np.log10(molar))

    input['pIC50'] = pIC50
    x = input.drop('standard_value_norm', 1)

    return x

#normalizes the IC50
def norm_values(input):
    norm = []

    for i in input['standard_value']:
        i = float(i)
        if i > 100000000:
            i = 100000000
        norm.append(i)

    input['standard_value_norm'] = norm
    x = input.drop('standard_value', 1)

    return x

#calculates the lipinski descriptors based on chemical information
def lipinski_descriptors(smiles, verbose=False):
    # Inspired by: https://codeocean.com/explore/capsules?query=tag:data-curation
    moldata = []
    for elem in smiles:
        mol = Chem.MolFromSmiles(elem)
        moldata.append(mol)

    baseData = np.arange(1, 1)
    i = 0
    for mol in moldata:

        desc_MolWt = Descriptors.MolWt(mol)
        desc_MolLogP = Descriptors.MolLogP(mol)
        desc_NumHDonors = Lipinski.NumHDonors(mol)
        desc_NumHAcceptors = Lipinski.NumHAcceptors(mol)

        row = np.array([desc_MolWt,
                        desc_MolLogP,
                        desc_NumHDonors,
                        desc_NumHAcceptors])

        if (i == 0):
            baseData = row
        else:
            baseData = np.vstack([baseData, row])
        i = i + 1

    columnNames = ["MW", "LogP", "NumHDonors", "NumHAcceptors"]
    descriptors = pd.DataFrame(data=baseData, columns=columnNames)

    return descriptors

#performs Mann Whitney test and outputs null hypothesis reject/fail to reject
def mannwhitney(df, df_2class, descriptor, verbose=False):
    # https://machinelearningmastery.com/nonparametric-statistical-significance-tests-in-python/
    # seed the random number generator
    seed(1)

    # actives and inactives
    selection = [descriptor, 'class']
    df = df_2class[selection]
    active = df[df['class'] == 'active']
    active = active[descriptor]

    selection = [descriptor, 'class']
    df = df_2class[selection]
    inactive = df[df['class'] == 'inactive']
    inactive = inactive[descriptor]

    # compare samples
    stat, p = mannwhitneyu(active, inactive)
    # print('Statistics=%.3f, p=%.3f' % (stat, p))

    # interpret
    alpha = 0.05
    if p > alpha:
        interpretation = 'Same distribution (fail to reject H0)'
    else:
        interpretation = 'Different distribution (reject H0)'

    results = pd.DataFrame({'Descriptor': descriptor,
                            'Statistics': stat,
                            'p': p,
                            'alpha': alpha,
                            'Interpretation': interpretation}, index=[0])
    filename = 'mannwhitneyu_' + descriptor + '.csv'
    results.to_csv(filename, index=False)

    return results

def predict_from_pIC50():
    df = pd.read_csv('bioactivity_final.csv')
    selection = ['canonical_smiles', 'molecule_chembl_id']
    df_selection = df[selection]
    df_selection.to_csv('molecule.smi', sep='\t', index=False, header=False)
    print("\n\n\n", "-" * 75)
    print("Now, you need to run \" bash padel.sh\" in Git for Windows or another shell/command prompt that supports bash.")
    print("This is necessary to retrieve the PaDEL descriptors for the Random Forest regression!")
    print("-" * 75,"\n\n\n")
    valid_ans = False
    while(not valid_ans):
        ans = input("\n\n\nDid you run \" bash padel.sh\" yet? (Y/N):    ")
        if(ans.upper() == "Y"):
            valid_ans = True
        elif(ans.upper() == "N"):
            print("Run the \" bash padel.sh\" command to get the PaDEL descriptors.")
        else:
            print("Please enter a valid command: (Y/N)")
    X = pd.read_csv('descriptors_output.csv').drop(columns=['Name'])
    Y = df['pIC50']
    #relating pIC50 to the molecular descriptors
    dataset = pd.concat([X, Y], axis=1)
    dataset.to_csv('bioactivity_data_pubchem_padel.csv')
    selection = VarianceThreshold(threshold=(.8 * (1 - .8)))
    X = selection.fit_transform(X)
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2)
    model = RandomForestRegressor(n_estimators=100)
    model.fit(X_train, Y_train)
    r2 = model.score(X_test, Y_test)
    predictions = model.predict(X_test)
    plt.clf()
    sns.set(color_codes=True)
    sns.set_style("white")

    ax = sns.regplot(x = Y_test, y = predictions, scatter_kws={'alpha': 0.4})
    ax.set_xlabel(xlabel = 'Experimental pIC50', fontsize='large', fontweight='bold')
    ax.set_ylabel(ylabel = 'Predicted pIC50', fontsize='large', fontweight='bold')
    ax.set_xlim(min(Y_test), max(Y_test))
    ax.set_ylim(min(predictions), max(predictions))
    ax.figure.set_size_inches(10, 10)
    ax.get_figure().savefig('predicted_experimental_pIC50.pdf')

if __name__ == '__main__':
    print("\n\n\n","-"*75)
    print(" _     _       _        __                            _   _          ")
    print("| |__ (_) ___ (_)_ __  / _| ___  _ __ _ __ ___   __ _| |_(_) ___ ___ ")
    print("| '_ \| |/ _ \| | '_ \| |_ / _ \| '__| '_ ` _ \ / _` | __| |/ __/ __|")
    print("| |_) | | (_) | | | | |  _| (_) | |  | | | | | | (_| | |_| | (__\__ \ ")
    print("|_.__/|_|\___/|_|_| |_|_|  \___/|_|  |_| |_| |_|\__,_|\__|_|\___|___/")

    print("                 _           _")
    print(" _ __  _ __ ___ (_) ___  ___| |_")
    print("| '_ \| '__/ _ \| |/ _ \/ __| __|")
    print("| |_) | | | (_) | |  __/ (__| |_")
    print("| .__/|_|  \___// |\___|\___|\__|")
    print("|_|           |__/    ")
    print("-" * 75,"\n\n\n")
    retrievedata()
    predict_from_pIC50()


