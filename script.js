// CENTRAL MEMORY CORE (SIMULATOR)
const simDb = {
    confessions: [
        { id: 1, frequency: "Burnt Out", author: "Anon (♂)", gender: "Male", text: "Endless hours on enterprise codes in Nairobi. Living purely for rent.", replies: 3, time: "2h ago" },
        { id: 2, frequency: "Lost", author: "Anon (♀)", gender: "Female", text: "Finished high school but still don't know my design parameters. Expectation weight is crushing.", replies: 0, time: "4h ago" },
        { id: 3, frequency: "Broken", author: "Anon (♂)", gender: "Male", text: "Total blackout blocks everywhere after 4 years of solid trust. Healing process not found.", replies: 1, time: "1d ago" }
    ],
    spillQuestions: {
        "Burnt Out": { question: "What is your unhealthiest coping mechanism during 12+ hour grinds?", choices: ["Infinite Caffeine", "Emotional Shutdown", "Aggressive Spending"] },
        "Broken": { question: "Who do you silently blame for your most recent structural damage?", choices: ["An Ex", "My Own Self-Sabotage", "Family Projections"] },
        "Lost": { question: "Have you compromised your design principles just to keep someone in your orbit?", choices: ["Completely", "Never", "Currently doing it right now"] }
    },
    explanations: [
        { id: 101, freq: "Lost", choice: "Completely", text: "I threw away my dreams of digital arts because they wanted me in standard financial jobs. Now I am a shell.", gender: "Female", author: "Anon (♀)" }
    ],
    // WhatsApp-like Conversation Models
    chats: [
        {
            id: "chat_1",
            partnerName: "Nerve_Signal",
            partnerGender: "Male",
            partnerFreq: "Burnt Out",
            lastMessage: "Yeah, totally get that stress.",
            timestamp: "12m ago",
            contextSnippet: "Replied to: 'Endless hours on enterprise codes...'",
            messagesRemaining: 8,
            holdActive: false,
            messages: [
                { sender: "them", body: "Bro, those corporate grinds in Nairobi will eat your soul.", time: "15m ago" },
                { sender: "me", body: "Tell me about it. 14 hours a day is ridiculous.", time: "14m ago" },
                { sender: "them", body: "Yeah, totally get that stress.", time: "12m ago" }
            ]
        }
    ],
    // System identity generators for conversations
    genZIdentities: ["Phantom_Signal", "Vibe_Wanderer", "Vibe_Anchor", "Null_Entity", "Neon_Hustler", "Midnight_Healer", "Distant_Aura", "Static_Void"]
};

// Kenyan Names and Security Blocks
const securityLocks = [
    "kamau", "mwangi", "njeri", "otieno", "onyango", "omondi", "odhiambo", "wafula", 
    "wambui", "maina", "karanja", "nyambura", "whatsapp", "instagram", "tiktok", "facebook", 
    "snapchat", "telegram", "fb", "ig", "namba", "nipigie", "unaitwa", "simu", "jina"
];

// USER CACHE
let userAura = {
    phone: "",
    gender: "",
    nativeFrequency: "",
    currentTunedFrequency: "" // To support inter-frequency tuning
};

let activeChatId = null;

