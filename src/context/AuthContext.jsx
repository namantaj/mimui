import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import * as authService from '../services/authService';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// ============================================================
// CURRENT COMPANY POLICY VERSION
// ============================================================
// Change this to "1.1", "1.2", etc. whenever you publish
// a new version of the company policy.
// Existing users will then be asked to accept the new version.
// ============================================================

const CURRENT_TERMS_VERSION = '1.0';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hasAcceptedPolicy, setHasAcceptedPolicy] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  // ============================================================
  // CHECK POLICY ACCEPTANCE
  // ============================================================
  // Checks Supabase to see whether this user has already accepted
  // the CURRENT policy version.
  // ============================================================

  const checkPolicyAcceptance = async (userId) => {
    if (!userId) {
      setHasAcceptedPolicy(false);
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('terms_acceptances')
        .select('id, terms_version, accepted_at')
        .eq('user_id', userId)
        .eq('terms_version', CURRENT_TERMS_VERSION)
        .maybeSingle();

      if (error) {
        console.error(
          'Error checking policy acceptance:',
          error
        );

        setHasAcceptedPolicy(false);
        return false;
      }

      const accepted = !!data;

      console.log(
        `Policy version ${CURRENT_TERMS_VERSION} accepted:`,
        accepted
      );

      setHasAcceptedPolicy(accepted);

      return accepted;

    } catch (error) {
      console.error(
        'Policy acceptance check failed:',
        error
      );

      setHasAcceptedPolicy(false);

      return false;
    }
  };

  // ============================================================
  // LOAD CURRENT SESSION
  // ============================================================

  useEffect(() => {
    const loadSession = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        // --------------------------------------------------------
        // NO ACTIVE SESSION
        // --------------------------------------------------------

        if (!session?.user) {
          setUser(null);
          setToken(null);
          setHasAcceptedPolicy(false);
          setHasCompletedProfile(false);
          return;
        }

        // --------------------------------------------------------
        // SAVE TOKEN
        // --------------------------------------------------------

        setToken(session.access_token);

        // --------------------------------------------------------
        // CHECK POLICY ACCEPTANCE
        // --------------------------------------------------------

        await checkPolicyAcceptance(session.user.id);

        // --------------------------------------------------------
        // LOAD COMPLETE MEMBER INFORMATION
        // --------------------------------------------------------

        const {
          data: member,
          error
        } = await supabase
          .from('members')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error(
            'Error loading member profile:',
            error
          );
        }

        // --------------------------------------------------------
        // PROFILE COMPLETION
        // --------------------------------------------------------

        const isCompleted =
          member?.profile_completed === true;

        console.log(
          'Profile completed from database:',
          isCompleted
        );

        // --------------------------------------------------------
        // FORMAT USER
        // --------------------------------------------------------

        const formattedUser = {
          id: session.user.id,

          fullName:
            member?.full_name ||
            session.user.user_metadata?.full_name ||
            '',

          email:
            member?.email ||
            session.user.email ||
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

          planAmount:
            member?.plan_amount ||
            '',

          paymentStatus:
            member?.payment_status ||
            'unpaid',

          paymentReference:
            member?.payment_reference ||
            '',

          aadhaarDocumentUrl:
            member?.aadhaar_document_url ||
            '',

          passbookDocumentUrl:
            member?.passbook_document_url ||
            '',

          walletBalance:
            member?.wallet_balance ||
            0,

          totalEarnings:
            member?.total_earnings ||
            0,

          profileCompleted:
            isCompleted
        };

        setUser(formattedUser);
        setHasCompletedProfile(isCompleted);

      } catch (error) {
        console.error(
          'Session loading error:',
          error
        );

        setUser(null);
        setToken(null);
        setHasAcceptedPolicy(false);
        setHasCompletedProfile(false);

      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================

  const login = async (emailOrPhone, password) => {
    setLoading(true);

    try {
      const response = await authService.loginUser(
        emailOrPhone,
        password
      );

      // --------------------------------------------------------
      // SAVE USER + TOKEN
      // --------------------------------------------------------

      setUser(response.user);
      setToken(response.token);

      // --------------------------------------------------------
      // CHECK POLICY FROM DATABASE
      // --------------------------------------------------------

      if (response.user?.id) {
        await checkPolicyAcceptance(
          response.user.id
        );
      } else {
        setHasAcceptedPolicy(false);
      }

      // --------------------------------------------------------
      // CHECK PROFILE COMPLETION
      // --------------------------------------------------------

      const isCompleted =
        !!response.user?.profileCompleted;

      console.log(
        'Profile completed from database:',
        response.user?.profileCompleted
      );

      setHasCompletedProfile(isCompleted);

      return response.user;

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SIGNUP
  // ============================================================

  const signup = async (formData) => {
    setLoading(true);

    try {
      const response =
        await authService.signupUser(formData);

      setUser(response.user);
      setToken(response.token);

      // --------------------------------------------------------
      // NEW USERS HAVE NOT ACCEPTED THE POLICY
      // --------------------------------------------------------

      setHasAcceptedPolicy(false);

      // --------------------------------------------------------
      // CHECK PROFILE COMPLETION
      // --------------------------------------------------------

      const isCompleted =
        !!response.user?.profileCompleted;

      console.log(
        'Profile completed from database:',
        response.user?.profileCompleted
      );

      setHasCompletedProfile(isCompleted);

      return response.user;

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ACCEPT COMPANY POLICY
  // ============================================================
  // IMPORTANT:
  // This now saves the acceptance permanently in Supabase.
  //
  // Previously this function only did:
  //
  // setHasAcceptedPolicy(true)
  //
  // which meant the acceptance disappeared after logout/login.
  // ============================================================

  const acceptPolicy = async () => {
    if (!user?.id) {
      console.error(
        'Cannot accept policy: user is not logged in.'
      );

      return false;
    }

    try {
      // --------------------------------------------------------
      // SAVE POLICY ACCEPTANCE
      // --------------------------------------------------------

      const { error } = await supabase
        .from('terms_acceptances')
        .upsert(
          {
            user_id: user.id,
            terms_version: CURRENT_TERMS_VERSION,
            accepted_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,terms_version'
          }
        );

      // --------------------------------------------------------
      // HANDLE DATABASE ERROR
      // --------------------------------------------------------

      if (error) {
        console.error(
          'Error saving policy acceptance:',
          error
        );

        return false;
      }

      // --------------------------------------------------------
      // UPDATE LOCAL STATE
      // --------------------------------------------------------

      setHasAcceptedPolicy(true);

      console.log(
        `Company Policy ${CURRENT_TERMS_VERSION} accepted successfully.`
      );

      return true;

    } catch (error) {
      console.error(
        'Policy acceptance failed:',
        error
      );

      return false;
    }
  };

  // ============================================================
  // COMPLETE PROFILE
  // ============================================================

  const completeProfile = async () => {
    if (user?.id) {
      try {
        const {
          data: member,
          error
        } = await supabase
          .from('members')
          .update({
            profile_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select('*')
          .single();

        if (error) {
          console.error(
            'Error updating profile:',
            error
          );
        }

        // ------------------------------------------------------
        // UPDATE USER WITH DATABASE DATA
        // ------------------------------------------------------

        if (member) {
          setUser(prev => ({
            ...prev,

            profileCompleted: true,

            fullName:
              member.full_name ||
              prev?.fullName ||
              '',

            email:
              member.email ||
              prev?.email ||
              '',

            phone:
              member.phone ||
              prev?.phone ||
              '',

            referralCode:
              member.member_id ||
              prev?.referralCode ||
              '',

            aadhaarDocumentUrl:
              member.aadhaar_document_url ||
              prev?.aadhaarDocumentUrl ||
              '',

            passbookDocumentUrl:
              member.passbook_document_url ||
              prev?.passbookDocumentUrl ||
              '',

            membershipPlan:
              member.membership_plan ||
              prev?.membershipPlan ||
              '',

            planAmount:
              member.plan_amount ||
              prev?.planAmount ||
              '',

            paymentStatus:
              member.payment_status ||
              prev?.paymentStatus ||
              '',

            paymentReference:
              member.payment_reference ||
              prev?.paymentReference ||
              ''
          }));

        } else {

          // ----------------------------------------------------
          // FALLBACK LOCAL UPDATE
          // ----------------------------------------------------

          setUser(prev =>
            prev
              ? {
                ...prev,
                profileCompleted: true
              }
              : null
          );
        }

      } catch (err) {
        console.error(
          'Error completing profile in AuthContext:',
          err
        );

        // ------------------------------------------------------
        // FALLBACK
        // ------------------------------------------------------

        setUser(prev =>
          prev
            ? {
              ...prev,
              profileCompleted: true
            }
            : null
        );
      }

    } else {

      // --------------------------------------------------------
      // NO USER ID FALLBACK
      // --------------------------------------------------------

      setUser(prev =>
        prev
          ? {
            ...prev,
            profileCompleted: true
          }
          : null
      );
    }

    // ----------------------------------------------------------
    // UPDATE PROFILE COMPLETION STATE
    // ----------------------------------------------------------

    setHasCompletedProfile(true);
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = async () => {
    setLoading(true);

    try {
      await authService.logoutUser();

    } catch (error) {
      console.error(
        'Logout error:',
        error
      );

    } finally {

      // --------------------------------------------------------
      // CLEAR SESSION STATE
      // --------------------------------------------------------

      setUser(null);
      setToken(null);

      // Resetting this is correct.
      // On the next login, checkPolicyAcceptance()
      // will load the REAL value from Supabase.

      setHasAcceptedPolicy(false);
      setHasCompletedProfile(false);

      setLoading(false);
    }
  };

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = {
    user,
    token,
    loading,

    hasAcceptedPolicy,
    hasCompletedProfile,

    isAuthenticated: !!user,

    login,
    signup,
    acceptPolicy,
    completeProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// USE AUTH
// ============================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}