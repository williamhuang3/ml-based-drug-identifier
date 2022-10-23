<h1>Bioinformatics AI Drug Descriptors Project</h1>
<p>This program uses the ChemBL Database to find a chemical/biological target, (in this example, Histone Deacetylase 1) and then uses the Lipinski Rule of 5 to evaluate the compounds that interact with the target to locate viable drug/treatment candidates. First, we look at compounds evaluated by a metric called the 'IC50'.
The IC50 essentially quantifies the concentration of a drug necessary
to inhibit a biological process by half, thus making it a good marker
for drug efficacy, along with other variables that altogether are part
of the Lipinski Molecular Descriptors, which evaluate a compound's
overall bioactivity. We will be calculating how well the interacting
compounds score on the Lipinski Molecular Descriptors, comparing an
active group (IC50 >= 10000) and an inactive group (IC50 <= 1000).


We will then use another collection of descriptors, the PaDEL
Descriptors, to describe the data and then try to 'predict' an IC50
value for each compound using Random Forest Regression, and compare it
to the actual IC50.


This predicted IC50 value can be useful in that we can attempt to
gauge a compound's bioactivity towards a certain inhibitor without
having to actually experimentally determine the IC50, saving R&D costs and
increasing the accessibility of IC50 data.

Creators: William Huang
Inspired by Data Professor on YT and machinelearningmastery.com</p>

