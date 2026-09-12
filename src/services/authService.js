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
 *
 * Example:
 * REF762082
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
 * Valid referral codes:
 *
 * 1. Original hardcoded sponsor codes:
 *    REF1001
 *    REF1002
 *    REF1003
 *
 * 2. Any existing member's member_id.
 *
 * Example:
 *
 * Existing member:
 * member_id = REF762082
 *
 * New user enters:
 * REF762082
 *
 * This is valid.
 */
export async function validateReferralCode(code) {
  if (!code || !code.trim()) {
    return false;
  }

  const normalizedCode = code.trim().toUpperCase();

  /**
   * Original hardcoded sponsor codes.
   */
  const initialCodes = [
    'REF1001',
    'REF1002',
    'REF1003'
  ];

  /**
   * If it is one of the original codes,
   * accept it immediately.
   */
  if (initialCodes.includes(normalizedCode)) {
    return true;
  }

  /**
   * Otherwise check whether the code belongs
   * to an existing member.
   */
  const { data, error } = await supabase
    .from('members')
    .select('id, member_id')
    .eq('member_id', normalizedCode)
    .maybeSingle();

  if (error) {
    console.error(
      'Error validating referral code:',
      error
    );

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

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: normalizedInput.toLowerCase(),
      password
    });

  if (error) {
    console.error('Login error:', error);

    if (
      error.message
        ?.toLowerCase()
        .includes('invalid login credentials')
    ) {
      throw new Error('Invalid email or password.');
    }

    throw new Error(
      error.message || 'Login failed.'
    );
  }

  if (!data.user) {
    throw new Error(
      'Unable to retrieve your account.'
    );
  }

  /**
   * Fetch member profile.
   *
   * members.id = Supabase Auth user ID.
   */
  const {
    data: member,
    error: memberError
  } = await supabase
    .from('members')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  if (memberError) {
    console.error(
      'Member profile fetch error:',
      memberError
    );
  }

  return {
    token:
      data.session?.access_token || '',

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

      /**
       * The user's own referral code.
       */
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
 * New user enters:
 *   Full Name
 *   Email
 *   Password
 *   Sponsor / Referral Code
 *
 * The referral code can be:
 *
 *   REF1001
 *   REF1002
 *   REF1003
 *
 * OR
 *
 *   Any existing member's member_id.
 *
 * Example:
 *
 * Existing member:
 *   member_id = REF762082
 *
 * New user enters:
 *   REF762082
 *
 * New member:
 *   member_id = REF835421
 *   sponsor   = REF762082
 */
export async function signupUser({
  fullName,
  emailOrPhone,
  password,
  referralCode
}) {
  /**
   * Required fields.
   */
  if (
    !fullName ||
    !emailOrPhone ||
    !password ||
    !referralCode
  ) {
    throw new Error('All fields are required.');
  }

  const normalizedName = fullName.trim();
  const normalizedInput = emailOrPhone.trim();

  /**
   * Always store referral codes in uppercase.
   */
  const normalizedReferralCode =
    referralCode.trim().toUpperCase();

  /**
   * Validate full name.
   */
  if (!normalizedName) {
    throw new Error(
      'Full name is required.'
    );
  }

  /**
   * Validate password.
   */
  if (password.length < 6) {
    throw new Error(
      'Password must be at least 6 characters.'
    );
  }

  /**
   * Signup currently uses email/password.
   */
  if (!isEmail(normalizedInput)) {
    throw new Error(
      'Please register using an email address. Phone/OTP registration will be added later.'
    );
  }

  const email =
    normalizedInput.toLowerCase();

  /**
   * ------------------------------------------------
   * STEP 1
   * Validate sponsor/referral code.
   * ------------------------------------------------
   */
  const isValidSponsor =
    await validateReferralCode(
      normalizedReferralCode
    );

  if (!isValidSponsor) {
    throw new Error(
      'Invalid referral/sponsor code. Please enter a valid existing member ID or sponsor code.'
    );
  }

  /**
   * ------------------------------------------------
   * STEP 2
   * Create Supabase Auth account.
   * ------------------------------------------------
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
    console.error(
      'Supabase signup error:',
      authError
    );

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
   * Supabase Auth user ID.
   *
   * This becomes members.id.
   */
  const userId =
    authData.user.id;

  /**
   * ------------------------------------------------
   * STEP 3
   * Generate NEW member's own referral code.
   * ------------------------------------------------
   *
   * This is different from the sponsor code.
   *
   * Example:
   *
   * Sponsor:
   * REF762082
   *
   * New member:
   * REF835421
   */
  let newMemberCode =
    generateMemberCode();

  /**
   * Check generated code uniqueness.
   */
  for (let attempt = 0; attempt < 10; attempt++) {
    const {
      data: existingMember,
      error: checkError
    } = await supabase
      .from('members')
      .select('id')
      .eq('member_id', newMemberCode)
      .maybeSingle();

    if (checkError) {
      console.error(
        'Error checking member code:',
        checkError
      );

      break;
    }

    if (!existingMember) {
      break;
    }

    newMemberCode =
      generateMemberCode();
  }

  /**
   * ------------------------------------------------
   * STEP 4
   * Create member record.
   * ------------------------------------------------
   */
  const {
    data: member,
    error: memberError
  } = await supabase
    .from('members')
    .insert({
      /**
       * Supabase Auth ID.
       */
      id: userId,

      /**
       * Basic information.
       */
      full_name: normalizedName,
      email,
      phone: null,

      /**
       * Address starts empty.
       */
      address: null,
      city: null,
      state: null,
      pincode: null,
      country: 'India',

      /**
       * NEW member's own referral code.
       */
      member_id: newMemberCode,

      /**
       * Plan starts empty.
       */
      membership_plan: null,
      plan_amount: null,
      payment_status: null,
      payment_reference: null,

      /**
       * Membership defaults.
       */
      membership_status: 'active',

      /**
       * Wallet defaults.
       */
      wallet_balance: 0,
      total_earnings: 0,

      /**
       * Profile must be completed later.
       */
      profile_completed: false,

      /**
       * ⭐ IMPORTANT ⭐
       *
       * Save the referral code entered
       * by the new user.
       *
       * Example:
       *
       * Existing member:
       * member_id = REF762082
       *
       * New member:
       * sponsor = REF762082
       */
      sponsor: normalizedReferralCode,

      /**
       * Default rank.
       */
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

    /**
     * Auth account was created but
     * member record failed.
     */
    await supabase.auth.signOut();

    throw new Error(
      `Account created, but member profile could not be created: ${memberError.message}`
    );
  }

  /**
   * ------------------------------------------------
   * STEP 5
   * Return newly created user.
   * ------------------------------------------------
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

      /**
       * NEW member's own referral code.
       */
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

    /**
     * New user's own referral code.
     */
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