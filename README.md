<h1>Bioinformatics AI Drug Descriptors Project</h1>
  <p>This program uses the ChemBL Database to find a chemical/biological target, 
  (in this example, Histone Deacetylase 1) and then uses the Lipinski Rule of 5 
  to evaluate the compounds that interact with the target to locate viable drug/
  treatment candidates. First, we look at compounds evaluated by a metric called the 'IC50'.
  The IC50 essentially quantifies the concentration of a drug necessary
  to inhibit a biological process by half, thus making it a good marker
  for drug efficacy, along with other variables that altogether are part
  of the Lipinski Molecular Descriptors, which evaluate a compound's
  overall bioactivity. We will be calculating how well the interacting
  compounds score on the Lipinski Molecular Descriptors, comparing an
  active group (IC50 >= 10000) and an inactive group (IC50 <= 1000).<p> -</p> 
  <p>All of these will be plotted used Matplotlib/Seaborn and saved as pdfs in the
  directory.</p><p>-</p>


  We will then use another collection of descriptors, the PaDEL
  Descriptors, to describe the data and then try to 'predict' an IC50
  value for each compound using Random Forest Regression, and compare it
  to the actual IC50.


  This predicted IC50 value can be useful in that we can attempt to
  gauge a compound's bioactivity towards a certain inhibitor without
  having to actually experimentally determine the IC50, saving R&D costs and
  increasing the accessibility of IC50 data.</p>
  
    
  <p>More on IC50 and Random Forest Regression and Lipinski Rule of 5:</p>
  <p>https://en.wikipedia.org/wiki/IC50</p>
  <p>https://en.wikipedia.org/wiki/Lipinski%27s_rule_of_five#:~:text=Lipinski's%20rule%20states%20that%2C%20in,all%20nitrogen%20or%20oxygen%20atoms)
  <p>CHEMBL: https://www.ebi.ac.uk/chembl/</p>
  <p>https://levelup.gitconnected.com/random-forest-regression-209c0f354c84?gi=302f1da7802c#:~:text=Random%20Forest%20Regression%20is%20a%20supervised%20learning%20algorithm%20that%20uses,prediction%20than%20a%20single%20model.</p>
  
  <p>Data to try: CHEMBL325 (Histone acetylase 1), CHEMBL2094109 (Muscarinic acetylcholine receptor), 	CHEMBL3927 (SARS coronavirus 3C-like proteinase) 
  </p>  
 <h3>Libraries: Numpy, Pandas, Matplotlib, Seaborn, SciPy, SKlearn, TextWrap3</h3>
 <h3>Inspired by Data Professor on YT and machinelearningmastery.com</h3>
 <h3>Creators: William Huang</h3>
  <p>![Example Screen](https://user-images.githubusercontent.com/103707873/197421966-6689269c-7b82-42f7-82a4-1e3d4c0352ba.png)</p>
  <p>![Example Screen: Mann-Whitney Results](https://user-images.githubusercontent.com/103707873/197422170-1e2cf4ea-1af5-481f-9e99-bd78b9d9edf1.png)</p>
  <p>![Example Screen: Bash padel.sh Script](https://user-images.githubusercontent.com/103707873/197422191-f994c0da-c07c-4c5c-8a5b-0b532690ec77.png)</p>
  <p>![Example Screen: Random Forest Regression Compiling](https://user-images.githubusercontent.com/103707873/197422393-21b52960-14ca-406a-9aee-569ec061daf3.png)</p>
  <p>![plot_bioactivity_class.pdf](https://github.com/williamhuang3/bioinformatics-drug-project/files/9847737/plot_bioactivity_class.pdf)</p>
  <p>![plot_ic50.pdf](https://github.com/williamhuang3/bioinformatics-drug-project/files/9847741/plot_ic50.pdf)</p>
  <p>![plot_LogP.pdf](https://github.com/williamhuang3/bioinformatics-drug-project/files/9847743/plot_LogP.pdf)</p>
  <p>![plot_MW.pdf](https://github.com/williamhuang3/bioinformatics-drug-project/files/9847744/plot_MW.pdf)</p>
  <p>![plot_MW_vs_LogP.pdf](https://github.com/williamhuang3/bioinformatics-drug-project/files/9847745/plot_MW_vs_LogP.pdf)</p>
  <p>![plot_NumHAcceptors.pdf](https://github.com/williamhuang3/bioinformatics-drug-project/files/9847750/plot_NumHAcceptors.pdf)</p>
  <p>![plot_NumHDonors.pdf](https://github.com/williamhuang3/bioinformatics-drug-project/files/9847751/plot_NumHDonors.pdf)</p>
  <p>![predicted_experimental_pIC50.pdf](https://github.com/williamhuang3/bioinformatics-drug-project/files/9847752/predicted_experimental_pIC50.pdf)</p>



