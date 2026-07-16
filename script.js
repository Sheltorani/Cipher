// Local Database Simulator (In-Memory for static testing before Firebase binding)
const database = {
    confessions: [
        { id: 1, frequency: "Burnt Out", author: "Anonymous Male", text: "I have been running three side hustles alongside my 9-5 job in Nairobi. I haven't slept more than 4 hours in two months. I feel like I am collapsing.", replies: 12, time: "2h ago" },
        { id: 2, frequency: "Lost", author: "Anonymous Female", text: "Finished my degree last year but still nothing. I sit in my house every day wondering if things will ever change.", replies: 8, time: "4h ago" },
        { id: 3, frequency: "Broken", author: "Anonymous Male", text: "We were together 6 years. She left without a single word and blocked me everywhere. I can't find closure.", replies: 24, time: "1d ago" }
    ],
    explanations: [],
    matchedUsers: []
};

// Kenyan Names and Anonymity Filter Wordlists
const forbiddenWords = [
    // Kenyan Names
    "kamau", "mwangi", "njeri", "otieno", "onyango", "omondi", "odhiambo", "kiprop", "chepngetich", "cheruiyot", 
    "wafula", "nekesa", "nafula", "wambui", "maina", "nduta", "mugo", "kariuki", "karanja", "nyambura",
    // Common Social Media / Contact items
    "whatsapp", "instagram", "tiktok", "facebook", "snapchat", "telegram", "fb", "ig", "number", "simu",
    // Sheng & Swahili exposure triggers
    "namba", "nipigie", "mchezo", "jina", "unaitwa"
];

// App State
let userState = {
    isAuthenticated: false,
    phone: "",
    gender: "",
    frequency: ""
};

// 1. CINEMATIC INTRO CONTROLLER
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const intro = document.getElementById('cinematic-intro');
        const mainApp = document.getElementById('app-container');
        
        intro.style.opacity = '0';
        mainApp.classList.remove('hidden');
        
        setTimeout(() => {
            intro.style.display = 'none';
        }, 1500);
    }, 4500); // 4.5 seconds intro sequence
});

// Navigation Utility
function navigateTo(pageId) {
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
}

// 2. PHONE AUTHENTICATION & OTP
function sendOTP() {
    const phone = document.getElementById('phone-number').value;
    if (phone.length < 9) {
        alert("Please enter a valid Kenyan Safaricom/Airtel number.");
        return;
    }
    userState.phone = "+254" + phone;
    document.getElementById('phone-input-group').classList.add('hidden');
    document.getElementById('otp-input-group').classList.remove('hidden');
}

function verifyOTP() {
    // Standard mock verification of whatever code
    userState.isAuthenticated = true;
    navigateTo('onboarding-page');
}

// 3. ONBOARDING
function selectGender(gender) {
    userState.gender = gender;
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.classList.remove('selected');
        if(btn.innerText.includes(gender)) btn.classList.add('selected');
    });
    checkOnboardingReady();
}

function selectFrequency(freq) {
    userState.frequency = freq;
    document.querySelectorAll('.freq-option-card').forEach(card => {
        card.classList.remove('selected');
        if(card.innerText.includes(freq)) card.classList.add('selected');
    });
    checkOnboardingReady();
}

function checkOnboardingReady() {
    if (userState.gender && userState.frequency) {
        document.getElementById('btn-complete-onboarding').removeAttribute('disabled');
    }
}

function completeOnboarding() {
    document.getElementById('current-user-frequency').innerText = userState.frequency;
    navigateTo('dashboard-page');
    renderConfessions();
}

// 4. ANONYMITY SCANNER (The system filters out identifying language)
function checkAnonymityViolation(text) {
    const sanitizedInput = text.toLowerCase().replace(/[^\w\s]/gi, '');
    const words = sanitizedInput.split(/\s+/);
    
    // Check for phone number patterns
    const phonePattern = /(07\d{8}|01\d{8}|\+254\d{9})/g;
    if(phonePattern.test(text)) {
        return "System Warning: Phone numbers are strictly prohibited on Cipher to ensure your anonymity.";
    }

    // Check for specific forbidden identifier keywords
    for (let word of words) {
        if (forbiddenWords.includes(word)) {
            return `System Warning: Identifying words or platform names ("${word}") are blocked to protect your identity.`;
        }
    }
    return null;
}

// 5. CONFESSIONS LOGIC
function submitConfession() {
    const text = document.getElementById('confession-text').value;
    const warningBox = document.getElementById('warning-box');

    const violation = checkAnonymityViolation(text);
    if(violation) {
        warningBox.innerText = violation;
        warningBox.classList.remove('hidden');
        return;
    }

    warningBox.classList.add('hidden');
    
    const newConf = {
        id: database.confessions.length + 1,
        frequency: userState.frequency,
        author: `Anonymous ${userState.gender}`,
        text: text,
        replies: 0,
        time: "Just now"
    };

    database.confessions.unshift(newConf);
    document.getElementById('confession-text').value = '';
    renderConfessions();
}

