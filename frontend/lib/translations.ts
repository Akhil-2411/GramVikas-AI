export type Language = "en" | "te" | "hi";

export interface Translations {
  appName: string;
  tagline: string;
  dashboard: string;
  advisory: string;
  swot: string;
  finance: string;
  schemes: string;
  map: string;
  radius: string;
  marketGap: string;
  districtAnalytics: string;
  aiChat: string;
  reports: string;
  admin: string;
  profile: string;
  login: string;
  signup: string;
  logout: string;
  selectDistrict: string;
  selectVillage: string;
  marginCapital: string;
  calculate: string;
  analyze: string;
  totalMSMEs: string;
  districtsCovered: string;
  villagesCovered: string;
  categories: string;
  opportunityScore: string;
  competitionScore: string;
  riskScore: string;
  projectCost: string;
  loanAmount: string;
  monthlyEMI: string;
  eligibleScheme: string;
  downloadReport: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "GramVikas AI",
    tagline: "AI-Driven Hyper-Local MSME Business Advisory & Financial Structuring",
    dashboard: "Dashboard",
    advisory: "Business Advisor",
    swot: "SWOT Analysis",
    finance: "Financial Planner",
    schemes: "Scheme Finder",
    map: "Village Intelligence",
    radius: "Radius Analysis",
    marketGap: "Market Gap Analysis",
    districtAnalytics: "District Analytics",
    aiChat: "AI Advisor Chat",
    reports: "Feasibility Reports",
    admin: "Admin Portal",
    profile: "User Profile",
    login: "Login",
    signup: "Register",
    logout: "Logout",
    selectDistrict: "Select District",
    selectVillage: "Select Village",
    marginCapital: "Available Margin Capital",
    calculate: "Calculate Feasibility",
    analyze: "Analyze Business",
    totalMSMEs: "Total MSMEs",
    districtsCovered: "District Coverage",
    villagesCovered: "Villages Covered",
    categories: "Business Categories",
    opportunityScore: "Opportunity Score",
    competitionScore: "Competition Score",
    riskScore: "Risk Score",
    projectCost: "Total Project Cost",
    loanAmount: "Maximum Loan (90%)",
    monthlyEMI: "Monthly EMI",
    eligibleScheme: "Selected Scheme",
    downloadReport: "Download PDF Report"
  },
  te: {
    appName: "గ్రామవికాస్ AI",
    tagline: "గ్రామీణ వ్యాపార సలహా మరియు ఆర్థిక ప్రణాళిక సహాయక వేదిక",
    dashboard: "డాష్‌బోర్డ్",
    advisory: "వ్యాపార సలహాదారు",
    swot: "SWOT విశ్లేషణ",
    finance: "ఆర్థిక ప్రణాళిక",
    schemes: "ప్రభుత్వ పథకాలు",
    map: "గ్రామ మేధో మ్యాప్",
    radius: "వ్యాసార్థ విశ్లేషణ",
    marketGap: "మార్కెట్ గ్యాప్ విశ్లేషణ",
    districtAnalytics: "జిల్లా విశ్లేషణలు",
    aiChat: "AI సలహాదారు చాట్",
    reports: "వ్యాపార నివేదికలు",
    admin: "అడ్మిన్ ప్యానెల్",
    profile: "ప్రొఫైల్",
    login: "లాగిన్",
    signup: "నమోదు చేసుకోండి",
    logout: "లాగ్ అవుట్",
    selectDistrict: "జిల్లాను ఎంచుకోండి",
    selectVillage: "గ్రామాన్ని ఎంచుకోండి",
    marginCapital: "లభ్యమయ్యే పెట్టుబడి (మార్జిన్)",
    calculate: "లెక్కించండి",
    analyze: "విశ్లేషించండి",
    totalMSMEs: "మొత్తం MSMEలు",
    districtsCovered: "కవర్ చేయబడిన జిల్లాలు",
    villagesCovered: "గ్రామాలు",
    categories: "వ్యాపార విభాగాలు",
    opportunityScore: "అవకాశ స్కోరు",
    competitionScore: "పోటీ స్కోరు",
    riskScore: "ప్రమాద స్కోరు",
    projectCost: "మొత్తం ప్రాజెక్ట్ ఖర్చు",
    loanAmount: "గరిష్ట రుణం (90%)",
    monthlyEMI: "నెలవారీ EMI",
    eligibleScheme: "అర్హతగల పథకం",
    downloadReport: "PDF నివేదికను డౌన్‌లోడ్ చేయండి"
  },
  hi: {
    appName: "ग्रामविकास AI",
    tagline: "एआई-संचालित ग्रामीण सूक्ष्म-उद्यम व्यापार सलाहकार एवं वित्तीय मंच",
    dashboard: "डैशबोर्ड",
    advisory: "बिजनेस एडवाइजर",
    swot: "SWOT विश्लेषण",
    finance: "वित्तीय योजनाकार",
    schemes: "सरकारी योजनाएं",
    map: "ग्राम इंटेलिजेंस",
    radius: "दायरा विश्लेषण",
    marketGap: "मार्केट गैप विश्लेषण",
    districtAnalytics: "जिला विश्लेषण",
    aiChat: "एआई चैट सहायक",
    reports: "व्यावसायिक रिपोर्ट",
    admin: "एडमिन पोर्टल",
    profile: "प्रोफाइल",
    login: "लॉगिन",
    signup: "रजिस्टर करें",
    logout: "लॉग आउट",
    selectDistrict: "जिला चुनें",
    selectVillage: "गांव चुनें",
    marginCapital: "उपलब्ध मार्जिन पूंजी",
    calculate: "गणना करें",
    analyze: "विश्लेषण करें",
    totalMSMEs: "कुल एमएसएमई",
    districtsCovered: "शामिल जिले",
    villagesCovered: "शामिल गांव",
    categories: "व्यावसायिक श्रेणियां",
    opportunityScore: "अवसर स्कोर",
    competitionScore: "प्रतिस्पर्धा स्कोर",
    riskScore: "जोखिम स्कोर",
    projectCost: "कुल परियोजना लागत",
    loanAmount: "अधिकतम ऋण (90%)",
    monthlyEMI: "मासिक ईएमआई",
    eligibleScheme: "चयनित योजना",
    downloadReport: "पीडीएफ रिपोर्ट डाउनलोड करें"
  }
};
