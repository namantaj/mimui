import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import * as authService from '../services/authService';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hasAcceptedPolicy, setHasAcceptedPolicy] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  // ============================================================
  // LOAD CURRENT SESSION
  // ============================================================

  useEffect(() => {
    const loadSession = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setUser(null);
          setToken(null);
          setHasCompletedProfile(false);
          return;
        }

        setToken(session.access_token);

        // Get complete member information
        const { data: member, error } = await supabase
          .from('members')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading member profile:', error);
        }

        const isCompleted = member?.profile_completed === true;
        console.log('Profile completed from database:', isCompleted);

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

          phone: member?.phone || '',

          referralCode: member?.member_id || '',

          membershipStatus:
            member?.membership_status || 'active',

          membershipPlan:
            member?.membership_plan || '',

          planAmount:
            member?.plan_amount || '',

          paymentStatus:
            member?.payment_status || 'unpaid',

          paymentReference:
            member?.payment_reference || '',

          aadhaarDocumentUrl:
            member?.aadhaar_document_url || '',

          passbookDocumentUrl:
            member?.passbook_document_url || '',

          walletBalance:
            member?.wallet_balance || 0,

          totalEarnings:
            member?.total_earnings || 0,

          profileCompleted: isCompleted
        };

        setUser(formattedUser);
        setHasCompletedProfile(isCompleted);

      } catch (error) {
        console.error('Session loading error:', error);

        setUser(null);
        setToken(null);
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

      setUser(response.user);
      setToken(response.token);

      setHasAcceptedPolicy(false);

      const isCompleted = !!response.user?.profileCompleted;
      console.log('Profile completed from database:', response.user?.profileCompleted);
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
      const response = await authService.signupUser(formData);

      setUser(response.user);
      setToken(response.token);

      setHasAcceptedPolicy(false);

      const isCompleted = !!response.user?.profileCompleted;
      console.log('Profile completed from database:', response.user?.profileCompleted);
      setHasCompletedProfile(isCompleted);

      return response.user;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ACCEPT COMPANY POLICY
  // ============================================================

  const acceptPolicy = () => {
    setHasAcceptedPolicy(true);
  };

  // ============================================================
  // COMPLETE PROFILE
  // ============================================================

  const completeProfile = async () => {
    if (user?.id) {
      try {
        const { data: member } = await supabase
          .from('members')
          .update({
            profile_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select('*')
          .single();

        if (member) {
          setUser(prev => ({
            ...prev,
            profileCompleted: true,
            fullName: member.full_name || prev?.fullName || '',
            email: member.email || prev?.email || '',
            phone: member.phone || prev?.phone || '',
            referralCode: member.member_id || prev?.referralCode || '',
            aadhaarDocumentUrl: member.aadhaar_document_url || prev?.aadhaarDocumentUrl || '',
            passbookDocumentUrl: member.passbook_document_url || prev?.passbookDocumentUrl || '',
            membershipPlan: member.membership_plan || prev?.membershipPlan || '',
            planAmount: member.plan_amount || prev?.planAmount || '',
            paymentStatus: member.payment_status || prev?.paymentStatus || '',
            paymentReference: member.payment_reference || prev?.paymentReference || ''
          }));
        } else {
          setUser(prev => prev ? { ...prev, profileCompleted: true } : null);
        }
      } catch (err) {
        console.error('Error completing profile in AuthContext:', err);
        setUser(prev => prev ? { ...prev, profileCompleted: true } : null);
      }
    } else {
      setUser(prev => prev ? { ...prev, profileCompleted: true } : null);
    }

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
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
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