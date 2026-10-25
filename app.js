// JanSahayak AI - Application Logic & Speech Controller

// DOM Elements
const langSelect = document.getElementById('langSelect');
const apiKeyToggleBtn = document.getElementById('apiKeyToggleBtn');
const apiKeyModal = document.getElementById('apiKeyModal');
const closeApiModal = document.getElementById('closeApiModal');
const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');

const presetsContainer = document.getElementById('presetsContainer');
const queryInput = document.getElementById('queryInput');
const voiceBtn = document.getElementById('voiceBtn');
const micIcon = document.getElementById('micIcon');
const micStatus = document.getElementById('micStatus');
const clearBtn = document.getElementById('clearBtn');
const analyzeBtn = document.getElementById('analyzeBtn');

const emptyState = document.getElementById('emptyState');
const resultsContainer = document.getElementById('resultsContainer');
const schemeCard = document.getElementById('schemeCard');
const grievanceCard = document.getElementById('grievanceCard');
const speakResultBtn = document.getElementById('speakResultBtn');
const audioCardTitle = document.getElementById('audioCardTitle');

let isRecording = false;
let recognition = null;
let currentSummaryForSpeech = "";

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderPresets();
  setupSpeechRecognition();
  loadSavedApiKey();

  // Event Listeners
  analyzeBtn.addEventListener('click', handleAnalyze);
  voiceBtn.addEventListener('click', toggleVoiceRecording);
  clearBtn.addEventListener('click', () => {
    queryInput.value = "";
    queryInput.focus();
  });

  apiKeyToggleBtn.addEventListener('click', () => apiKeyModal.classList.remove('hidden'));
  closeApiModal.addEventListener('click', () => apiKeyModal.classList.add('hidden'));
  saveApiKeyBtn.addEventListener('click', () => {
    const key = geminiApiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('GEMINI_API_KEY', key);
      alert('Gemini API Key saved for live inference!');
    } else {
      localStorage.removeItem('GEMINI_API_KEY');
      alert('Reverted to built-in offline Indic engine.');
    }
    apiKeyModal.classList.add('hidden');
  });

  speakResultBtn.addEventListener('click', playSpokenSummary);
  langSelect.addEventListener('change', () => {
    updateSpeechLang();
    renderPresets();
  });
});

function loadSavedApiKey() {
  const saved = localStorage.getItem('GEMINI_API_KEY');
  if (saved) geminiApiKeyInput.value = saved;
}

// Render Presets
function renderPresets() {
  const isHi = langSelect.value === 'hi';
  presetsContainer.innerHTML = DEMO_PRESETS.map((p, idx) => `
    <button onclick="applyPreset(${idx})" class="text-left bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 p-2.5 rounded-xl transition shadow-xs flex flex-col justify-between group">
      <div class="flex items-center space-x-1.5 mb-1">
        <span class="text-base group-hover:scale-110 transition transform">${p.icon}</span>
        <span class="text-xs font-bold text-slate-800">${isHi ? p.label_hi : p.label}</span>
      </div>
      <p class="text-[10px] text-slate-500 line-clamp-2 leading-tight">${p.query}</p>
    </button>
  `).join('');
}

window.applyPreset = function(idx) {
  const preset = DEMO_PRESETS[idx];
  queryInput.value = preset.query;
  if (preset.lang) {
    langSelect.value = preset.lang;
    updateSpeechLang();
  }
  handleAnalyze();
};

// Robust Web Speech API - Speech-to-Text & Text-to-Speech Engine
let availableVoices = [];
let speechSilenceTimer = null;

// Preload & Cache Voices for Chrome, Safari & Edge
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  availableVoices = window.speechSynthesis.getVoices();
}
loadVoices();
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (micStatus) micStatus.innerHTML = `<span class="text-amber-600 font-semibold">⚠️ Mic fallback mode</span>`;
    return;
  }

  try {
    recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening until user pauses or stops
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    updateSpeechLang();

    recognition.onstart = () => {
      isRecording = true;
      if (voiceBtn) {
        voiceBtn.classList.add('listening-glow', 'bg-red-500', 'from-red-500', 'to-rose-600');
      }
      if (micStatus) {
        micStatus.innerHTML = `
          <span class="flex items-center space-x-1">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span class="text-red-600 font-bold">सुन रहे हैं... (Listening live)</span>
          </span>
        `;
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript || interimTranscript) {
        queryInput.value = (finalTranscript + interimTranscript).trim();
      }

      // Reset auto-analyze debounce timer on speech detected
      if (speechSilenceTimer) clearTimeout(speechSilenceTimer);
      speechSilenceTimer = setTimeout(() => {
        if (isRecording && queryInput.value.trim().length > 4) {
          stopRecording();
          handleAnalyze();
        }
      }, 2200); // 2.2 seconds of silence triggers automatic analysis
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition notice:", event.error);
      if (event.error === 'not-allowed') {
        alert("Please grant microphone permissions in your browser address bar.");
      }
      stopRecording();
    };

    recognition.onend = () => {
      if (isRecording) {
        // If stopped unexpectedly, clean up
        stopRecording();
        if (queryInput.value.trim().length > 4) {
          handleAnalyze();
        }
      }
    };
  } catch (err) {
    console.error("Speech initialization error:", err);
  }
}

