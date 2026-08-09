/**
 * Authentication Service
 * Simulates backend API requests for login, signup, and referral code validation.
 * 
 * TODO: Replace the mock implementation in these functions with real axios/fetch API calls later.
 */

// Memory database for simulation (persisted in RAM during page session)
const mockUsers = [
  {
    fullName: 'Alexander Wright',
    email: 'alexander.wright@mlmenterprise.com',
    phone: '(555) 123-4567',
    password: 'password123',
    referralCode: 'REF1001'
  }
];

const validReferralCodes = new Set(['REF1001', 'REF1002', 'REF1003']);

/**
 * Helper to simulate network latency
 * @param {number} ms 
 */
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates logging in a user
 * @param {string} emailOrPhone 
 * @param {string} password 
 * @returns {Promise<{token: string, user: object}>}
 */
export async function loginUser(emailOrPhone, _password) {
  await delay(); // Simulate network lag

  const normalizedInput = (emailOrPhone || '').trim() || 'alexander.wright@mlmenterprise.com';
  
  // Find user by email or phone
  let user = mockUsers.find(
    u => u.email.toLowerCase() === normalizedInput.toLowerCase() || u.phone === normalizedInput
  );

  // If not found in registered database, dynamically generate user details so "everyone can login"
  if (!user) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let email = '';
    let phone = '';
    let fullName = 'Alexander Wright';

    if (emailRegex.test(normalizedInput)) {
      email = normalizedInput.toLowerCase();
      const prefix = email.split('@')[0];
      if (prefix) {
        fullName = prefix
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
    } else {
      phone = normalizedInput;
    }

    user = {
      fullName,
      email: email || 'guest@mlmenterprise.com',
      phone: phone || '(555) 123-4567',
      referralCode: 'REF' + Math.floor(1000 + Math.random() * 9000)
    };
  }

  // Return a mock token and the user's details
  return {
    token: `mock-jwt-token-${Date.now()}`,
    user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode
    }
  };
}

/**
 * Simulates checking if a referral/sponsor code is valid
 * @param {string} code 
 * @returns {Promise<boolean>}
 */
export async function validateReferralCode(code) {
  await delay(400); // Simulate network lag
  
  if (!code) {
    return false;
  }
  
  return validReferralCodes.has(code.trim().toUpperCase());
}

/**
 * Simulates registering a new user
 * @param {object} formData
 * @param {string} formData.fullName
 * @param {string} formData.emailOrPhone
 * @param {string} formData.password
 * @param {string} formData.referralCode
 * @returns {Promise<{token: string, user: object}>}
 */
export async function signupUser({ fullName, emailOrPhone, password, referralCode }) {
  await delay(); // Simulate network lag

  if (!fullName || !emailOrPhone || !password || !referralCode) {
    throw new Error('All fields are required.');
  }

  // Basic email pattern matching (if input looks like an email)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let email = '';
  let phone = '';

  if (emailRegex.test(emailOrPhone)) {
    email = emailOrPhone.trim().toLowerCase();
  } else {
    phone = emailOrPhone.trim();
  }

  // Check if user already exists
  const userExists = mockUsers.some(
    u => (email && u.email.toLowerCase() === email) || (phone && u.phone === phone)
  );

  if (userExists) {
    throw new Error('Account with this email/phone already exists.');
  }

  // Check sponsor code validity
  const isValidSponsor = await validateReferralCode(referralCode);
  if (!isValidSponsor) {
    throw new Error('Invalid or inactive referral/sponsor code.');
  }

  // Generate a new unique mock referral code for the new user
  const newReferralCode = 'REF' + Math.floor(1000 + Math.random() * 9000);
  validReferralCodes.add(newReferralCode);

  const newUser = {
    fullName: fullName.trim(),
    email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
    phone: phone || '(555) 000-0000',
    password,
    referralCode: newReferralCode
  };

  mockUsers.push(newUser);

  return {
    token: `mock-jwt-token-${Date.now()}`,
    user: {
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      referralCode: newUser.referralCode
    }
  };
}
