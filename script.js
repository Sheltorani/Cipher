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
    
    // WHATSAPP-GRADE CHAT CHANNELS (Using Screenshot values)
    chats: [
        {
            id: "chat_tee",
            partnerName: "Tee✨💕",
            partnerAvatar: "https://images.unsplash.com/photo-1518818419601-72c8673f5852?auto=format&fit=crop&q=80&w=150", /* Soft ambient glow sky mimicking Tee's avatar */
            partnerGender: "Female",
            partnerFreq: "Broken",
            lastMessage: "Goodnight",
            timestamp: "00:32",
            unreadCount: 0,
            contextSnippet: "Replied to your post on Westlands",
            messagesRemaining: 9,
            holdActive: false,
            messages: [
                { sender: "them", body: "Most is from the parents then zinging since yeye ni software engineer he deals with those stuff", time: "00:10" },
                { sender: "me", body: "Nice there's something I'm working on ikinishinda I might need his skills,,so it depends on you", time: "00:12" },
                { sender: "them", body: "Mmmmh now i don't know it's upto him not me", time: "00:17", quote: { author: "You", text: "Nice there's something I'm working on..." } },
                { sender: "me", body: "Ok", time: "00:22" },
                { sender: "them", body: "Ok", time: "00:23", quote: { author: "Tee✨💕", text: "Mmmmh now i don't know..." } },
                { sender: "me", body: "I'll sleep,,si wewe uko kesha😂😂", time: "00:24" },
                { sender: "them", body: "Naah I'm tired", time: "00:28" },
                { sender: "me", body: "Lala poa", time: "00:31" },
                { sender: "them", body: "Goodnight", time: "00:32" }
            ]
        },
        {
            id: "chat_expoze",
            partnerName: "Expoze Teens",
            partnerAvatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=150",
            partnerGender: "Male",
            partnerFreq: "Burnt Out",
            lastMessage: "Badooo",
            timestamp: "12:09",
            unreadCount: 3,
            contextSnippet: "Global Frequency Broadcast",
            messagesRemaining: 5,
            holdActive: false,
            messages: [
                { sender: "them", body: "We need to schedule the release program", time: "11:58" },
                { sender: "them", body: "Badooo", time: "12:09" }
            ]
        },
        {
            id: "chat_prozy",
            partnerName: "Prozy",
            partnerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
            partnerGender: "Female",
            partnerFreq: "Lost",
            lastMessage: "Woishe 😂",
            timestamp: "09:22",
            unreadCount: 1,
            contextSnippet: "Replied to: 'Limbo phase after varsity'",
            messagesRemaining: 10,
            holdActive: false,
            messages: [
                { sender: "them", body: "Woishe 😂", time: "09:22" }
            ]
        }
    ],

    // SYSTEM CHAT IDENTITIES
    anonymousVibeTags: ["Oracle_Gold", "Golden_Echo", "Vibe_Seeker", "Saffron_Aura", "Amber_Stardust", "Silent_Pulse"]
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

