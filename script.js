// MEMORY EMULATOR DB
const simDb = {
    confessions: [
        { id: 1, frequency: "Burnt Out", author: "Anon (♂)", text: "Working 14-hour days on corporate finance in Westlands. Physically alive, but inside it is completely quiet.", replies: 3, time: "1h ago" },
        { id: 2, frequency: "Lost", author: "Anon (♀)", text: "Stuck in that limbo phase after varsity. My friends seem to have mapped out their paths, while I am just here standing still.", replies: 1, time: "4h ago" },
        { id: 3, frequency: "Broken", author: "Anon (♂)", text: "Invested everything I had into building a dream house together, only to receive a single text saying 'I need space'. How do you rebuild from that?", replies: 12, time: "1d ago" }
    ],
    spillQuestions: {
        "Burnt Out": { question: "What is your primary toxic dynamic to keep yourself awake during midnight grinds?", choices: ["Infinite Espresso Shocks", "Uncontrolled Retail Spending", "Complete Emotional Blackout"] },
        "Broken": { question: "How do you navigate past interactions that no longer belong to you?", choices: ["Archive & Pretend it is Empty", "Reread old exchanges", "Subconsciously blame myself"] },
        "Lost": { question: "Who do you feel you are currently performing for?", choices: ["Strict Family Parameters", "Societal Expectation Metrics", "The Ghost of my Former Potential"] }
    },
    explanations: [
        { id: 101, freq: "Lost", choice: "Strict Family Parameters", text: "I accepted a boring business desk job purely because my folks wanted to brag to the cousins at family gatherings. I am dying slow.", author: "Anon (♀)" }
    ],
    
    // WHATSAPP-GRADE CHAT CHANNELS
    chats: [
        {
            id: "chat_tee",
            partnerName: "Tee",
            partnerGender: "Female",
            partnerFreq: "Broken",
            lastMessage: "I really get what you went through with that situation.",
            timestamp: "3m ago",
            contextSnippet: "Replied to your: 'Invested everything into building...'",
            messagesRemaining: 9,
            holdActive: false,
            messages: [
                { sender: "them", body: "I read your confession about building a dream house together. It hit dangerously close to home.", time: "10m ago" },
                { sender: "me", body: "Appreciate you checking in. It was a massive shock to the system.", time: "8m ago" },
                { sender: "them", body: "I really get what you went through with that situation.", time: "3m ago" }
            ]
        },
        {
            id: "chat_nerve",
            partnerName: "Nerve_Signal",
            partnerGender: "Male",
            partnerFreq: "Burnt Out",
            lastMessage: "Let's check back in on this grind tomorrow.",
            timestamp: "2h ago",
            contextSnippet: "Replied to: 'Working 14-hour days on corporate...'",
            messagesRemaining: 5,
            holdActive: false,
            messages: [
                { sender: "them", body: "Corporate finance in Westlands will empty your soul out, boss.", time: "3h ago" },
                { sender: "me", body: "Seriously. Constant pressure, zero relief.", time: "2h ago" },
                { sender: "them", body: "Let's check back in on this grind tomorrow.", time: "2h ago" }
            ]
        }
    ],

    // SYSTEM CHAT IDENTITIES
    anonymousVibeTags: ["Oracle_Gold", "Golden_Echo", "Vibe_Seeker", "Saffron_Aura", "Amber_Stardust", "Silent_Pulse", "Midnight_Mist"]
};

// Kenyan Names and traceable coordinates blocking rules
const illegalIdentifiers = [
    "kamau", "mwangi", "njeri", "otieno", "onyango", "omondi", "odhiambo", "wafula", 
    "wambui", "maina", "karanja", "nyambura", "whatsapp", "instagram", "tiktok", "facebook", 
    "snapchat", "telegram", "fb", "ig", "namba", "nipigie", "unaitwa", "simu", "jina", "my name"
];

// USER STORAGE
let userAura = {
    phone: "",
    gender: "",
    nativeFrequency: "",
    currentTunedFrequency: ""
};

let activeChatId = null;

// CENTRAL ROUTER
function navigateTo(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    window.scrollTo(0,0);
}

// SMS SYSTEM INTERACTION
function sendOTP() {
    const ph = document.getElementById('phone-number').value;
    if (ph.length < 9) {
        alert("Enter a verified phone registration parameter.");
        return;
    }
    userAura.phone = "+254" + ph;
    document.getElementById('phone-input-group').classList.add('hidden');
    document.getElementById('otp-input-group').classList.remove('hidden');
}

function verifyOTP() {
    navigateTo('onboarding-page');
}

// AURA RECEPTORS
function selectGender(g) {
    userAura.gender = g;
    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(g === 'Male' ? 'gender-male' : 'gender-female').classList.add('selected');
    validateOnboarding();
}

