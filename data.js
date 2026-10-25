// JanSahayak AI - Indic Knowledge Base & Schemes Matrix
// Inspired by Sarvam AI Ideas: Sarkari Sahayak (#45), Grievance Drafter (#46), Scheme-to-Pocket (#29)

const SCHEMES_DATABASE = [
  {
    id: "pm-kisan",
    category: "Agriculture & Farmers",
    category_hi: "कृषि एवं किसान कल्याण",
    name: "PM-KISAN Samman Nidhi",
    name_hi: "प्रधानमंत्री किसान सम्मान निधि",
    tagline: "Direct income support of ₹6,000 per year for farmer families",
    tagline_hi: "किसान परिवारों के लिए ₹6,000 प्रति वर्ष की प्रत्यक्ष वित्तीय सहायता",
    benefit_amount: "₹6,000 / year (in 3 installments of ₹2,000)",
    benefit_amount_hi: "₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तों में)",
    eligibility: [
      "Small and marginal landholder farmer families",
      "Landholding in applicant's name",
      "Valid Aadhaar linked bank account"
    ],
    eligibility_hi: [
      "छोटे और सीमांत किसान परिवार जिनके नाम कृषि योग्य भूमि है",
      "आवेदक के नाम पर खतौनी / भूमि रिकॉर्ड",
      "आधार से लिंक सक्रिय बैंक खाता"
    ],
    documents: [
      "Aadhaar Card (आधार कार्ड)",
      "Land Ownership Documents / Khasra-Khatauni (जमीन के कागजात)",
      "Bank Account Passbook with IFSC (बैंक पासबुक)",
      "Aadhaar-linked Mobile Number (मोबाइल नंबर)"
    ],
    official_portal: "https://pmkisan.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    ministry_hi: "कृषि एवं किसान कल्याण मंत्रालय",
    keywords: ["kisan", "farmer", "kheti", "khet", "tractor", "beej", "crop", "fasal", "agriculture", "fertilizer", "khad", "pm kisan", "जमीन", "खेती", "किसान", "बीज", "खाद"]
  },
  {
    id: "ayushman-bharat",
    category: "Healthcare",
    category_hi: "स्वास्थ्य एवं चिकित्सा",
    name: "Ayushman Bharat PM-JAY",
    name_hi: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
    tagline: "Free health cover up to ₹5,00,000 per family per year for secondary & tertiary care",
    tagline_hi: "प्रति परिवार ₹5,00,000 तक का कैशलेस एवं मुफ्त इलाज सरकारी व निजी अस्पतालों में",
    benefit_amount: "₹5,00,000 / year cashless treatment",
    benefit_amount_hi: "₹5,00,000 प्रति वर्ष कैशलेस इलाज",
    eligibility: [
      "Listed in SECC 2011 database or eligible ration card holder",
      "Deprived rural households & designated occupational urban workers",
      "Senior citizens aged 70+ (Universal Cover regardless of income)"
    ],
    eligibility_hi: [
      "SECC 2011 सूची या पात्र राशन कार्ड धारक परिवार",
      "ग्रामीण गरीब परिवार व असंगठित शहरी श्रमिक",
      "70 वर्ष या अधिक उम्र के सभी वरिष्ठ नागरिक (बिना आय सीमा)"
    ],
    documents: [
      "Aadhaar Card (आधार कार्ड)",
      "Ration Card / Parivar Pehchan Patra (राशन कार्ड)",
      "Mobile Number (मोबाइल नंबर)"
    ],
    official_portal: "https://beneficiary.nha.gov.in",
    ministry: "National Health Authority, Ministry of Health",
    ministry_hi: "स्वास्थ्य एवं परिवार कल्याण मंत्रालय",
    keywords: ["health", "hospital", "bimari", "doctor", "treatment", "medicine", "operation", "ilaj", "ayushman", "card", "अस्पताल", "दवा", "इलाज", "बीमारी", "आयुष्मान"]
  },
  {
    id: "e-shram-gig",
    category: "Gig Workers & Unorganized Labour",
    category_hi: "गिग वर्कर्स और असंगठित श्रमिक",
    name: "e-Shram & PMSYM Social Security",
    name_hi: "ई-श्रम व प्रधानमंत्री श्रम योगी मानधन योजना",
    tagline: "Accidental cover of ₹2 Lakh + ₹3,000/month pension for delivery partners & gig workers",
    tagline_hi: "गिग व डिलीवरी वर्कर्स के लिए ₹2 लाख का दुर्घटना बीमा + ₹3,000/माह पेंशन सुरक्षा",
    benefit_amount: "₹2 Lakh accident cover + ₹3,000 monthly pension post 60",
    benefit_amount_hi: "₹2 लाख दुर्घटना बीमा + 60 वर्ष बाद ₹3,000 मासिक पेंशन",
    eligibility: [
      "Age between 16 to 59 years",
      "Unorganized worker, gig worker (Swiggy, Zomato, Uber, Zepto, Dunzo, etc.)",
      "Not an EPFO / ESIC member or income tax payee"
    ],
    eligibility_hi: [
      "आयु 16 से 59 वर्ष के बीच",
      "असंगठित श्रमिक, गिग वर्कर, डिलीवरी बॉय, कैब ड्राइवर",
      "ईपीएफओ (EPFO) या आयकर दाता न हों"
    ],
    documents: [
      "Aadhaar Card linked with active mobile (आधार कार्ड)",
      "Bank Account details (बैंक खाता विवरण)",
      "Nominee details (नॉमिनी की जानकारी)"
    ],
    official_portal: "https://eshram.gov.in",
    ministry: "Ministry of Labour & Employment",
    ministry_hi: "श्रम एवं रोजगार मंत्रालय",
    keywords: ["gig", "delivery", "swiggy", "zomato", "uber", "ola", "driver", "mazdoor", "labour", "worker", "eshram", "pension", "डिलीवरी", "मजदूर", "श्रमिक", "गिग"]
  },
  {
    id: "nsp-scholarship",
    category: "Education & Youth",
    category_hi: "शिक्षा एवं छात्रवृत्ति",
    name: "National Scholarship Portal (NSP Post-Matric)",
    name_hi: "राष्ट्रीय छात्रवृत्ति पोर्टल (पोस्ट-मैट्रिक स्कॉलरशिप)",
    tagline: "Full tuition fee reimbursement + annual maintenance allowance for college students",
    tagline_hi: "उच्च शिक्षा एवं कॉलेज विद्यार्थियों के लिए पूरी ट्यूशन फीस व मासिक भत्ता",
    benefit_amount: "Up to ₹50,000/year + Tuition waiver",
    benefit_amount_hi: "₹50,000 प्रति वर्ष तक + पूरी ट्यूशन फीस माफी",
    eligibility: [
      "Enrolled in recognized College/University/Diploma",
      "Family annual income below ₹2.5 Lakh (or ₹8 Lakh for select categories)",
      "Minimum 50% marks in preceding exam"
    ],
    eligibility_hi: [
      "मान्यता प्राप्त कॉलेज/विश्वविद्यालय में अध्यनरत छात्र",
      "परिवार की वार्षिक आय ₹2.5 लाख से कम",
      "पिछली परीक्षा में न्यूनतम 50% अंक"
    ],
    documents: [
      "College Admission Fee Receipt & Bonafide Certificate",
      "Income Certificate issued by Tehsildar (आय प्रमाण पत्र)",
      "Caste / Category Certificate if applicable (जाति प्रमाण पत्र)",
      "Previous Year Marksheet (अंकतालिका)",
      "Aadhaar Card & Bank Passbook (आधार व बैंक पासबुक)"
    ],
    official_portal: "https://scholarships.gov.in",
    ministry: "Ministry of Education & Social Justice",
    ministry_hi: "शिक्षा मंत्रालय",
    keywords: ["student", "college", "school", "scholarship", "fees", "study", "padhai", "degree", "chhatravritti", "छात्रवृत्ति", "पढ़ाई", "कॉलेज", "फीस", "विद्यार्थी"]
  },
  {
    id: "pm-svanidhi",
    category: "Street Vendors & Small Business",
    category_hi: "रेहड़ी-पटरी व लघु व्यापारी",
    name: "PM SVANidhi Micro-Credit",
    name_hi: "पीएम स्वनिधि योजना (स्ट्रीट वेंडर्स आत्मनिर्भर निधि)",
    tagline: "Collateral-free working capital loan starting at ₹10,000 up to ₹50,000 with 7% interest subsidy",
    tagline_hi: "रेहड़ी-पटरी व छोटे दुकानदारों को बिना गारंटी ₹10,000 से ₹50,000 तक का रियायती ऋण",
    benefit_amount: "₹10,000 to ₹50,000 collateral-free loan with 7% interest rebate",
    benefit_amount_hi: "₹10,000 से ₹50,000 तक बिना गारंटी ऋण + 7% ब्याज सब्सिडी",
    eligibility: [
      "Urban street vendors / hawkers operating on or before March 2020",
      "Possession of Vending Certificate / Identity Card issued by ULB"
    ],
    eligibility_hi: [
      "शहरी रेहड़ी-पटरी वाले, ठेला लगाने वाले, छोटे दुकानदार",
      "नगर पालिका / नगर निगम द्वारा वेंडिंग प्रमाण पत्र या सर्वेक्षण में नाम"
    ],
    documents: [
      "Aadhaar Card (आधार कार्ड)",
      "Vending Certificate or Letter of Recommendation (वेंडिंग कार्ड/एलओआर)",
      "Bank Account details (बैंक खाता)"
    ],
    official_portal: "https://pmsvanidhi.mohua.gov.in",
    ministry: "Ministry of Housing and Urban Affairs",
    ministry_hi: "आवासन और शहरी कार्य मंत्रालय",
    keywords: ["loan", "thela", "dukan", "vendor", "street", "vyapar", "business", "small business", "rehri", "patri", "दुकान", "ठेला", "व्यापार", "ऋण", "लोन"]
  },
  {
    id: "pm-awas-gramin",
    category: "Housing & Rural Development",
    category_hi: "आवास एवं ग्रामीण विकास",
    name: "PM Awas Yojana (PMAY-G)",
    name_hi: "प्रधानमंत्री आवास योजना (ग्रामीण/शहरी)",
    tagline: "Financial grant of ₹1.20 Lakh to ₹2.50 Lakh to build your own Pucca House",
    tagline_hi: "पक्का मकान बनाने के लिए ₹1.20 लाख से ₹2.50 लाख की सीधी सरकारी सहायता",
    benefit_amount: "₹1,20,000 in plains / ₹1,30,000 in hilly areas + 90 days MGNREGA wages",
    benefit_amount_hi: "मैदानी क्षेत्रों में ₹1.20 लाख / पहाड़ी क्षेत्रों में ₹1.30 लाख + मनरेगा मजदूरी",
    eligibility: [
      "Homeless or living in kutcha/dilapidated house",
      "Name in SECC 2011 deprivation list or Gram Sabha verified beneficiary"
    ],
    eligibility_hi: [
      "बेघर परिवार या कच्चे/जीर्ण-शीर्ण मकान में रहने वाले",
      "आवासहीन सूची या ग्राम सभा द्वारा सत्यापित पात्र लाभार्थी"
    ],
    documents: [
      "Aadhaar Card of all family members",
      "Bank Account details (with DBT enabled)",
      "MGNREGA Job Card (मनरेगा जॉब कार्ड)",
      "Photograph of existing kutcha house"
    ],
    official_portal: "https://pmayg.nic.in",
    ministry: "Ministry of Rural Development",
    ministry_hi: "ग्रामीण विकास मंत्रालय",
    keywords: ["house", "makan", "ghar", "home", "awas", "pucca", "chhat", "मकान", "घर", "आवास", "छत"]
  }
];