function openReplyFlow(sourceType, sourceId, authorName, originalText) {
    const replyText = prompt(`Initiate secure context-validated Echo to ${authorName}:`);
    if (!replyText) return;

    const violation = checkTextAnonymity(replyText);
    if (violation) {
        alert(violation);
        return;
    }

    const randTag = simDb.anonymousVibeTags[Math.floor(Math.random() * simDb.anonymousVibeTags.length)];
    const systemDesignatedIdentity = randTag + "_" + Math.floor(100 + Math.random() * 900);

    const newChat = {
        id: "chat_" + Date.now(),
        partnerName: systemDesignatedIdentity,
        partnerAvatar: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=150",
        partnerGender: authorName.includes('♂') ? 'Male' : 'Female',
        partnerFreq: userAura.currentTunedFrequency,
        lastMessage: replyText,
        timestamp: "Just now",
        unreadCount: 0,
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
// WHATSAPP-STYLE REDESIGNED CHAT SYSTEMS
// =======================================================
function renderEchoConversations() {
    const list = document.getElementById('connections-list');
    list.innerHTML = '';

    simDb.chats.forEach(chat => {
        const activeClass = (chat.id === activeChatId) ? 'active' : '';
        const unreadBadgeHtml = chat.unreadCount > 0 ? `<div class="item-unread-badge">${chat.unreadCount}</div>` : '';
        
        list.innerHTML += `
            <div class="echo-connection-item ${activeClass}" onclick="openChat('${chat.id}')">
                <div class="avatar-ring">
                    <img class="avatar-img-placeholder" src="${chat.partnerAvatar}" alt="Profile Avatar">
                </div>
                <div class="item-content-pane">
                    <div class="item-header-row">
                        <span class="item-title">${chat.partnerName}</span>
                        <span class="item-time">${chat.timestamp}</span>
                    </div>
                    <div class="item-details-row">
                        <span class="item-snippet">${chat.lastMessage}</span>
                        ${unreadBadgeHtml}
                    </div>
                </div>
            </div>
        `;
    });
}

function openChat(chatId) {
    activeChatId = chatId;
    
    // Clear unreads upon selection
    const target = simDb.chats.find(c => c.id === chatId);
    if(target) target.unreadCount = 0;

    renderEchoConversations();

    const windowDiv = document.getElementById('active-chat-window');

    // Build vibe limit markers dynamically
    let limitGridHtml = '';
    for (let i = 1; i <= 10; i++) {
        const activeClass = (i <= target.messagesRemaining) ? 'active' : '';
        limitGridHtml += `<div class="vibe-visual-tick ${activeClass}"></div>`;
    }

    // Toggle Mobile display classes
    document.querySelector('.echo-sidebar').classList.add('mobile-hide');
    windowDiv.classList.add('mobile-show');

    windowDiv.innerHTML = `
        <div class="chat-window-header">
            <div class="header-contact-info" onclick="closeChatMobile()">
                <button class="back-arrow-mobile">←</button>
                <div class="avatar-ring">
                    <img class="avatar-img-placeholder" src="${target.partnerAvatar}">
                </div>
                <div class="active-user-details">
                    <h4 style="font-size: 1rem; font-weight: 700; color: #fff;">${target.partnerName}</h4>
                    <p style="font-size: 0.72rem; color: var(--gold-light);">${target.partnerFreq} Resonance</p>
                </div>
            </div>

            <div class="chat-header-actions">
                <button class="chat-action-btn" onclick="alert('Initiating premium direct video feed protocol...')">📹</button>
                <button class="chat-action-btn" onclick="alert('Connecting secure direct voice note stream...')">📞</button>
                <button class="chat-action-btn" onclick="alert('Securing Chat Environment')">⋮</button>
            </div>
        </div>

        <div class="chat-history-area" id="chat-scroller">
            <!-- Messages are rendered dynamically below -->
        </div>

        <div class="chat-input-wrapper">
            <div class="input-pill-container">
                <button class="pill-emoji-btn">😀</button>
                <button class="pill-clip-btn" onclick="alert('Accessing Encrypted Local Storage files...')">📎</button>
                <input type="text" id="echo-message-input" placeholder="Message" onkeydown="if(event.key === 'Enter') sendEchoMessage()">
                <button class="pill-camera-btn" onclick="alert('Opening secure Camera capture...')">📷</button>
            </div>
            <button class="mic-or-send-btn" id="voice-send-trigger" onclick="sendEchoMessage()">
                🎙️
            </button>
        </div>
    `;

    renderActiveChatMessages(target);

    // Watch for typing actions to change mic button to a gold submit button dynamically
    const msgInp = document.getElementById('echo-message-input');
    const trigger = document.getElementById('voice-send-trigger');
    msgInp.addEventListener('input', () => {
        if(msgInp.value.trim().length > 0) {
            trigger.innerHTML = "✈️";
            trigger.style.background = "var(--gold-metallic)";
        } else {
            trigger.innerHTML = "🎙️";
            trigger.style.background = "#a8583b";
        }
    });
}

function renderActiveChatMessages(chat) {
    const box = document.getElementById('chat-scroller');
    box.innerHTML = '';

    chat.messages.forEach(m => {
        const rowClass = (m.sender === 'me') ? 'sent' : 'received';
        const tickHtml = (m.sender === 'me') ? `<span class="double-tick">✓✓</span>` : '';
        
        // Quote bubble condition checking
        let quoteHtml = '';
        if (m.quote) {
            quoteHtml = `
                <div class="bubble-quote-wrap">
                    <div class="quote-author">${m.quote.author}</div>
                    <div class="quote-text">${m.quote.text}</div>
                </div>
            `;
        }

        box.innerHTML += `
            <div class="chat-bubble-row ${rowClass}">
                ${quoteHtml}
                <div class="bubble-text-content">${m.body}</div