function selectFrequency(f) {
    userAura.nativeFrequency = f;
    document.querySelectorAll('.freq-btn').forEach(btn => btn.classList.remove('selected'));
    
    if (f === 'Burnt Out') document.getElementById('freq-burnt').classList.add('selected');
    if (f === 'Broken') document.getElementById('freq-broken').classList.add('selected');
    if (f === 'Lost') document.getElementById('freq-lost').classList.add('selected');
    
    validateOnboarding();
}

function validateOnboarding() {
    if (userAura.gender && userAura.nativeFrequency) {
        document.getElementById('btn-complete-onboarding').removeAttribute('disabled');
    }
}

function completeOnboarding() {
    userAura.currentTunedFrequency = userAura.nativeFrequency;
    document.getElementById('user-freq-tag').innerText = `Native: ${userAura.nativeFrequency}`;
    navigateTo('dashboard-page');
    applyFrequencyTheme(userAura.nativeFrequency);
    renderFeed();
}

// THEME TUNING STYLIST
function applyFrequencyTheme(freq) {
    document.body.className = 'theme-premium';
    document.querySelectorAll('.tuner-btn').forEach(btn => btn.classList.remove('active'));

    if (freq === 'Burnt Out') {
        document.body.classList.add('theme-burnt');
        document.getElementById('tuner-burnt').classList.add('active');
    } else if (freq === 'Broken') {
        document.body.classList.add('theme-broken');
        document.getElementById('tuner-broken').classList.add('active');
    } else if (freq === 'Lost') {
        document.body.classList.add('theme-lost');
        document.getElementById('tuner-lost').classList.add('active');
    }
}

function tuneFrequency(targetFreq) {
    userAura.currentTunedFrequency = targetFreq;
    applyFrequencyTheme(targetFreq);
    
    // Toggle composer locks if tuned out of native channels
    const comp = document.getElementById('creator-module');
    if (userAura.currentTunedFrequency !== userAura.nativeFrequency) {
        comp.classList.add('locked');
    } else {
        comp.classList.remove('locked');
    }

    renderFeed();
    renderSpillQuestion();
}

// SECURITY ALIGNMENT FILTER
function checkTextAnonymity(inputStr) {
    const safeStr = inputStr.toLowerCase().replace(/[^\w\s]/gi, '');
    const tokens = safeStr.split(/\s+/);
    
    const phReg = /(07\d{8}|01\d{8}|\+254\d{9})/g;
    if (phReg.test(inputStr)) {
        return "Traceable routing details detected. Broadcast halted.";
    }

    for (let token of tokens) {
        if (illegalIdentifiers.includes(token)) {
            return `Identity security break caught ("${token}"). Broadcast blocked.`;
        }
    }
    return null;
}

// BROADCASTS ENGINE
function submitPost() {
    const inp = document.getElementById('post-text-input');
    const txt = inp.value;
    const err = document.getElementById('filter-error-msg');

    const violation = checkTextAnonymity(txt);
    if (violation) {
        err.innerText = violation;
        err.classList.remove('hidden');
        return;
    }

    err.classList.add('hidden');

    const rawPost = {
        id: simDb.confessions.length + 1,
        frequency: userAura.nativeFrequency,
        author: `Anon (${userAura.gender === 'Male' ? '♂' : '♀'})`,
        text: txt,
        replies: 0,
        time: "Just now"
    };

    simDb.confessions.unshift(rawPost);
    inp.value = '';
    renderFeed();
}

function renderFeed() {
    const list = document.getElementById('feed-list');
    list.innerHTML = '';

    const activeBroadcasts = simDb.confessions.filter(p => p.frequency === userAura.currentTunedFrequency);

    activeBroadcasts.forEach(c => {
        list.innerHTML += `
            <div class="card-confession">
                <div class="card-meta">
                    <span class="card-freq">${c.frequency}</span>
                    <span class="card-auth">${c.author} • ${c.time}</span>
                </div>
                <div class="card-body">${c.text}</div>
                <div class="card-actions">
                    <button class="act-btn" onclick="openReplyFlow('confession', ${c.id}, '${c.author}', '${c.text}')">💬 Secure Echo Reply (${c.replies})</button>
                </div>
            </div>
        `;
    });
}

// DAILY SPILLS
function renderSpillQuestion() {
    const pool = simDb.spillQuestions[userAura.currentTunedFrequency];
    const qBox = document.getElementById('spill-question-box');
    
    if (userAura.currentTunedFrequency !== userAura.nativeFrequency) {
        qBox.classList.add('locked');
    } else {
        qBox.classList.remove('locked');
    }

    document.getElementById('current-question').innerText = pool.question;
    const ansGrid = document.getElementById('spill-answers');
    ansGrid.innerHTML = '';

    pool.choices.forEach(ch => {
        ansGrid.innerHTML += `
            <button class="ans-opt" onclick="chooseSpillChoice('${ch}')">${ch}</button>
        `;
    });

    renderSpillReplies();
}

