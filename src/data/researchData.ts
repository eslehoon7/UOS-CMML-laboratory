/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ResearchItem {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string[];
  imageUrl: string;
  detailImageUrl: string;
  publications: string[];
  references?: string[];
}

export const RESEARCH_DATA: ResearchItem[] = [
  {
    id: "chlorosulfolipids",
    title: "Membrane Structure of Chlorosulfolipids",
    subtitle: "Understanding Danicalipin A",
    shortDescription: "Chlorosulfolipids (CSLs) are unique flagellar membrane components in sea algae with hydrophilic groups in their hydrocarbon tails. We used coarse-grained and atomistic MD simulations to resolve their longstanding structural mystery. Our research reveals that Danicalipin A forms a stable monolayer membrane where hydrocarbon moieties are sandwiched by hydrophilic groups. This unique monolayer structure demonstrates high thermal stability with a phase transition observed around 300 K.",
    fullDescription: [
      "Chlorosulfolipids (CSLs) are major components of flagellar membranes in sea algae. Unlike typical biological lipids that have a hydrophilic head group and hydrophobic hydrocarbon tails, CSLs contain hydrophilic sulfate and chloride groups in the hydrocarbon tail region; this has eluded the prediction of the CSL membrane structure since 1960.",
      "In this study, we combine coarse-grained (CG) and atomistic molecular dynamics (MD) simulations to gain significant insights into the membrane structure of Danicalipin A, which is one of the typical CSLs. It is observed from the CG MD that Danicalipin A lipids form a stable monolayer membrane structure wherein the hydrocarbon moieties are sandwiched by hydrophilic sulfate and chloride groups in both the head and tail regions.",
      "Based on the mesoscopic membrane structure, we built the corresponding atomistic model to investigate the integrity of the CSL monolayer membrane structure. The monolayer membrane comprising bent lipids shows high thermal stability up to 313 K. The gel-liquid crystalline phase transition is observed around 300 K."
    ],
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200",
    detailImageUrl: "https://images.unsplash.com/photo-1532187875605-2fe35f74de4b?auto=format&fit=crop&q=80&w=1200",
    publications: ["J. Phys. Chem. Lett., 2021 (accepted)"],
    references: ["J. Phys. Chem. Lett., 2021 (accepted)"]
  },
  {
    id: "organic-photovoltaics",
    title: "Organic Photovoltaics",
    subtitle: "Stability and Efficiency of Ternary Systems",
    shortDescription: "Strategic incorporation of non-fullerene small molecules in polymer:fullerene blends improves OSC efficiency and stability. Our study reveals how ternary blends alleviate fullerene aggregation, extending device lifetimes under real-world conditions and offering promise for print-processed solar cells.",
    fullDescription: [
      "Long-term stability of organic blends is a key factor for the practical use of organic solar cells (OSCs) in commercial fields. Here, we report the strategic incorporation of non-fullerene small molecules in polymer:fullerene blends to obtain ternary OSCs with improved efficiency and extended lifetimes. Non-fullerene small molecules employed in the polymer:fullerene blend successfully increased the photon-to-current conversion process as an efficient charge cascade acceptor.",
      "A combination of theoretical simulations and experimental measurements revealed that aggregation of meta-stable fullerene molecules was significantly alleviated in the ternary blend, thereby preventing an unintentional increase in the threshold for charge transfer during operation.",
      "Thus, the ternary OSCs could exhibit highly extended lifetimes with improved morphological stability and better resistance to performance decay under harsh real operational conditions compared to their binary counterparts. Combined with its high efficiency and improved device lifetimes, the high tolerance to the ternary blend thickness offers promise for commercially acceptable ternary OSCs fabricated by a printing process."
    ],
    imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1200",
    detailImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    publications: [
      "J. Mater. Chem. A, 7, 9698, 2019",
      "Adv. Energy Mater., 9, 1901856, 2019",
      "Nano Energy, 74, 104883, 2020",
      "BKCS, 2021, in press"
    ]
  },
  {
    id: "neurofilaments",
    title: "Molecular Modeling of Neurofilaments",
    subtitle: "Cytoskeletal Architecture and Axonal Caliber",
    shortDescription: "Neurofilaments (NFs) are essential cytoskeletal filaments that impart mechanical integrity to nerve cells. We investigate the structural organization of NF architecture under different phosphorylation conditions using a physically motivated sequence-based coarse-grain model.",
    fullDescription: [
      "Neurofilaments (NFs) are essential cytoskeletal filaments that impart mechanical integrity to nerve cells. They are assembled from three distinct molecular mass proteins that bind to each other to form a 10-nm-diameter filamentous rod with sidearm extensions. The sidearms are considered to play a critical role in modulating interfilament spacing and axonal caliber.",
      "However, the precise mechanism by which NF protrusions regulate axonal diameter remains to be well understood. In particular, the role played by individual NF protrusions in specifying interfilament distances is yet to be established. To gain insight into the role of individual proteins, we investigated the structural organization of NF architecture under different phosphorylation conditions.",
      "To this end, a physically motivated sequence-based coarse-grain model of NF brush has been developed based on the three-dimensional architecture of NFs. The model incorporates the charge distribution of sidearms, including charges from the phosphorylation sites corresponding to Lys-Ser-Pro repeat motifs. The model also incorporates the proper grafting of the real NF sidearms based on the stoichiometry of the three subunits.",
      "The equilibrium structure of the NF brush is then investigated under different phosphorylation conditions. The phosphorylation of NF modifies the structural organization of sidearms. Upon phosphorylation, a dramatic change involving a transformation from a compact conformation to an extended conformation is found in the heavy NF (NF-H) protein.",
      "However, in spite of extensive phosphorylation sites present in the NF-H subunit, the tails of the medium NF subunit are found to be more extended than the NF-H sidearms. This supports the notion that medium NF protrusions are critical in regulating NF spacings and, hence, axonal caliber."
    ],
    imageUrl: "https://images.unsplash.com/photo-1559757175-9e351c9a1301?auto=format&fit=crop&q=80&w=1200",
    detailImageUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200",
    publications: [
      "J. Mol. Biol. 391, 648, 2009",
      "J. Mol. Biol. 405, 1101, 2011",
      "J. Neurol. Sci. 307, 132-138, 2011",
      "J. Neurosci. 32, 6209-6219, 2012",
      "J. Biol. Phys. 39, 343-362, 2013",
      "J. Chem. Phys. 138, 015103, 2013",
      "J. Neurochem. 146, 631-641, 2018"
    ]
  },
  {
    id: "nanoparticles-membranes",
    title: "Effects of Nanoparticles on Biological Membranes",
    subtitle: "Molecular Dynamics of C60 Clusters",
    shortDescription: "We study the static and dynamic effects of carbon nanoparticles on biological membranes using atomistic molecular dynamics simulations of C60 clusters and DMPC bilayers.",
    fullDescription: [
      "We have performed molecular dynamics simulations of atomistic models of C60 clusters and a DMPC bilayer membrane to study the static and dynamic effects of carbon nanoparticles on biological membranes. All four C60-membrane systems were investigated representing dilute and concentrated solutions of C60 residing either inside or outside the membrane.",
      "The concentrated C60 molecules in water phase start forming an aggregated cluster. Due to its heavy mass, the cluster tends to adhere on the surface of the bilayer membrane, hindering both translational and rotational diffusion of individual C60.",
      "On the other hand, once C60 molecules accumulate inside the membrane, they are well dispersed in the central region of the bilayer membrane. Because of the homogeneous dispersion inside the membrane, each leaflet is pulled away from the center, making the bilayer membrane thicker.",
      "This thickening of the membrane provides more room for both translational and rotational motions of C60 inside the membrane compared to that in the water region. As a result, the dynamics of C60 inside the membrane becomes faster with increasing its concentration."
    ],
    imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=1200",
    detailImageUrl: "https://images.unsplash.com/photo-1579154235823-6b1b34982164?auto=format&fit=crop&q=80&w=1200",
    publications: [
      "J. Phys. Chem. B 110, 5073, 2006",
      "Biophys. J. 95, 4102, 2008",
      "BKCS 31, 3195, 2010",
      "J. Phys. Chem. B 118, 6792, 2014",
      "BKCS 37, 1076-1085, 2016",
      "BKCS 39, 516-523, 2018"
    ]
  },
  {
    id: "polymer-dynamics",
    title: "Polymer Dynamics in Porous Medium",
    subtitle: "Disordered Materials and Chain Entanglements",
    shortDescription: "We study the dynamic behavior of hard chains in disordered materials composed of fixed hard spheres using discontinuous molecular dynamics simulations, revealing unique hopping mechanisms and scaling laws.",
    fullDescription: [
      "The dynamic behavior of hard chains in disordered materials composed of fixed hard spheres is studied using discontinuous molecular dynamics simulations. The matrix induces entanglements in the chain fluid, where for high matrix densities the diffusion coefficient D scales with the chain length N as D ~ N-2.",
      "At high matrix densities the rotational relaxation time becomes very large but the translational diffusion is not affected significantly; i.e., the chains display a dynamic heterogeneity reminiscent of probe diffusion in supercooled liquids and glasses.",
      "We show that this is because some chains are trapped, and move via a hopping mechanism. There are no signatures of this dynamic heterogeneity in the matrix static structure, however, which is identical to that of a hard-sphere liquid."
    ],
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    detailImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    publications: [
      "J. Phys. Chem. B 110, 5073, 2006",
      "Biophys. J. 95, 4102, 2008",
      "BKCS 31, 3195, 2010",
      "J. Phys. Chem. B 118, 6792, 2014",
      "BKCS 37, 1076-1085, 2016",
      "BKCS 39, 516-523, 2018"
    ]
  },
  {
    id: "dna-conformation",
    title: "DNA Conformation in Nanochannels",
    subtitle: "Monte Carlo Simulations and Genetic Constraints",
    shortDescription: "We utilize canonical ensemble Monte Carlo simulations of a primitive DNA model to investigate the conformation of long DNA molecules confined in nanochannels across various ionic concentrations.",
    fullDescription: [
      "We have performed canonical ensemble Monte Carlo simulations of a primitive DNA model to study the conformation of 2.56 ∼ 21.8 μm long DNA molecules confined in nanochannels at various ionic concentrations with the comparison of our previous experimental findings.",
      "In the model, the DNA molecule is represented as a chain of charged hard spheres connected by fixed bond length and the nanochannels as planar hard walls. System potentials consist of explicit electrostatic potential along with short-ranged hard-sphere and angle potentials.",
      "The visualization and statistical analysis of DNA molecules in various channel dimensions and ionic strengths verified the formation of locally coiled structures such as backfoldings or hairpins and their significance even in highly stretched states.",
      "Our study showed that channel dimension and ionic strength have different influences on the local DNA structure. Ionic strength changes local correlation between neighboring monomers by controlling the strength of electrostatic interaction, while channel dimension controls the overall stretch by applying geometric constraints.",
      "The molecular weight dependence of DNA stretch was observed especially in low stretch regime, where low stretch modes in short DNA molecules are not readily accessible to longer ones, resulting in increased stretch for longer DNA molecules."
    ],
    imageUrl: "https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?auto=format&fit=crop&q=80&w=1200",
    detailImageUrl: "https://images.unsplash.com/photo-1544333323-58739934e9cf?auto=format&fit=crop&q=80&w=1200",
    publications: [
      "Lab on a Chip 11, 1721, 2011",
      "J. Chem. Phys. 136, 095101, 2012",
      "ACS Macro Lett. 3, 926-930, 2014"
    ]
  }
];
