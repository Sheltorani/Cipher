// ==========================================
// CIPHER - Main App UI & Logic
// Integrates with cipher-core.js for real backend
// ==========================================

class CipherApp {
  constructor() {
    this.screen = 'signin';
    this.init();
  }

  init() {
    // Check auth state
    firebase.auth().onAuthStateChanged((user) => {
      if (user && cipher.state.frequency) {
        this.screen = 'dashboard';
        this.renderDashboard();
      } else if (user) {
        this.screen = 'frequency';
        this.renderFrequency();
      } else {
        this.screen = 'signin';
        this.renderSignIn();
      }
    });
  }

  // ==========================================
  // SIGN IN SCREEN
  // ==========================================

  renderSignIn() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="signin-page">
        <div class="signin-box">
          <div class="signin-logo">cipher</div>
          <h1>Verify Your Phone</h1>
          <p>Real Safaricom OTP. Phone deleted after verification. Zero data storage.</p>
          
          <div id="phone-section">
            <input 
              type="tel" 
              id="phone-input" 
              placeholder="Enter Safaricom number (07XXXXXXXX)"
              class="signin-input"
              maxlength="12"
            />
            <button class="btn-primary" onclick="app.handleSendOTP()" style="width:100%;">
              Send OTP
            </button>
          </div>

          <div id="otp-section" style="display:none;">
            <input 
              type="text" 
              id="otp-input" 
              placeholder="Enter 6-digit OTP"
              class="signin-input"
              maxlength="6"
            />
            <button class="btn-primary" onclick="app.handleVerifyOTP()" style="width:100%;">
              Verify
            </button>
            <button class="btn-secondary" onclick="app.resetSignIn()" style="width:100%;">
              Change Number
            </button>
          </div>