let activeChoiceSelected = "";

function chooseSpillChoice(choice) {
    if (userAura.currentTunedFrequency !== userAura.nativeFrequency) return;
    
    activeChoiceSelected = choice;
    document.querySelectorAll('.ans-opt').forEach(opt => {
        opt.style.borderColor = 'var(--border-gold)';
        if (opt.innerText === choice) opt.style.borderColor = 'var(--gold-metallic)';
    });
    document.getElementById('explanation-box').classList.remove('hidden');
}

function submitExplanation() {
    const inp = document.getElementById('explanation-input');
    const txt = inp.value;

    const violation = checkTextAnonymity(txt);
    if (violation) {
        alert(violation);
        return;
    }

    const exp = {
        id: simDb.explanations.length + 100,
        freq: userAura.nativeFrequency,
        choice: activeChoiceSelected,
        text: txt,
        author: `Anon (${userAura.gender === 'Male' ? '♂' : '♀'})`
    };

    simDb.explanations.unshift(exp);
    inp.value = '';
    document.getElementById('explanation-box').classList.add('hidden');
    renderSpillReplies();
}

function renderSpillReplies() {
    const list = document.getElementById('explanations-list');
    list.innerHTML = '';

    const related = simDb.explanations.filter(e => e.freq === userAura.currentTunedFrequency);
    
    related.forEach(e => {
        list.innerHTML += `
            <div class="card-confession">
                <div class="card-meta">
                    <span class="card-freq">Aura Alignment: ${e.choice}</span>
                    <span class="card-auth">${e.author}</span>
                </div>
                <div class="card-body">${e.text}</div>
                <div class="card-actions">
                    <button class="act-btn" onclick="openReplyFlow('spill', ${e.id}, '${e.author}', '${e.text}')">💬 Secure Echo Reply</button>
                </div>
            </div>
        `;
    });
}

// ECHO INSTANT ACTION ROUTER
function openReplyFlow(sourceType, sourceId, authorName, originalText) {
    const replyText = prompt(`Initiate secure context-validated Echo to ${authorName}:`);
    if (!replyText) return;

    const violation = checkTextAnonymity(replyText);
    if (violation) {
        alert(violation);
        return;
    }

    // Generate high-end randomized alignment dynamic profile name
    const randTag = simDb.anonymousVibeTags[Math.floor(Math.random() * simDb.anonymousVibeTags.length)];
    const systemDesignatedIdentity = randTag + "_" + Math.floor(100 + Math.random() * 900);

    const newChat = {
        id: "chat_" + Date.now(),
        partnerName: systemDesignatedIdentity,
        partnerGender: authorName.includes('♂') ? 'Male' : 'Female',
        partnerFreq: userAura.currentTunedFrequency,
        lastMessage: replyText,
        timestamp: "Just now",
        contextSnippet: `Replied to your ${sourceType}: "${originalText.substring(0, 32)}..."`,
        messagesRemaining: 9,
        holdActive: false,
        messages: [
            { sender: "me", body: replyText, time: "Just now" }
        ]
    };

    if (sourceType === 'confession') {
        const found = simDb.confessions.find(c => c.id === sourceId);
        if (found) found.replies++;
    }

    simDb.chats.unshift(newChat);
    switchTab('echo');
    openChat(newChat.id);
}

// =======================================================
// WHATSAPP-STYLE HIGH RESOLUTION ECHO CONTROLLER
// =======================================================
function renderEchoConversations() {
    const list = document.getElementById('connections-list');
    list.innerHTML = '';

    simDb.chats.forEach(chat => {
        const activeClass = (chat.id === activeChatId) ? 'active' : '';
        const lowerFreq = chat.partnerFreq.toLowerCase().replace(/\s+/g, '');
        
        list.innerHTML += `
            <div class="echo-connection-item ${activeClass}" onclick="openChat('${chat.id}')">
                <div class="echo-item-meta">
                    <span class="echo-item-name">${chat.partnerName}</span>
                    <span class="echo-item-badge ${lowerFreq}">${chat.partnerFreq}</span>
                </div>
                <div class="echo-item-snippet">${chat.lastMessage}</div>
                <div class="echo-item-context">⚡ ${chat.contextSnippet}</div>
            </div>
        `;
    });
}