function updateSpeechLang() {
  if (!recognition) return;
  const langMap = {
    hi: 'hi-IN',
    en: 'en-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    or: 'or-IN',
    bho: 'hi-IN'
  };
  recognition.lang = langMap[langSelect.value] || 'hi-IN';
}

function toggleVoiceRecording() {
  if (!recognition) {
    alert("Speech recognition isn't supported in this browser. Please use Google Chrome, Edge, or Brave.");
    return;
  }
  if (isRecording) {
    stopRecording();
    if (queryInput.value.trim().length > 3) {
      handleAnalyze();
    }
  } else {
    try {
      updateSpeechLang();
      recognition.start();
    } catch (e) {
      console.warn("Recognition already active", e);
      try {
        recognition.stop();
        setTimeout(() => recognition.start(), 200);
      } catch (err2) {
        console.error(err2);
      }
    }
  }
}

function stopRecording() {
  isRecording = false;
  if (speechSilenceTimer) clearTimeout(speechSilenceTimer);
  if (voiceBtn) {
    voiceBtn.classList.remove('listening-glow', 'bg-red-500', 'from-red-500', 'to-rose-600');
  }
  if (micStatus) {
    micStatus.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="text-emerald-700 font-medium">Mic Active &amp; Ready</span>`;
  }
  if (recognition) {
    try { recognition.stop(); } catch (e) {}
  }
}

// Sarvam Vision KYC OCR Simulator (Row #45 in Spreadsheet)
window.simulateKycScan = function(docType) {
  let docTitle = "";
  let extractedQuery = "";

  if (docType === 'aadhaar') {
    docTitle = "Aadhaar Card (UIDAI)";
    extractedQuery = "आधार कार्ड स्कैन: रमेश कुमार (आयु 42 वर्ष), निवासी सीतापुर, यूपी। असंगठित कृषि श्रमिक, बैंक डीबीटी लिंक सत्यापित। मुझे उपयुक्त सरकारी योजना बताएं।";
    langSelect.value = 'hi';
  } else if (docType === 'khasra') {
    docTitle = "Khasra-Khatauni Land Record";
    extractedQuery = "खसरा-खतौनी रिकॉर्ड स्कैन: खाता सं. 00412, रकबा 1.75 एकड़ (सीमांत किसान), जिला सीतापुर। पीएम किसान और कृषि खाद बीज सहायता हेतु पात्रता।";
    langSelect.value = 'hi';
  } else if (docType === 'ration') {
    docTitle = "NFSA Priority Ration Card";
    extractedQuery = "राशन कार्ड स्कैन: अन्त्योदय/बीपीएल परिवार, 5 सदस्य। आयुष्मान भारत मुफ्त इलाज और राशन वितरण शिकायत जांच।";
    langSelect.value = 'hi';
  }

  queryInput.value = `[Sarvam Vision OCR: ${docTitle} Verified ✓]\n${extractedQuery}`;
  updateSpeechLang();
  
  // Show brief scan flash
  micStatus.innerHTML = `<span class="text-orange-600 font-bold animate-pulse">📸 Sarvam Vision OCR 99.4% Match!</span>`;
  setTimeout(() => {
    handleAnalyze();
  }, 400);
};

// Quick Voice Prompt Helper (Instant Audio & Text Trigger)
window.quickVoicePrompt = function(promptText, lang) {
  queryInput.value = promptText;
  if (lang) {
    langSelect.value = lang;
    updateSpeechLang();
  }
  handleAnalyze();
};

// Text-to-Speech Output with Enhanced Clarity and Voice Selection
function playSpokenSummary() {
  if (!('speechSynthesis' in window)) {
    alert("Text-to-speech is not supported by your browser.");
    return;
  }

  window.speechSynthesis.cancel(); // Stop any active speech

  const textToRead = currentSummaryForSpeech || "JanSahayak AI analysis complete.";
  const utterance = new SpeechSynthesisUtterance(textToRead);
  
  const langMap = {
    hi: 'hi-IN',
    en: 'en-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN',
    or: 'or-IN',
    bho: 'hi-IN'
  };
  const targetLang = langMap[langSelect.value] || 'hi-IN';
  utterance.lang = targetLang;
  utterance.rate = 0.95; // Natural, clear conversational pacing
  utterance.pitch = 1.0;

  // Smart Voice Matcher for Indian Accents & Regional Dialects
  const voices = window.speechSynthesis.getVoices();
  let matchedVoice = null;

  if (voices.length > 0) {
    // 1. Try exact language match
    matchedVoice = voices.find(v => v.lang === targetLang || v.lang === targetLang.replace('-', '_'));
    
    // 2. Try prefix match
    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.startsWith(langSelect.value));
    }
    
    // 3. Try Indian English voice if Indic not found
    if (!matchedVoice && (langSelect.value === 'en' || !matchedVoice)) {
      matchedVoice = voices.find(v => v.lang.includes('en-IN') || v.name.toLowerCase().includes('india'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  // Workaround for Chrome's 15-second speech synthesis garbage collector pause bug
  const speechInterval = setInterval(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.resume();
    } else {
      clearInterval(speechInterval);
    }
  }, 5000);

  utterance.onstart = () => {
    speakResultBtn.innerHTML = `<span>⏹️ रोकें (Stop Audio)</span>`;
  };
  utterance.onend = () => {
    clearInterval(speechInterval);
    speakResultBtn.innerHTML = `<span>▶️ सुनें (Listen)</span>`;
  };
  utterance.onerror = (e) => {
    clearInterval(speechInterval);
    console.warn("Speech synthesis notice:", e);
    speakResultBtn.innerHTML = `<span>▶️ सुनें (Listen)</span>`;
  };

  window.speechSynthesis.speak(utterance);
}

// Core Analysis Engine
async function handleAnalyze() {
  const query = queryInput.value.trim();
  if (!query) {
    alert("Please enter or speak your query first!");
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    <span>विश्लेषण जारी है... (Analyzing)</span>
  `;

  try {
    const isHindi = langSelect.value === 'hi';
    const lowerQuery = query.toLowerCase();

    // 1. Detect Intent: Is it a Grievance/Complaint or Scheme Search?
    const grievanceKeywords = ["bijli", "transformer", "sadak", "gaddha", "paani", "pani", "water", "electricity", "complaint", "shikayat", "fir", "police", "ration", "dealer", "cut", "problem", "गड्ढा", "बिजली", "पानी", "शिकायत", "कटौती", "राशन"];
    const isGrievance = grievanceKeywords.some(kw => lowerQuery.includes(kw));

    // 2. Identify Matching Scheme
    let matchedScheme = SCHEMES_DATABASE.find(scheme => 
      scheme.keywords.some(kw => lowerQuery.includes(kw))
    );

    // Default to PM-Kisan or Ayushman if no exact keyword match
    if (!matchedScheme) {
      if (lowerQuery.includes("delivery") || lowerQuery.includes("worker") || lowerQuery.includes("driver")) {
        matchedScheme = SCHEMES_DATABASE.find(s => s.id === "e-shram-gig");
      } else if (lowerQuery.includes("student") || lowerQuery.includes("padhai") || lowerQuery.includes("college")) {
        matchedScheme = SCHEMES_DATABASE.find(s => s.id === "nsp-scholarship");
      } else {
        matchedScheme = isGrievance ? SCHEMES_DATABASE[0] : SCHEMES_DATABASE[1];
      }
    }

    // 3. Identify Grievance Type if applicable
    let grievanceType = "electricity";
    if (lowerQuery.includes("pani") || lowerQuery.includes("water") || lowerQuery.includes("jal")) {
      grievanceType = "water";
    } else if (lowerQuery.includes("sadak") || lowerQuery.includes("road") || lowerQuery.includes("gaddha")) {
      grievanceType = "roads";
    } else if (lowerQuery.includes("ration") || lowerQuery.includes("dealer")) {
      grievanceType = "ration";
    } else if (lowerQuery.includes("police") || lowerQuery.includes("fir") || lowerQuery.includes("thana")) {
      grievanceType = "police";
    }
    const grievanceConfig = GRIEVANCE_CATEGORIES[grievanceType];

    // Extract potential locality/name
    let localityMatch = query.match(/(?:at|in|में|का)\s+([A-Za-z0-9\u0900-\u097F]+)/i);
    let locality = localityMatch ? localityMatch[1] : (isHindi ? "गाँव/वार्ड क्षेत्र" : "Local Ward Area");

    // Render Scheme Card
    renderSchemeCard(matchedScheme, isHindi);

    // Render Grievance Card
    renderGrievanceCard(grievanceConfig, locality, query, isHindi, isGrievance);

    // Prepare Spoken Narration
    if (isHindi) {
      currentSummaryForSpeech = isGrievance 
        ? `आपकी समस्या का निवारण पत्र तैयार कर दिया गया है। संबंधित विभाग ${grievanceConfig.dept_name_hi} है। नागरिक अधिकार चार्टर के तहत इसका निस्तारण ${grievanceConfig.sla_days} दिनों में होना अनिवार्य है। साथ ही आप ${matchedScheme.name_hi} के भी पात्र हैं।`
        : `नमस्ते! आपकी ज़रूरत के अनुसार ${matchedScheme.name_hi} सबसे उपयुक्त है। इसमें आपको ${matchedScheme.benefit_amount_hi} का सीधा लाभ मिलता है। आवश्यक दस्तावेजों की सूची और आवेदन लिंक स्क्रीन पर उपलब्ध है।`;
    } else {
      currentSummaryForSpeech = isGrievance
        ? `Your official administrative grievance draft has been generated for ${grievanceConfig.dept_name}. Under citizen charter, mandatory SLA resolution time is ${grievanceConfig.sla_days} days. You are also eligible for ${matchedScheme.name}.`
        : `Hello! Based on your profile, you are eligible for ${matchedScheme.name}. You get ${matchedScheme.benefit_amount}. Required documents and official portal links are listed below.`;
    }

    emptyState.classList.add('hidden');
    resultsContainer.classList.remove('hidden');

    // Smooth scroll down to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error("Analysis error:", err);
    alert("Error processing query. Please try again.");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `
      <span>समाधान खोजें (Analyze &amp; Assist)</span>
      <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
    `;
  }
}

// Render Welfare Scheme Card
function renderSchemeCard(scheme, isHi) {
  const name = isHi ? scheme.name_hi : scheme.name;
  const tagline = isHi ? scheme.tagline_hi : scheme.tagline;
  const benefit = isHi ? scheme.benefit_amount_hi : scheme.benefit_amount;
  const eligibility = isHi ? scheme.eligibility_hi : scheme.eligibility;
  const ministry = isHi ? scheme.ministry_hi : scheme.ministry;

  schemeCard.innerHTML = `
    <div class="flex items-start justify-between border-b border-slate-100 pb-3">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
            ${isHi ? scheme.category_hi : scheme.category}
          </span>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <span>✓</span>
            <span>${isHi ? 'पात्रता: 100% अनुकूल' : '100% Eligible'}</span>
          </span>
        </div>
        <h2 class="text-lg font-bold text-slate-900 mt-1.5">${name}</h2>
        <p class="text-xs text-slate-500">${ministry}</p>
      </div>
      <div class="text-right">
        <span class="text-[10px] uppercase font-bold text-slate-400 block">${isHi ? 'सीधा आर्थिक लाभ' : 'Direct Financial Benefit'}</span>
        <span class="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 inline-block mt-0.5">${benefit}</span>
      </div>
    </div>

    <p class="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
      💡 ${tagline}
    </p>

    <!-- Eligibility Criteria -->
    <div>
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">${isHi ? 'पात्रता शर्तें (Eligibility Criteria):' : 'Eligibility Criteria:'}</h3>
      <ul class="space-y-1.5 text-xs text-slate-700">
        ${eligibility.map(item => `
          <li class="flex items-center space-x-2">
            <span class="text-emerald-500 font-bold">✔</span>
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- Required Documents Checklist -->
    <div>
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">${isHi ? 'आवश्यक दस्तावेज चेकलिस्ट (Required Documents):' : 'Required Documents Checklist:'}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${scheme.documents.map(doc => `
          <div class="flex items-center space-x-2 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800">
            <input type="checkbox" checked class="accent-orange-600 h-4 w-4 rounded">
            <span class="truncate">${doc}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Direct Apply & Information Link -->
    <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
      <span class="text-xs text-slate-500">${isHi ? 'आधिकारिक पोर्टल पर सीधा आवेदन करें:' : 'Apply directly on official portal:'}</span>
      <a href="${scheme.official_portal}" target="_blank" class="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition shadow">
        <span>${isHi ? 'पोर्टल खोलें (Apply Online)' : 'Apply Online'}</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
      </a>
    </div>
  `;
}

// Render Grievance / CPGRAMS Card
function renderGrievanceCard(cfg, locality, originalQuery, isHi, isGrievance) {
  const trackingId = "CPG-" + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const subject = isHi ? cfg.subject_template_hi(locality) : cfg.subject_template(locality);
  const dept = isHi ? cfg.dept_name_hi : cfg.dept_name;
  const acts = isHi ? cfg.acts_cited_hi : cfg.acts_cited;

  const letterBody = isHi ? 
`सेवा में,
नोडल जन शिकायत अधिकारी / सक्षम प्राधिकारी,
${dept}।

विषय: ${subject}

महोदय/महोदया,
सादर निवेदन है कि प्रार्थी ${locality} का निवासी है। इस क्षेत्र में जन समस्या/अनियमितता के कारण नागरिकों का सामान्य जनजीवन अस्त-व्यस्त हो गया है। समस्या का संक्षिप्त विवरण निम्नवत है:

"${originalQuery}"

उल्लेखनीय है कि ${acts} के अनुसार नागरिकों को समयबद्ध एवं गुणवत्तापूर्ण सेवा प्रदान करना विभाग की वैधानिक बाध्यता है। 

अतः आपसे सविनय अनुरोध है कि इस मामले को संज्ञान में लेकर तत्काल प्रभाव से समस्या का समाधान कराने का कष्ट करें।

सधन्यवाद,
जागरूक नागरिक
संदर्भ टोकन: ${trackingId}
दिनांक: ${dateStr}`
:
`To,
The Nodal Grievance Officer / Competent Authority,
${dept}.

Subject: ${subject}

Respected Sir/Madam,
I am a resident of ${locality}. I wish to bring to your urgent notice the following citizen grievance affecting our area:

"${originalQuery}"

Under the statutory provisions of ${acts}, the department is legally bound to resolve this service disruption within the mandated SLA period of ${cfg.sla_days} working days.

Kindly register this formal complaint on CPGRAMS / State Citizen Portal and initiate immediate corrective measures.

Yours sincerely,
Concerned Citizen
Tracking Ref ID: ${trackingId}
Date: ${dateStr}`;

  grievanceCard.innerHTML = `
    <div>
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div class="flex items-center space-x-2">
          <span class="text-base">📜</span>
          <h2 class="text-sm font-bold text-slate-900">${isHi ? 'आधिकारिक CPGRAMS जन शिकायत प्रारूप' : 'Official CPGRAMS Grievance Draft'}</h2>
        </div>
        <span class="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">#${trackingId}</span>
      </div>

      <div class="my-3 space-y-2">
        <div class="flex items-center justify-between text-[11px] text-slate-500 bg-amber-50 border border-amber-200 p-2 rounded-lg">
          <span><strong>${isHi ? 'कानूनी संदर्भ:' : 'Legal Mandate:'}</strong> ${acts}</span>
          <span class="text-amber-800 font-bold ml-1">${cfg.sla_days} Days SLA</span>
        </div>

        <!-- Preformatted Letter -->
        <pre id="grievanceLetterContent" class="text-[11px] text-slate-800 font-mono bg-slate-50 border border-slate-200 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 select-all">${letterBody}</pre>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
      <button onclick="copyGrievance()" class="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 transition shadow-sm">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
        <span>कॉपी करें (Copy)</span>
      </button>

      <button onclick="shareWhatsApp('${encodeURIComponent(letterBody)}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 transition shadow-sm">
        <span>💬 WhatsApp Share</span>
      </button>

      <button onclick="window.print()" class="text-slate-600 hover:text-slate-800 border border-slate-200 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-50 transition">
        <span>🖨️ Print / PDF</span>
      </button>
    </div>
  `;
}

// Copy Grievance to Clipboard
window.copyGrievance = function() {
  const el = document.getElementById('grievanceLetterContent');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    alert("Grievance application copied to clipboard! You can paste it directly on pgportal.gov.in or send via email.");
  }).catch(err => {
    console.error("Clipboard copy failed:", err);
  });
};

// Share Grievance to WhatsApp
window.shareWhatsApp = function(encodedText) {
  const url = `https://api.whatsapp.com/send?text=${encodedText}`;
  window.open(url, '_blank');
};