          <div id="recaptcha-container"></div>
        </div>
      </div>
    `;
  }

  async handleSendOTP() {
    const phone = document.getElementById('phone-input').value;
    if (!phone) {
      alert('Enter your phone number');
      return;
    }

    const result = await cipher.sendOTP(phone);
    if (result.success) {
      document.getElementById('phone-section').style.display = 'none';
      document.getElementById('otp-section').style.display = 'block';
    } else {
      alert('Error: ' + result.message);
    }
  }

  async handleVerifyOTP() {
    const otp = document.getElementById('otp-input').value;
    if (!otp || otp.length < 6) {
      alert('Enter valid OTP');
      return;
    }

    const result = await cipher.verifyOTP(otp);
    if (result.success) {
      this.screen = 'frequency';
      this.renderFrequency();
    } else {
      alert('Error: ' + result.message);
    }
  }

  resetSignIn() {
    document.getElementById('phone-input').value = '';
    document.getElementById('otp-input').value = '';
    document.getElementById('phone-section').style.display = 'block';
    document.getElementById('otp-section').style.display = 'none';
  }

  // ==========================================
  // FREQUENCY SELECTION
  // ==========================================

  renderFrequency() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="frequency-page">
        <div class="frequency-box">
          <div class="frequency-logo">cipher</div>
          <h1>Choose Your Frequency</h1>
          <p>This is permanent. You can't switch. Choose where you truly belong.</p>

          <div class="section">
            <h3>Gender</h3>
            <div class="gender-options">
              <button class="option-btn" onclick="app.selectGender('Male')">Male</button>
              <button class="option-btn" onclick="app.selectGender('Female')">Female</button>
            </div>
          </div>

          <div class="section">
            <h3>Your Struggle</h3>
            <div class="frequency-options">
              <button class="freq-btn" onclick="app.selectFrequency('burnt-out')">
                <div style="font-size:24px;">🔥</div>
                <strong>The Burnt Out</strong>
                <p>Exhausted. Overwhelmed. Drowning.</p>
              </button>
              <button class="freq-btn" onclick="app.selectFrequency('broken')">
                <div style="font-size:24px;">💔</div>
                <strong>The Broken</strong>
                <p>Hurt. Betrayed. Can't find healing.</p>
              </button>
              <button class="freq-btn" onclick="app.selectFrequency('lost')">
                <div style="font-size:24px;">🌀</div>
                <strong>The Lost</strong>
                <p>Confused. No identity. Searching.</p>
              </button>
            </div>
          </div>

          <button class="btn-primary" onclick="app.confirmFrequency()" style="width:100%;margin-top:24px;">
            Enter Cipher
          </button>
        </div>
      </div>
    `;
  }

  selectGender(gender) {
    cipher.state.gender = gender;
    document.querySelectorAll('.gender-options .option-btn').forEach((btn, i) => {
      btn.classList.remove('selected');
      if ((i === 0 && gender === 'Male') || (i === 1 && gender === 'Female')) {
        btn.classList.add('selected');
      }
    });
  }

  selectFrequency(freq) {
    cipher.state.frequency = freq;
    document.querySelectorAll('.frequency-options .freq-btn').forEach((btn, i) => {
      btn.classList.remove('selected');
    });
    event.target.closest('.freq-btn').classList.add('selected');
  }

  async confirmFrequency() {
    if (!cipher.state.gender || !cipher.state.frequency) {
      alert('Select both gender and frequency');
      return;
    }

    await cipher.createUserProfile();
    this.screen = 'dashboard';
    this.renderDashboard();
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  renderDashboard() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="dashboard">
        <div class="dashboard-header">
          <div class="dashboard-logo">cipher</div>
          <div class="user-badge">
            ${cipher.state.anonId} • ${cipher.state.gender}
          </div>
        </div>

        <div class="dashboard-tabs">
          <button class="tab-btn active" onclick="app.switchTab('feed')">Feed</button>
          <button class="tab-btn" onclick="app.switchTab('confessions')">Confessions</button>
          <button class="tab-btn" onclick="app.switchTab('questions')">Questions</button>
          <button class="tab-btn" onclick="app.switchTab('engaged')">Engaged</button>
        </div>

        <div class="dashboard-content" id="dashboard-content">
          Loading...
        </div>

        <div class="dashboard-footer">
          <button class="btn-logout" onclick="cipher.logout()">Logout</button>
        </div>
      </div>
    `;

    this.switchTab('feed');
  }

  switchTab(tab) {
    const content = document.getElementById('dashboard-content');
    
    switch(tab) {
      case 'feed':
        this.renderFeed(content);
        break;
      case 'confessions':
        this.renderConfessions(content);
        break;
      case 'questions':
        this.renderQuestions(content);
        break;
      case 'engaged':
        this.renderEngaged(content);
        break;
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
  }

  renderFeed(content) {
    content.innerHTML = `
      <h2>Cipher Feed (All Frequencies)</h2>
      <div id="feed-list"></div>
    `;

    cipher.loadConfessions().then(() => {
      const feedList = document.getElementById('feed-list');
      feedList.innerHTML = cipher.state.confessions.map(conf => `
        <div class="post">
          <div class="post-header">
            <span class="anon-id">${conf.anonId}</span>
            <span class="meta">${conf.gender} • ${conf.frequency}</span>
          </div>
          <p>${conf.content}</p>
          <div class="post-footer">
            <span>${conf.replies || 0} replies</span>
            <button class="btn-resonate" onclick="app.resonate('${conf.id}')">Resonate</button>
          </div>
        </div>
      `).join('');
    });
  }

  renderConfessions(content) {
    content.innerHTML = `
      <h2>Post a Confession</h2>
      <div class="composer">
        <div class="format-options">
          <button class="format-btn selected" onclick="app.selectFormat('text')">📝 Text</button>
          <button class="format-btn" onclick="app.selectFormat('voice')">🎤 Voice</button>
          <button class="format-btn" onclick="app.selectFormat('video')">🎥 Video</button>
        </div>
        <textarea id="confession-text" placeholder="Share anonymously..." rows="4" class="textarea"></textarea>
        <button class="btn-primary" onclick="app.postConfession()" style="width:100%;">Post</button>
      </div>

      <h3 style="margin-top:32px;">Your Confessions</h3>
      <div id="confessions-list"></div>
    `;

    cipher.loadConfessions().then(() => {
      const list = document.getElementById('confessions-list');
      const userConfessions = cipher.state.confessions.filter(c => 
        c.frequency === cipher.state.frequency && c.userId === cipher.state.userId
      );
      list.innerHTML = userConfessions.length ? userConfessions.map(conf => `
        <div class="confession">
          <p>${conf.content}</p>
          <div class="confession-meta">
            <span>${conf.replies || 0} replies</span>
            <button onclick="app.viewReplies('${conf.id}', '${conf.frequency}')">View</button>
          </div>
        </div>
      `).join('') : '<p style="color:#999;">No confessions yet</p>';
    });
  }

  renderQuestions(content) {
    content.innerHTML = `
      <h2>Sensitive Questions</h2>
      <div id="questions-list">
        <div class="question">
          <h3>When betrayed, what do you do first?</h3>
          <div class="answers">
            <button class="answer-opt" onclick="app.answerQuestion('q1', 'A', 'I need time alone to process')">
              A: Close off and isolate
            </button>
            <button class="answer-opt" onclick="app.answerQuestion('q1', 'B', 'I need people around me')">
              B: Seek connection immediately
            </button>
            <button class="answer-opt" onclick="app.answerQuestion('q1', 'C', 'Betrayal needs consequences')">
              C: Let anger out
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async renderEngaged(content) {
    content.innerHTML = '<h2>People You\'ve Engaged With</h2><div id="engaged-list"></div>';
    
    await cipher.getEngagedUsers();
    const list = document.getElementById('engaged-list');
    
    if (Object.keys(cipher.state.engagedUsers).length === 0) {
      list.innerHTML = '<p style="color:#999;">No interactions yet. Start engaging!</p>';
    } else {
      list.innerHTML = Object.entries(cipher.state.engagedUsers).map(([id, interaction]) => `
        <div class="engaged-card">
          <p><strong>${interaction.responderAnonId || 'Someone'}</strong></p>
          <p style="font-size:12px;color:#999;">${interaction.type} • ${new Date(interaction.timestamp).toLocaleDateString()}</p>
          <button onclick="app.messageUser('${id}')" class="btn-message">Message</button>
        </div>
      `).join('');
    }
  }

  async postConfession() {
    const text = document.getElementById('confession-text').value;
    if (!text) {
      alert('Write something first');
      return;
    }

    const result = await cipher.postConfession(text);
    if (result.success) {
      alert('✅ Confession posted anonymously!');
      document.getElementById('confession-text').value = '';
      this.renderConfessions(document.getElementById('dashboard-content'));
    } else {
      alert('❌ Error: ' + result.message);
    }
  }

  async answerQuestion(qId, choice, explanation) {
    const result = await cipher.answerQuestion(qId, choice, explanation);
    if (result.success) {
      alert('✅ Answer submitted!');
    } else {
      alert('❌ Error: ' + result.message);
    }
  }

  resonate(confessionId) {
    alert('✅ You resonated with this confession');
  }

  viewReplies(confessionId, frequency) {
    alert('Viewing replies for: ' + confessionId);
  }

  messageUser(userId) {
    alert('Opening chat with: ' + userId);
  }

  selectFormat(format) {
    document.querySelectorAll('.format-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
  }
}

// Initialize when document is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new CipherApp();
});