// ROUTING MATRIX
function navigateTo(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

// 1. REGISTRATION GATEWAY
function sendOTP() {
    const ph = document.getElementById('phone-number').value;
    if (ph.length < 9) {
        alert("Valid Safaricom/Airtel identifier expected.");
        return;
    }
    userAura.phone = "+254" + ph;
    document.getElementById('phone-input-group').classList.add('hidden');
    document.getElementById('otp-input-group').classList.remove('hidden');
}

function verifyOTP() {
    navigateTo('onboarding-page');
}

// 2. AURA LOCKING
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

// 3. THEME TUNER ENGINE (Crucial for immersive inter-frequency shifts)
function applyFrequencyTheme(freq) {
    // Reset classes
    document.body.className = '';
    
    // De-activate all dials
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

// 4. INTER-FREQUENCY TUNING ACTION
function tuneFrequency(targetFreq) {
    userAura.currentTunedFrequency = targetFreq;
    applyFrequencyTheme(targetFreq);
    
    // Dynamically lock/unlock composer based on tuned status
    const comp = document.getElementById('creator-module');
    if (userAura.currentTunedFrequency !== userAura.nativeFrequency) {
        comp.classList.add('locked');
    } else {
        comp.classList.remove('locked');
    }

    renderFeed();
    renderSpillQuestion();
}

// 5. PARSING CONTENT FOR SECURITY BREAKS
function checkTextAnonymity(inputStr) {
    const safeStr = inputStr.toLowerCase().replace(/[^\w\s]/gi, '');
    const tokens = safeStr.split(/\s+/);
    
    const phReg = /(07\d{8}|01\d{8}|\+254\d{9})/g;
    if (phReg.test(inputStr)) {
        return "System Warning: Telephone routing details detected. Broadcast blocked.";
    }

    for (let token of tokens) {
        if (securityLocks.includes(token)) {
            return `System Warning: Traceable identifier ("${token}") detected. Broadcast blocked.`;
        }
    }
    return null;
}

// 6. BROADCASTS & REPLIES CORE
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
        gender: userAura.gender,
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

    // Filter feed purely by currently tuned dial
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
                    <button class="act-btn" onclick="openDirectReplyOverlay('confession', ${c.id}, '${c.author}', '${c.text}')">💬 Secure Echo Reply (${c.replies})</button>
                </div>
            </div>
        `;
    });
}

// 7. INTERACTIVE SPILL🌶️ HUB
function renderSpillQuestion() {
    const pool = simDb.spillQuestions[userAura.currentTunedFrequency];
    const qBox = document.getElementById('spill-question-box');
    
    // Check if composer needs lock visual
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
    if (userAura.currentTunedFrequency !== userAura.nativeFrequency) return; // Locked
    
    activeChoiceSelected = choice;
    document.querySelectorAll('.ans-opt').forEach(opt => {
        opt.style.borderColor = 'var(--border-color)';
        if (opt.innerText === choice) opt.style.borderColor = 'var(--accent-color)';
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
        gender: userAura.gender,
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
                    <span class="card-freq">Aura Answer: ${e.choice}</span>
                    <span class="card-auth">${e.author}</span>
                </div>
                <div class="card-body">${e.text}</div>
                <div class="card-actions">
                    <button class="act-btn" onclick="openDirectReplyOverlay('spill', ${e.id}, '${e.author}', '${e.text}')">💬 Secure Echo Reply</button>
                </div>
            </div>
        `;
    });
}

// 8. DIRECT ROUTING OVERLAY (PROMPTS MESSAGE INSTANTLY TO WhatsApp-like Chat Panel)
function openDirectReplyOverlay(sourceType, sourceId, authorName, originalText) {
    const replyText = prompt(`Type your secure, context-backed reply to ${authorName}:`);
    if (!replyText) return;

    const violation = checkTextAnonymity(replyText);
    if (violation) {
        alert(violation);
        return;
    }

    // Generate random secure identity
    const randomNameIdx = Math.floor(Math.random() * simDb.genZIdentities.length);
    const mockIdentity = simDb.genZIdentities[randomNameIdx] + "_" + Math.floor(100 + Math.random() * 900);

    // Create a dynamic messaging thread
    const newChat = {
        id: "chat_" + Date.now(),
        partnerName: mockIdentity,
        partnerGender: authorName.includes('♂') ? 'Male' : 'Female',
        partnerFreq: userAura.currentTunedFrequency,
        lastMessage: replyText,
        timestamp: "Just now",
        contextSnippet: `Replied to your ${sourceType}: "${originalText.substring(0, 30)}..."`,
        messagesRemaining: 9, // Start count
        holdActive: false,
        messages: [
            { sender: "me", body: replyText, time: "Just now" }
        ]
    };

    // Update original counter
    if (sourceType === 'confession') {
        const found = simDb.confessions.find(c => c.id === sourceId);
        if (found) found.replies++;
    }

    simDb.chats.unshift(newChat);
    
    // Switch over to Echo Space immediately
    switchTab('echo');
    openChat(newChat.id);
}

// 9. WHATSAPP STYLE ECHO INTERFACE
function renderEchoSidebar() {
    const list = document.getElementById('connections-list');
    list.innerHTML = '';

    simDb.chats.forEach(chat => {
        const activeClass = (chat.id === activeChatId) ? 'active' : '';
        const lowerFreq = chat.partnerFreq.toLowerCase().replace(/\s+/g, '');
        
        list.innerHTML += `
            <div class="connection-item ${activeClass}" onclick="openChat('${chat.id}')">
                <div class="connection-meta">
                    <span class="conn-name">${chat.partnerName}</span>
                    <span class="conn-freq ${lowerFreq}">${chat.partnerFreq}</span>
                </div>
                <div class="connection-snippet">${chat.lastMessage}</div>
                <div style="font-size:0.6rem; color:#6b7280; margin-top:0.25rem;">${chat.contextSnippet}</div>
            </div>
        `;
    });
}

