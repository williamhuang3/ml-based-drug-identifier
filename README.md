# ML-Based Drug Identifier

## Overview

This project aims to streamline the early phases of drug discovery using AI and bioinformatics, focusing on identifying and evaluating potential drug candidates. By harnessing the ChemBL Database, it searches for compounds that interact with specific chemical or biological targets—using Histone Deacetylase 1 as the primary example. The project assesses these compounds based on the Lipinski Rule of 5 and other molecular descriptors, classifying them into active or inactive groups based on their IC50 values. The IC50 metric is crucial as it measures the concentration required to inhibit a biological process by half, offering insight into a compound's drug efficacy.

Furthermore, the project employs the PaDEL Descriptors for a more in-depth analysis, aiming to predict the IC50 values of compounds using Random Forest Regression. This approach not only facilitates the identification of promising drug candidates but also significantly reduces research and development costs by circumventing the need for extensive experimental testing.

## Dependencies

To run this project, the following dependencies are required:

- **ChemBL and RDKit**:
  ```python
  conda install -c rdkit rdkit -y
  ```
- **Bash** (either through Conda or Git Desktop):
  ```python
  conda install -c conda-forge bash
  ```
- **TextWrap3**:
  ```python
  pip install textwrap3
  ```
- **Other Essential Libraries** (Matplotlib, Seaborn, Pandas, Numpy, Scikit-Learn, SciPy):
  ```python
  pip install matplotlib seaborn pandas numpy scikit-learn scipy
  ```

## Content

- [Introduction](https://github.com/williamhuang3/bioinformatics-drug-project/#Overview)
  - Overview of the project, its objectives, and the methodology used.
- [Getting Started and Example Inputs](https://github.com/williamhuang3/bioinformatics-drug-project/#Getting-Started)
  - Getting started and showing suggested data for trial runs, including CHEMBL325, CHEMBL220, and CHEMBL3927, with CHEMBL325 as the primary example.
- [Plotting](https://github.com/williamhuang3/bioinformatics-drug-project/#Results-and-Visualization)
  - Details on how data for the Lipinski Descriptors are plotted, including examples.
- [Regression](https://github.com/williamhuang3/bioinformatics-drug-project/#Predictive-Modeling)
  - Explanation of how Random Forest Regression is utilized to predict IC50 values.
- [More Info and Credits](https://github.com/williamhuang3/bioinformatics-drug-project/#More-Info-And-Credits)
  - Additional resources and acknowledgments.

## Getting Started

To initiate drug discovery, follow the installation steps to set up the environment and install necessary dependencies. Next, select a target from the suggested list or choose one of interest to you. The process involves extracting data on compounds interacting with the target, analyzing their properties according to the Lipinski Rule of 5, and employing statistical and machine learning models to evaluate their potential as drug candidates.

Data to try: CHEMBL325 (Histone deacetylase 1), CHEMBL220 (Homo Sapiens - Acetylcholinesterase), 	CHEMBL3927 (SARS coronavirus 3C-like proteinase)

In this example, I used CHEMBL325:
  
  
  ![Example Screen](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/Screenshot%20(24).png)

## Results and Visualization

The project includes plotting the evaluated data using Matplotlib and Seaborn to visualize the distribution and comparison between active and inactive compounds across different molecular descriptors. These plots are crucial for understanding the characteristics that contribute to a compound's effectiveness and bioactivity.
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
  
## Predictive Modeling

Using PaDEL Descriptors and Random Forest Regression, the project aims to predict the IC50 values of compounds. The model learns to correlate the descriptors (features) with the IC50 values (target) across the training dataset. Random Forest improves prediction accuracy by creating a forest of decision trees where each tree is trained on a random subset of the data and features. This randomness helps in making the model more robust and less prone to overfitting to the training data, which is great for assessing a compound's viability as a drug candidate without extensive laboratory testing, offering a cost-effective and efficient alternative to traditional methods.

 ![predicted_experimental_pIC50.png](https://github.com/williamhuang3/bioinformatics-drug-project/blob/main/assets/predicted_experimental_pIC50.png)
 
## Conclusion

This project represents a significant tool in the field of drug discovery, leveraging bioinformatics and artificial intelligence to streamline the search and evaluation of new drug candidates. By reducing the need for extensive experimental testing, it shows promise in accelerating and cutting costs in the development of effective treatments for a variety of conditions.

## More Info And Credits
 [IC50 Definition](https://en.wikipedia.org/wiki/IC50)
  
  
 [Lipinski Rule of 5](https://en.wikipedia.org/wiki/Lipinski%27s_rule_of_five#:~:text=Lipinski's%20rule%20states%20that%2C%20in,all%20nitrogen%20or%20oxygen%20atoms)
  
  
 [ChemBL Database](https://www.ebi.ac.uk/chembl/)
  
  
 [Random Forest Regression](https://levelup.gitconnected.com/random-forest-regression-209c0f354c84?gi=302f1da7802c#:~:text=Random%20Forest%20Regression%20is%20a%20supervised%20learning%20algorithm%20that%20uses,prediction%20than%20a%20single%20model.)

This project was inspired by resources and tutorials from Data Professor on YouTube and machinelearningmastery.com
Written by William Huang
