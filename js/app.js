// CIPHER APP - Complete Application
// All features: Sign In, Frequency Selection, Dashboard, Confessions, Questions, Engaged Users

class CipherApp {
  constructor() {
    this.state = {
      screen: 'signin', // signin, frequency, dashboard
      user: localStorage.getItem('cipherUser'),
      gender: localStorage.getItem('cipherGender'),
      frequency: localStorage.getItem('cipherFrequency'),
      activeTab: 'feed',
      confessions: [],
      questions: [],
      engagedUsers: [],
      replies: 0
    };

    this.initializeApp();
  }

  initializeApp() {
    // Check if user is logged in
    if (this.state.user && this.state.gender && this.state.frequency) {
      this.state.screen = 'dashboard';
      this.loadMockData();
    } else if (this.state.user && this.state.gender) {
      this.state.screen = 'frequency';
    } else if (this.state.user) {
      this.state.screen = 'signin';
    } else {
      this.state.screen = 'signin';
    }

    this.render();
  }

  loadMockData() {
    // Mock confessions data
    this.state.confessions = [
      {
        id: 1,
        anonId: 'Anon_XYZ789',
        frequency: 'burnt-out',
        gender: 'Female',
        content: 'I said yes to everything and now I\'m drowning in commitments I don\'t want',
        format: 'text',
        replies: 5,
        timestamp: new Date(Date.now() - 3600000),
        resonates: 12
      },
      {
        id: 2,
        anonId: 'Anon_ABC123',
        frequency: 'broken',
        gender: 'Male',
        content: 'Just realized I\'m more afraid of being loved than abandoned',
        format: 'text',
        replies: 8,
        timestamp: new Date(Date.now() - 7200000),
        resonates: 24
      },
      {
        id: 3,
        anonId: 'Anon_DEF456',
        frequency: 'lost',
        gender: 'Female',
        content: 'Tried to be myself today and felt like a complete fraud',
        format: 'text',
        replies: 3,
        timestamp: new Date(Date.now() - 10800000),
        resonates: 8
      }
    ];

    // Mock questions data
    this.state.questions = [
      {
        id: 1,
        question: 'When betrayed, what do you do first?',
        answers: [
          { choice: 'A', text: 'Close off and isolate', explanation: 'I need time alone to process pain' },
          { choice: 'B', text: 'Seek connection immediately', explanation: 'I need people to remind me I\'m not broken' },
          { choice: 'C', text: 'Let anger out', explanation: 'Betrayal needs consequences' }
        ],
        responses: 127
      }
    ];

    // Mock engaged users data (people they've interacted with)
    this.state.engagedUsers = [
      {
        anonId: 'Anon_XYZ789',
        frequency: 'burnt-out',
        gender: 'Female',
        interaction: 'You replied to their confession',
        timestamp: new Date(Date.now() - 3600000),
        confessionPreview: 'I said yes to everything and now I\'m drowning...'
      },
      {
        anonId: 'Anon_JKL012',
        frequency: 'broken',
        gender: 'Male',
        interaction: 'They replied to your confession',
        timestamp: new Date(Date.now() - 7200000),
        confessionPreview: 'You\'re not alone in this pain...'
      },
      {
        anonId: 'Anon_MNO345',
        frequency: 'lost',
        gender: 'Female',
        interaction: 'You both answered the same question',
        timestamp: new Date(Date.now() - 14400000),
        confessionPreview: 'Both chose option A - isolation'
      }
    ];
  }

  // SIGN IN SCREEN
  renderSignIn() {
    return `
      <div class="signin-container">
        <div class="signin-box">
          <div class="signin-logo">cipher</div>
          <h1 class="signin-title">Verify Your Identity</h1>
          <p class="signin-subtitle">Phone deleted after verification. Zero data stored.</p>
          
          <div id="otp-section">
            <input 
              type="tel" 
              id="phone-input" 
              placeholder="Enter phone number" 
              class="signin-input"
              maxlength="10"
            />
            <button class="btn-primary" onclick="app.handleSendOTP()" style="width: 100%; margin-top: 16px;">
              Send OTP
            </button>
          </div>

          <div id="verify-section" style="display: none;">
            <input 
              type="text" 
              id="otp-input" 
              placeholder="Enter OTP (4 digits)" 
              class="signin-input"
              maxlength="4"
            />
            <button class="btn-primary" onclick="app.handleVerifyOTP()" style="width: 100%; margin-top: 16px;">
              Verify & Continue
            </button>
            <button class="btn-secondary" onclick="app.handleChangeNumber()" style="width: 100%; margin-top: 12px;">
              Change Number
            </button>
          </div>
        </div>
      </div>
    `;
  }

  handleSendOTP() {
    const phone = document.getElementById('phone-input').value;
    if (!phone || phone.length < 10) {
      alert('Enter valid phone number');
      return;
    }
    
    document.getElementById('otp-section').style.display = 'none';
    document.getElementById('verify-section').style.display = 'block';
    alert('OTP sent to ' + phone + ' (Demo: Use any 4 digits)');
  }

