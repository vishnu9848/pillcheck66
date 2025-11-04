const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'medicine_dataset.csv');

const generics = [
  { generic: 'amoxicillin', category: 'Antibiotic', uses: 'Bacterial infections (respiratory, ear, throat)', sideEffects: 'nausea; diarrhea; allergic reaction (rash)', dosages: [250, 500, 875], prescription: 'Yes' },
  { generic: 'azithromycin', category: 'Antibiotic', uses: 'Respiratory and skin infections', sideEffects: 'stomach pain; diarrhea; headache', dosages: [250, 500], prescription: 'Yes' },
  { generic: 'ciprofloxacin', category: 'Antibiotic', uses: 'Urinary and respiratory infections', sideEffects: 'dizziness; nausea; tendon pain', dosages: [250, 500, 750], prescription: 'Yes' },
  { generic: 'doxycycline', category: 'Antibiotic', uses: 'Acne and bacterial infections', sideEffects: 'photosensitivity; nausea; diarrhea', dosages: [50, 100], prescription: 'Yes' },
  { generic: 'metronidazole', category: 'Antibiotic', uses: 'Anaerobic bacterial and protozoal infections', sideEffects: 'metallic taste; nausea; headache', dosages: [250, 500], prescription: 'Yes' },
  { generic: 'cephalexin', category: 'Antibiotic', uses: 'Skin and respiratory infections', sideEffects: 'diarrhea; rash; dizziness', dosages: [250, 500], prescription: 'Yes' },
  { generic: 'clindamycin', category: 'Antibiotic', uses: 'Serious bacterial infections', sideEffects: 'diarrhea; stomach pain; rash', dosages: [150, 300], prescription: 'Yes' },
  { generic: 'clarithromycin', category: 'Antibiotic', uses: 'Respiratory infections and H. pylori', sideEffects: 'nausea; taste disturbance; diarrhea', dosages: [250, 500], prescription: 'Yes' },
  { generic: 'levofloxacin', category: 'Antibiotic', uses: 'Respiratory and urinary infections', sideEffects: 'nausea; headache; dizziness', dosages: [250, 500], prescription: 'Yes' },
  { generic: 'sulfamethoxazole/trimethoprim', category: 'Antibiotic', uses: 'Urinary and certain respiratory infections', sideEffects: 'rash; nausea; photosensitivity', dosages: [400, 800], prescription: 'Yes' },

  { generic: 'acetaminophen', category: 'Painkiller/Fever', uses: 'Pain relief and fever reduction', sideEffects: 'rare allergic reaction; liver toxicity in overdose', dosages: [325, 500, 650], prescription: 'No' },
  { generic: 'ibuprofen', category: 'Painkiller/Anti-inflammatory', uses: 'Pain, inflammation and fever', sideEffects: 'stomach upset; heartburn; headache', dosages: [200, 400, 600], prescription: 'No' },
  { generic: 'naproxen', category: 'Painkiller/Anti-inflammatory', uses: 'Pain and inflammation', sideEffects: 'indigestion; headache; dizziness', dosages: [220, 250, 500], prescription: 'No' },
  { generic: 'aspirin', category: 'Painkiller/Antiplatelet', uses: 'Pain relief, fever, and heart health (low dose)', sideEffects: 'stomach upset; bleeding; tinnitus', dosages: [81, 325], prescription: 'No' },
  { generic: 'diclofenac', category: 'Painkiller/Anti-inflammatory', uses: 'Moderate pain and inflammation', sideEffects: 'stomach upset; dizziness; headache', dosages: [50, 75], prescription: 'No' },

  { generic: 'cetirizine', category: 'Antihistamine', uses: 'Allergic rhinitis and urticaria (hives)', sideEffects: 'drowsiness; dry mouth; headache', dosages: [10], prescription: 'No' },
  { generic: 'loratadine', category: 'Antihistamine', uses: 'Seasonal allergies', sideEffects: 'headache; dry mouth; fatigue', dosages: [10], prescription: 'No' },
  { generic: 'fexofenadine', category: 'Antihistamine', uses: 'Allergic symptoms and hives', sideEffects: 'headache; nausea; drowsiness (rare)', dosages: [60, 120], prescription: 'No' },
  { generic: 'diphenhydramine', category: 'Antihistamine', uses: 'Allergy relief and short-term sleep aid', sideEffects: 'drowsiness; dry mouth; dizziness', dosages: [25, 50], prescription: 'No' },

  { generic: 'metformin', category: 'Diabetes', uses: 'Type 2 diabetes management', sideEffects: 'nausea; diarrhea; metallic taste', dosages: [500, 850, 1000], prescription: 'Yes' },
  { generic: 'glipizide', category: 'Diabetes', uses: 'Type 2 diabetes to lower blood sugar', sideEffects: 'hypoglycemia; nausea; weight gain', dosages: [2.5, 5, 10], prescription: 'Yes' },
  { generic: 'sitagliptin', category: 'Diabetes', uses: 'Type 2 diabetes (DPP-4 inhibitor)', sideEffects: 'headache; nasopharyngitis; nausea', dosages: [25, 50, 100], prescription: 'Yes' },
  { generic: 'pioglitazone', category: 'Diabetes', uses: 'Type 2 diabetes to improve insulin sensitivity', sideEffects: 'weight gain; edema; risk of heart failure', dosages: [15, 30, 45], prescription: 'Yes' },

  { generic: 'lisinopril', category: 'Blood Pressure', uses: 'High blood pressure and heart failure', sideEffects: 'cough; dizziness; high potassium', dosages: [2.5, 5, 10, 20, 40], prescription: 'Yes' },
  { generic: 'enalapril', category: 'Blood Pressure', uses: 'High blood pressure', sideEffects: 'cough; dizziness; high potassium', dosages: [2.5, 5, 10, 20], prescription: 'Yes' },
  { generic: 'amlodipine', category: 'Blood Pressure', uses: 'High blood pressure and angina', sideEffects: 'swelling (edema); dizziness; flushing', dosages: [2.5, 5, 10], prescription: 'Yes' },
  { generic: 'losartan', category: 'Blood Pressure', uses: 'High blood pressure and kidney protection', sideEffects: 'dizziness; fatigue; cough (rare)', dosages: [25, 50, 100], prescription: 'Yes' },
  { generic: 'metoprolol', category: 'Blood Pressure', uses: 'High blood pressure and heart rate control', sideEffects: 'fatigue; dizziness; bradycardia', dosages: [25, 50, 100], prescription: 'Yes' },
];

