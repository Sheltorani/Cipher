// Local In-Memory Database Simulator (Updates live in memory)
const dbSim = {
    confessions: [
        { id: 1, frequency: "Burnt Out", author: "Anonymous Male", text: "Working 14-hour days in Westlands, Nairobi. Feels like I am just existing to pay rent. Unbelievable burnout.", replies: 12, time: "2h ago" },
        { id: 2, frequency: "Lost", author: "Anonymous Female", text: "Finished high school but still don't know what career path is for me. My family expects so much.", replies: 3, time: "4h ago" },
        { id: 3, frequency: "Broken", author: "Anonymous Male", text: "She blocked me everywhere after 4 years of a perfect relationship. I cannot heal.", replies: 28, time: "1d ago" }
    ],
    explanations: [],
    chats: []
};

// Kenyan Names and Anonymity Filters (Blocking Swahili, Sheng, and Identity handles)
const restrictedWords = [
    "kamau", "mwangi", "njeri", "otieno", "onyango", "omondi", "odhiambo", "wafula", 
    "wambui", "maina", "karanja", "nyambura", "whatsapp", "instagram", "tiktok", "facebook", 
    "snapchat", "telegram", "fb", "ig", "namba", "nipigie", "unaitwa", "simu", "jina"
];

// App State
let appState = {
    phone: "",
    gender: "",
    frequency: ""
};

// Pure JavaScript SPA Navigation Controller
function navigateTo(pageId) {
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
}

// 1. VERIFICATION FLOW
function sendOTP() {
    const phoneInput = document.getElementById('phone-number').value;
    if (phoneInput.length < 9) {
        alert("Please enter a valid Kenyan Safaricom or Airtel number.");
        return;
    }
    appState.phone = "+254" + phoneInput;
    document.getElementById('phone-input-group').classList.add('hidden');
    document.getElementById('otp-input-group').classList.remove('hidden');
}

function verifyOTP() {
    navigateTo('onboarding-page');
}

// 2. ONBOARDING
function selectGender(g) {
    appState.gender = g;
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById(g === 'Male' ? 'gender-male' : 'gender-female').classList.add('selected');
    checkOnboardStatus();
}

function selectFrequency(f) {
    appState.frequency = f;
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('selected'));
    
    if (f === 'Burnt Out') document.getElementById('freq-burnt').classList.add('selected');
    if (f === 'Broken') document.getElementById('freq-broken').classList.add('selected');
    if (f === 'Lost') document.getElementById('freq-lost').classList.add('selected');
    
    checkOnboardStatus();
}

function checkOnboardStatus() {
    if (appState.gender && appState.frequency) {
        document.getElementById('btn-complete-onboarding').removeAttribute('disabled');
    }
}

function completeOnboarding() {
    document.getElementById('user-freq-tag').innerText = appState.frequency;
    navigateTo('dashboard-page');
    renderFeed();
}

// 3. ANONYMITY SCANNER AND COMPOSER
function checkTextAnonymity(str) {
    const safeStr = str.toLowerCase().replace(/[^\w\s]/gi, '');
    const words = safeStr.split(/\s+/);
    
    // Check for phone numbers
    const numRegex = /(07\d{8}|01\d{8}|\+254\d{9})/g;
    if (numRegex.test(str)) {
        return "Warning: Sharing phone numbers violates Cipher rules and is blocked.";
    }

    for (let word of words) {
        if (restrictedWords.includes(word)) {
            return `Warning: Sharing identifiers ("${word}") is not allowed to keep you safe.`;
        }
    }
    return null;
}

function submitPost() {
    const postBox = document.getElementById('post-text-input');
    const txt = postBox.value;
    const errBox = document.getElementById('filter-error-msg');

    const violation = checkTextAnonymity(txt);
    if (violation) {
        errBox.innerText = violation;
        errBox.classList.remove('hidden');
        return;
    }

    errBox.classList.add('hidden');

    const newConf = {
        id: dbSim.confessions.length + 1,
        frequency: appState.frequency,
        author: `Anon (${appState.gender === 'Male' ? '♂' : '♀'})`,
        text: txt,
        replies: 0,
        time: "Just now"
    };

    dbSim.confessions.unshift(newConf);
    postBox.value = '';
    renderFeed();

    setTimeout(() => {
        triggerAutomaticMatch();
    }, 1200);
}