function renderConfessions() {
    const filter = document.getElementById('feed-freq-filter').value;
    const feed = document.getElementById('confessions-list');
    feed.innerHTML = '';

    const filtered = database.confessions.filter(c => filter === 'All' || c.frequency === filter);

    filtered.forEach(c => {
        feed.innerHTML += `
            <div class="conf-card">
                <div class="conf-header">
                    <span class="badge ${c.frequency.toLowerCase().replace(' ', '-')}">${c.frequency}</span>
                    <span class="conf-meta">${c.author} • ${c.time}</span>
                </div>
                <p class="conf-body">${c.text}</p>
                <div class="conf-actions">
                    <button class="action-btn" onclick="openReplyModal(${c.id})">💬 Reply Directly (${c.replies})</button>
                    <button class="action-btn" onclick="triggerAutomaticMatch()">⚡ System Match Mindset</button>
                </div>
            </div>
        `;
    });
}

// 6. SENSITIVE Q&A & SYSTEM MATCHING LOGIC
function answerQuestion(choice) {
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.classList.remove('selected');
        if(btn.innerText === choice) btn.classList.add('selected');
    });
    document.getElementById('answer-explanation-box').classList.remove('hidden');
}

function submitExplanation() {
    const explanation = document.getElementById('explanation-text').value;
    const violation = checkAnonymityViolation(explanation);
    if(violation) {
        alert(violation);
        return;
    }

    database.explanations.push({
        frequency: userState.frequency,
        gender: userState.gender,
        text: explanation
    });

    document.getElementById('explanation-text').value = '';
    document.getElementById('answer-explanation-box').classList.add('hidden');
    
    // Automatically trigger system match simulator based on complimentary vectors
    setTimeout(() => {
        triggerAutomaticMatch();
    }, 1500);
}

// Automatic Mindset Matching Mechanism
function triggerAutomaticMatch() {
    const matchGender = userState.gender === 'Male' ? 'Female' : 'Male';
    document.getElementById('matched-gender').innerText = `Anon ${matchGender}`;
    document.getElementById('match-modal').classList.remove('hidden');
}

function closeMatchModal() {
    document.getElementById('match-modal').classList.add('hidden');
}

function initiateHold() {
    alert("Initiating Safaricom M-Pesa Request... Pay 50 KES to lock this Hold for 7 days.");
    closeMatchModal();
    // Simulate active chat channel initiation
    switchDashTab('chats');
    renderActiveChats();
}

// 7. HOLDS & DM SCREEN
function switchDashTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));

    // Highlight target button
    event.target.classList.add('active');
    document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
}

function renderActiveChats() {
    const list = document.getElementById('active-holds-list');
    list.innerHTML = `
        <div class="chat-item" onclick="openPrivateChat('Anonymous Girl 🌿')">
            <h4>Anonymous Girl 🌿</h4>
            <p style="font-size: 0.75rem; color: var(--text-muted);">Hold expires in 7 days</p>
        </div>
    `;
}

function openPrivateChat(name) {
    const win = document.getElementById('active-chat-window');
    win.innerHTML = `
        <div style="padding: 1.5rem; background-color: var(--bg-card); display: flex; justify-content: space-between;">
            <div>
                <h4>${name}</h4>
                <p style="font-size: 0.75rem; color: var(--accent-emerald);">Secure Hold Active</p>
            </div>
            <button class="btn-signin" style="font-size: 0.75rem;" onclick="revealIdentity()">Buy Sheltorani Perfume to Reveal (300 KES)</button>
        </div>
        <div style="flex-grow: 1; padding: 1.5rem; display: flex; flex-direction: column; justify-content: flex-end;" id="msg-history">
            <p style="text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-bottom: 2rem;">🔒 Messages are encrypted and deleted completely when Hold expires.</p>
            <div style="align-self: flex-start; background-color: var(--bg-card); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
                Hey! Your explanation on today's question was so deep. I feel the exact same way.
            </div>
        </div>
        <div style="padding: 1rem; background-color: var(--bg-card); display: flex; gap: 0.5rem;">
            <input type="text" placeholder="Type a secure reply..." style="background-color: var(--bg-deep); border-radius: 8px;" id="chat-input-box">
            <button class="btn-submit-post" style="padding: 0.5rem 1rem;" onclick="sendPrivateMsg()">Send</button>
        </div>
    `;
}

function sendPrivateMsg() {
    const text = document.getElementById('chat-input-box').value;
    const violation = checkAnonymityViolation(text);
    if(violation) {
        alert(violation);
        return;
    }
    const box = document.getElementById('msg-history');
    box.innerHTML += `
        <div style="align-self: flex-end; background-color: var(--accent-emerald); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
            ${text}
        </div>
    `;
    document.getElementById('chat-input-box').value = '';
}

function revealIdentity() {
    alert("Ordering Sheltorani Perfume for 300 KES. Upon delivery notification, your real credentials will be securely shared with each other.");
}
  