// Grievance / CPGRAMS Template Engine
const GRIEVANCE_CATEGORIES = {
  electricity: {
    dept_name: "State Electricity Board / Ministry of Power",
    dept_name_hi: "विद्युत वितरण निगम / ऊर्जा मंत्रालय",
    cpgrams_portal: "https://pgportal.gov.in",
    sla_days: 7,
    acts_cited: "Electricity Act 2003 (Section 43: Duty to Supply on Request) & Consumer Charter",
    acts_cited_hi: "विद्युत अधिनियम 2003 (धारा 43: समयबद्ध आपूर्ति) व उपभोक्ता अधिकार चार्टर",
    subject_template: (locality) => `Urgent Complaint: Extended Power Outage and Burnt Transformer at ${locality}`,
    subject_template_hi: (locality) => `अत्यंत आवश्यक शिकायत: ${locality} में जले हुए ट्रांसफार्मर एवं अनवरत विद्युत कटौती के संबंध में`
  },
  water: {
    dept_name: "Jal Sansthan / Public Health Engineering / Jal Shakti Ministry",
    dept_name_hi: "जल संस्थान / लोक स्वास्थ्य अभियंत्रण विभाग",
    cpgrams_portal: "https://pgportal.gov.in",
    sla_days: 5,
    acts_cited: "National Water Policy & Right to Clean Drinking Water (Article 21)",
    acts_cited_hi: "राष्ट्रीय जल नीति व स्वच्छ पेयजल का मौलिक अधिकार (अनुच्छेद 21)",
    subject_template: (locality) => `Complaint regarding contamination / disruption of drinking water supply at ${locality}`,
    subject_template_hi: (locality) => `पेयजल आपूर्ति में व्यवधान / दूषित जल आपूर्ति की शिकायत - क्षेत्र: ${locality}`
  },
  roads: {
    dept_name: "Public Works Department (PWD) / Municipal Corporation",
    dept_name_hi: "लोक निर्माण विभाग (PWD) / नगर निगम",
    cpgrams_portal: "https://pgportal.gov.in",
    sla_days: 15,
    acts_cited: "Municipal Solid Waste & Road Safety Norms under Motor Vehicles Act",
    acts_cited_hi: "लोक निर्माण एवं सड़क सुरक्षा मानक अधिनियम",
    subject_template: (locality) => `Grievance: Severe potholes and broken main road causing accidents at ${locality}`,
    subject_template_hi: (locality) => `सड़क की खस्ताहाली, बड़े गड्ढों व दुर्घटनाओं की आशंका के संबंध में शिकायत - ${locality}`
  },
  ration: {
    dept_name: "Food & Civil Supplies Department (PDS)",
    dept_name_hi: "खाद्य एवं रसद विभाग (सार्वजनिक वितरण प्रणाली)",
    cpgrams_portal: "https://pgportal.gov.in",
    sla_days: 7,
    acts_cited: "National Food Security Act (NFSA) 2013",
    acts_cited_hi: "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) 2013",
    subject_template: (locality) => `Grievance: Denial of subsidized ration / biometric failure at Fair Price Shop, ${locality}`,
    subject_template_hi: (locality) => `उचित दर विक्रेता (राशन डीलर) द्वारा राशन वितरण में अनियमितता की शिकायत - ${locality}`
  },
  police: {
    dept_name: "State Police Department / Home Affairs",
    dept_name_hi: "गृह विभाग / जिला पुलिस अधीक्षक कार्यालय",
    cpgrams_portal: "https://pgportal.gov.in",
    sla_days: 3,
    acts_cited: "Code of Criminal Procedure (CrPC Sec 154) & Citizen Charter",
    acts_cited_hi: "दंड प्रक्रिया संहिता (धारा 154) व नागरिक चार्टर",
    subject_template: (locality) => `Grievance regarding non-registration of FIR / Police Inaction at ${locality}`,
    subject_template_hi: (locality) => `शिकायत दर्ज न करने / पुलिस निष्क्रियता के विरुद्ध शिकायत - थाना क्षेत्र: ${locality}`
  }
};

