

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/tooltip';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

const profileSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  country: z.string().min(2, { message: 'Country must be at least 2 characters' }).optional(),
  bio: z.string().max(160, { message: 'Bio must be 160 characters or less' }).optional(),
  phone: z.string().optional(),
  avatar_url: z.string().optional(),
  notifications: z.boolean().optional(),
  privacy: z.boolean().optional(),
  birthday: z.string().optional(),
  occupation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm: React.FC = () => {
  const FORM_KEY = 'profile-form';
  
  const defaultFormValues: ProfileFormValues = {
    email: '',
    name: '',
    country: '',
    bio: '',
    phone: '',
    avatar_url: '',
    notifications: true,
    privacy: false,
    birthday: '',
    occupation: '',
  };

  const { loadInitialData, clearData } = useFormPersistence(
    FORM_KEY,
    defaultFormValues,
    defaultFormValues
  );

  const { user, supabase, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user profile data and merge with auth provider metadata
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !supabase) return;
      // Get Supabase profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get metadata from auth provider (Google/LinkedIn/email)
      const meta = user.user_metadata || {};
      // Prefer Supabase profile, fallback to metadata
      const name = profile?.name || meta.full_name || meta.name || '';
      const email = user.email || meta.email || '';
      const country = profile?.country || meta.country || '';
      const bio = profile?.bio || meta.bio || '';
      const phone = profile?.phone || meta.phone || '';
      // Avatar: prefer Supabase, fallback to Google/LinkedIn/email avatar
      const avatar_url = profile?.avatar_url || meta.avatar_url || meta.picture || meta.avatar || meta.image || '';
      const notifications = profile?.notifications ?? true;
      const privacy = profile?.privacy ?? false;
      const birthday = profile?.birthday || meta.birthday || '';
      const occupation = profile?.occupation || meta.occupation || '';

      // All fields are auto-filled from provider metadata on initial signup
      setProfileData({
        email,
        name,
        country,
        bio,
        phone,
        avatar_url,
        notifications,
        privacy,
        birthday,
        occupation,
      });
      setAvatarPreview(avatar_url || null);
      form.reset({
        email,
        name,
        country,
        bio,
        phone,
        avatar_url,
        notifications,
        privacy,
        birthday,
        occupation,
      });
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user, supabase]);

  const meta = user?.user_metadata || {};
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || meta.email || '',
      name: meta.full_name || meta.name || '',
      country: meta.country || '',
      bio: meta.bio || '',
      phone: meta.phone || '',
      avatar_url: meta.avatar_url || meta.picture || meta.avatar || meta.image || '',
      notifications: true,
      privacy: false,
      birthday: meta.birthday || '',
      occupation: meta.occupation || '',
    },
  });

  // Auto-save form data whenever it changes
  const formData = form.watch();
  useFormPersistence(FORM_KEY, formData, defaultFormValues);

  // Avatar upload handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !supabase || !user) return;
    setIsUpdating(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { publicUrl } = supabase.storage.from('avatars').getPublicUrl(fileName).data;
      setAvatarPreview(publicUrl);
      form.setValue('avatar_url', publicUrl);
      toast({ title: 'Avatar updated', description: 'Your profile photo has been updated.' });
    } catch (error) {
      const err = error as { message: string };
      toast({ title: 'Avatar upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Profile update handler
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !supabase) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      toast({ title: 'Profile updated', description: 'Your profile information has been saved.' });
    } catch (error) {
      const err = error as { message?: string };
      toast({ title: 'Update failed', description: err.message || 'There was an error updating your profile', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;
    if (!password || password !== passwordConfirm) {
      toast({ title: 'Password mismatch', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setIsPasswordUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: 'Password updated', description: 'Your password has been changed.' });
      setPassword('');
      setPasswordConfirm('');
    } catch (error) {
      const err = error as { message: string };
      toast({ title: 'Password update failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  // Account deletion handler
  const handleDeleteAccount = async () => {
    if (!user || !supabase) return;
    setIsUpdating(true);
    try {
      // You may want to add a confirmation dialog here
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.signOut();
      toast({ title: 'Account deleted', description: 'Your account has been deleted.' });
    } catch (error) {
      const err = error as { message: string };
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate profile completeness
  const completeness = [profileData?.name, profileData?.country, profileData?.bio, profileData?.phone, avatarPreview, profileData?.birthday, profileData?.occupation].filter(Boolean).length / 7 * 100;
  // Dynamic greeting based on user name or fallback to email
  const greeting = profileData?.name
    ? `Welcome back, ${profileData.name.split(' ')[0]}!`
    : user?.email
      ? `Welcome, ${user.email.split('@')[0]}!`
      : 'Welcome to your profile!';

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center font-sans bg-gray-50">
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg bg-white p-4 md:p-8">
        <CardHeader className="flex flex-col items-center pb-0">
          <motion.div
            className="mb-2"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          >
            <Avatar className="h-20 w-20 border-4 border-bantu-orange shadow-lg">
              <AvatarImage src={avatarPreview || ''} />
              <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="text-2xl font-extrabold text-bantu-orange drop-shadow-lg mb-1">{greeting}</div>
          <motion.div
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
              <motion.div
                className="h-full bg-bantu-orange"
                initial={{ width: 0 }}
                animate={{ width: `${completeness}%` }}
                transition={{ duration: 1.2, type: 'spring' }}
              />
            </div>
            <span className="text-xs text-gray-500 mb-1">Profile completeness: {Math.round(completeness)}%</span>
          </motion.div>
          <Button type="button" variant="outline" className="mb-2" onClick={() => fileInputRef.current?.click()} disabled={isUpdating}>
            Change Photo
          </Button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} />
        </CardHeader>
        <CardContent className="pt-2 space-y-8 w-full">
          {/* Profile Form Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="font-semibold text-base mb-2">
                  {user?.user_metadata?.profile_section_title || 'Personal Information'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ...existing code for personal info fields... */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                <FormLabel>{user?.user_metadata?.name_label || 'Full Name'}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} autoComplete="name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                <FormLabel>{user?.user_metadata?.email_label || 'Email'}</FormLabel>
                        <FormControl>
                          <Input value={user?.email || ''} disabled autoComplete="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                <FormLabel>{user?.user_metadata?.country_label || 'Country'}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your country" {...field} autoComplete="country" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                <FormLabel>{user?.user_metadata?.phone_label || 'Phone'}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} autoComplete="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* New: Birthday field */}
                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem>
                <FormLabel>{user?.user_metadata?.birthday_label || 'Birthday'}</FormLabel>
                        <FormControl>
                          <Input type="date" value={field.value ?? ''} onChange={field.onChange} autoComplete="bday" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* New: Occupation field */}
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                <FormLabel>{user?.user_metadata?.occupation_label || 'Occupation'}</FormLabel>
                        <FormControl>
                          <Input placeholder="Your occupation" value={field.value ?? ''} onChange={field.onChange} autoComplete="organization-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                <FormLabel>{user?.user_metadata?.bio_label || 'Bio'}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about yourself" {...field} autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.section>

              <div className="border-t border-gray-200 my-4" />

              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h2 className="font-semibold text-base mb-2">
                  {user?.user_metadata?.preferences_section_title || 'Preferences'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{user?.user_metadata?.notifications_label || 'Enable Notifications'}</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="privacy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{user?.user_metadata?.privacy_label || 'Private Profile'}</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.section>

              <div className="border-t border-gray-200 my-4" />

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Button type="submit" className="w-full bg-bantu-orange hover:bg-bantu-orange/90 font-semibold text-base py-2" disabled={isUpdating}>
                  {isUpdating ? (user?.user_metadata?.updating_text || 'Updating...') : (user?.user_metadata?.update_profile_text || 'Update Profile')}
                </Button>
                {completeness < 100 && (
                  <div className="mt-2 text-xs text-bantu-orange/80 text-center">
                    {user?.user_metadata?.profile_tip || 'Tip: Complete all fields for a perfect profile!'}
                  </div>
                )}
              </motion.section>
            </form>
          </Form>

          <div className="border-t border-gray-200 my-4" />

          {/* Account Security Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full"
          >
            <h2 className="font-semibold text-base mb-2">
              {user?.user_metadata?.account_security_section_title || 'Account Security'}
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="password" placeholder={user?.user_metadata?.new_password_placeholder || 'New password'} value={password} onChange={e => setPassword(e.target.value)} disabled={isPasswordUpdating} />
                <Input type="password" placeholder={user?.user_metadata?.confirm_new_password_placeholder || 'Confirm new password'} value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} disabled={isPasswordUpdating} />
              </div>
              <Button type="submit" className="w-full" disabled={isPasswordUpdating}>
                {isPasswordUpdating ? (user?.user_metadata?.updating_text || 'Updating...') : (user?.user_metadata?.change_password_text || 'Change Password')}
              </Button>
            </form>
          </motion.section>

          <div className="border-t border-gray-200 my-4" />

          {/* Danger Zone Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full"
          >
            <h2 className="font-semibold text-base mb-2 text-red-600">
              {user?.user_metadata?.danger_zone_section_title || 'Danger Zone'}
            </h2>
            <Button type="button" variant="destructive" className="w-full" onClick={handleDeleteAccount} disabled={isUpdating}>
              {user?.user_metadata?.delete_account_text || 'Delete Account'}
            </Button>
          </motion.section>

          <div className="border-t border-gray-200 my-4" />

          {/* Share Profile / Invite Others Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-semibold text-base mb-2 text-bantu-orange">
              {user?.user_metadata?.share_profile_section_title || 'Share Your Profile / Invite Others'}
            </h2>
            <div className="text-gray-700 text-center mb-2">
              {user?.user_metadata?.share_profile_description || 'Invite friends or share your profile to grow your network!'}
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Button className="w-full bg-bantu-orange hover:bg-bantu-orange/90 font-semibold text-base py-2">
                {user?.user_metadata?.share_profile_button || 'Share Profile'}
              </Button>
              <Button variant="outline" className="w-full font-semibold text-base py-2">
                {user?.user_metadata?.invite_others_button || 'Invite Others'}
              </Button>
            </div>
          </motion.section>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