function renderFeed() {
    const currentFilter = document.getElementById('feed-filter').value;
    const targetDiv = document.getElementById('feed-list');
    targetDiv.innerHTML = '';

    const listToRender = dbSim.confessions.filter(item => currentFilter === 'All' || item.frequency === currentFilter);

    listToRender.forEach(c => {
        targetDiv.innerHTML += `
            <div class="card-confession">
                <div class="card-meta">
                    <span class="card-freq">${c.frequency}</span>
                    <span class="card-auth">${c.author} • ${c.time}</span>
                </div>
                <div class="card-body">${c.text}</div>
                <div class="card-actions">
                    <button class="act-btn" onclick="triggerAutomaticMatch()">⚡ Direct Match</button>
                    <button class="act-btn">💬 Reply (${c.replies})</button>
                </div>
            </div>
        `;
    });
}

// 4. Q&A FUNCTIONALITY
function chooseQuestionAnswer(choice) {
    document.querySelectorAll('.ans-opt').forEach(opt => {
        opt.style.borderColor = 'var(--border-glow)';
        if(opt.innerText === choice) opt.style.borderColor = 'var(--accent-green)';
    });
    document.getElementById('explanation-box').classList.remove('hidden');
}

function submitExplanation() {
    const input = document.getElementById('explanation-input').value;
    const violation = checkTextAnonymity(input);
    if (violation) {
        alert(violation);
        return;
    }

    dbSim.explanations.push({
        text: input,
        gender: appState.gender
    });

    document.getElementById('explanation-input').value = '';
    document.getElementById('explanation-box').classList.add('hidden');
    triggerAutomaticMatch();
}

// 5. AUTOMATIC MATCHING MECHANISM
function triggerAutomaticMatch() {
    const calculatedGender = appState.gender === 'Male' ? 'Female' : 'Male';
    document.getElementById('matched-target-gender').innerText = `Anon (${calculatedGender})`;
    document.getElementById('match-modal').classList.remove('hidden');
}

function closeMatchModal() {
    document.getElementById('match-modal').classList.add('hidden');
}

function activateHold() {
    alert("Requesting secure MPESA push... Pay 50 KES to activate Hold.");
    closeMatchModal();
    switchTab('chats');
    renderChats();
}

// 6. DASHBOARD TAB AND CHAT SYSTEM
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));

    document.getElementById(`tab-btn-${tab}`).classList.add('active');
    document.getElementById(`panel-${tab}`).classList.remove('hidden');
}

function renderChats() {
    const target = document.getElementById('connections-list');
    target.innerHTML = `
        <div style="padding: 0.8rem; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-green); border-radius: 8px; cursor: pointer;" onclick="openPrivateMessage()">
            <h4>Active Vibe Hold</h4>
            <p style="font-size: 0.7rem; color: var(--text-dim);">Hold Active: 7 Days Remaining</p>
        </div>
    `;
}

function openPrivateMessage() {
    const windowDiv = document.getElementById('active-chat-window');
    windowDiv.innerHTML = `
        <div style="padding: 1rem; border-bottom: 1px solid var(--border-glow); background: var(--bg-card); display: flex; justify-content: space-between;">
            <h4>Anonymous Match</h4>
            <button style="background: var(--accent-green); border: none; padding: 0.3rem 0.8rem; font-weight: 700; border-radius: 4px;" onclick="revealIdentity()">Get Sheltorani Perfume to Reveal (300 KES)</button>
        </div>
        <div style="flex-grow: 1; padding: 1rem; display: flex; flex-direction: column; justify-content: flex-end;" id="chat-messages">
            <div style="align-self: flex-start; background: var(--bg-card); padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; max-width: 80%;">
                Hey! Your thoughts in today's section matched perfectly with mine. Real vibe here.
            </div>
        </div>
        <div style="padding: 1rem; display: flex; gap: 0.5rem; background: var(--bg-card);">
            <input type="text" id="chat-send-input" placeholder="Type a message...">
            <button style="background: var(--accent-green); color: black; border: none; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 700;" onclick="sendPrivateMsg()">Send</button>
        </div>
    `;
}

function sendPrivateMsg() {
    const val = document.getElementById('chat-send-input').value;
    const violation = checkTextAnonymity(val);
    if (violation) {
        alert(violation);
        return;
    }

    const messages = document.getElementById('chat-messages');
    messages.innerHTML += `
        <div style="align-self: flex-end; background: var(--accent-green); color: black; padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; max-width: 80%;">
            ${val}
        </div>
    `;
    document.getElementById('chat-send-input').value = '';
}

function revealIdentity() {
    alert("Requesting 300 KES transaction to unlock Sheltorani Perfume & exchange contact channels.");
        }
        
