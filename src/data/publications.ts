/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Publication {
  id: number;
  authors: string;
  title: string;
  journal: string;
  year: number;
  details?: string;
  tags?: string[];
}

export const publications: Publication[] = [
  {
    id: 101,
    authors: "C. Y. Joe, K. Song, and R. Chang",
    title: "Evaluating In-Context Learning in Large Language Models for Molecular Property Regression",
    journal: "Journal of Computational Chemistry",
    year: 2026,
    details: "47, e70308",
    tags: ["LLM", "Molecular Modeling"]
  },
  {
    id: 103,
    authors: "J. Na and R. Chang",
    title: "MORPHOLOGICAL CHANGES OF ORGANIC PHOTOVOLTAICS: MOLECULAR DYNAMICS SIMULATION STUDIES",
    journal: "Journal of Materials Chemistry A (expected)",
    year: 2025,
    tags: ["MD", "OPV"]
  },
  {
    id: 102,
    authors: "J. Hong and R. Chang",
    title: "Identification of methylated cytidines using terahertz spectroscopy",
    journal: "Bulletin of the Korean Chemical Society",
    year: 2025,
    details: "2025",
    tags: ["Spectroscopy"]
  },
  {
    id: 100,
    authors: "M. Park, R. Chang, and K. Song",
    title: "Correction To: Dirichlet stochastic weights averaging for graph neural networks",
    journal: "Applied Intelligence",
    year: 2025,
    details: "55, 93",
    tags: ["GNN"]
  },
  {
    id: 99,
    authors: "M. Park, R. Chang, and K. Song",
    title: "Dirichlet stochastic weights averaging for graph neural networks",
    journal: "Applied Intelligence",
    year: 2025,
    details: "55, 10516-10524",
    tags: ["GNN"]
  },
  {
    id: 98,
    authors: "J. Hong and R. Chang",
    title: "Hybrid coarse-grained and all-atom molecular dynamics simulation studies of binary biological lipid membranes containing chlorosulfolipids",
    journal: "The Journal of Chemical Physics",
    year: 2025,
    details: "163",
    tags: ["MD", "Membrane"]
  },
  {
    id: 97,
    authors: "Y. Park, J. Lee, K. Song, J. Hong, and R. Chang",
    title: "Local nonequilibrium thermodynamics of polymer collapse dynamics",
    journal: "The Journal of Chemical Physics",
    year: 2025,
    details: "163",
    tags: ["Thermodynamics"]
  },
  {
    id: 96,
    authors: "H. Jeon, D. W. Lee, R. Chang, S. J. Hwang, and X. Jin",
    title: "Synergetic defect and local structure engineering to boost photocatalytic activity of ZnIn2-xCuxS4 nanosheets for H2O2 production",
    journal: "Journal of Materials Chemistry A",
    year: 2025,
    details: "13, 37277-37285",
    tags: ["Photocatalysis"]
  },
  {
    id: 95,
    authors: "S. Chang et al.",
    title: "Hypoxia increases methylated histones to prevent histone clipping and redistribution during raf-induced senescence",
    journal: "Nucleic Acids Research",
    year: 2025,
    details: "53, gkae1210",
    tags: ["Biology"]
  },
  {
    id: 94,
    authors: "M. Park, R. Chang, and K. Song",
    title: "Dirichlet stochastic weights averaging for graph neural networks",
    journal: "Applied Intelligence",
    year: 2024,
    details: "54, 10516-10524",
    tags: ["GNN"]
  },
  {
    id: 93,
    authors: "Y. Kang, R. Chang, and S. Y. Ju",
    title: "Pressure-Dependent Shape and Edge Configurations of MoS2 by Kinetic Monte Carlo Simulation",
    journal: "ACS Nano",
    year: 2024,
    details: "18, 31495-31505",
    tags: ["MoS2", "KMC"]
  },
  {
    id: 92,
    authors: "J. Y. Park, R. Chang et al.",
    title: "Enhancing the thermostability of lignin peroxidase: Heme as a keystone cofactor driving stability changes in heme enzymes",
    journal: "Heliyon",
    year: 2024,
    details: "10",
    tags: ["Biology"]
  },
  {
    id: 91,
    authors: "J. Yeom, T. Kim, R. Chang, and K. Song",
    title: "Structural and positional ensemble encoded for Graph Transformer",
    journal: "Pattern Recognition Letters",
    year: 2024,
    details: "183, 104-110",
    tags: ["Graph Transformer"]
  },
  {
    id: 90,
    authors: "J. Kang, T. Kim, Y. Kim, C. Oh, J. Jung, R. Chang, and K. Song",
    title: "Bimbimap: Pre-trained models ensemble for Domain Generalization",
    journal: "Pattern Recognition",
    year: 2024,
    details: "151, 110391",
    tags: ["ML", "Ensemble"]
  },
  {
    id: 89,
    authors: "C. Lee et al.",
    title: "Novel Diffusion-Regulated Layering Methodology to Improve Blend Miscibility and Thermal Stability of Organic Photovoltaics",
    journal: "Advanced Functional Materials",
    year: 2024,
    details: "34, 2308047",
    tags: ["OPV"]
  },
  {
    id: 88,
    authors: "Y. Nam, S. Lee, and R. Chang",
    title: "Structure and stability of polydiacetylene membrane systems: Molecular dynamics simulation studies",
    journal: "Journal of Computational Chemistry",
    year: 2023,
    details: "44, 927-934",
    tags: ["MD", "Membrane"]
  },
  {
    id: 87,
    authors: "C. Cho, Y. Nam, H. H. Lee, and R. Chang",
    title: "Inhibition mechanism of testis-expressed gene 14 (TEX14) in kinectic abscission: Well-tempered metadynamics simulation studies",
    journal: "The Journal of Chemical Physics",
    year: 2023,
    details: "159, 015102",
    tags: ["Metadynamics"]
  },
  {
    id: 86,
    authors: "S. Chang et al.",
    title: "Hypoxia increases the methylated histones to prevent histone clipping and redistribution of heterochromatin during Raf-induced senescence",
    journal: "bioRxiv",
    year: 2023,
    details: "2023.10.02.560619",
    tags: ["Biology"]
  },
  {
    id: 85,
    authors: "H. Chul Lim et al.",
    title: "Cover Feature: New Highly Stable Ionic Compounds Composed of Multivalent Graphene Quantum Dot Anions and Alkali Metal Cations",
    journal: "Batteries & Supercaps",
    year: 2022,
    details: "5, e202200064",
    tags: ["Energy"]
  },
  {
    id: 84,
    authors: "J. Hyun and R. Chang",
    title: "Penetration mechanism of small molecule therapeutics into the skin: Molecular dynamics simulation study",
    journal: "Journal of the Korean Chemical Society",
    year: 2022,
    details: "43, 364-368",
    tags: ["MD"]
  },
  {
    id: 83,
    authors: "J. Na et al.",
    title: "Cover Feature: KDM3A inhibition by JMJD3-KDM3A-IN-1 induces chromatin condensation and suppresses the progression of colorectal cancer",
    journal: "Korean Chemical Society",
    year: 2022,
    details: "25, 104517",
    tags: ["Biology"]
  },
  {
    id: 82,
    authors: "H. Chul Lim et al.",
    title: "New Highly Stable Ionic Compounds Composed of Multivalent Graphene Quantum Dot Anions and Alkali Metal Cations",
    journal: "Batteries & Supercaps",
    year: 2022,
    details: "5, e202100337",
    tags: ["Energy"]
  },
  {
    id: 81,
    authors: "J. Lee, S. Yoon, and R. Chang",
    title: "Chlorosulfolipid (Danicalipin A) Membrane Structure: Hybrid Molecular Dynamics Simulation Studies",
    journal: "The Journal of Physical Chemistry Letters",
    year: 2021,
    details: "12, 4537-4542",
    tags: ["MD", "Membrane"]
  },
  {
    id: 80,
    authors: "J. Na and R. Chang",
    title: "Morphological Stability of Organic Photovoltaics: Coarse-Grained Molecular Dynamics Simulation Studies",
    journal: "Bulletin of the Korean Chemical Society",
    year: 2021,
    details: "42, 988-993",
    tags: ["MD", "OPV"]
  },
  {
    id: 79,
    authors: "G. D. Kong et al.",
    title: "Interstitially Mixed Self-Assembled Monolayers Enhance Electrical Stability of Molecular Junctions",
    journal: "Nano Letters",
    year: 2021,
    details: "21, 3162-3169",
    tags: ["MEMS"]
  },
  {
    id: 78,
    authors: "M. Nam et al.",
    title: "Alternative sequential deposition for optimization-free multi-component organic bulk heterojunctions",
    journal: "Nano Energy",
    year: 2020,
    details: "74, 104883",
    tags: ["OPV"]
  },
  {
    id: 77,
    authors: "J. Lee and R. Chang",
    title: "Saccharide Insertion in Carbon Nanotube: Molecular Dynamics Simulation Studies",
    journal: "Bulletin of the Korean Chemical Society",
    year: 2020,
    details: "41, 439-443",
    tags: ["MD", "Nanotube"]
  },
  {
    id: 76,
    authors: "R. Chang and J. Lee",
    title: "Prediction of Chlorosulfolipid Membrane Structures Using Hybrid Molecular Dynamics Simulations",
    journal: "European Biophysics Journal",
    year: 2019,
    details: "48, S108-S108",
    tags: ["MD", "Membrane"]
  },
  {
    id: 75,
    authors: "M. Nam et al.",
    title: "Ternary Blend Organic Solar Cells with Improved Morphological Stability",
    journal: "Journal of Materials Chemistry A",
    year: 2019,
    details: "7, 9698-9707",
    tags: ["OPV"]
  },
  {
    id: 74,
    authors: "M. Nam et al.",
    title: "Ternary Organic Blends Approaches for High Photovoltaic Performance in Versatile Applications",
    journal: "Advanced Energy Materials",
    year: 2019,
    details: "9, 1901856",
    tags: ["OPV"]
  },
  {
    id: 73,
    authors: "R. Chang and A. Yethiraj",
    title: "Can Polymer Chains Cross Each Other and Still Be Entangled?",
    journal: "Macromolecules",
    year: 2019,
    details: "52, 2000-2006",
    tags: ["Polymer"]
  },
  {
    id: 72,
    authors: "D. Lim et al.",
    title: "Application of Molecular Dynamics Simulation to Improve the Theoretical Prediction for Collisional Cross Section of Aromatic Compounds with Long Alkyl Chains in Crude Oils",
    journal: "Rapid Communications in Mass Spectrometry",
    year: 2019,
    details: "33, 650-656",
    tags: ["MD"]
  },
  {
    id: 71,
    authors: "S. Lee et al.",
    title: "Nanochannel-Confined TAMRA-Polypyrrole Stained DNA Stretching by Varying the Ionic Strength from Micromolar to Millimolar Concentrations",
    journal: "Polymers",
    year: 2018,
    details: "11, 15",
    tags: ["DNA"]
  },
  {
    id: 70,
    authors: "E. Zucchi et al.",
    title: "A Motor Neuron Strategy to Save Time and Energy in Neurodegeneration: Adaptive Protein Stoichiometry",
    journal: "Journal of Neurochemistry",
    year: 2018,
    details: "146, 631-641",
    tags: ["Biology"]
  },
  {
    id: 69,
    authors: "S. Kim, J. Lee, and R. Chang",
    title: "Plasma-Induced Water Pore Formation in Model Cell Membranes: Molecular Dynamics Simulation",
    journal: "Bulletin of the Korean Chemical Society",
    year: 2018,
    details: "39, 516-523",
    tags: ["MD", "Membrane"]
  },
  {
    id: 68,
    authors: "I. Choi et al.",
    title: "On-Demand Modulation of Bacterial Cell Fates on Multifunctional Dynamic Substrates",
    journal: "ACS Applied Materials & Interfaces",
    year: 2018,
    details: "10, 4324-4332",
    tags: ["Biology"]
  },
  {
    id: 67,
    authors: "Y. Cho and R. Chang",
    title: "Metadynamics simulation studies of the interaction between TEX14 and CEP55",
    journal: "Abstracts of Papers of the American Chemical Society",
    year: 2017,
    details: "254",
    tags: ["Metadynamics"]
  },
  {
    id: 66,
    authors: "D. Lee and R. Chang",
    title: "Polyelectrolyte Diode: Grand Canonical Monte Carlo Simulation Studies Using Primitive Polymer Models",
    journal: "한국고분자학회 학술대회 연구논문 초록집",
    year: 2016,
    details: "41, 761-761",
    tags: ["MC"]
  },
  {
    id: 65,
    authors: "W. Kim and R. Chang",
    title: "Cytotoxic Study of Polyhexametylene Guanidine (PHMG) Adsorption on Model Cell Membranes: Molecular Dynamics Simulations",
    journal: "한국고분자학회 학술대회 연구논문 초록집",
    year: 2016,
    details: "41, 830-830",
    tags: ["MD", "Membrane"]
  },
  {
    id: 64,
    authors: "R. Chang",
    title: "Application of Polymer Concepts to Biological Systems",
    journal: "한국고분자학회 학술대회 연구논문 초록집",
    year: 2016,
    details: "41, 315-315",
    tags: ["Polymer"]
  },
  {
    id: 63,
    authors: "J. Lee and R. Chang",
    title: "Theoretical Studies of Substituent Effects of Polyaniline on CO Sensing",
    journal: "한국고분자학회 학술대회 연구논문 초록집",
    year: 2016,
    details: "41, 653-653",
    tags: ["MD"]
  },
  {
    id: 62,
    authors: "J. Lee and R. Chang",
    title: "Prediction of Chlorosulfolipid (Danicalipin A) Membrane Structure Using Hybrid Molecular Dynamics Simulations",
    journal: "한국고분자학회 학술대회 연구논문 초록집",
    year: 2016,
    details: "41, 836-836",
    tags: ["MD", "Membrane"]
  },
  {
    id: 61,
    authors: "S. Kim and R. Chang",
    title: "Structure, Dynamics, and Phase Behavior of DOPC/DSPC Mixture Membrane Systems: Molecular Dynamics Simulation Studies",
    journal: "Bulletin of the Korean Chemical Society",
    year: 2016,
    details: "37, 1076-1085",
    tags: ["MD", "Membrane"]
  },
  {
    id: 60,
    authors: "H. J. Kim, H. Kim, R. Chang, Y. G. Yu, and H. H. Lee",
    title: "Biochemical and Molecular Modeling Studies of the Interaction between Human CEP55 and TEX14",
    journal: "Bulletin of the Korean Chemical Society",
    year: 2016,
    details: "37, 847-854",
    tags: ["Biology"]
  },
  {
    id: 59,
    authors: "J. Lee, R. Chang, Y. L. Chen, and K. Jo",
    title: "Single DNA Molecule Swollen and Trapped in Nanoslit",
    journal: "Biophysical Journal",
    year: 2015,
    details: "108, 175a",
    tags: ["DNA"]
  },
  {
    id: 58,
    authors: "R. Chang, Y. Kim, and A. Yethiraj",
    title: "Osmotic Pressure of Polyelectrolyte Solutions with Salt: Grand Canonical Monte Carlo Simulation Studies",
    journal: "Macromolecules",
    year: 2015,
    details: "48, 7370-7377",
    tags: ["MC"]
  },
  {
    id: 57,
    authors: "Q. A. Tuan Le, R. Chang, and Y. H. Kim",
    title: "Rational design of paraoxonase 1 (PON1) for the efficient hydrolysis of organophosphates",
    journal: "Chemical Communications",
    year: 2015,
    details: "51, 14536-14539",
    tags: ["Biology"]
  },
  {
    id: 56,
    authors: "Q. A. Tuan Le, S. Kim, R. Chang, and Y. H. Kim",
    title: "Insights into the Lactonase Mechanism of Serum Paraoxonase 1 (PON1): Experimental and Quantum Mechanics/Molecular Mechanics (QM/MM) Studies",
    journal: "The Journal of Physical Chemistry B",
    year: 2015,
    details: "119, 9571-9585",
    tags: ["QM/MM"]
  },
  {
    id: 55,
    authors: "H. Choe et al.",
    title: "Structural insights into the efficient CO2-reducing activity of an NAD-dependent formate dehydrogenase from Thiobacillus sp. KNK65MA",
    journal: "Biological Crystallography",
    year: 2015,
    details: "71, 313-323",
    tags: ["Biology"]
  },
  {
    id: 54,
    authors: "H. J. Kim et al.",
    title: "Structural and biochemical insights into the role of testis-expressed gene 14 (TEX14) in forming the stable intercellular bridges of germ cells",
    journal: "Proceedings of the National Academy of Sciences",
    year: 2015,
    details: "112, 12372-12377",
    tags: ["Biology"]
  },
  {
    id: 53,
    authors: "Q. A. N. H. T. Le, S. Kim, R. W. Chang, and Y. H. Kim",
    title: "Elucidation of Lactonase and lactonization mechanism of PON1 paraoxonase for gammavalerolactonesynthesis: Quantum Mechanics and Molecular Mechanics (QM/MM) with various QM …",
    journal: "한국생물공학회 학술대회",
    year: 2014,
    details: "357-357",
    tags: ["QM/MM"]
  },
  {
    id: 52,
    authors: "S. Lee, J. Lee, M. Lee, Y. K. Cho, J. Baek, J. Kim, S. Park, M. H. Kim, R. Chang, et al.",
    title: "Thermochromic Sensors: Construction and Molecular Understanding of an Unprecedented, Reversibly Thermochromic Bis‐Polydiacetylene",
    journal: "Advanced Functional Materials",
    year: 2014,
    details: "24, 3836-3836",
    tags: ["Membrane"]
  },
  {
    id: 51,
    authors: "J. Lee, S. Kim, H. Jeong, G. Y. Jung, R. Chang, Y. L. Chen, and K. Jo",
    title: "Nanoslit confined DNA at low ionic strengths",
    journal: "ACS Macro Letters",
    year: 2014,
    details: "3, 926-930",
    tags: ["DNA"]
  },
  {
    id: 50,
    authors: "H. Kang, Y. Kim, I. Choi, R. Chang, and W. S. Yeo",
    title: "Determination of self-exchange rate of alkanethiolates in self-assembled monolayers on gold using matrix-assisted laser desorption/ionization time-of-flight mass spectrometry",
    journal: "Analytica Chimica Acta",
    year: 2014,
    details: "843, 38-45",
    tags: ["Spectroscopy"]
  },
  {
    id: 49,
    authors: "Y. Kim, Y. Kwak, and R. Chang",
    title: "Free energy of PAMAM dendrimer adsorption onto model biological membranes",
    journal: "The Journal of Physical Chemistry B",
    year: 2014,
    details: "118, 6792-6802",
    tags: ["MD"]
  },
  {
    id: 48,
    authors: "S. Lee, J. Lee, M. Lee, Y. K. Cho, J. Baek, J. Kim, S. Park, M. H. Kim, R. Chang, et al.",
    title: "Construction and molecular understanding of an unprecedented, reversibly thermochromic bis‐polydiacetylene",
    journal: "Advanced Functional Materials",
    year: 2014,
    details: "24, 3699-3705",
    tags: ["Membrane"]
  },
  {
    id: 47,
    authors: "Q. A. T. Le, S. Kim, R. W. Chang, and Y. H. Kim",
    title: "Elucidation of Lactonase and lactonization mechanism of PON1 paraoxonase for gamma-valerolactone synthesis: Hybrid Quantum Mechanics and Molecular Mechanics (QM/MM) study",
    journal: "한국생물공학회 학술대회",
    year: 2013,
    details: "237-237",
    tags: ["QM/MM"]
  },
  {
    id: 46,
    authors: "B. Z. Shang, R. Chang, and J.-W. Chu",
    title: "Systems-level modeling with molecular resolution elucidates the rate-limiting mechanisms of cellulose decomposition by cellobiohydrolases",
    journal: "Journal of Biological Chemistry",
    year: 2013,
    details: "288, 29081-29089",
    tags: ["MD"]
  },
  {
    id: 45,
    authors: "B. W. Jeon, J. Lee, H. S. Kim, D. H. Cho, H. Lee, R. Chang, and Y. H. Kim",
    title: "Lipase-catalyzed enantioselective synthesis of (R,R)-lactide from alkyl lactate to produce PDLA (poly D-lactic acid) and stereocomplex PLA (poly lactic acid)",
    journal: "Journal of Biotechnology",
    year: 2013,
    details: "168, 201-207",
    tags: ["Biology"]
  },
  {
    id: 44,
    authors: "J. Lee, S. Kim, R. Chang, L. Jayanthi, and Y. Gebremichael",
    title: "Effects of molecular model, ionic strength, divalent ions, and hydrophobic interaction on human neurofilament conformation",
    journal: "The Journal of Chemical Physics",
    year: 2013,
    details: "138, 015103",
    tags: ["MD", "Biology"]
  },
  {
    id: 43,
    authors: "L. Jayanthi, W. Stevenson, Y. Kwak, R. Chang, and Y. Gebremichael",
    title: "Conformational properties of interacting neurofilaments: Monte Carlo simulations of cylindrically grafted apposing neurofilament brushes",
    journal: "Journal of Biological Physics",
    year: 2013,
    details: "39, 343-362",
    tags: ["MC", "Biology"]
  },
  {
    id: 42,
    authors: "Y. Kwak, R. Chang, and Y. Gebremichael",
    title: "Monte Carlo simulation studies of neurofilament brushes",
    journal: "AIP Conference Proceedings",
    year: 2012,
    details: "1504, 1235-1238",
    tags: ["MC", "Biology"]
  },
  {
    id: 41,
    authors: "E. Lee, J. Han, R. Chang, and T. D. Chung",
    title: "Grand-canonical Monte Carlo simulation study of polyelectrolyte diode",
    journal: "AIP Conference Proceedings",
    year: 2012,
    details: "1504, 1239-1242",
    tags: ["MC"]
  },
  {
    id: 40,
    authors: "R. Chang, A. S. Gross, and J.-W. Chu",
    title: "Degree of polymerization of glucan chains shapes the structure fluctuations and melting thermodynamics of a cellulose microfibril",
    journal: "The Journal of Physical Chemistry B",
    year: 2012,
    details: "116, 8074-8083",
    tags: ["MD"]
  },
  {
    id: 39,
    authors: "D. M. Barry, W. Stevenson, B. G. Bober, P. J. Wiese, J. M. Dale, G. S. Barry, et al.",
    title: "Expansion of neurofilament medium C terminus increases axonal diameter independent of increases in conduction velocity or myelin thickness",
    journal: "Journal of Neuroscience",
    year: 2012,
    details: "32, 6209-6219",
    tags: ["Biology"]
  },
  {
    id: 38,
    authors: "E. Lee, R. Chang, J.-H. Han, and T. D. Chung",
    title: "Effect of pore geometry on gas adsorption: Grand canonical Monte Carlo simulation studies",
    journal: "Bulletin of the Korean Chemical Society",
    year: 2012,
    details: "33, 901-905",
    tags: ["MC"]
  },
  {
    id: 37,
    authors: "R. Chang and K. Jo",
    title: "DNA conformation in nanochannels: Monte Carlo simulation studies using a primitive DNA model",
    journal: "The Journal of Chemical Physics",
    year: 2012,
    details: "136, 095101",
    tags: ["MC", "DNA"]
  },
  {
    id: 36,
    authors: "L. Jayanthi, W. Stevenson, R. Chang, and Y. Gebremichael",
    title: "Computational Investigation of the Mechanism Behind Sidearm-Mediated Neurofilament Interaction",
    journal: "Biophysical Journal",
    year: 2011,
    details: "100, 94a",
    tags: ["MD", "Biology"]
  },
  {
    id: 35,
    authors: "B. W. Jeon, Q. A. T. Le, D. H. Cho, R. Chang, and Y. H. Kim",
    title: "Improved catalysis of Candida antarctica lipase B (CALB) through protein engineering for conversion of R-lactide from alkyl R-lactate in organic solvent",
    journal: "한국생물공학회 학술대회",
    year: 2011,
    details: "179-179",
    tags: ["Biology"]
  },
  {
    id: 34,
    authors: "S. Kim, R. Chang, C. Teunissen, Y. Gebremichael, and A. Petzold",
    title: "Neurofilament stoichiometry simulations during neurodegeneration suggest a remarkable self-sufficient and stable in vivo protein structure",
    journal: "Journal of the Neurological Sciences",
    year: 2011,
    details: "307, 132-138",
    tags: ["Biology"]
  },
  {
    id: 33,
    authors: "Y. Kim, K. S. Kim, K. L. Kounovsky, R. Chang, G. Y. Jung, J. J. DePablo, K. Jo, et al.",
    title: "Nanochannel confinement: DNA stretch approaching full contour length",
    journal: "Lab on a Chip",
    year: 2011,
    details: "11, 1721-1729",
    tags: ["DNA"]
  },
  {
    id: 32,
    authors: "W. Stevenson, R. Chang, and Y. Gebremichael",
    title: "Phosphorylation-mediated conformational changes in the mouse neurofilament architecture: insight from a neurofilament brush model",
    journal: "Journal of Molecular Biology",
    year: 2011,
    details: "405, 1101-1118",
    tags: ["MD", "Biology"]
  },
  {
    id: 31,
    authors: "W. Stevenson, R. Chang, and Y. Gebremichael",
    title: "The Role of Phosphorylation on Mouse Neurofilament Medium Protein (NF-M) Sidearms",
    journal: "Biophysical Journal",
    year: 2010,
    details: "98, 139a",
    tags: ["Biology"]
  },
  {
    id: 30,
    authors: "R. W. Chang and J. M. Lee",
    title: "Dynamics of C60 Molecules in Biological Membranes: Computer Simulation Studies",
    journal: "Bulletin of the Korean Chemical Society",
    year: 2010,
    details: "31, 3195-3200",
    tags: ["MD", "Membrane"]
  },
  {
    id: 29,
    authors: "J.-H. Han, E. Lee, S. Park, R. Chang, and T. D. Chung",
    title: "Effect of nanoporous structure on enhanced electrochemical reaction",
    journal: "The Journal of Physical Chemistry C",
    year: 2010,
    details: "114, 9546-9553",
    tags: ["Thermodynamics"]
  },
  {
    id: 28,
    authors: "R. Chang, Y. Kwak, and Y. Gebremichael",
    title: "Morphology of Neurofilament Protrusions: Sequence-Based Modeling of Neurofilament Brush",
    journal: "Biophysical Journal",
    year: 2009,
    details: "96, 479a-480a",
    tags: ["MC", "Biology"]
  },
  {
    id: 27,
    authors: "A. Quang",
    title: "Rational redesign of Candida antarctica lipase B for SS-lactide formation to produce enantiopure polylactic acid (PLA)",
    journal: "Journal of Bioscience and Bioengineering",
    year: 2009,
    tags: ["Biology"]
  },
  {
    id: 26,
    authors: "R. Chang, Y. Kwak, and Y. Gebremichael",
    title: "Structural properties of neurofilament sidearms: sequence-based modeling of neurofilament architecture",
    journal: "Journal of Molecular Biology",
    year: 2009,
    details: "391, 648-660",
    tags: ["MD", "Biology"]
  },
  {
    id: 25,
    authors: "B. J. Sung, R. Chang, and A. Yethiraj",
    title: "Swelling of polymers in porous media",
    journal: "The Journal of Chemical Physics",
    year: 2009,
    details: "130, 124901",
    tags: ["Polymer"]
  },
  {
    id: 24,
    authors: "S. Choe, R. Chang, J. Jeon, and A. Violi",
    title: "Molecular dynamics simulation study of a pulmonary surfactant film interacting with a carbonaceous nanoparticle",
    journal: "Biophysical Journal",
    year: 2008,
    details: "95, 4102-4114",
    tags: ["MD", "Biology"]
  },
  {
    id: 23,
    authors: "Y. H. Jhon, M. Cho, H. R. Jeon, I. Park, R. Chang, J. L. C. Rowsell, and J. Kim",
    title: "Simulations of methane adsorption and diffusion within alkoxy-functionalized IRMOFs exhibiting severely disordered crystal structures",
    journal: "The Journal of Physical Chemistry C",
    year: 2007,
    details: "111, 16618-16625",
    tags: ["MD"]
  },
  {
    id: 22,
    authors: "R. Chang and A. Yethiraj",
    title: "Structure and dynamics of short chain molecules in disordered porous materials: A molecular dynamics simulation study",
    journal: "The Journal of Chemical Physics",
    year: 2007,
    details: "126, 174906",
    tags: ["MD"]
  },
  {
    id: 21,
    authors: "A. Violi and R. Chang",
    title: "Carbonaceous nanoparticles in lipid bilayers",
    journal: "Abstracts of Papers of the American Chemical Society",
    year: 2006,
    details: "231",
    tags: ["Membrane"]
  },
  {
    id: 20,
    authors: "R. Chang and A. Yethiraj",
    title: "Dynamics of chain molecules in disordered materials",
    journal: "Physical Review Letters",
    year: 2006,
    details: "96, 107802",
    tags: ["MD"]
  },
  {
    id: 19,
    authors: "G. Reddy, A. Yethiraj, and R. Chang",
    title: "Adsorption and dynamics of a single polyelectrolyte chain near a planar charged surface: Molecular dynamics simulations with explicit solvent",
    journal: "Journal of Chemical Theory and Computation",
    year: 2006,
    details: "2, 630-636",
    tags: ["MD", "Polymer"]
  },
  {
    id: 18,
    authors: "R. Chang and A. Violi",
    title: "Insights into the effect of combustion-generated carbon nanoparticles on biological membranes: A computer simulation study",
    journal: "The Journal of Physical Chemistry B",
    year: 2006,
    details: "110, 5073-5083",
    tags: ["MD", "Membrane"]
  },
  {
    id: 17,
    authors: "R. Chang and A. Yethiraj",
    title: "Dilute solutions of strongly charged flexible polyelectrolytes in poor solvents: Molecular dynamics simulations with explicit solvent",
    journal: "Macromolecules",
    year: 2006,
    details: "39, 821-828",
    tags: ["MD", "Polymer"]
  },
  {
    id: 16,
    authors: "G. Reddy, R. Chang, and A. Yethiraj",
    title: "Solvent effects on the dynamics of polyelectrolyte chains near a charged wall: Molecular dynamics simulations with explicit solvent",
    journal: "APS March Meeting Abstracts",
    year: 2005,
    details: "A29.002",
    tags: ["Polymer"]
  },
  {
    id: 15,
    authors: "R. Chang, G. S. Ayton, and G. A. Voth",
    title: "Multiscale coupling of mesoscopic- and atomistic-level lipid bilayer simulations",
    journal: "The Journal of Chemical Physics",
    year: 2005,
    details: "122, 244716",
    tags: ["MD", "Membrane"]
  },
  {
    id: 14,
    authors: "R. Chang and A. Yethiraj",
    title: "Osmotic pressure of salt-free polyelectrolyte solutions: A Monte Carlo simulation study",
    journal: "Macromolecules",
    year: 2005,
    details: "38, 607-616",
    tags: ["MC", "Polymer"]
  },
  {
    id: 13,
    authors: "A. Yethiraj, C. N. Patra, and R. Chang",
    title: "Behavior of polyelectrolyte solutions at charged surfaces",
    journal: "Abstracts of Papers of the American Chemical Society",
    year: 2004,
    details: "228, U234-U234",
    tags: ["Polymer"]
  },
  {
    id: 12,
    authors: "C. N. Patra, R. Chang, and A. Yethiraj",
    title: "Structure of polyelectrolyte solutions at a charged surface",
    journal: "The Journal of Physical Chemistry B",
    year: 2004,
    details: "108, 9126-9132",
    tags: ["Polymer"]
  },
  {
    id: 11,
    authors: "R. Chang, K. Jagannathan, and A. Yethiraj",
    title: "Diffusion of hard sphere fluids in disordered media: A molecular dynamics simulation study",
    journal: "Physical Review E",
    year: 2004,
    details: "69, 051101",
    tags: ["MD"]
  },
  {
    id: 10,
    authors: "R. Chang",
    title: "Computer simulation and theoretical studies of polyelectrolyte solutions and diffusion in random media",
    journal: "The University of Wisconsin-Madison",
    year: 2003,
    tags: ["Polymer"]
  },
  {
    id: 9,
    authors: "R. Chang and A. Yethiraj",
    title: "The behavior of salt-free polyelectrolyte solutions at charged surfaces",
    journal: "Progress in Organic Coatings",
    year: 2003,
    details: "47, 331-336",
    tags: ["Polymer"]
  },
  {
    id: 8,
    authors: "R. Chang and A. Yethiraj",
    title: "Brownian dynamics simulations of polyelectrolyte solutions with divalent counterions",
    journal: "The Journal of Chemical Physics",
    year: 2003,
    details: "118, 11315-11325",
    tags: ["BD", "Polymer"]
  },
  {
    id: 7,
    authors: "R. Chang and A. Yethiraj",
    title: "Strongly charged flexible polyelectrolytes in poor solvents: Molecular dynamics simulations with explicit solvent",
    journal: "The Journal of Chemical Physics",
    year: 2003,
    details: "118, 6634-6647",
    tags: ["MD", "Polymer"]
  },
  {
    id: 6,
    authors: "R. Chang and A. Yethiraj",
    title: "Brownian Dynamics Simulations of Polyelectrolyte Solutions",
    journal: "APS March Meeting Abstracts",
    year: 2002,
    details: "S10.014",
    tags: ["BD", "Polymer"]
  },
  {
    id: 5,
    authors: "K. Jagannathan, R. Chang, and A. Yethiraj",
    title: "A Monte Carlo study of the self-assembly of bacteriochlorophylls",
    journal: "Biophysical Journal",
    year: 2002,
    details: "83, 1902-1916",
    tags: ["MC"]
  },
  {
    id: 4,
    authors: "R. Chang and A. Yethiraj",
    title: "Brownian dynamics simulations of salt-free polyelectrolyte solutions",
    journal: "The Journal of Chemical Physics",
    year: 2002,
    details: "116, 5284-5298",
    tags: ["BD"]
  },
  {
    id: 3,
    authors: "R. Chang and A. Yethiraj",
    title: "Solvent Effect on Collapse Dynamics of a Neutral Homopolymer",
    journal: "APS March Meeting Abstracts",
    year: 2001,
    details: "G19.010",
    tags: ["Polymer"]
  },
  {
    id: 2,
    authors: "R. Chang and A. Yethiraj",
    title: "Solvent effects on the collapse dynamics of polymers",
    journal: "The Journal of Chemical Physics",
    year: 2001,
    details: "114, 7688-7699",
    tags: ["Polymer"]
  },
  {
    id: 1,
    authors: "R. Chang and W. Shin",
    title: "N-[2-(N'-Hydroxy-n-oxidodiazinyl)-3-methylbutyl] octanamide",
    journal: "Crystal Structure Communications",
    year: 1998,
    details: "54, 827-829",
    tags: ["Crystal"]
  }
];
