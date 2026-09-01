import { supabase } from '../lib/supabase';

/**
 * Get the currently logged-in member's profile.
 */
export async function getMemberProfile(userId) {
    if (!userId) {
        throw new Error('User ID is required.');
    }

    const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Get member profile error:', error);
        throw new Error(error.message || 'Unable to load member profile.');
    }

    return data;
}


/**
 * Update the currently logged-in member's profile.
 */
export async function updateMemberProfile(userId, updates) {
    if (!userId) {
        throw new Error('User ID is required.');
    }

    const { data, error } = await supabase
        .from('members')
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Update member profile error:', error);
        throw new Error(error.message || 'Unable to update member profile.');
    }

    return data;
}