/**
 * Authentication Service
 *
 * Real Supabase implementation for:
 * - Login
 * - Signup
 * - Sponsor/referral validation
 * - Creating a member record in public.members
 */

import { supabase } from '../lib/supabase';

/**
 * Generate a unique member/referral code.
 */
function generateMemberCode() {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `REF${randomNumber}`;
}

/**
 * Check whether the input is an email.
 */
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validate sponsor/referral code.
 *
 * Initial sponsor codes:
 * REF1001
 * REF1002
 * REF1003
 *
 * Existing members can also be sponsors
 * using their member_id.
 */
export async function validateReferralCode(code) {
  if (!code || !code.trim()) {
    return false;
  }

  const normalizedCode = code.trim().toUpperCase();

  // Initial sponsor codes
  const initialCodes = ['REF1001', 'REF1002', 'REF1003'];

  if (initialCodes.includes(normalizedCode)) {
    return true;
  }

  // Check existing members
  const { data, error } = await supabase
    .from('members')
    .select('id')
    .eq('member_id', normalizedCode)
    .maybeSingle();

  if (error) {
    console.error('Error validating referral code:', error);
    return false;
  }

  return !!data;
}

/**
 * Login user using Supabase Authentication.
 */
export async function loginUser(emailOrPhone, password) {
  if (!emailOrPhone || !password) {
    throw new Error('Email and password are required.');
  }

  const normalizedInput = emailOrPhone.trim();

  if (!isEmail(normalizedInput)) {
    throw new Error(
      'Please login using the email address registered with your account.'
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedInput.toLowerCase(),
    password
  });

  if (error) {
    console.error('Login error:', error);

    if (
      error.message?.toLowerCase().includes('invalid login credentials')
    ) {
      throw new Error('Invalid email or password.');
    }

    throw new Error(error.message || 'Login failed.');
  }

  if (!data.user) {
    throw new Error('Unable to retrieve your account.');
  }

  /**
   * Fetch member profile.
   *
   * members.id = Supabase Auth user ID.
   */
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  if (memberError) {
    console.error('Member profile fetch error:', memberError);
  }

  return {
    token: data.session?.access_token || '',

    user: {
      id: data.user.id,

      fullName:
        member?.full_name ||
        data.user.user_metadata?.full_name ||
        '',

      email:
        member?.email ||
        data.user.email ||
        '',

      phone:
        member?.phone ||
        '',

      referralCode:
        member?.member_id ||
        '',

      membershipStatus:
        member?.membership_status ||
        'active',

      membershipPlan:
        member?.membership_plan ||
        '',

      walletBalance:
        member?.wallet_balance ||
        0,

      totalEarnings:
        member?.total_earnings ||
        0,

      profileCompleted:
        member?.profile_completed ||
        false
    }
  };
}

/**
 * Register a new user.
 *
 * Flow:
 *
 * Signup form
 *     ↓
 * Supabase Auth
 *     ↓
 * public.members
 */
export async function signupUser({
  fullName,
  emailOrPhone,
  password,
  referralCode
}) {
  if (!fullName || !emailOrPhone || !password || !referralCode) {
    throw new Error('All fields are required.');
  }

  const normalizedName = fullName.trim();
  const normalizedInput = emailOrPhone.trim();
  const normalizedReferralCode = referralCode.trim().toUpperCase();

  if (!normalizedName) {
    throw new Error('Full name is required.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  /**
   * First version uses email/password authentication.
   */
  if (!isEmail(normalizedInput)) {
    throw new Error(
      'Please register using an email address. Phone/OTP registration will be added later.'
    );
  }

  const email = normalizedInput.toLowerCase();

  /**
   * Validate sponsor before creating account.
   */
  const isValidSponsor = await validateReferralCode(
    normalizedReferralCode
  );

  if (!isValidSponsor) {
    throw new Error(
      'Invalid or inactive referral/sponsor code.'
    );
  }

  /**
   * Create Supabase Auth account.
   */
  const {
    data: authData,
    error: authError
  } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name: normalizedName
      }
    }
  });

  if (authError) {
    console.error('Supabase signup error:', authError);

    if (
      authError.message
        ?.toLowerCase()
        .includes('already registered')
    ) {
      throw new Error(
        'An account with this email already exists.'
      );
    }

    throw new Error(
      authError.message || 'Signup failed.'
    );
  }

  if (!authData.user) {
    throw new Error(
      'Unable to create your account.'
    );
  }

  /**
   * IMPORTANT
   *
   * The member ID is the SAME ID as the Supabase Auth user.
   *
   * authData.user.id
   *       =
   * members.id
   */
  const userId = authData.user.id;

  /**
   * Generate the member's own referral code.
   */
  const newMemberCode = generateMemberCode();

  /**
   * Create member profile.
   */
  const {
    data: member,
    error: memberError
  } = await supabase
    .from('members')
    .insert({
      id: userId,

      full_name: normalizedName,

      email,

      phone: null,

      address: null,

      city: null,

      state: null,

      pincode: null,

      country: 'India',

      member_id: newMemberCode,

      membership_plan: null,

      membership_status: 'active',

      wallet_balance: 0,

      total_earnings: 0,

      profile_completed: false,

      sponsor: normalizedReferralCode,

      rank: 'Member'
    })
    .select()
    .single();

  /**
   * Handle member creation failure.
   */
  if (memberError) {
    console.error(
      'Member record creation error:',
      memberError
    );

    // Remove the auth session if one exists.
    await supabase.auth.signOut();

    throw new Error(
      `Account created, but member profile could not be created: ${memberError.message}`
    );
  }

  /**
   * Return user data.
   */
  return {
    token:
      authData.session?.access_token || '',

    user: {
      id: userId,

      fullName:
        member.full_name,

      email:
        member.email,

      phone:
        member.phone || '',

      referralCode:
        member.member_id,

      membershipStatus:
        member.membership_status,

      membershipPlan:
        member.membership_plan || '',

      walletBalance:
        member.wallet_balance,

      totalEarnings:
        member.total_earnings,

      profileCompleted:
        member.profile_completed
    },

    referralCode:
      member.member_id
  };
}

/**
 * Logout helper.
 */
export async function logoutUser() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    console.error(
      'Logout error:',
      error
    );

    throw new Error(
      error.message || 'Logout failed.'
    );
  }
}

/**
 * Get currently logged-in Supabase user.
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    console.error(
      'Get current user error:',
      error
    );

    return null;
  }

  return user;
}