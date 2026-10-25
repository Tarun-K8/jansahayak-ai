// JanSahayak AI - 16:9 HD Video Walkthrough Engine
// Generates an interactive cinematic product video with synchronized voiceover narration and live canvas graphics

class JanSahayakVideoPlayer {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.container = document.getElementById(containerId);
    
    this.isPlaying = false;
    this.currentScene = 0;
    this.sceneTime = 0;
    this.totalDuration = 45; // 45 seconds total
    this.currentTime = 0;
    this.animationFrameId = null;
    this.narrationLang = 'hi'; // 'hi' or 'en'
    
    // Video Scenes Definition
    this.scenes = [
      {
        id: "intro",
        duration: 9,
        title: "The Problem / समस्या",
        title_hi: "भारत में 80 करोड़ नागरिकों की समस्या",
        subtitle: "800M+ citizens are eligible for welfare schemes, but blocked by complex English portals.",
        subtitle_hi: "80 करोड़+ नागरिक सरकारी योजनाओं के पात्र हैं, पर अंग्रेजी पोर्टल्स और कठिन कागजी कार्यवाही के कारण लाभ नहीं ले पाते।",
        accent: "#FF671F",
        icon: "🇮🇳"
      },
      {
        id: "voice",
        duration: 9,
        title: "Voice-First in Indic Languages",
        title_hi: "मातृभाषा में आवाज़ से सवाल पूछें",
        subtitle: "Citizens simply speak in Hindi, Bengali, Marathi, Tamil, or Telugu. No typing required.",
        subtitle_hi: "किसान और आम नागरिक सीधे अपनी मातृभाषा में बोलते हैं: 'मुझे फसल और खाद के लिए मदद चाहिए'...",
        accent: "#3B82F6",
        icon: "🎙️"
      },
      {
        id: "matching",
        duration: 9,
        title: "Instant Welfare Scheme Matcher",
        title_hi: "सटीक सरकारी योजना व वित्तीय सहायता",
        subtitle: "AI matches PM-Kisan, Ayushman Bharat, E-Shram with direct cash benefit calculation.",
        subtitle_hi: "JanSahayak तुरंत पात्रता परखता है: ₹6,000/वर्ष पीएम-किसान, ₹5 लाख आयुष्मान भारत और जरूरी कागजात चेकलिस्ट।",
        accent: "#10B981",
        icon: "⚡"
      },
      {
        id: "grievance",
        duration: 9,
        title: "Automated CPGRAMS Grievance Drafting",
        title_hi: "कानूनी जन शिकायत पत्र (CPGRAMS) तैयार",
        subtitle: "Converts complaints into formal petitions citing Electricity Act Sec 43 with 7-day SLA.",
        subtitle_hi: "टूटी सड़क, कटी बिजली या राशन डीलर की शिकायत को आधिकारिक कानून (Sec 43) और टोकन नंबर सहित ड्राफ्ट करता है।",
        accent: "#8B5CF6",
        icon: "📜"
      },
      {
        id: "action",
        duration: 9,
        title: "WhatsApp Share & Spoken Audio",
        title_hi: "1-क्लिक व्हाट्सएप शेयर व ऑडियो वाचन",
        subtitle: "Read aloud via Bulbul TTS, export PDF, and send directly to authorities on WhatsApp.",
        subtitle_hi: "अनपढ़ नागरिकों के लिए बोलकर सुनाता है और 1-क्लिक में व्हाट्सएप या जन शिकायत पोर्टल पर भेजता है।",
        accent: "#EC4899",
        icon: "🚀"
      }
    ];

    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecordingExport = false;

