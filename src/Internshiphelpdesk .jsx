import { useState, useMemo } from "react";

// ===== ALL INTERNSHIP DATA FROM EXCEL =====
const INTERNSHIP_DATA = [
  // Agricultural Engineering
  { program: "Agricultural Engineering", company: "CSIR – Crops Research Institute", region: "Ashanti", city: "Kumasi", email: "cri@csir-ghana.org", focus: "Crop production systems, mechanised agriculture research", interests: ["Research", "Agriculture", "Ashanti"] },
  { program: "Agricultural Engineering", company: "Yedent Agro Group", region: "Northern", city: "Tamale", email: "info@yedent.com", focus: "Grain processing, food storage, post-harvest systems", interests: ["Manufacturing", "Agriculture", "Private Sector"] },
  { program: "Agricultural Engineering", company: "Ghana Grains Council", region: "Greater Accra", city: "Accra", email: "info@ghanagrainscouncil.org", focus: "Grain quality standards, silo management, storage engineering", interests: ["Agriculture", "Government", "Research"] },
 
  // Aerospace Engineering
  { program: "Aerospace Engineering", company: "PassionAir Ghana", region: "Greater Accra", city: "Accra", email: "info@fly.passionair.com.gh", focus: "Commercial aviation, fleet maintenance, flight operations", interests: ["Aviation", "Operations", "Private Sector"] },
  { program: "Aerospace Engineering", company: "Aircraft Maintenance & Engineering Services (AMES)", region: "Greater Accra", city: "Accra", email: "info@amesghana.com", focus: "MRO services, airframe & engine maintenance", interests: ["Aviation", "Maintenance", "Private Sector"] },
  { program: "Aerospace Engineering", company: "Bristow Helicopters Ghana", region: "Western", city: "Takoradi", email: "ghana@bristowgroup.com", focus: "Offshore helicopter operations, rotary-wing maintenance", interests: ["Aviation", "Oil & Gas", "Private Sector"] },
 
  // Automobile Engineering
  { program: "Automobile Engineering", company: "Suzuki Ghana (Motorsport Ghana)", region: "Greater Accra", city: "Accra", email: "info@suzukighana.com", focus: "Vehicle systems, automobile electronics, diagnostics", interests: ["Automotive", "Diagnostics", "Private Sector"] },
  { program: "Automobile Engineering", company: "Kantanka Automobile Company", region: "Greater Accra", city: "Accra", email: "info@kantanka.com.gh", focus: "Local vehicle assembly, powertrain engineering, R&D", interests: ["Automotive", "Assembly", "Private Sector"] },
  { program: "Automobile Engineering", company: "Amanfrom Filling Station & Auto Service", region: "Ashanti", city: "Kumasi", email: "info@amanfromauto.com", focus: "Vehicle maintenance, fuel systems, auto-electrical engineering", interests: ["Automotive", "Diagnostics", "Ashanti"] },
 
  // Biomedical Engineering
  { program: "Biomedical Engineering", company: "Nyaho Medical Centre", region: "Greater Accra", city: "Accra", email: "info@nyahoclinic.com", focus: "Clinical biomedical equipment, hospital systems engineering", interests: ["Healthcare", "Medical Devices", "Private Sector"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit", region: "Greater Accra", city: "Accra", email: "info@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Research"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit – Ashanti Branch", region: "Ashanti", city: "Kumasi", email: "ashanti@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Ashanti"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit – Western Branch", region: "Western", city: "Takoradi", email: "western@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Research"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit – Northern Branch", region: "Northern", city: "Tamale", email: "northern@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Research"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit – Eastern Branch", region: "Eastern", city: "Koforidua", email: "eastern@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Research"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit – Central Branch", region: "Central", city: "Cape Coast", email: "central@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Research"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit – Upper East Branch", region: "Upper East", city: "Bolgatanga", email: "uppereast@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Research"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit – Volta Branch", region: "Volta", city: "Ho", email: "volta@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Research"] },
  { program: "Biomedical Engineering", company: "Ghana Health Service – Biomedical Unit – Upper West Branch", region: "Upper West", city: "Wa", email: "upperwest@ghanahealth.gov.gh", focus: "National equipment maintenance, health technology assessment", interests: ["Healthcare", "Government", "Research"] },
  { program: "Biomedical Engineering", company: "Siemens Healthineers Ghana", region: "Greater Accra", city: "Accra", email: "ghana@siemens-healthineers.com", focus: "Imaging systems, diagnostic equipment installation & service", interests: ["Healthcare", "Medical Devices", "Private Sector"] },
 
  // Chemical Engineering
  { program: "Chemical Engineering", company: "Unilever Ghana PLC", region: "Greater Accra", city: "Accra", email: "info@unileverghana.com", focus: "Consumer goods manufacturing, process chemistry, formulation", interests: ["Manufacturing", "Quality Control", "Private Sector"] },
  { program: "Chemical Engineering", company: "Sentuo Oil Refinery", region: "Greater Accra", city: "Tema", email: "info@sentuorefinery.com", focus: "Refinery operations, chemical process engineering", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Chemical Engineering", company: "Latex Foam Rubber Products", region: "Greater Accra", city: "Accra", email: "info@latexfoam.com.gh", focus: "Polymer processing, foam chemistry & manufacturing", interests: ["Manufacturing", "Polymers", "Private Sector"] },
 
  // Civil Engineering
  { program: "Civil Engineering", company: "Taysec Construction Ltd", region: "Greater Accra", city: "Accra", email: "info@taysec.com.gh", focus: "Heavy civil construction, earthmoving, project management", interests: ["Construction", "Infrastructure", "Private Sector"] },
  { program: "Civil Engineering", company: "Vinci Construction (Bouygues Ghana)", region: "Greater Accra", city: "Accra", email: "info@bouyghesghana.com", focus: "Large-scale infrastructure, bridges, road construction", interests: ["Infrastructure", "Construction", "Private Sector"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Ashanti Region", region: "Ashanti", city: "Kumasi", email: "info@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government", "Ashanti"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Greater Accra Branch", region: "Greater Accra", city: "Accra", email: "accra@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Western Branch", region: "Western", city: "Takoradi", email: "western@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Eastern Branch", region: "Eastern", city: "Koforidua", email: "eastern@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Northern Branch", region: "Northern", city: "Tamale", email: "northern@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Central Branch", region: "Central", city: "Cape Coast", email: "central@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Volta Branch", region: "Volta", city: "Ho", email: "volta@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Upper East Branch", region: "Upper East", city: "Bolgatanga", email: "uppereast@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Upper West Branch", region: "Upper West", city: "Wa", email: "upperwest@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Brong-Ahafo Branch", region: "Brong-Ahafo", city: "Sunyani", email: "bronahafo@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Savannah Branch", region: "Savannah", city: "Damongo", email: "savannah@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Oti Branch", region: "Oti", city: "Dambai", email: "oti@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Western North Branch", region: "Western North", city: "Sefwi Wiawso", email: "westernnorth@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – North East Branch", region: "North East", city: "Nalerigu", email: "northeast@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Bono East Branch", region: "Bono East", city: "Techiman", email: "bonoeast@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
  { program: "Civil Engineering", company: "Urban Roads Dept – Ahafo Branch", region: "Ahafo", city: "Goaso", email: "ahafo@urbanroads.gov.gh", focus: "Urban road design, drainage systems, traffic engineering", interests: ["Infrastructure", "Government"] },
 
  // Computer Engineering
  { program: "Computer Engineering", company: "Amalitech Ghana", region: "Greater Accra", city: "Accra", email: "info@amalitech.com", focus: "Software development, cloud engineering, IT outsourcing", interests: ["Software", "IT", "Tech Startup"] },
  { program: "Computer Engineering", company: "Amalitech Ghana – Ashanti Branch", region: "Ashanti", city: "Kumasi", email: "kumasi@amalitech.com", focus: "Software development, cloud engineering, IT outsourcing", interests: ["Software", "IT", "Ashanti"] },
  { program: "Computer Engineering", company: "Logiciel Ltd", region: "Ashanti", city: "Kumasi", email: "info@logicielghana.com", focus: "Enterprise software, embedded systems, hardware-software integration", interests: ["Software", "IT", "Ashanti"] },
  { program: "Computer Engineering", company: "Ghana-India Kofi Annan Centre of Excellence in ICT", region: "Greater Accra", city: "Accra", email: "info@kaceict.org", focus: "ICT research, hardware prototyping, network systems", interests: ["IT", "Research", "Networks"] },
 
  // Electrical Engineering
  { program: "Electrical Engineering", company: "Karpowership Ghana", region: "Greater Accra", city: "Tema", email: "info@karpowership.com", focus: "Power plant engineering, turbine operations, electrical systems", interests: ["Energy", "Operations", "Private Sector"] },
  { program: "Electrical Engineering", company: "BUI Power Authority", region: "Brong-Ahafo", city: "Bui", email: "info@buipower.com.gh", focus: "Hydropower generation, dam electrical systems, switchgear", interests: ["Energy", "Water", "Government"] },
  { program: "Electrical Engineering", company: "Elkem Ghana (Solar & Renewable Energy)", region: "Greater Accra", city: "Accra", email: "info@elkem.com.gh", focus: "Solar PV systems, renewable energy installation & testing", interests: ["Energy", "Research", "Private Sector"] },
 
  // Geological Engineering
  { program: "Geological Engineering", company: "Ghana Manganese Company", region: "Western", city: "Tarkwa", email: "info@ghanamanganeseco.com", focus: "Manganese ore extraction, geological surveys, mine planning", interests: ["Mining", "Minerals", "Private Sector"] },
  { program: "Geological Engineering", company: "Chirano Gold Mines (Kinross)", region: "Western", city: "Chirano", email: "info@kinross.com", focus: "Underground geology, drill-core analysis, reserve estimation", interests: ["Mining", "Minerals", "Private Sector"] },
  { program: "Geological Engineering", company: "Bulk Earth Science Consultants", region: "Ashanti", city: "Kumasi", email: "info@bulkearthscience.com", focus: "Geotechnical investigations, slope stability, soil testing", interests: ["Research", "Consulting", "Ashanti"] },
 
  // Geomatic Engineering
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept", region: "Ashanti", city: "Kumasi", email: "info@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Ashanti"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Greater Accra Branch", region: "Greater Accra", city: "Accra", email: "accra@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Western Branch", region: "Western", city: "Takoradi", email: "western@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Eastern Branch", region: "Eastern", city: "Koforidua", email: "eastern@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Central Branch", region: "Central", city: "Cape Coast", email: "central@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Northern Branch", region: "Northern", city: "Tamale", email: "northern@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Upper East Branch", region: "Upper East", city: "Bolgatanga", email: "uppereast@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Upper West Branch", region: "Upper West", city: "Wa", email: "upperwest@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Volta Branch", region: "Volta", city: "Ho", email: "volta@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Brong-Ahafo Branch", region: "Brong-Ahafo", city: "Sunyani", email: "bronahafo@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Savannah Branch", region: "Savannah", city: "Damongo", email: "savannah@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Oti Branch", region: "Oti", city: "Dambai", email: "oti@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Western North Branch", region: "Western North", city: "Sefwi Wiawso", email: "westernnorth@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – North East Branch", region: "North East", city: "Nalerigu", email: "northeast@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Bono East Branch", region: "Bono East", city: "Techiman", email: "bonoeast@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Town & Country Planning Dept – Ahafo Branch", region: "Ahafo", city: "Goaso", email: "ahafo@tcpd.gov.gh", focus: "Land use planning, urban spatial analysis, GIS", interests: ["GIS", "Government", "Mapping"] },
  { program: "Geomatic Engineering", company: "Ghana Space Science & Technology Institute (GSSTI)", region: "Greater Accra", city: "Accra", email: "info@gssti.org", focus: "Satellite imagery, remote sensing applications, spatial data", interests: ["GIS", "Remote Sensing", "Research"] },
  { program: "Geomatic Engineering", company: "Trim Ghana Ltd", region: "Greater Accra", city: "Accra", email: "info@trimghana.com", focus: "GPS/GNSS surveying, engineering surveys, volume calculations", interests: ["GIS", "Mapping", "Private Sector"] },
 
  // Industrial Engineering
  { program: "Industrial Engineering", company: "Neoplan Ghana Limited", region: "Greater Accra", city: "Accra", email: "info@neoplanghana.com", focus: "Bus assembly, production systems, lean manufacturing", interests: ["Manufacturing", "Production", "Private Sector"] },
  { program: "Industrial Engineering", company: "Kasapreko Company Limited", region: "Greater Accra", city: "Accra", email: "info@kasapreko.com", focus: "Beverage manufacturing, production scheduling, quality control", interests: ["Manufacturing", "Quality Control", "Private Sector"] },
  { program: "Industrial Engineering", company: "GCB Bank – Operations Dept", region: "Greater Accra", city: "Accra", email: "info@gcbbank.com.gh", focus: "Process optimisation, service operations, workflow engineering", interests: ["Operations", "Finance", "Private Sector"] },
 
  // Materials Engineering
  { program: "Materials Engineering", company: "Omega Packaging Ghana", region: "Greater Accra", city: "Tema", email: "info@omegapackaging.com.gh", focus: "Packaging materials, polymer science, product testing", interests: ["Manufacturing", "Polymers", "Private Sector"] },
  { program: "Materials Engineering", company: "Pioneer Aluminium Factory", region: "Greater Accra", city: "Accra", email: "info@pioneeraluminium.com.gh", focus: "Aluminium fabrication, alloy processing, surface treatment", interests: ["Metals", "Manufacturing", "Private Sector"] },
  { program: "Materials Engineering", company: "CSIR – Building & Road Research Institute (BRRI)", region: "Ashanti", city: "Kumasi", email: "brri@csir-ghana.org", focus: "Construction materials testing, road materials research", interests: ["Research", "Infrastructure", "Ashanti"] },
 
  // Metallurgical Engineering
  { program: "Metallurgical Engineering", company: "Ghana Manganese Company", region: "Western", city: "Tarkwa", email: "metallurgy@ghanamanganeseco.com", focus: "Manganese smelting, ore beneficiation, metal recovery", interests: ["Mining", "Metals", "Private Sector"] },
  { program: "Metallurgical Engineering", company: "Pioneer Aluminium Factory", region: "Greater Accra", city: "Accra", email: "metallurgy@pioneeraluminium.com.gh", focus: "Aluminium casting, alloying, quality control", interests: ["Metals", "Manufacturing", "Private Sector"] },
  { program: "Metallurgical Engineering", company: "Chirano Gold Mines (Kinross)", region: "Western", city: "Chirano", email: "metallurgy@kinross.com", focus: "Gold doré production, carbon-in-leach processing", interests: ["Mining", "Metals", "Private Sector"] },
 
  // Marine Engineering
  { program: "Marine Engineering", company: "Ghana Maritime Authority (GMA)", region: "Greater Accra", city: "Accra", email: "info@ghanamaritime.org", focus: "Vessel inspection, maritime safety, seafarer certification", interests: ["Maritime", "Government", "Safety"] },
  { program: "Marine Engineering", company: "Fareast Shipping & Logistics", region: "Greater Accra", city: "Tema", email: "info@fareastghana.com", focus: "Ship agency, marine logistics, vessel turnaround management", interests: ["Maritime", "Logistics", "Private Sector"] },
  { program: "Marine Engineering", company: "Stena Drilling (FPSO Operations)", region: "Western", city: "Takoradi", email: "info@stenadrillinggh.com", focus: "FPSO marine systems, dynamic positioning, offshore maintenance", interests: ["Maritime", "Oil & Gas", "Private Sector"] },
 
  // Mechanical Engineering
  { program: "Mechanical Engineering", company: "Neoplan Ghana Limited", region: "Greater Accra", city: "Accra", email: "mechanical@neoplanghana.com", focus: "Bus manufacturing, mechanical assembly, production engineering", interests: ["Manufacturing", "Production", "Private Sector"] },
  { program: "Mechanical Engineering", company: "Ghana Water Company Limited (GWCL) – Mechanical Dept", region: "Greater Accra", city: "Accra", email: "mechanical@gwcl.com.gh", focus: "Pump systems, pipe networks, mechanical maintenance", interests: ["Water", "Infrastructure", "Government"] },
  { program: "Mechanical Engineering", company: "GHACEM (Ghana Cement)", region: "Greater Accra", city: "Tema", email: "info@ghacem.com.gh", focus: "Cement plant machinery, kiln operations, mechanical maintenance", interests: ["Manufacturing", "Operations", "Private Sector"] },
 
  // Petrochemical Engineering
  { program: "Petrochemical Engineering", company: "Aboadze Power Plant (TICO)", region: "Western", city: "Aboadze", email: "info@tico.com.gh", focus: "Thermal power, combustion engineering, fuel gas systems", interests: ["Oil & Gas", "Energy", "Government"] },
  { program: "Petrochemical Engineering", company: "Cirrus Oil Services Ghana", region: "Western", city: "Takoradi", email: "info@cirrusoil.com", focus: "Petrochemical logistics, fuel blending, oilfield chemicals", interests: ["Oil & Gas", "Logistics", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana", region: "Greater Accra", city: "Accra", email: "ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana – Ashanti Branch", region: "Ashanti", city: "Kumasi", email: "ashanti.ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Ashanti"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana – Western Branch", region: "Western", city: "Takoradi", email: "western.ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana – Central Branch", region: "Central", city: "Cape Coast", email: "central.ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana – Northern Branch", region: "Northern", city: "Tamale", email: "northern.ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana – Eastern Branch", region: "Eastern", city: "Koforidua", email: "eastern.ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana – Volta Branch", region: "Volta", city: "Ho", email: "volta.ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana – Upper East Branch", region: "Upper East", city: "Bolgatanga", email: "uppereast.ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
  { program: "Petrochemical Engineering", company: "Total Energies Ghana – Brong-Ahafo Branch", region: "Brong-Ahafo", city: "Sunyani", email: "bronahafo.ghana@totalenergies.com", focus: "Fuel distribution, lubricant formulation, downstream operations", interests: ["Oil & Gas", "Manufacturing", "Private Sector"] },
 
  // Petroleum Engineering
  { program: "Petroleum Engineering", company: "Tullow Oil Ghana", region: "Western", city: "Takoradi", email: "ghana@tullowoil.com", focus: "Offshore oil production, reservoir engineering, well intervention", interests: ["Oil & Gas", "Maritime", "Private Sector"] },
  { program: "Petroleum Engineering", company: "Halliburton Ghana", region: "Greater Accra", city: "Accra", email: "ghana@halliburton.com", focus: "Drilling services, completion fluids, cementing operations", interests: ["Oil & Gas", "Technology", "Private Sector"] },
  { program: "Petroleum Engineering", company: "Baker Hughes Ghana", region: "Greater Accra", city: "Accra", email: "ghana@bakerhughes.com", focus: "Oilfield technology, drilling equipment, reservoir evaluation", interests: ["Oil & Gas", "Technology", "Private Sector"] },
 
  // Telecommunication Engineering
  { program: "Telecommunication Engineering", company: "Huawei Technologies Ghana", region: "Greater Accra", city: "Accra", email: "ghana@huawei.com", focus: "5G infrastructure, telecom equipment deployment & testing", interests: ["Telecoms", "Networks", "Private Sector"] },
  { program: "Telecommunication Engineering", company: "Huawei Technologies Ghana – Ashanti Branch", region: "Ashanti", city: "Kumasi", email: "kumasi.ghana@huawei.com", focus: "5G infrastructure, telecom equipment deployment & testing", interests: ["Telecoms", "Networks", "Ashanti"] },
  { program: "Telecommunication Engineering", company: "Huawei Technologies Ghana – Western Branch", region: "Western", city: "Takoradi", email: "western.ghana@huawei.com", focus: "5G infrastructure, telecom equipment deployment & testing", interests: ["Telecoms", "Networks", "Private Sector"] },
  { program: "Telecommunication Engineering", company: "Huawei Technologies Ghana – Northern Branch", region: "Northern", city: "Tamale", email: "northern.ghana@huawei.com", focus: "5G infrastructure, telecom equipment deployment & testing", interests: ["Telecoms", "Networks", "Private Sector"] },
  { program: "Telecommunication Engineering", company: "Ericsson Ghana", region: "Greater Accra", city: "Accra", email: "ghana@ericsson.com", focus: "Radio access networks, OSS/BSS systems, network optimisation", interests: ["Telecoms", "Networks", "Private Sector"] },
  { program: "Telecommunication Engineering", company: "Ericsson Ghana – Ashanti Branch", region: "Ashanti", city: "Kumasi", email: "kumasi.ghana@ericsson.com", focus: "Radio access networks, OSS/BSS systems, network optimisation", interests: ["Telecoms", "Networks", "Ashanti"] },
  { program: "Telecommunication Engineering", company: "Ericsson Ghana – Western Branch", region: "Western", city: "Takoradi", email: "western.ghana@ericsson.com", focus: "Radio access networks, OSS/BSS systems, network optimisation", interests: ["Telecoms", "Networks", "Private Sector"] },
  { program: "Telecommunication Engineering", company: "Ghana Telecom University College (GTUC)", region: "Greater Accra", city: "Accra", email: "info@gtuc.edu.gh", focus: "ICT research, telecom systems lab, network simulation", interests: ["Telecoms", "Research", "Education"] },
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
            <span className="ihd-tag">🎓 THE Industry Bridge</span>
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
              <span className="ihd-stat-num">16</span>
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