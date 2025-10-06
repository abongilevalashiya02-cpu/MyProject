import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Sun, Moon, Globe, Bell, Lock, Trash2, Sparkles } from 'lucide-react';

const SettingsModern: React.FC = () => {
  const { user, supabase } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [fontSize, setFontSize] = useState('md');
  const [contrast, setContrast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  // Simulate save
  const handleSave = () => {
    setShowSparkle(true);
    toast({ title: 'Settings saved!', description: 'Your preferences are updated.' });
    setTimeout(() => setShowSparkle(false), 1500);
  };

  // Simulate account deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      toast({ title: 'Account deleted', description: 'Your account has been deleted.' });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-bantu-orange/10 font-sans">
      {showSparkle && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="fixed top-0 left-0 w-full h-20 flex items-center justify-center z-50 pointer-events-none"
        >
          <Sparkles className="text-bantu-orange animate-bounce" size={40} />
        </motion.div>
      )}
      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="rounded-3xl shadow-2xl border border-gray-100 bg-white p-6">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl font-bold text-bantu-orange">Settings</CardTitle>
            <p className="text-gray-500 mt-2">Customize your experience, privacy, and accessibility.</p>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
            <section>
              <h2 className="font-semibold text-lg mb-2">Theme</h2>
              <div className="flex gap-2">
                <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}><Sun className="mr-2" />Light</Button>
                <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}><Moon className="mr-2" />Dark</Button>
                <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}><Globe className="mr-2" />System</Button>
              </div>
            </section>
            <section>
              <h2 className="font-semibold text-lg mb-2">Language</h2>
              <Input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Language code (e.g. en, fr, es)" />
            </section>
            <section>
              <h2 className="font-semibold text-lg mb-2">Notifications</h2>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </section>
            <section>
              <h2 className="font-semibold text-lg mb-2">Privacy</h2>
              <Switch checked={privacy} onCheckedChange={setPrivacy} />
            </section>
            <section>
              <h2 className="font-semibold text-lg mb-2">Accessibility</h2>
              <div className="flex gap-2 mb-2">
                <Button variant={fontSize === 'sm' ? 'default' : 'outline'} onClick={() => setFontSize('sm')}>Small</Button>
                <Button variant={fontSize === 'md' ? 'default' : 'outline'} onClick={() => setFontSize('md')}>Medium</Button>
                <Button variant={fontSize === 'lg' ? 'default' : 'outline'} onClick={() => setFontSize('lg')}>Large</Button>
              </div>
              <Switch checked={contrast} onCheckedChange={setContrast} /> High Contrast
            </section>
            <section className="mt-6">
              <Button className="w-full bg-bantu-orange hover:bg-bantu-orange/90 font-semibold text-lg py-3" onClick={handleSave}>
                Save Settings
              </Button>
            </section>
            <section className="mt-10">
              <h2 className="font-semibold text-lg mb-2 text-red-600">Danger Zone</h2>
              <Button type="button" variant="destructive" className="w-full" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="mr-2" />{isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </section>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsModern;