const prefixes = ['Acu','Bio','Cura','Dura','Evo','Flex','Geno','Hema','Iro','Juno','Karo','Luma','Medi','Nexa','Orbi','Pillo','Quin','Rivo','Sano','Tera','Uro','Vita','Wello','Xylo','Yara','Zeno'];
const suffixes = ['dex','lon','zep','mox','cillin','stat','pril','pine','sone','tab','zol','fine','mide','tril','vex','ril','nac','mir','nex','rova'];
const manufacturers = ['BlueLake Pharma','NovaHealth Labs','MediCore Therapeutics','Pillara Biotech','ClearPath Pharmaceuticals','EverWell Labs','Suncrest Pharma','GreenLeaf Bio','PrimeCure Inc','Horizon Health','VitalAxis Labs','Orion Medica','Lumen Pharma','CedarBridge Labs','Silverline Pharmaceuticals'];

function csvEscape(str) {
  if (str === null || str === undefined) return '';
  return '"' + String(str).replace(/"/g, '""') + '"';
}

let rows = [];
rows.push(['Pill_Name','Generic_Name','Uses','Side_Effects','Manufacturer','Dosage (mg)','Prescription_Required'].join(','));

const total = 1000;
for (let i = 1; i <= total; i++) {
  const g = generics[(i - 1) % generics.length];
  const prefix = prefixes[(i - 1) % prefixes.length];
  const suffix = suffixes[(i - 1) % suffixes.length];
  const pillBase = prefix + suffix + (Math.floor((i - 1) / (prefixes.length * suffixes.length)) + 1);
  const pillName = pillBase + '-' + i; // ensure unique
  const manufacturer = manufacturers[i % manufacturers.length];
  // choose dosage deterministically
  const dosage = g.dosages[(i - 1) % g.dosages.length];
  const uses = g.uses;
  const sideEffects = g.sideEffects;
  const prescription = g.prescription;

  const row = [
    csvEscape(pillName),
    csvEscape(g.generic),
    csvEscape(uses),
    csvEscape(sideEffects),
    csvEscape(manufacturer),
    csvEscape(dosage),
    csvEscape(prescription),
  ].join(',');
  rows.push(row);
}

fs.writeFileSync(outputPath, rows.join('\n'));
console.log('Wrote', outputPath);
