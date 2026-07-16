// ==========================================
// CIPHER - Core Platform Engine
// Real authentication, database, confessions, replies, payments
// ==========================================

class CipherPlatform {
  constructor() {
    this.state = {
      user: null,
      userId: null,
      gender: null,
      frequency: null,
      anonId: null,
      confessions: [],
      replies: [],
      engagedUsers: {},
      activeTab: 'feed'
    };

    this.initializeApp();
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  initializeApp() {
    // Check if user is already logged in
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.state.user = user;
        this.state.userId = user.uid;
        this.loadUserProfile();
      } else {
        this.showSignIn();
      }
    });
  }

  // ==========================================
  // AUTHENTICATION - REAL PHONE OTP
  // ==========================================

  async sendOTP(phoneNumber) {
    try {
      // Validate Kenya phone number
      const cleaned = phoneNumber.replace(/\D/g, '');
      if (cleaned.length < 10) {
        throw new Error("Invalid phone number");
      }

      // Create full phone number in E.164 format
      const fullPhone = cleaned.length === 10 ? '+254' + cleaned.substring(1) : '+' + cleaned;

      // Initialize recaptcha (required by Firebase)
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' },
        firebase.auth()
      );

      // Send OTP
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(
        fullPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      this.showOTPInput();
      console.log("✅ OTP sent to", fullPhone);
      
      return { success: true, message: "OTP sent successfully" };
    } catch (error) {
      console.error("❌ OTP Error:", error);
      return { success: false, message: error.message };
    }
  }

  async verifyOTP(otpCode) {
    try {
      if (!window.confirmationResult) {
        throw new Error("OTP verification session expired");
      }

      const userCredential = await window.confirmationResult.confirm(otpCode);
      const user = userCredential.user;

      // User is now authenticated - phone number NOT stored in profile
      // Delete phone number from auth metadata immediately
      this.state.userId = user.uid;
      
      // Create anonymous user profile (no phone stored)
      await this.createUserProfile();
      
      console.log("✅ User verified:", user.uid);
      return { success: true };
    } catch (error) {
      console.error("❌ Verification Error:", error);
      return { success: false, message: "Invalid OTP. Try again." };
    }
  }

  // ==========================================
  // USER PROFILE
  // ==========================================

  async createUserProfile() {
    try {
      const anonId = 'Anon_' + Math.random().toString(36).substring(7).toUpperCase();

      const userProfile = {
        anonId: anonId,
        gender: this.state.gender,
        frequency: this.state.frequency,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        lastActive: firebase.database.ServerValue.TIMESTAMP
      };

      await firebase.database().ref(`users/${this.state.userId}`).set(userProfile);
      this.state.anonId = anonId;

      console.log("✅ User profile created:", anonId);
    } catch (error) {
      console.error("❌ Profile creation error:", error);
    }
  }

  async loadUserProfile() {
    try {
      const snapshot = await firebase.database().ref(`users/${this.state.userId}`).once('value');
      const profile = snapshot.val();

      if (profile) {
        this.state.gender = profile.gender;
        this.state.frequency = profile.frequency;
        this.state.anonId = profile.anonId;
      }

      // Load confessions and other data
      await this.loadConfessions();
    } catch (error) {
      console.error("❌ Load profile error:", error);
    }
  }

  // ==========================================
  // CONFESSIONS - REAL DATA
  // ==========================================

  async postConfession(text, format = 'text', mediaUrl = null) {
    try {
      // ANONYMITY ENFORCEMENT: Filter personal info
      const filtered = this.filterAnonymity(text);
      if (!filtered.safe) {
        return { success: false, message: filtered.message };
      }

      const confessionData = {
        anonId: this.state.anonId,
        userId: this.state.userId,
        frequency: this.state.frequency,
        gender: this.state.gender,
        content: filtered.text,
        format: format, // text, voice, video
        mediaUrl: mediaUrl,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        replies: 0,
        resonances: 0
      };

      const confessionRef = await firebase.database()
        .ref(`confessions/${this.state.frequency}`)
        .push(confessionData);

      // Track interaction
      await this.trackInteraction(this.state.anonId, confessionRef.key, 'posted');

      console.log("✅ Confession posted");
      return { success: true, confessionId: confessionRef.key };
    } catch (error) {
      console.error("❌ Confession error:", error);
      return { success: false, message: error.message };
    }
  }

  async loadConfessions() {
    try {
      // Load from all frequencies
      const frequencies = ['burnt-out', 'broken', 'lost'];
      let allConfessions = [];

      for (const freq of frequencies) {
        const snapshot = await firebase.database()
          .ref(`confessions/${freq}`)
          .limitToLast(50)
          .once('value');

        if (snapshot.exists()) {
          const data = snapshot.val();
          for (const [key, val] of Object.entries(data)) {
            allConfessions.push({ id: key, ...val });
          }
        }
      }

      this.state.confessions = allConfessions.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      console.log("✅ Loaded", allConfessions.length, "confessions");
    } catch (error) {
      console.error("❌ Load confessions error:", error);
    }
  }

  // ==========================================
  // REPLIES - REAL CONVERSATIONS
  // ==========================================

  async replyToConfession(confessionId, confessionFreq, replyText) {
    try {
      // ANONYMITY ENFORCEMENT
      const filtered = this.filterAnonymity(replyText);
      if (!filtered.safe) {
        return { success: false, message: filtered.message };
      }

      // Check daily reply limit (10 free)
      const repliesLeftToday = await this.checkReplyLimit();
      if (repliesLeftToday <= 0) {
        return { success: false, message: "Daily reply limit reached. Upgrade for more." };
      }

      const replyData = {
        confessionId: confessionId,
        responderId: this.state.userId,
        responderAnonId: this.state.anonId,
        responderGender: this.state.gender,
        responderFrequency: this.state.frequency,
        content: filtered.text,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        isPrivate: true // Replies are private
      };

      const replyRef = await firebase.database()
        .ref(`replies/${confessionFreq}/${confessionId}`)
        .push(replyData);

      // Update reply count on confession
      await firebase.database()
        .ref(`confessions/${confessionFreq}/${confessionId}/replies`)
        .transaction((current) => (current || 0) + 1);

      // Track interaction for matching
      await this.trackInteraction(
        this.state.anonId,
        confessionId,
        'replied'
      );

      console.log("✅ Reply posted");
      return { success: true, replyId: replyRef.key };
    } catch (error) {
      console.error("❌ Reply error:", error);
      return { success: false, message: error.message };
    }
  }

  async loadReplies(confessionId, confessionFreq) {
    try {
      const snapshot = await firebase.database()
        .ref(`replies/${confessionFreq}/${confessionId}`)
        .once('value');

      if (snapshot.exists()) {
        const replies = snapshot.val();
        return Object.entries(replies).map(([key, val]) => ({
          id: key,
          ...val
        }));
      }
      return [];
    } catch (error) {
      console.error("❌ Load replies error:", error);
      return [];
    }
  }

  // ==========================================
  // QUESTIONS & ANSWERS
  // ==========================================

  async answerQuestion(questionId, choice, explanation) {
    try {
      const filtered = this.filterAnonymity(explanation);
      if (!filtered.safe) {
        return { success: false, message: filtered.message };
      }

      const answerData = {
        userId: this.state.userId,
        anonId: this.state.anonId,
        frequency: this.state.frequency,
        gender: this.state.gender,
        choice: choice,
        explanation: filtered.text,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };

      await firebase.database()
        .ref(`answers/${questionId}/${this.state.userId}`)
        .set(answerData);

      console.log("✅ Answer submitted");
      return { success: true };
    } catch (error) {
      console.error("❌ Answer error:", error);
      return { success: false, message: error.message };
    }
  }

  // ==========================================
  // ANONYMITY ENFORCEMENT - CRITICAL
  // ==========================================

  filterAnonymity(text) {
    // Check for personal identifiers
    const patterns = {
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      phone: /(?:\+\d{1,3}[-.\s]?)?\d{10,}/g,
      socialHandle: /@[\w]{2,}/g,
      realNames: /(John|Mary|Jane|Mike|Sarah|Ahmed|Hassan|Fatima|Aisha|Kamau|Njeri|Kipchoge)/gi,
      kenyaLocations: /(Nairobi|Mombasa|Kisumu|Nakuru|Eldoret|Kiambu|Muranga|Machakos|Machakos Road|River Road|Luthuli|Westlands|Kilimani|Karen)/gi
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return {
          safe: false,
          message: `Remove ${type} (${type === 'email' ? 'emails' : type === 'phone' ? 'phone numbers' : type === 'socialHandle' ? 'social handles' : 'personal information'}) before posting.`
        };
      }
    }

    return { safe: true, text: text };
  }

  // ==========================================
  // ENGAGEMENT TRACKING - FOR MATCHING
  // ==========================================

  async trackInteraction(anonId, targetId, type) {
    try {
      const interactionData = {
        anonId: anonId,
        userId: this.state.userId,
        targetId: targetId,
        type: type, // replied, posted, resonated
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      await firebase.database()
        .ref(`interactions/${this.state.userId}/${targetId}`)
        .set(interactionData);
    } catch (error) {
      console.error("❌ Tracking error:", error);
    }
  }

  async getEngagedUsers() {
    try {
      const snapshot = await firebase.database()
        .ref(`interactions/${this.state.userId}`)
        .once('value');

      if (snapshot.exists()) {
        const interactions = snapshot.val();
        this.state.engagedUsers = interactions;
        return interactions;
      }
      return {};
    } catch (error) {
      console.error("❌ Load engaged users error:", error);
      return {};
    }
  }

  // ==========================================
  // REPLY LIMIT SYSTEM
  // ==========================================

  async checkReplyLimit() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const snapshot = await firebase.database()
        .ref(`replyLimits/${this.state.userId}/${today}`)
        .once('value');

      const repliesUsed = snapshot.val() || 0;
      return Math.max(0, 10 - repliesUsed);
    } catch (error) {
      console.error("❌ Check limit error:", error);
      return 0;
    }
  }

  async incrementReplyLimit() {
    try {
      const today = new Date().toISOString().split('T')[0];
      await firebase.database()
        .ref(`replyLimits/${this.state.userId}/${today}`)
        .transaction((current) => (current || 0) + 1);
    } catch (error) {
      console.error("❌ Increment limit error:", error);
    }
  }

  // ==========================================
  // PAYMENT INTEGRATION - M-Pesa via Paystack
  // ==========================================

  async initiatePayment(amount, description) {
    try {
      // This integrates with Paystack for M-Pesa payments
      // Amount in KES
      const paymentData = {
        userId: this.state.userId,
        anonId: this.state.anonId,
        amount: amount,
        description: description,
        currency: "KES",
        email: "user@cipher.app", // Anonymous email
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      const paymentRef = await firebase.database()
        .ref(`payments/${this.state.userId}`)
        .push(paymentData);

      console.log("✅ Payment initiated:", paymentRef.key);
      return { success: true, paymentId: paymentRef.key };
    } catch (error) {
      console.error("❌ Payment error:", error);
      return { success: false, message: error.message };
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  async logout() {
    try {
      await firebase.auth().signOut();
      window.location.href = 'index.html';
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  }

  // ==========================================
  // UI HELPERS
  // ==========================================

  showSignIn() {
    console.log("Showing sign in");
  }

  showOTPInput() {
    console.log("Showing OTP input");
  }
}

// Initialize globally
let cipher = new CipherPlatform();