function openChat(chatId) {
    activeChatId = chatId;
    renderEchoConversations();

    const target = simDb.chats.find(c => c.id === chatId);
    const windowDiv = document.getElementById('active-chat-window');

    // Build vibe limit markers dynamically
    let limitGridHtml = '';
    for (let i = 1; i <= 10; i++) {
        const activeClass = (i <= target.messagesRemaining) ? 'active' : '';
        limitGridHtml += `<div class="vibe-visual-tick ${activeClass}"></div>`;
    }

    windowDiv.innerHTML = `
        <div class="chat-window-header">
            <div class="active-user-details">
                <h4>${target.partnerName}</h4>
                <p>${target.partnerGender} • ${target.partnerFreq} Resonance</p>
            </div>
            
            <div class="vibe-visual-limit">
                <span class="vibe-visual-text">ALIGNMENT LEVEL:</span>
                <div class="vibe-visual-grid">${limitGridHtml}</div>
            </div>

            <div class="chat-window-actions">
                <button class="action-icon-btn" title="Secure Encrypted Audio Note" onclick="alert('Securing pristine sound capturing node...')">🎙️</button>
                <button class="action-icon-btn" title="Secure Pixelated Stream Call" onclick="alert('Initiating zero-identity pixelated visual link...')">📹</button>
            </div>
        </div>
        
        <div class="chat-origin-context-strip">
            Origin: <strong>${target.contextSnippet}</strong>
        </div>

        <div class="chat-history-area" id="chat-scroller">
            <!-- Rendered below -->
        </div>

        <div class="chat-input-row">
            <div class="audio-video-send-shortcuts">
                <button class="chat-shortcut-btn" title="Simulate Pixel Video Clip Attachment" onclick="alert('Loading private pixel frame buffer...')">🎞️</button>
                <button class="chat-shortcut-btn" title="Simulate Voice Clip Attachment" onclick="alert('Routing safe microphone buffer...')">🎙️</button>
            </div>
            <input type="text" id="echo-message-input" placeholder="Type secure message..." onkeydown="if(event.key === 'Enter') sendEchoMessage()">
            <button class="btn-send-message" onclick="sendEchoMessage()">Send</button>
        </div>
    `;

    renderActiveChatMessages(target);
}

function renderActiveChatMessages(chat) {
    const box = document.getElementById('chat-scroller');
    box.innerHTML = '';

    chat.messages.forEach(m => {
        const rowClass = (m.sender === 'me') ? 'sent' : 'received';
        box.innerHTML += `
            <div class="chat-bubble-row ${rowClass}">
                <div class="bubble-text">${m.body}</div>
                <div class="bubble-time">${m.time}</div>
            </div>
        `;
    });
    
    // WhatsApp native automated vertical alignments
    box.scrollTop = box.scrollHeight;
}

function sendEchoMessage() {
    const chat = simDb.chats.find(c => c.id === activeChatId);
    const input = document.getElementById('echo-message-input');
    const val = input.value;

    if (!val.trim()) return;

    const violation = checkTextAnonymity(val);
    if (violation) {
        alert(violation);
        return;
    }

    if (chat.messagesRemaining <= 0 && !chat.holdActive) {
        document.getElementById('match-modal').classList.remove('hidden');
        return;
    }

    if (!chat.holdActive) {
        chat.messagesRemaining--;
    }

    chat.messages.push({
        sender: "me",
        body: val,
        time: "Just now"
    });

    chat.lastMessage = val;
    input.value = '';

    openChat(chat.id);

    // Mock dynamic replies 
    setTimeout(() => {
        if (chat.messages[chat.messages.length - 1].sender === "me") {
            chat.messages.push({
                sender: "them",
                body: "I highly appreciate your perspective on this, let us hold alignment here.",
                time: "Just now"
            });
            chat.lastMessage = "I highly appreciate your perspective...";
            if (activeChatId === chat.id) {
                openChat(chat.id);
            }
        }
    }, 2000);
}

// MPESA GATEWAY OPERATIONS
function activateHold() {
    alert("STK M-Pesa push initiated on your registered number for KES 50. Key in your secure PIN on your device.");
    const chat = simDb.chats.find(c => c.id === activeChatId);
    if (chat) {
        chat.holdActive = true;
        chat.messagesRemaining = 10; 
    }
    closeMatchModal();
    openChat(activeChatId);
}

function closeMatchModal() {
    document.getElementById('match-modal').classList.add('hidden');
}

// NAVIGATION TABS SWITCHBOARD
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(panel => panel.classList.add('hidden'));

    document.getElementById(`tab-btn-${tabId}`).classList.add('active');
    document.getElementById(`panel-${tabId}`).classList.remove('hidden');

    if (tabId === 'feed') {
        renderFeed();
    } else if (tabId === 'spill') {
        renderSpillQuestion();
    } else if (tabId === 'echo') {
        renderEchoConversations();
        document.getElementById('echo-unread-badge').classList.add('hidden');
    }
        }
            