// Ready-to-go Hackathon Demo Personas
const DEMO_PRESETS = [
  {
    icon: "🌾",
    label: "Kisan (Farmer)",
    label_hi: "किसान (कृषि सहायता)",
    query: "मैं उत्तर प्रदेश के सीतापुर का किसान हूँ। मेरे पास 2 एकड़ जमीन है। मुझे फसल के लिए खाद, बीज और सरकारी सहायता चाहिए।",
    lang: "hi"
  },
  {
    icon: "⚡",
    label: "Grievance (Bijli Cut)",
    label_hi: "जन शिकायत (बिजली गुल)",
    query: "हमारे गाँव रामपुर में 15 दिनों से ट्रांसफार्मर फुंका हुआ है। बिजली विभाग में जेई कोई सुनवाई नहीं कर रहा। कृपया CPGRAMS शिकायत पत्र तैयार करें।",
    lang: "hi"
  },
  {
    icon: "🛵",
    label: "Gig Worker (Delivery)",
    label_hi: "गिग वर्कर (डिलीवरी पार्टनर)",
    query: "I work as a Swiggy delivery partner in Bangalore. What government health insurance, pension, or social security schemes am I eligible for?",
    lang: "en"
  },
  {
    icon: "🎓",
    label: "Student (Scholarship)",
    label_hi: "विद्यार्थी (छात्रवृत्ति)",
    query: "मेरी बेटी 12वीं पास करके कॉलेज में दाखिला ले रही है। हमारी सालाना आय 1.5 लाख है। फीस माफी और स्कॉलरशिप के लिए कौन सी योजना है?",
    lang: "hi"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SCHEMES_DATABASE, GRIEVANCE_CATEGORIES, DEMO_PRESETS };
}
