import { useState, useMemo } from "react";

// ===== ALL INTERNSHIP DATA FROM EXCEL =====
const INTERNSHIP_DATA = [
  // Agricultural Engineering
  { program: "Agricultural Engineering", company: "Ghana Irrigation Development Authority (GIDA)", region: "Upper East", city: "Bolgatanga", email: "info@gimigration.gov.gh", focus: "Irrigation infrastructure, water resource management", interests: ["Water", "Infrastructure", "Government"] },
  { program: "Agricultural Engineering", company: "Savannah Agricultural Research Institute (SARI)", region: "Northern", city: "Tamale", email: "sari@csir.org.gh", focus: "Farm mechanisation, post-harvest engineering", interests: ["Research", "Mechanisation", "Agriculture"] },
  { program: "Agricultural Engineering", company: "Opoku Ware Farms", region: "Ashanti", city: "Ejura", email: "info@opokuwarefarms.com", focus: "Large-scale farming, mechanised operations", interests: ["Agriculture", "Mechanisation", "Private Sector"] },
  { program: "Agricultural Engineering", company: "Agricultural Development Bank (ADB)", region: "Greater Accra", city: "Accra", email: "customercare@agricbank.com", focus: "Agri-financing, rural infrastructure support", interests: ["Finance", "Infrastructure", "Government"] },

  // Aerospace Engineering
  { program: "Aerospace Engineering", company: "Ghana Civil Aviation Authority (GCAA)", region: "Greater Accra", city: "Accra", email: "ais@caa.com.gh", focus: "Aviation safety, airspace management, regulatory operations", interests: ["Aviation", "Safety", "Government"] },
  { program: "Aerospace Engineering", company: "Africa World Airlines (AWA)", region: "Greater Accra", city: "Accra", email: "res.callcentre@flyafricaworld.com", focus: "Aircraft operations, maintenance coordination", interests: ["Aviation", "Operations", "Private Sector"] },
  { program: "Aerospace Engineering", company: "Ghana Air Force – Technical Dept", region: "Greater Accra", city: "Accra", email: "spro@airforce.mil.gh", focus: "Aircraft maintenance, avionics, aerospace systems", interests: ["Defense", "Aviation", "Maintenance"] },
  { program: "Aerospace Engineering", company: "Takoradi Technical University – Aero Dept", region: "Western", city: "Takoradi", email: "takoradi.university@ttu.edu.gh", focus: "Aeronautical training, aircraft structural analysis", interests: ["Research", "Aviation", "Education"] },

  // Automobile Engineering
  { program: "Automobile Engineering", company: "Toyota Ghana Limited", region: "Greater Accra", city: "Accra", email: "info@toyotaghana.com", focus: "Vehicle servicing, automotive systems, diagnostics", interests: ["Automotive", "Diagnostics", "Private Sector"] },
  { program: "Automobile Engineering", company: "Mechanical Lloyd Company Ghana", region: "Greater Accra", city: "Accra", email: "enquired@mechlloyd.com", focus: "Auto engineering, spare parts, fleet management", interests: ["Automotive", "Fleet Management", "Private Sector"] },
  { program: "Automobile Engineering", company: "CFAO Motors Ghana", region: "Greater Accra", city: "Accra", email: "cfaomotors@cfao-gh.com", focus: "Vehicle assembly, automobile systems, after-sales engineering", interests: ["Automotive", "Assembly", "Private Sector"] },
  { program: "Automobile Engineering", company: "NTHC Technical Services", region: "Ashanti", city: "Kumasi", email: "info@nthctech.com.gh", focus: "Automotive repairs, mechanical diagnostics, fleet service", interests: ["Automotive", "Diagnostics", "Ashanti"] },

  // Biomedical Engineering
  { program: "Biomedical Engineering", company: "Komfo Anokye Teaching Hospital (KATH)", region: "Ashanti", city: "Kumasi", email: "info@kath.gov.gh", focus: "Medical equipment maintenance, clinical engineering", interests: ["Healthcare", "Medical Devices", "Government"] },
  { program: "Biomedical Engineering", company: "Korle-Bu Teaching Hospital", region: "Greater Accra", city: "Accra", email: "hr@kbth.gov.gh", focus: "Biomedical device management, hospital technology", interests: ["Healthcare", "Medical Devices", "Government"] },
  { program: "Biomedical Engineering", company: "Gentleland Healthcare Ltd", region: "Ashanti", city: "Kumasi", email: "enquires@ghc.services", focus: "Medical supplies, device distribution & maintenance", interests: ["Healthcare", "Private Sector", "Ashanti"] },
  { program: "Biomedical Engineering", company: "Medlab Ghana", region: "Greater Accra", city: "Accra", email: "info@medlab.com.gh", focus: "Laboratory systems, diagnostic equipment management", interests: ["Healthcare", "Laboratory", "Private Sector"] },

  // Chemical Engineering
  { program: "Chemical Engineering", company: "Guinness Ghana Breweries PLC", region: "Greater Accra", city: "Accra", email: "ghanainfo@diageo.com", focus: "Brewing processes, quality control, chemical analysis", interests: ["Manufacturing", "Quality Control", "Private Sector"] },
  { program: "Chemical Engineering", company: "Cocoa Processing Company (CPC)", region: "Greater Accra", city: "Tema", email: "info@goldentreeghana.com", focus: "Cocoa butter/powder production, food chemistry", interests: ["Manufacturing", "Food", "Private Sector"] },
  { program: "Chemical Engineering", company: "Anglogold Ashanti – Obuasi Mine", region: "Ashanti", city: "Obuasi", email: "paia@anglogoldashanti.com", focus: "Mineral processing, hydrometallurgy, reagent use", interests: ["Mining", "Minerals", "Private Sector"] },
  { program: "Chemical Engineering", company: "Fan Milk Ghana PLC", region: "Greater Accra", city: "Accra", email: "info@fanmilk.com.gh", focus: "Dairy processing, food safety, plant operations", interests: ["Manufacturing", "Food", "Private Sector"] },

  // Civil Engineering
  { program: "Civil Engineering", company: "Ghana Highway Authority (GHA)", region: "Ashanti", city: "Kumasi", email: "ce@highways.gov.gh", focus: "Road design, bridge construction, highway maintenance", interests: ["Infrastructure", "Government", "Construction"] },
  { program: "Civil Engineering", company: "Architectural & Engineering Services Ltd (AESL)", region: "Greater Accra", city: "Accra", email: "aesl@ghana.com", focus: "Structural design, building inspection, civil works", interests: ["Structural", "Design", "Government"] },
  { program: "Civil Engineering", company: "Ghana Water Company Limited (GWCL)", region: "Greater Accra", city: "Accra", email: "smartey@gwcl.com.gh", focus: "Water supply infrastructure, pipe design, hydraulics", interests: ["Water", "Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Messrs Berock Ventures", region: "Ashanti", city: "Kumasi", email: "info@berockconstruction", focus: "Construction management, earthworks, site supervision", interests: ["Construction", "Management", "Ashanti"] },

  // Computer Engineering
  { program: "Computer Engineering", company: "Ghana Revenue Authority (GRA) – IT Dept", region: "Greater Accra", city: "Accra", email: "ithelpdesk@gra.gov.gh", focus: "Systems administration, software development, networking", interests: ["IT", "Government", "Software"] },
  { program: "Computer Engineering", company: "Rancard Solutions", region: "Greater Accra", city: "Accra", email: "info@rancard.com", focus: "Mobile platforms, software engineering, data systems", interests: ["Software", "Mobile", "Tech Startup"] },
  { program: "Computer Engineering", company: "Vodafone Ghana", region: "Greater Accra", city: "Accra", email: "info@telecel.com.gh", focus: "Network engineering, IT infrastructure, telecoms", interests: ["Telecoms", "Networks", "Private Sector"] },
  { program: "Computer Engineering", company: "Hubtel Ghana", region: "Greater Accra", city: "Accra", email: "support@hubtel.com", focus: "Payment systems, software development, APIs", interests: ["Fintech", "Software", "Tech Startup"] },

  // Electrical Engineering
  { program: "Electrical Engineering", company: "Electricity Company of Ghana (ECG)", region: "Ashanti", city: "Kumasi", email: "help@ecggh.com", focus: "Power distribution, electrical installation, maintenance", interests: ["Energy", "Government", "Infrastructure"] },
  { program: "Electrical Engineering", company: "Ghana Grid Company (GRIDCo)", region: "Greater Accra", city: "Tema", email: "gridco@gridcogh.com", focus: "High-voltage transmission, grid operations", interests: ["Energy", "Government", "Infrastructure"] },
  { program: "Electrical Engineering", company: "Volta River Authority (VRA)", region: "Greater Accra", city: "Accra", email: "info@vra.com", focus: "Power generation, hydroelectric systems, energy management", interests: ["Energy", "Government", "Water"] },
  { program: "Electrical Engineering", company: "Huawei Technologies Ghana", region: "Greater Accra", city: "Accra", email: "ghana@huawei.com", focus: "Telecoms infrastructure, ICT networks, electronics", interests: ["Telecoms", "IT", "Private Sector"] },

  // Geological Engineering
  { program: "Geological Engineering", company: "Geological Survey Authority (GSA)", region: "Greater Accra", city: "Accra", email: "info@geologicalsurvey.gov.gh", focus: "Geological mapping, mineral exploration, site investigation", interests: ["Mining", "Government", "Research"] },
  { program: "Geological Engineering", company: "Gold Fields Ghana – Tarkwa Mine", region: "Western", city: "Tarkwa", email: "info@goldfields.com", focus: "Open-pit mining geology, ore sampling, rock mechanics", interests: ["Mining", "Minerals", "Private Sector"] },
  { program: "Geological Engineering", company: "Newmont Ghana – Ahafo Mine", region: "Brong-Ahafo", city: "Kenyasi", email: "ghana@newmont.com", focus: "Underground mining, geotechnical engineering", interests: ["Mining", "Minerals", "Private Sector"] },
  { program: "Geological Engineering", company: "Environmental & Geological Consultants Ltd", region: "Ashanti", city: "Kumasi", email: "admin@egcghana.com", focus: "Environmental geology, foundation investigation", interests: ["Environment", "Consulting", "Ashanti"] },

  // Geomatic Engineering
  { program: "Geomatic Engineering", company: "Survey & Mapping Division (Lands Commission)", region: "Greater Accra", city: "Accra", email: "info@landscommission.gov.gh", focus: "Topographic surveys, cadastral mapping, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Geodata International Ltd", region: "Ashanti", city: "Kumasi", email: "info@geodataghana.com", focus: "Remote sensing, land surveying, spatial data", interests: ["GIS", "Remote Sensing", "Ashanti"] },
  { program: "Geomatic Engineering", company: "Ghana Hydrological Services Dept", region: "Greater Accra", city: "Accra", email: "info@hydrologygh.gov.gh", focus: "Hydrological mapping, flood risk assessment", interests: ["Water", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Geospatial Systems Limited", region: "Greater Accra", city: "Accra", email: "info@gssl.com.gh", focus: "GIS consulting, aerial photography, drone mapping", interests: ["GIS", "Drones", "Private Sector"] },

  // Industrial Engineering
  { program: "Industrial Engineering", company: "Ghana Cocoa Board (COCOBOD)", region: "Ashanti", city: "Kumasi", email: "info@cocobod.gh", focus: "Supply chain, logistics, process optimisation", interests: ["Logistics", "Government", "Agriculture"] },
  { program: "Industrial Engineering", company: "Printex Ghana Limited", region: "Greater Accra", city: "Accra", email: "info@printex.com.gh", focus: "Manufacturing operations, production planning", interests: ["Manufacturing", "Production", "Private Sector"] },
  { program: "Industrial Engineering", company: "Ghana Bauxite Company", region: "Western", city: "Awaso", email: "info@ghanabauxite.com", focus: "Mining operations, industrial process management", interests: ["Mining", "Operations", "Private Sector"] },
  { program: "Industrial Engineering", company: "PZ Cussons Ghana", region: "Greater Accra", city: "Accra", email: "info@pzcussons.com.gh", focus: "FMCG manufacturing, quality engineering", interests: ["Manufacturing", "Quality Control", "Private Sector"] },

  // Materials Engineering
  { program: "Materials Engineering", company: "Ghana Standards Authority (GSA)", region: "Greater Accra", city: "Accra", email: "info@gsa.gov.gh", focus: "Material testing, standards compliance, quality assurance", interests: ["Quality Control", "Government", "Research"] },
  { program: "Materials Engineering", company: "Latex Foam Rubber Products", region: "Greater Accra", city: "Accra", email: "info@latexfoam.com.gh", focus: "Polymer processing, foam manufacturing", interests: ["Manufacturing", "Polymers", "Private Sector"] },
  { program: "Materials Engineering", company: "Interplast Ghana Ltd", region: "Greater Accra", city: "Accra", email: "info@interplastghana.com", focus: "Plastics fabrication, material selection & testing", interests: ["Manufacturing", "Polymers", "Private Sector"] },
  { program: "Materials Engineering", company: "Tema Steel Works", region: "Greater Accra", city: "Tema", email: "info@temasteel.com.gh", focus: "Steel rolling, metallurgical analysis", interests: ["Metals", "Manufacturing", "Private Sector"] },

  // Metallurgical Engineering
  { program: "Metallurgical Engineering", company: "Anglogold Ashanti – Obuasi Mine", region: "Ashanti", city: "Obuasi", email: "metallurgy@anglogoldashanti.com", focus: "Hydrometallurgy, gold extraction, mineral processing", interests: ["Mining", "Metals", "Private Sector"] },
  { program: "Metallurgical Engineering", company: "Gold Fields Ghana – Tarkwa Mine", region: "Western", city: "Tarkwa", email: "metallurgy@goldfields.com", focus: "Ore processing, smelting, pyrometallurgy", interests: ["Mining", "Metals", "Private Sector"] },
  { program: "Metallurgical Engineering", company: "Tema Steel Works", region: "Greater Accra", city: "Tema", email: "info@temasteel.com.gh", focus: "Steel making, alloy design, heat treatment", interests: ["Metals", "Manufacturing", "Private Sector"] },
  { program: "Metallurgical Engineering", company: "Newmont Ghana – Ahafo Mine", region: "Brong-Ahafo", city: "Kenyasi", email: "metallurgy@newmont.com", focus: "Process metallurgy, leach circuit operations", interests: ["Mining", "Metals", "Private Sector"] },

  // Marine Engineering
  { program: "Marine Engineering", company: "Ghana Ports & Harbours Authority (GPHA)", region: "Greater Accra", city: "Tema", email: "info@ghanaports.com.gh", focus: "Port operations, marine equipment maintenance", interests: ["Maritime", "Government", "Infrastructure"] },
  { program: "Marine Engineering", company: "Black Star Line (Shipping)", region: "Greater Accra", city: "Accra", email: "info@blackstarline.com.gh", focus: "Marine vessel operations, ship maintenance", interests: ["Maritime", "Operations", "Private Sector"] },
  { program: "Marine Engineering", company: "Meridian Port Services (MPS)", region: "Greater Accra", city: "Tema", email: "info@meridianport.com", focus: "Container terminal, maritime logistics, marine systems", interests: ["Maritime", "Logistics", "Private Sector"] },
  { program: "Marine Engineering", company: "Tullow Oil Ghana (Offshore)", region: "Western", city: "Takoradi", email: "ghana@tullowoil.com", focus: "Offshore marine engineering, subsea operations", interests: ["Oil & Gas", "Maritime", "Private Sector"] },

  // Mechanical Engineering
  { program: "Mechanical Engineering", company: "Ghana Cylinder Manufacturing Company", region: "Ashanti", city: "Kumasi", email: "info@gcmcghana.com", focus: "Cylinder fabrication, manufacturing processes", interests: ["Manufacturing", "Fabrication", "Ashanti"] },
  { program: "Mechanical Engineering", company: "Tema Oil Refinery (TOR)", region: "Greater Accra", city: "Tema", email: "info@tor.com.gh", focus: "Petroleum refining, mechanical plant maintenance", interests: ["Oil & Gas", "Manufacturing", "Government"] },
  { program: "Mechanical Engineering", company: "Taysec Construction Ltd", region: "Greater Accra", city: "Accra", email: "info@taysec.com.gh", focus: "Heavy equipment operations, mechanical systems", interests: ["Construction", "Equipment", "Private Sector"] },
  { program: "Mechanical Engineering", company: "Karpowership Ghana", region: "Greater Accra", city: "Tema", email: "info@karpowership.com", focus: "Power plant engineering, turbine maintenance", interests: ["Energy", "Operations", "Private Sector"] },

  // Petrochemical Engineering
  { program: "Petrochemical Engineering", company: "Tema Oil Refinery (TOR)", region: "Greater Accra", city: "Tema", email: "info@tor.com.gh", focus: "Crude refining, petrochemical production, plant operations", interests: ["Oil & Gas", "Manufacturing", "Government"] },
  { program: "Petrochemical Engineering", company: "Sentuo Oil Refinery", region: "Greater Accra", city: "Tema", email: "info@sentuorefinery.com", focus: "Refinery operations, chemical process engineering", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Ghana National Gas Company (GNGC)", region: "Western", city: "Atuabo", email: "info@ghanagas.com.gh", focus: "Natural gas processing, gas plant operations", interests: ["Oil & Gas", "Energy", "Government"] },
  { program: "Petrochemical Engineering", company: "Bulk Oil Storage & Transportation (BOST)", region: "Greater Accra", city: "Accra", email: "info@bostghana.com", focus: "Petroleum product storage, pipeline management", interests: ["Oil & Gas", "Logistics", "Government"] },

  // Petroleum Engineering
  { program: "Petroleum Engineering", company: "Ghana National Petroleum Corporation (GNPC)", region: "Greater Accra", city: "Accra", email: "info@gnpcghana.com", focus: "Petroleum exploration, drilling engineering, reservoir management", interests: ["Oil & Gas", "Government", "Exploration"] },
  { program: "Petroleum Engineering", company: "Schlumberger (SLB) Ghana", region: "Greater Accra", city: "Accra", email: "ghana@slb.com", focus: "Oilfield services, well logging, production optimisation", interests: ["Oil & Gas", "Private Sector", "Technology"] },
  { program: "Petroleum Engineering", company: "Eni Ghana Exploration & Production", region: "Western", city: "Takoradi", email: "eni.ghana@eni.com", focus: "Offshore operations, production engineering", interests: ["Oil & Gas", "Maritime", "Private Sector"] },
  { program: "Petroleum Engineering", company: "Petroleum Commission Ghana", region: "Greater Accra", city: "Accra", email: "info@petroleumcommission.gov.gh", focus: "Regulatory compliance, upstream petroleum operations", interests: ["Oil & Gas", "Government", "Regulatory"] },

  // Telecommunication Engineering
  { program: "Telecommunication Engineering", company: "MTN Ghana", region: "Greater Accra", city: "Accra", email: "internship@mtn.com.gh", focus: "Mobile networks, RF engineering, network planning", interests: ["Telecoms", "Networks", "Private Sector"] },
  { program: "Telecommunication Engineering", company: "AirtelTigo Ghana", region: "Greater Accra", city: "Accra", email: "customercare@airteltigo.com.gh", focus: "Telecoms infrastructure, network operations", interests: ["Telecoms", "Networks", "Private Sector"] },
  { program: "Telecommunication Engineering", company: "National Communications Authority (NCA)", region: "Greater Accra", city: "Accra", email: "info@nca.org.gh", focus: "Spectrum management, regulatory compliance", interests: ["Telecoms", "Government", "Regulatory"] },
  { program: "Telecommunication Engineering", company: "Vodafone Ghana", region: "Greater Accra", city: "Accra", email: "info@vodafone.com.gh", focus: "Fibre optics, broadband infrastructure, telecoms systems", interests: ["Telecoms", "Networks", "Private Sector"] },
];

const ALL_PROGRAMS = [...new Set(INTERNSHIP_DATA.map(d => d.program))].sort();
const ALL_CITIES = [...new Set(INTERNSHIP_DATA.map(d => d.city))].sort();
const ALL_INTERESTS = [...new Set(INTERNSHIP_DATA.flatMap(d => d.interests))].sort();

const programColors = {
  "Agricultural Engineering": "#4CAF50",
  "Aerospace Engineering": "#2196F3",
  "Automobile Engineering": "#FF9800",
  "Biomedical Engineering": "#E91E63",
  "Chemical Engineering": "#9C27B0",
  "Civil Engineering": "#795548",
  "Computer Engineering": "#00BCD4",
  "Electrical Engineering": "#FFEB3B",
  "Geological Engineering": "#FF5722",
  "Geomatic Engineering": "#009688",
  "Industrial Engineering": "#607D8B",
  "Materials Engineering": "#3F51B5",
  "Metallurgical Engineering": "#F44336",
  "Marine Engineering": "#1565C0",
  "Mechanical Engineering": "#F5A300",
  "Petrochemical Engineering": "#6D4C41",
  "Petroleum Engineering": "#212121",
  "Telecommunication Engineering": "#D32F2F",
};

const THEME = {
  amber: "#F5A300",
  amberLight: "#FFB800",
  red: "#D32F2F",
  black: "#111111",
  blackSoft: "#1A1A1A",
  white: "#FFFFFF",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  :root {
    --amber: ${THEME.amber};
    --amber-light: ${THEME.amberLight};
    --red: ${THEME.red};
    --black: ${THEME.black};
    --black-soft: ${THEME.blackSoft};
    --white: ${THEME.white};
    --ease: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ihd-wrap {
    width: 100%;
    background: linear-gradient(160deg, #111111 0%, #1a1a1a 100%);
    border-top: 4px solid var(--amber);
    border-bottom: 4px solid var(--amber);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .ihd-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 5%;
  }

  /* Header */
  .ihd-header {
    text-align: center;
    margin-bottom: 3.5rem;
  }
  .ihd-tag {
    display: inline-block;
    background: var(--amber);
    color: var(--black);
    font-family: 'Oswald', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    padding: 0.3rem 1rem;
    margin-bottom: 1rem;
    border-radius: 100px;
    font-weight: 700;
  }
  .ihd-title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    color: var(--amber);
    margin-bottom: 0.75rem;
    line-height: 1.05;
  }
  .ihd-title span { color: #fff; }
  .ihd-sub {
    color: rgba(255,255,255,0.65);
    font-size: 1.05rem;
    font-weight: 600;
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* Stats bar */
  .ihd-stats {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }
  .ihd-stat {
    background: rgba(245,163,0,0.08);
    border: 2px solid rgba(245,163,0,0.2);
    border-radius: 12px;
    padding: 0.8rem 1.5rem;
    text-align: center;
    min-width: 130px;
  }
  .ihd-stat-num {
    font-family: 'Oswald', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--amber);
    display: block;
    line-height: 1;
  }
  .ihd-stat-label {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.5);
    font-weight: 700;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  /* Filters */
  .ihd-filters {
    background: rgba(255,255,255,0.04);
    border: 2px solid rgba(245,163,0,0.15);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2.5rem;
  }
  .ihd-filters-title {
    font-family: 'Oswald', sans-serif;
    color: var(--amber);
    font-size: 1rem;
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ihd-filters-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.2rem;
  }
  @media (max-width: 768px) {
    /* 1. Stacks the top Search/Programme/City filters (Already doing this, but good to keep) */
    .ihd-filters-grid { 
      grid-template-columns: 1fr; 
    }
    
    .ihd-inner { 
      padding: 70px 5%; 
    }

    /* 2. Forces the City and Region badges onto their own lines inside the cards */
    .ihd-card-location {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      width: 100%;
    }

    /* 3. Ensures the icons align properly when the text drops to a new line */
    .ihd-card-meta-row {
      align-items: flex-start; 
    }

    /* 4. Optional: Make the badges take up the full width for a cleaner mobile look */
    .ihd-city-badge, 
    .ihd-region-badge {
      display: block;
      width: 100%;
      text-align: left;
    }
    
    /* 5. Makes the Engineering Programme tag wrap cleanly if the text is too long */
    .ihd-card-program {
      white-space: normal;
      line-height: 1.4;
    }
  }
  .ihd-filter-group label {
    display: block;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .ihd-filter-group select,
  .ihd-search-input {
    width: 100%;
    background: rgba(0,0,0,0.4);
    border: 2px solid rgba(245,163,0,0.2);
    border-radius: 10px;
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.7rem 1rem;
    outline: none;
    cursor: pointer;
    transition: var(--ease);
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23F5A300' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.9rem center;
    padding-right: 2.5rem;
  }
  .ihd-filter-group select:focus,
  .ihd-search-input:focus {
    border-color: var(--amber);
    background-color: rgba(245,163,0,0.06);
  }
  .ihd-search-input {
    background-image: none;
    padding-right: 1rem;
  }
  .ihd-filter-group select option {
    background: #222;
    color: #fff;
  }
  .ihd-filter-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.2rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .ihd-results-count {
    color: rgba(255,255,255,0.5);
    font-size: 0.85rem;
    font-weight: 700;
  }
  .ihd-results-count span {
    color: var(--amber);
    font-family: 'Oswald', sans-serif;
    font-size: 1rem;
  }
  .ihd-clear-btn {
    background: transparent;
    border: 2px solid rgba(245,163,0,0.3);
    border-radius: 8px;
    color: var(--amber);
    font-family: 'Oswald', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.45rem 1rem;
    cursor: pointer;
    transition: var(--ease);
  }
  .ihd-clear-btn:hover {
    background: rgba(245,163,0,0.1);
    border-color: var(--amber);
  }

  /* Interest tag pills */
  .ihd-interest-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .ihd-interest-pill {
    background: transparent;
    border: 1.5px solid rgba(245,163,0,0.25);
    border-radius: 100px;
    color: rgba(255,255,255,0.55);
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.3rem 0.8rem;
    cursor: pointer;
    transition: var(--ease);
    font-family: 'Plus Jakarta Sans', sans-serif;
    letter-spacing: 0.03em;
  }
  .ihd-interest-pill:hover {
    border-color: var(--amber);
    color: var(--amber);
    background: rgba(245,163,0,0.06);
  }
  .ihd-interest-pill.active {
    background: var(--amber);
    border-color: var(--amber);
    color: var(--black);
  }

  /* Cards grid */
  .ihd-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    gap: 1.5rem;
  }
  @media (max-width: 700px) {
    .ihd-grid { grid-template-columns: 1fr; }
  }

  /* Company Card */
  .ihd-card {
    background: rgba(255,255,255,0.04);
    border: 2px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 1.8rem;
    transition: var(--ease);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .ihd-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--card-accent, var(--amber));
    border-radius: 18px 18px 0 0;
  }
  .ihd-card:hover {
    border-color: rgba(245,163,0,0.3);
    background: rgba(245,163,0,0.05);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,163,0,0.15);
  }

  .ihd-card-program {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--card-accent, var(--amber));
    font-family: 'Oswald', sans-serif;
  }
  .ihd-card-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--card-accent, var(--amber));
    flex-shrink: 0;
  }

  .ihd-card-company {
    font-family: 'Oswald', sans-serif;
    font-size: 1.2rem;
    color: #fff;
    font-weight: 600;
    line-height: 1.25;
  }

  .ihd-card-focus {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.55);
    line-height: 1.65;
    font-weight: 600;
  }

  .ihd-card-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .ihd-card-meta-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.5);
    font-weight: 600;
  }
  .ihd-card-meta-row svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
  .ihd-card-email {
    color: var(--amber) !important;
    text-decoration: none;
    word-break: break-all;
    transition: opacity 0.2s;
  }
  .ihd-card-email:hover { opacity: 0.75; }

  .ihd-card-location {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .ihd-city-badge {
    background: rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 0.15rem 0.5rem;
    font-size: 0.72rem;
    font-weight: 800;
    color: rgba(255,255,255,0.6);
    letter-spacing: 0.05em;
  }
  .ihd-region-badge {
    background: rgba(245,163,0,0.1);
    border: 1px solid rgba(245,163,0,0.2);
    border-radius: 6px;
    padding: 0.15rem 0.5rem;
    font-size: 0.72rem;
    font-weight: 800;
    color: rgba(245,163,0,0.8);
    letter-spacing: 0.05em;
  }

  /* Empty state */
  .ihd-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    color: rgba(255,255,255,0.35);
  }
  .ihd-empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  .ihd-empty h3 {
    font-family: 'Oswald', sans-serif;
    font-size: 1.5rem;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }
  .ihd-empty p {
    font-size: 0.9rem;
    font-weight: 600;
    max-width: 400px;
    margin: 0 auto;
  }
