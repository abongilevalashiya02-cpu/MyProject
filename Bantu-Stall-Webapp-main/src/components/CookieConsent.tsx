
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, X, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookie-consent');
    if (!consentGiven) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem('cookie-preferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    saveCookiePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    saveCookiePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const rejected = {
      necessary: true, // Always required
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(rejected);
    saveCookiePreferences(rejected);
    setShowBanner(false);
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', 'true');
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    
    // Apply preferences - you can extend this to manage actual cookies
    if (!prefs.analytics) {
      // Disable analytics cookies
      document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    // Trigger any analytics setup based on preferences
    if (prefs.analytics && typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
        <Card className="max-w-6xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Cookie className="h-6 w-6 text-bantu-orange flex-shrink-0 mt-1" />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-2">We value your privacy</h3>
                <p className="text-gray-600 mb-4">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies in accordance with our Privacy Policy. 
                  This helps us comply with POPIA and GDPR requirements.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleAcceptAll} className="bg-bantu-orange hover:bg-bantu-orange/90">
                    Accept All
                  </Button>
                  <Button onClick={handleRejectAll} variant="outline">
                    Reject All
                  </Button>
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Cookie Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Cookie Preferences</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Necessary Cookies</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Essential for the website to function properly. Cannot be disabled.
                              </p>
                            </div>
                            <Switch checked={preferences.necessary} disabled />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Analytics Cookies</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Help us understand how visitors interact with our website.
                              </p>
                            </div>
                            <Switch 
                              checked={preferences.analytics}
                              onCheckedChange={(checked) => updatePreference('analytics', checked)}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Marketing Cookies</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Used to track visitors across websites for advertising purposes.
                              </p>
                            </div>
                            <Switch 
                              checked={preferences.marketing}
                              onCheckedChange={(checked) => updatePreference('marketing', checked)}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium">Functional Cookies</Label>
                              <p className="text-sm text-gray-600 mt-1">
                                Enable enhanced functionality and personalization.
                              </p>
                            </div>
                            <Switch 
                              checked={preferences.functional}
                              onCheckedChange={(checked) => updatePreference('functional', checked)}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setShowSettings(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAcceptSelected} className="bg-bantu-orange hover:bg-bantu-orange/90">
                            Save Preferences
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CookieConsent;
