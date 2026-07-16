// ==========================================
// CIPHER - Utility Functions
// ==========================================

// Storage helper
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage error:", e);
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("Storage error:", e);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Storage error:", e);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error("Storage error:", e);
    }
  }
};

// Anonymous ID generator
function generateAnonymousID() {
  return 'Anon_' + Math.random().toString(36).substring(7).toUpperCase();
}

// Time formatter
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Validate phone number
function validatePhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 12;
}

// Validate OTP
function validateOTP(otp) {
  return otp.length === 4 && /^\d+$/.test(otp);
}

// Anonymity filter - remove personal info
function filterConfession(text) {
  // Block real names (simple check)
  // Block phone numbers
  // Block email addresses
  // Block social media handles
  
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
  const phoneRegex = /(?:\d{3}[-.]?){2}\d{4}|\d{10}/g;
  const socialRegex = /@[\w]{3,}/g;

  if (emailRegex.test(text) || phoneRegex.test(text) || socialRegex.test(text)) {
    return {
      valid: false,
      message: "Remove personal details (emails, phones, handles) and try again"
    };
  }

  return { valid: true };
}

// Generate mock confessions
function generateMockConfessions() {
  return [
    {
      id: 1,
      anonId: 'Anon_XYZ789',
      frequency: 'burnt-out',
      gender: 'Female',
      content: 'I said yes to everything and now I\'m drowning in commitments I don\'t even want',
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
}

// Frequency display names
const FrequencyNames = {
  'burnt-out': 'The Burnt Out',
  'broken': 'The Broken',
  'lost': 'The Lost'
};

function getFrequencyName(key) {
  return FrequencyNames[key] || key;
}

// Log for debugging
function log(message, data = null) {
  const timestamp = new Date().toLocaleTimeString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
}

// Error handler
function handleError(error, context = '') {
  log(`Error in ${context}:`, error);
  console.error(error);
}