`;

export default function InternshipHelpDesk() {
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterInterest, setFilterInterest] = useState("");

  const filtered = useMemo(() => {
    return INTERNSHIP_DATA.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.company.toLowerCase().includes(q) ||
        item.focus.toLowerCase().includes(q) ||
        item.program.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q);
      const matchProgram = !filterProgram || item.program === filterProgram;
      const matchCity = !filterCity || item.city === filterCity;
      const matchInterest = !filterInterest || item.interests.includes(filterInterest);
      return matchSearch && matchProgram && matchCity && matchInterest;
    });
  }, [search, filterProgram, filterCity, filterInterest]);

  const clearAll = () => {
    setSearch("");
    setFilterProgram("");
    setFilterCity("");
    setFilterInterest("");
  };

  const hasFilters = search || filterProgram || filterCity || filterInterest;

  return (
    <>
      <style>{styles}</style>
      <section className="ihd-wrap" id="internships">
        <div className="ihd-inner">

          {/* Header */}
          <div className="ihd-header">
            <span className="ihd-tag">🎓 THE INDUSTRIAL BRIDGE</span>
            <h2 className="ihd-title">
              Find Your <span>Industrial Attachment</span>
            </h2>
            <p className="ihd-sub">
              A curated directory of internship-ready companies across Ghana — filtered by your
              programme, city, and area of interest. All contacts verified for KNUST engineering students.
            </p>
          </div>

          {/* Stats */}
          <div className="ihd-stats">
            <div className="ihd-stat">
              <span className="ihd-stat-num">{INTERNSHIP_DATA.length}</span>
              <div className="ihd-stat-label">Companies Listed</div>
            </div>
            <div className="ihd-stat">
              <span className="ihd-stat-num">18</span>
              <div className="ihd-stat-label">Engineering Programmes</div>
            </div>
            <div className="ihd-stat">
              <span className="ihd-stat-num">{ALL_CITIES.length}</span>
              <div className="ihd-stat-label">Cities Covered</div>
            </div>
            <div className="ihd-stat">
              <span className="ihd-stat-num">6</span>
              <div className="ihd-stat-label">Regions in Ghana</div>
            </div>
          </div>

          {/* Filters */}
          <div className="ihd-filters">
            <div className="ihd-filters-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              FILTER COMPANIES
            </div>

            <div className="ihd-filters-grid">
              <div className="ihd-filter-group">
                <label>Search</label>
                <input
                  className="ihd-search-input"
                  type="text"
                  placeholder="Company, focus area, programme..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="ihd-filter-group">
                <label>Engineering Programme</label>
                <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)}>
                  <option value="">All Programmes</option>
                  {ALL_PROGRAMS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="ihd-filter-group">
                <label>City / Location</label>
                <select value={filterCity} onChange={e => setFilterCity(e.target.value)}>
                  <option value="">All Cities</option>
                  {ALL_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interest tag filters */}
            <div style={{ marginTop: "1.2rem" }}>
              <label style={{ display:"block", fontSize:"0.72rem", fontWeight:800, letterSpacing:"0.12em", color:"rgba(255,255,255,0.5)", textTransform:"uppercase", marginBottom:"0.6rem" }}>
                Filter by Interest
              </label>
              <div className="ihd-interest-pills">
                {ALL_INTERESTS.map(interest => (
                  <button
                    key={interest}
                    className={`ihd-interest-pill${filterInterest === interest ? " active" : ""}`}
                    onClick={() => setFilterInterest(filterInterest === interest ? "" : interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="ihd-filter-actions">
              <div className="ihd-results-count">
                Showing <span>{filtered.length}</span> of {INTERNSHIP_DATA.length} companies
              </div>
              {hasFilters && (
                <button className="ihd-clear-btn" onClick={clearAll}>
                  ✕ Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="ihd-grid">
            {filtered.length === 0 ? (
              <div className="ihd-empty">
                <span className="ihd-empty-icon">🔍</span>
                <h3>No matches found</h3>
                <p>Try adjusting your filters or search term to find more companies.</p>
              </div>
            ) : (
              filtered.map((item, i) => {
                const accent = programColors[item.program] || THEME.amber;
                return (
                  <div
                    key={`${item.company}-${item.program}-${i}`}
                    className="ihd-card"
                    style={{ "--card-accent": accent }}
                  >
                    <div className="ihd-card-program">
                      <div className="ihd-card-dot" />
                      {item.program}
                    </div>

                    <div className="ihd-card-company">{item.company}</div>

                    <div className="ihd-card-focus">{item.focus}</div>

                    <div className="ihd-card-meta">
                      <div className="ihd-card-meta-row">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <a href={`mailto:${item.email}`} className="ihd-card-email">
                          {item.email}
                        </a>
                      </div>
                      <div className="ihd-card-meta-row">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <div className="ihd-card-location">
                          <span className="ihd-city-badge">{item.city}</span>
                          <span className="ihd-region-badge">{item.region}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </section>
    </>
  );
}