    this.initControls();
    this.renderFrame();
  }

  initControls() {
    this.playBtn = document.getElementById('videoPlayBtn');
    this.progressBar = document.getElementById('videoProgressBar');
    this.timeDisplay = document.getElementById('videoTimeDisplay');
    this.langBtn = document.getElementById('videoLangToggle');
    this.downloadBtn = document.getElementById('videoDownloadBtn');

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.langBtn) {
      this.langBtn.addEventListener('click', () => {
        this.narrationLang = this.narrationLang === 'hi' ? 'en' : 'hi';
        this.langBtn.innerText = this.narrationLang === 'hi' ? '🇮🇳 हिन्दी' : '🌐 English';
        if (this.isPlaying) this.narrateCurrentScene();
      });
    }

    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.exportVideoFile());
    }

    if (this.progressBar) {
      this.progressBar.addEventListener('input', (e) => {
        this.seekTo(parseFloat(e.target.value));
      });
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.currentTime >= this.totalDuration) {
      this.currentTime = 0;
      this.currentScene = 0;
      this.sceneTime = 0;
    }
    this.isPlaying = true;
    if (this.playBtn) this.playBtn.innerHTML = "⏸️ Pause";
    this.lastTimestamp = performance.now();
    this.narrateCurrentScene();
    this.loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.playBtn) this.playBtn.innerHTML = "▶️ Play Video";
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  seekTo(seconds) {
    this.currentTime = Math.max(0, Math.min(seconds, this.totalDuration));
    
    // Find corresponding scene
    let accumulated = 0;
    for (let i = 0; i < this.scenes.length; i++) {
      if (this.currentTime <= accumulated + this.scenes[i].duration) {
        this.currentScene = i;
        this.sceneTime = this.currentTime - accumulated;
        break;
      }
      accumulated += this.scenes[i].duration;
    }
    this.renderFrame();
    if (this.isPlaying) this.narrateCurrentScene();
  }

  narrateCurrentScene() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const scene = this.scenes[this.currentScene];
    const text = this.narrationLang === 'hi' ? scene.subtitle_hi : scene.subtitle;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.narrationLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(this.narrationLang));
    if (matchedVoice) utterance.voice = matchedVoice;

    window.speechSynthesis.speak(utterance);
  }

  loop() {
    if (!this.isPlaying) return;

    const now = performance.now();
    const dt = (now - this.lastTimestamp) / 1000;
    this.lastTimestamp = now;

    this.currentTime += dt;
    this.sceneTime += dt;

    const scene = this.scenes[this.currentScene];
    if (this.sceneTime >= scene.duration) {
      this.sceneTime = 0;
      this.currentScene++;
      if (this.currentScene >= this.scenes.length) {
        this.pause();
        this.currentTime = this.totalDuration;
        this.renderFrame();
        return;
      } else {
        this.narrateCurrentScene();
      }
    }

    this.renderFrame();
    this.updateControls();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  updateControls() {
    if (this.progressBar) {
      this.progressBar.value = this.currentTime;
    }
    if (this.timeDisplay) {
      const curM = Math.floor(this.currentTime / 60);
      const curS = Math.floor(this.currentTime % 60).toString().padStart(2, '0');
      const totM = Math.floor(this.totalDuration / 60);
      const totS = Math.floor(this.totalDuration % 60).toString().padStart(2, '0');
      this.timeDisplay.innerText = `${curM}:${curS} / ${totM}:${totS}`;
    }
  }

  renderFrame() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const scene = this.scenes[this.currentScene] || this.scenes[0];

    // 1. Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#0F172A'); // Deep Slate
    bgGradient.addColorStop(0.5, '#1E293B');
    bgGradient.addColorStop(1, '#0B0F19');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Subtle background mesh grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Top Indian Tricolor Stripe
    const stripeH = 6;
    ctx.fillStyle = '#FF671F'; // Saffron
    ctx.fillRect(0, 0, w / 3, stripeH);
    ctx.fillStyle = '#FFFFFF'; // White
    ctx.fillRect(w / 3, 0, w / 3, stripeH);
    ctx.fillStyle = '#046A38'; // India Green
    ctx.fillRect((w / 3) * 2, 0, w / 3, stripeH);

    // Header Logo & Badge
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('JanSahayak AI | जन सहायक', 40, 50);

    ctx.fillStyle = '#FF671F';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText('DEMO WALKTHROUGH', 350, 48);

    // Scene Indicator Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(w - 220, 30, 180, 30, 15);
    ctx.fill();
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText(`SCENE ${this.currentScene + 1} OF ${this.scenes.length}`, w - 180, 50);

    // Center Stage Graphic Box
    const stageX = 80;
    const stageY = 90;
    const stageW = w - 160;
    const stageH = 430;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.strokeStyle = scene.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(stageX, stageY, stageW, stageH, 20);
    ctx.fill();
    ctx.stroke();

    // Scene Specific Graphics Rendering
    this.renderSceneGraphics(ctx, scene, stageX, stageY, stageW, stageH);

    // Subtitle / Caption Card at Bottom
    const capX = 80;
    const capY = 540;
    const capW = w - 160;
    const capH = 140;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(capX, capY, capW, capH, 16);
    ctx.fill();
    ctx.stroke();

    // Icon & Title
    ctx.font = '36px system-ui';
    ctx.fillText(scene.icon, capX + 30, capY + 55);

    ctx.fillStyle = scene.accent;
    ctx.font = 'bold 20px system-ui';
    const mainTitle = this.narrationLang === 'hi' ? scene.title_hi : scene.title;
    ctx.fillText(mainTitle, capX + 85, capY + 45);

    // Subtitle Narration Text
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '16px system-ui';
    const mainSub = this.narrationLang === 'hi' ? scene.subtitle_hi : scene.subtitle;
    this.wrapText(ctx, mainSub, capX + 85, capY + 78, capW - 120, 24);

    // Bottom timeline bar inside canvas
    const progW = (this.currentTime / this.totalDuration) * w;
    ctx.fillStyle = '#FF671F';
    ctx.fillRect(0, h - 5, progW, 5);
  }

  renderSceneGraphics(ctx, scene, x, y, w, h) {
    const t = this.sceneTime;
    const centerX = x + w / 2;
    const centerY = y + h / 2;

    switch (scene.id) {
      case "intro":
        // Animated Exclusion vs Inclusion Map
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('800 Million Citizens vs. Complex English Portals', centerX, y + 80);

        // Two comparison cards
        const cardW = 380;
        const cardH = 220;

        // Card 1: Problem
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.strokeStyle = '#EF4444';
        ctx.beginPath();
        ctx.roundRect(centerX - cardW - 20, y + 130, cardW, cardH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('❌ Traditional Portals', centerX - cardW / 2 - 20, y + 170);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '14px system-ui';
        ctx.fillText('• 100% Bureaucratic English', centerX - cardW / 2 - 20, y + 210);
        ctx.fillText('• Rejection due to minor typos', centerX - cardW / 2 - 20, y + 240);
        ctx.fillText('• No voice or regional assistance', centerX - cardW / 2 - 20, y + 270);

        // Card 2: Solution
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.strokeStyle = '#10B981';
        ctx.beginPath();
        ctx.roundRect(centerX + 20, y + 130, cardW, cardH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('✅ JanSahayak AI', centerX + cardW / 2 + 20, y + 170);
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '14px system-ui';
        ctx.fillText('• Speaks & Listens in Indic Languages', centerX + cardW / 2 + 20, y + 210);
        ctx.fillText('• Instant 100% Welfare Eligibility Check', centerX + cardW / 2 + 20, y + 240);
        ctx.fillText('• Official CPGRAMS Grievance Letters', centerX + cardW / 2 + 20, y + 270);
        ctx.textAlign = 'left';
        break;

      case "voice":
        // Pulsing Microphone & Speech Wave Animation
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px system-ui';
        ctx.fillText('🎙️ Real-time Native Voice Recognition (STT)', centerX, y + 70);

        // Glowing Voice Rings
        const pulse = (Math.sin(t * 6) + 1) * 20;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 20, 60 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 20, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '40px system-ui';
        ctx.fillText('🎙️', centerX, centerY - 6);

        // Spoken Dialogue Bubble
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeStyle = '#60A5FA';
        ctx.beginPath();
        ctx.roundRect(centerX - 350, y + 270, 700, 70, 15);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'italic 18px system-ui';
        ctx.fillText('"मैं एक छोटा किसान हूँ, मुझे खाद और बीज के लिए सरकारी मदद चाहिए..."', centerX, y + 312);
        ctx.textAlign = 'left';
        break;

      case "matching":
        // Instant Scheme Matching Visualization
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px system-ui';
        ctx.fillText('⚡ 100% Match Found: PM-KISAN Samman Nidhi', centerX, y + 60);

        // Big Benefit Badge
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(centerX - 180, y + 90, 360, 60, 30);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 24px system-ui';
        ctx.fillText('₹6,000 / Year Direct DBT', centerX, y + 130);

        // Document Verification Checklist Animation
        const docs = [
          'Aadhaar Card (आधार कार्ड) - Verified ✓',
          'Land Ownership Khatauni (जमीन के कागजात) - Verified ✓',
          'DBT Linked Bank Account (बैंक पासबुक) - Active ✓'
        ];
        docs.forEach((doc, idx) => {
          const docY = y + 180 + idx * 50;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.beginPath();
          ctx.roundRect(centerX - 280, docY, 560, 40, 8);
          ctx.fill();

          ctx.fillStyle = '#10B981';
          ctx.font = 'bold 18px system-ui';
          ctx.fillText('✓', centerX - 250, docY + 26);

          ctx.fillStyle = '#F1F5F9';
          ctx.font = '15px system-ui';
          ctx.fillText(doc, centerX + 10, docY + 26);
        });
        ctx.textAlign = 'left';
        break;

      case "grievance":
        // Formal CPGRAMS Letter Animation
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px system-ui';
        ctx.fillText('📜 CPGRAMS Official Grievance Drafting Engine', centerX, y + 60);

        // Letter Paper
        const letW = 640;
        const letH = 260;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(centerX - letW / 2, y + 90, letW, letH, 12);
        ctx.fill();
        ctx.stroke();

        // Letter Text in Dark
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('TO: NODAL OFFICER, STATE ELECTRICITY DISTRIBUTION CORP.', centerX - letW / 2 + 30, y + 130);
        ctx.fillText('REF: CPGRAMS/2026/UP/98214 | MANDATORY SLA: 7 DAYS', centerX - letW / 2 + 30, y + 155);

        ctx.fillStyle = '#475569';
        ctx.font = '13px monospace';
        ctx.fillText('SUBJECT: Urgent replacement of burnt transformer at Rampur', centerX - letW / 2 + 30, y + 185);
        ctx.fillText('STATUTORY CITATION: Electricity Act 2003 (Section 43)', centerX - letW / 2 + 30, y + 210);
        ctx.fillText('CITIZEN CHARTER: Non-supply beyond 7 days incurs statutory penalty.', centerX - letW / 2 + 235, y + 235);

        // Stamp badge
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('[ CPGRAMS READY FOR SUBMISSION ]', centerX - letW / 2 + 30, y + 310);
        break;

      case "action":
        // WhatsApp & Speech Output
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px system-ui';
        ctx.fillText('🚀 Omnichannel Delivery & Voice Synthesis', centerX, y + 60);

        // WhatsApp card
        ctx.fillStyle = '#075E54';
        ctx.beginPath();
        ctx.roundRect(centerX - 300, y + 110, 280, 180, 16);
        ctx.fill();

        ctx.fillStyle = '#25D366';
        ctx.font = '40px system-ui';
        ctx.fillText('💬', centerX - 160, y + 170);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('WhatsApp Share', centerX - 160, y + 210);
        ctx.font = '12px system-ui';
        ctx.fillText('Share official draft with 1 tap', centerX - 160, y + 240);

        // TTS Speaker card
        ctx.fillStyle = '#831843';
        ctx.beginPath();
        ctx.roundRect(centerX + 20, y + 110, 280, 180, 16);
        ctx.fill();

        ctx.fillStyle = '#F472B6';
        ctx.font = '40px system-ui';
        ctx.fillText('🔊', centerX + 160, y + 170);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px system-ui';
        ctx.fillText('Bulbul TTS Audio', centerX + 160, y + 210);
        ctx.font = '12px system-ui';
        ctx.fillText('Full audio read-aloud for illiterate users', centerX + 160, y + 240);
        ctx.textAlign = 'left';
        break;
    }
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  // Export video to .webm download file using Canvas captureStream
  exportVideoFile() {
    if (!('MediaRecorder' in window)) {
      alert('MediaRecorder is not supported in this browser.');
      return;
    }

    if (this.isRecordingExport) {
      alert('Video export already in progress!');
      return;
    }

    this.isRecordingExport = true;
    this.recordedChunks = [];
    if (this.downloadBtn) this.downloadBtn.innerText = '⏺️ Recording (Please wait 45s)...';

    // Start stream at 30fps
    const stream = this.canvas.captureStream(30);
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'JanSahayak-AI-Demo.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.isRecordingExport = false;
      if (this.downloadBtn) this.downloadBtn.innerText = '📥 Download .WebM Video';
      alert('🎉 JanSahayak AI Demo Video downloaded successfully!');
    };

    // Reset playback to 0 and play full video
    this.seekTo(0);
    this.mediaRecorder.start();
    this.play();

    // Set timeout to stop recorder at totalDuration
    setTimeout(() => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    }, (this.totalDuration + 1) * 1000);
  }
}

// Global hook
window.initJanSahayakVideo = function() {
  window.janSahayakPlayer = new JanSahayakVideoPlayer('videoCanvas', 'videoContainer');
};
