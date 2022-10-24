<h1>Bioinformatics AI Drug Discovery Project</h1>


Dependencies: 


ChemBL and rdkit: 


```python 
conda install -c rdkit rdkit -y
``` 


Bash:


```python 
conda install -c conda-forge bash
``` 

or, alternatively, run Bash from Git Desktop.


TextWrap3: 

```python 
pip install textwrap3
``` 


Other: Matplotlib, Seaborn, Pandas, Numpy, Scikit-Learn, SciPy
```python 
pip install matplotlib seaborn pandas numpy scikit-learn scipy
``` 
<h2>Table of Contents</h2>


  **[Introduction](https://github.com/williamhuang3/bioinformatics-drug-project/#Introduction)**
  
  
  **[Plotting](https://github.com/williamhuang3/bioinformatics-drug-project/#Plotting)**
  
  
  **[Regression](https://github.com/williamhuang3/bioinformatics-drug-project/#Regression)**
  
  
  **[Example Input(s)](https://github.com/williamhuang3/bioinformatics-drug-project/#Example-Inputs)**
  
  
  **[More Info and Credits](https://github.com/williamhuang3/bioinformatics-drug-project/#More-Info-And-Credits)**
<h2>Introduction</h2>


  This program uses the ChemBL Database to find a chemical/biological target, 
  (in this example, Histone Deacetylase 1) and then uses the Lipinski Rule of 5 
  to evaluate the compounds that interact with the target to locate viable drug/
  treatment candidates. First, we look at compounds evaluated by a metric called the 'IC50'.
  The IC50 essentially identifies the concentration of a drug necessary
  to inhibit a biological process by half, thus making it a good marker
  for drug efficacy, along with other variables that altogether are part
  of the Lipinski Molecular Descriptors, which evaluate a compound's
  overall bioactivity. We will be calculating how well the interacting
  compounds score on the Lipinski Molecular Descriptors, comparing an
  active group (IC50 >= 10000) and an inactive group (IC50 <= 1000).
  
  
  We will then use another collection of descriptors, the PaDEL
  Descriptors, to 'predict' an IC50 value for each compound using Random Forest Regression, and compare it
  to the actual IC50, which has many applications. For instance, useful in that we can attempt to
  gauge a compound's bioactivity towards a certain inhibitor without
  having to actually experimentally determine the IC50, saving R&D costs and
  increasing the accessibility of IC50 data.
  
  
<h2>Plotting</h2>     


  All evaluated data for the Lipinski Descriptors will be plotted used Matplotlib/Seaborn and saved as pngs in the
  directory.
  
  <h4>Molecular Weight: Active vs. Inactive</h4>
  
  
  ![plot_MW.png](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/plot_MW.png)
  <h4>Molecular Weight vs. Log(P): Active vs. Inactive</h4>
  
  
  ![plot_MW_vs_LogP.png](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/plot_MW_vs_LogP.png)
  <h4>Number of Hydrogen Acceptors: Active vs. Inactive</h4>
  
  
  ![plot_NumHAcceptors.png](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/plot_NumHAcceptors.png)
   <h4>Number of Hydrogen Donors: Active vs. Inactive</h4>
   
   
  ![plot_NumHDonors.png](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/plot_NumHDonors.png) 
  <h4>IC50 Values: Active vs. Inactive</h4>
  
  
  ![plot_ic50.png](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/plot_ic50.png)
  <h4>LogP: Active vs. Inactive</h4>
  
  
  ![LogP](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/plot_LogP.png)
  <h4>Frequencies: Active vs. Inactive</h4>
  
  
  ![plot_bioactivity_class.png](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/plot_bioactivity_class.png)


<h2>Regression</h2>


  We will then use another collection of descriptors, the PaDEL
  Descriptors, with `bash padel.sh` to describe the data and then try to 'predict' an IC50
  value for each compound using Random Forest Regression, and compare it
  to the actual IC50.

  ![predicted_experimental_pIC50.png](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/predicted_experimental_pIC50.png)
    
  This predicted IC50 value can be useful in that we can attempt to
  gauge a compound's bioactivity towards a certain inhibitor without
  having to actually experimentally determine the IC50, saving R&D costs and
  increasing the accessibility of IC50 data.
  
  
  
<h2>Example Input(s)</h2>

  Data to try: CHEMBL325 (Histone deacetylase 1), CHEMBL2094109 (Muscarinic acetylcholine receptor), 	CHEMBL3927 (SARS coronavirus 3C-like proteinase)
  
  
  In this example, I used CHEMBL325:
  
  
  ![Example Screen](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/Screenshot%20(24).png)
  ![Example Screen: Mann-Whitney Results](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/Screenshot%20(26).png)  
  
  
  
<h2>More Info and Credits</h2>

 [IC50 Definition](https://en.wikipedia.org/wiki/IC50)
  
  
 [Lipinski Rule of 5](https://en.wikipedia.org/wiki/Lipinski%27s_rule_of_five#:~:text=Lipinski's%20rule%20states%20that%2C%20in,all%20nitrogen%20or%20oxygen%20atoms)
  
  
 [ChemBL Database](https://www.ebi.ac.uk/chembl/)
  
  
 [Random Forest Regression](https://levelup.gitconnected.com/random-forest-regression-209c0f354c84?gi=302f1da7802c#:~:text=Random%20Forest%20Regression%20is%20a%20supervised%20learning%20algorithm%20that%20uses,prediction%20than%20a%20single%20model.)


 Libraries: Numpy, Pandas, Matplotlib, Seaborn, SciPy, SKlearn, TextWrap3
 
 
 Inspired by Data Professor on YT and machinelearningmastery.com
 
 
 Creators: William Huang
 
 