function openChat(chatId) {
    activeChatId = chatId;
    renderEchoSidebar();

    const target = simDb.chats.find(c => c.id === chatId);
    const windowDiv = document.getElementById('active-chat-window');

    // Create vibe dots
    let dotsHtml = '';
    for (let i = 1; i <= 10; i++) {
        const activeClass = (i <= target.messagesRemaining) ? 'active' : '';
        dotsHtml += `<div class="vibe-dot ${activeClass}"></div>`;
    }

    windowDiv.innerHTML = `
        <div class="chat-active-header">
            <div class="chat-active-details">
                <h4>${target.partnerName}</h4>
                <p>${target.partnerGender} • ${target.partnerFreq} Aura</p>
            </div>
            <div class="vibe-meter">
                <span class="vibe-label">FREE RANGE:</span>
                <div class="vibe-bar">${dotsHtml}</div>
            </div>
        </div>
        
        <div class="chat-context-panel">
            ⚡ ${target.contextSnippet}
        </div>

        <div class="chat-message-history" id="chat-messages-container">
            <!-- Populated -->
        </div>

        <div class="chat-input-controls">
            <input type="text" id="chat-msg-input" placeholder="Type a message..." onkeydown="if(event.key === 'Enter') sendEchoMsg()">
            <button class="btn-icon-send" onclick="sendEchoMsg()">Send</button>
        </div>
    `;

    renderActiveChatMessages(target);
}

function renderActiveChatMessages(chat) {
    const box = document.getElementById('chat-messages-container');
    box.innerHTML = '';

    chat.messages.forEach(m => {
        const rowClass = (m.sender === 'me') ? 'sent' : 'received';
        box.innerHTML += `
            <div class="chat-msg-row ${rowClass}">
                <div class="msg-body">${m.body}</div>
                <div class="msg-time">${m.time}</div>
            </div>
        `;
    });
    
    // Auto Scroll to Bottom
    box.scrollTop = box.scrollHeight;
}

function sendEchoMsg() {
    const chat = simDb.chats.find(c => c.id === activeChatId);
    const input = document.getElementById('chat-msg-input');
    const val = input.value;

    if (!val.trim()) return;

    const violation = checkTextAnonymity(val);
    if (violation) {
        alert(violation);
        return;
    }

    // Check message credits limit (Hold system gate)
    if (chat.messagesRemaining <= 0 && !chat.holdActive) {
        document.getElementById('match-modal').classList.remove('hidden');
        return;
    }

    // Deduct message count unless an M-Pesa Hold is active
    if (!chat.holdActive) {
        chat.messagesRemaining--;
    }

    // Append Message
    chat.messages.push({
        sender: "me",
        body: val,
        time: "Just now"
    });

    chat.lastMessage = val;
    input.value = '';

    openChat(chat.id); // Re-render

    // Mock Response from Match after 2 seconds to simulate active interaction
    setTimeout(() => {
        if (chat.messages[chat.messages.length - 1].sender === "me") {
            chat.messages.push({
                sender: "them",
                body: "This is a secure network transmission test. I sense compatibility.",
                time: "Just now"
            });
            chat.lastMessage = "This is a secure network...";
            if(activeChatId === chat.id) {
                openChat(chat.id);
            }
        }
    }, 2000);
}

// 10. ACTIVE MPESA HOLD CORES
function activateHold() {
    alert("Triggering Safaricom STK M-Pesa Push to +254... Amount: 50 KES. Enter your pin.");
    const chat = simDb.chats.find(c => c.id === activeChatId);
    if (chat) {
        chat.holdActive = true;
        chat.messagesRemaining = 10; // refill metrics
    }
    closeMatchModal();
    openChat(activeChatId);
}

function closeMatchModal() {
    document.getElementById('match-modal').classList.add('hidden');
}

// TAB SELECTS
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
        renderEchoSidebar();
        document.getElementById('echo-unread-badge').classList.add('hidden');
    }
    }
    