  handleVerifyOTP() {
    const otp = document.getElementById('otp-input').value;
    if (!otp || otp.length < 4) {
      alert('Enter valid OTP');
      return;
    }

    // Create anonymous user
    const anonId = 'Anon_' + Math.random().toString(36).substring(7).toUpperCase();
    localStorage.setItem('cipherUser', anonId);
    this.state.user = anonId;
    this.state.screen = 'frequency';
    this.render();
  }

  handleChangeNumber() {
    document.getElementById('otp-section').style.display = 'block';
    document.getElementById('verify-section').style.display = 'none';
    document.getElementById('phone-input').value = '';
    document.getElementById('otp-input').value = '';
  }

  // FREQUENCY SELECTION SCREEN
  renderFrequency() {
    return `
      <div class="frequency-container">
        <div class="frequency-box">
          <div class="frequency-logo">cipher</div>
          <h1 class="frequency-title">Complete Your Profile</h1>

          <div class="frequency-section">
            <h2 class="frequency-label">Gender</h2>
            <div class="gender-options">
              <button class="option-btn" data-gender="Male" onclick="app.selectGender('Male')">Male</button>
              <button class="option-btn" data-gender="Female" onclick="app.selectGender('Female')">Female</button>
            </div>
          </div>

          <div class="frequency-section">
            <h2 class="frequency-label">What Are You Struggling With?</h2>
            <div class="frequency-options">
              <button class="freq-btn" data-freq="burnt-out" onclick="app.selectFrequency('burnt-out')">
                <div class="freq-icon">🔥</div>
                <h3>The Burnt Out</h3>
                <p>Exhausted. Overwhelmed. Drowning.</p>
              </button>
              <button class="freq-btn" data-freq="broken" onclick="app.selectFrequency('broken')">
                <div class="freq-icon">💔</div>
                <h3>The Broken</h3>
                <p>Hurt. Betrayed. Can't find healing.</p>
              </button>
              <button class="freq-btn" data-freq="lost" onclick="app.selectFrequency('lost')">
                <div class="freq-icon">🌀</div>
                <h3>The Lost</h3>
                <p>Confused. No identity. Searching.</p>
              </button>
            </div>
          </div>

          <button class="btn-primary" onclick="app.handleFrequencySubmit()" style="width: 100%; margin-top: 24px;">
            Enter Cipher
          </button>
        </div>
      </div>
    `;
  }

  selectGender(gender) {
    this.state.gender = gender;
    document.querySelectorAll('[data-gender]').forEach(btn => {
      btn.classList.remove('selected');
    });
    document.querySelector(`[data-gender="${gender}"]`).classList.add('selected');
  }

  selectFrequency(freq) {
    this.state.frequency = freq;
    document.querySelectorAll('[data-freq]').forEach(btn => {
      btn.classList.remove('selected');
    });
    document.querySelector(`[data-freq="${freq}"]`).classList.add('selected');
  }

  handleFrequencySubmit() {
    if (!this.state.gender || !this.state.frequency) {
      alert('Select both gender and frequency');
      return;
    }
    localStorage.setItem('cipherGender', this.state.gender);
    localStorage.setItem('cipherFrequency', this.state.frequency);
    this.state.screen = 'dashboard';
    this.render();
  }

  // DASHBOARD SCREENS
  renderDashboard() {
    return `
      <div class="dashboard">
        ${this.renderDashboardHeader()}
        ${this.renderDashboardTabs()}
        ${this.renderDashboardContent()}
        ${this.renderDashboardFooter()}
      </div>
    `;
  }

  renderDashboardHeader() {
    const freqDisplay = this.state.frequency === 'burnt-out' ? 'The Burnt Out' : 
                       this.state.frequency === 'broken' ? 'The Broken' : 'The Lost';
    return `
      <div class="dashboard-header">
        <div class="dashboard-logo">cipher</div>
        <div class="user-info">
          <span style="color: #6bb8a0;">●</span>
          <span>${freqDisplay}</span>
          <span style="color: #6bb8a0;">●</span>
          <span>${this.state.gender}</span>
        </div>
      </div>
    `;
  }

