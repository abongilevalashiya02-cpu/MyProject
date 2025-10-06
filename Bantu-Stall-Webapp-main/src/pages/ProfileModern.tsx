import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Copy, 
  QrCode, 
  Edit, 
  ExternalLink, 
  Sparkles,
  User,
  MapPin,
  Briefcase,
  Heart,
  Share2,
  Camera,
  Star,
  Award,
  TrendingUp,
  Loader2,
  Plus,
  X,
  Users,
  Calendar
} from 'lucide-react';

const interestsList = [
  'Travel', 'Culture', 'Adventure', 'Food', 'Tech', 'Art', 'Music', 'Nature', 
  'History', 'Business', 'Sports', 'Photography', 'Reading', 'Gaming', 'Fitness'
];

const ProfileModern: React.FC = () => {
  const { loading } = useRequireAuth();
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    occupation: '',
    interests: [] as string[],
    avatar_url: '',
  });

  const [stats] = useState({
    profileViews: 124,
    connections: 89,
    posts: 15,
    achievements: 3
  });

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      setProfile({
        name: meta.full_name || meta.name || '',
        bio: meta.bio || '',
        location: meta.location || '',
        occupation: meta.occupation || '',
        interests: meta.interests || [],
        avatar_url: meta.avatar_url || meta.picture || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile({ data: profile });
      
      if (result && !result.error) {
        setShowConfetti(true);
        toast({ 
          title: 'Profile updated!', 
          description: 'Your changes are now live and visible to others.' 
        });
        setIsEditing(false);
        setTimeout(() => setShowConfetti(false), 2000);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast({ 
        title: 'Error updating profile', 
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/user/${user?.id}`;
    navigator.clipboard.writeText(link);
    toast({ 
      title: 'Profile link copied!', 
      description: 'Share this link with others to showcase your profile.' 
    });
  };

  const addInterest = (interest: string) => {
    if (!profile.interests.includes(interest) && profile.interests.length < 10) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const calculateCompletion = () => {
    const fields = [
      profile.name,
      profile.bio,
      profile.location,
      profile.occupation,
      profile.avatar_url,
      profile.interests.length > 0 ? 'interests' : ''
    ];
    const completed = fields.filter(field => field && field.length > 0).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-bantu-orange mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your modern profile...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Profile Section */}
          <motion.div 
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
              <CardContent className="p-0">
                <div className="relative h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24 ring-4 ring-white/30 bg-white">
                          <AvatarImage src={profile.avatar_url} alt={profile.name} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex-grow text-white">
                        <h1 className="text-3xl font-bold mb-2">
                          {profile.name || 'Your Name'}
                        </h1>
                        <p className="text-white/90 mb-2">{user?.email}</p>
                        {profile.location && (
                          <div className="flex items-center gap-2 text-white/80">
                            <MapPin className="h-4 w-4" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={handleCopyLink}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button 
                          onClick={() => setIsEditing(!isEditing)}
                          variant="secondary"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="text-center p-4 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-purple-600">{stats.profileViews}</div>
              <div className="text-sm text-gray-600">Profile Views</div>
            </Card>
            <Card className="text-center p-4 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-blue-600">{stats.connections}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </Card>
            <Card className="text-center p-4 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-cyan-600">{stats.posts}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </Card>
            <Card className="text-center p-4 hover:shadow-lg transition-shadow">
              <div className="text-2xl font-bold text-green-600">{stats.achievements}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* About Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        About Me
                      </span>
                      {!isEditing && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Bio</label>
                          <Textarea
                            value={profile.bio}
                            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell the world about yourself..."
                            className="resize-none"
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Location</label>
                            <Input
                              value={profile.location}
                              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="City, Country"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Occupation</label>
                            <Input
                              value={profile.occupation}
                              onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                              placeholder="Your profession"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          {profile.bio || 'No bio added yet. Click edit to add information about yourself.'}
                        </p>
                        {(profile.location || profile.occupation) && (
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            {profile.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{profile.location}</span>
                              </div>
                            )}
                            {profile.occupation && (
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                <span>{profile.occupation}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interests Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Interests & Hobbies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest) => (
                          <Badge 
                            key={interest} 
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200"
                          >
                            {interest}
                            {isEditing && (
                              <button
                                onClick={() => removeInterest(interest)}
                                className="ml-2 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                        {profile.interests.length === 0 && !isEditing && (
                          <p className="text-gray-500 text-sm">No interests added yet.</p>
                        )}
                      </div>
                      
                      {isEditing && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Add interests:</p>
                          <div className="flex flex-wrap gap-2">
                            {interestsList
                              .filter(interest => !profile.interests.includes(interest))
                              .map((interest) => (
                                <Button
                                  key={interest}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addInterest(interest)}
                                  className="text-xs"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  {interest}
                                </Button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Profile Completion */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Profile Strength
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completion</span>
                        <span className="text-sm text-gray-500">{calculateCompletion()}%</span>
                      </div>
                      <Progress value={calculateCompletion()} className="h-2" />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${profile.name ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={profile.name ? 'text-green-700' : 'text-gray-500'}>Name</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${profile.bio ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={profile.bio ? 'text-green-700' : 'text-gray-500'}>Bio</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${profile.avatar_url ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={profile.avatar_url ? 'text-green-700' : 'text-gray-500'}>Profile Photo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${profile.interests.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className={profile.interests.length > 0 ? 'text-green-700' : 'text-gray-500'}>Interests</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Profile Link
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview Public Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-50">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Profile Complete</p>
                          <p className="text-xs text-gray-600">Completed your profile</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Social Butterfly</p>
                          <p className="text-xs text-gray-600">Connected with 50+ people</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                        <Calendar className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Active Member</p>
                          <p className="text-xs text-gray-600">Member for 6+ months</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <motion.div 
              className="fixed bottom-8 right-8 z-40"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfileModern;