  renderDashboardTabs() {
    const tabs = ['feed', 'confessions', 'questions', 'engaged'];
    const labels = ['Feed', 'Confessions', 'Questions', 'Engaged'];
    
    return `
      <div class="dashboard-tabs">
        ${tabs.map((tab, i) => `
          <button 
            class="tab-button ${this.state.activeTab === tab ? 'active' : ''}"
            onclick="app.switchTab('${tab}')"
          >
            ${labels[i]}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderDashboardContent() {
    switch (this.state.activeTab) {
      case 'feed':
        return this.renderFeed();
      case 'confessions':
        return this.renderConfessions();
      case 'questions':
        return this.renderQuestions();
      case 'engaged':
        return this.renderEngaged();
      default:
        return '';
    }
  }

  renderFeed() {
    return `
      <div class="dashboard-content">
        <h2>Cipher Feed (All Frequencies)</h2>
        ${this.state.confessions.map(conf => `
          <div class="feed-post">
            <div class="feed-header">
              <span class="post-anonid">${conf.anonId}</span>
              <span class="post-meta">${conf.gender} • ${conf.frequency}</span>
            </div>
            <p class="feed-content">${conf.content}</p>
            <div class="feed-footer">
              <span>${conf.replies} replies</span>
              <button class="btn-resonate">Resonate (${conf.resonates})</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderConfessions() {
    return `
      <div class="dashboard-content">
        <h2>Share a Confession</h2>
        
        <div class="confession-composer">
          <div class="format-options">
            <button class="format-btn" onclick="app.selectFormat('text')">📝 Text</button>
            <button class="format-btn" onclick="app.selectFormat('voice')">🎤 Voice</button>
            <button class="format-btn" onclick="app.selectFormat('video')">🎥 Video</button>
          </div>
          <textarea 
            id="confession-input" 
            placeholder="What's on your mind? (Stay anonymous)"
            class="confession-input"
            rows="4"
          ></textarea>
          <button class="btn-primary" onclick="app.postConfession()" style="width: 100%;">
            Post Confession
          </button>
        </div>

        <h3 style="color: #c0c0c0; margin-top: 32px;">Recent Confessions in Your Frequency</h3>
        ${this.state.confessions
          .filter(c => c.frequency === this.state.frequency)
          .map(conf => `
            <div class="confession-item">
              <p>${conf.content}</p>
              <div class="confession-meta">
                <span>${conf.replies} replies</span>
                <span>•</span>
                <span>${this.formatTime(conf.timestamp)}</span>
              </div>
            </div>
          `).join('')}
      </div>
    `;
  }

  renderQuestions() {
    return `
      <div class="dashboard-content">
        <h2>Sensitive Questions</h2>
        ${this.state.questions.map(q => `
          <div class="question-item">
            <h3>${q.question}</h3>
            ${q.answers.map(ans => `
              <div class="answer-option">
                <h4>Choice ${ans.choice}</h4>
                <p>${ans.text}</p>
                <small>"${ans.explanation}"</small>
                <button class="btn-answer">Answer</button>
              </div>
            `).join('')}
            <div class="question-responses">${q.responses} people answered</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderEngaged() {
    return `
      <div class="dashboard-content">
        <h2>People You've Engaged With</h2>
        ${this.state.engagedUsers.length === 0 ? `
          <p style="color: #999999; text-align: center;">No interactions yet. Start engaging!</p>
        ` : `
          ${this.state.engagedUsers.map(user => `
            <div class="engaged-user">
              <div class="engaged-header">
                <div class="engaged-info">
                  <h4>${user.anonId}</h4>
                  <p>${user.gender} • ${user.frequency}</p>
                </div>
                <span class="engaged-time">${this.formatTime(user.timestamp)}</span>
              </div>
              <p class="engaged-interaction">${user.interaction}</p>
              <p class="engaged-preview">"${user.confessionPreview}"</p>
              <div class="engaged-actions">
                <button class="btn-action" onclick="app.viewInteraction('${user.anonId}')">View</button>
                <button class="btn-action" onclick="app.messageUser('${user.anonId}')">Message</button>
              </div>
            </div>
          `).join('')}
        `}
      </div>
    `;
  }

  renderDashboardFooter() {
    return `
      <div class="dashboard-footer">
        <button class="btn-logout" onclick="app.logout()">Logout</button>
      </div>
    `;
  }

  switchTab(tab) {
    this.state.activeTab = tab;
    this.render();
  }

  selectFormat(format) {
    document.querySelectorAll('.format-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
  }

  postConfession() {
    const content = document.getElementById('confession-input').value;
    if (!content.trim()) {
      alert('Write something before posting');
      return;
    }
    alert('Confession posted! (This is a demo - no backend yet)');
    document.getElementById('confession-input').value = '';
  }

  viewInteraction(anonId) {
    const user = this.state.engagedUsers.find(u => u.anonId === anonId);
    alert(`Viewing interaction with ${user.anonId}\n\n${user.confessionPreview}`);
  }

  messageUser(anonId) {
    alert(`Starting conversation with ${anonId}. This leads to the Hold system (coming next!)`);
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  logout() {
    localStorage.clear();
    window.location.href = 'index.html';
  }

  // MAIN RENDER
  render() {
    const root = document.getElementById('app-root');
    
    let content = '';
    switch (this.state.screen) {
      case 'signin':
        content = this.renderSignIn();
        break;
      case 'frequency':
        content = this.renderFrequency();
        break;
      case 'dashboard':
        content = this.renderDashboard();
        break;
    }

    root.innerHTML = content;
  }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new CipherApp();
});
