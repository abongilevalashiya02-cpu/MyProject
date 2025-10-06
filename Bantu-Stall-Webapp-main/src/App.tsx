
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { AppStateProvider } from "./contexts/AppStateContext";
import { NotificationManager } from "./components/notifications/NotificationManager";
import { SecurityHeaders } from './components/security/SecurityHeaders';

import { useDeviceFingerprinting } from './hooks/useDeviceFingerprinting';
import { useSecurityAlerts } from './hooks/useSecurityAlerts';
import { useSecurityMonitoring } from './hooks/useSecurityMonitoring';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { ScrollToTop } from "./components/routing/ScrollToTop";

import LandingPageGuard from "./components/routing/LandingPageGuard";
import About from "./pages/About";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import EventReadinessCaseStudy from "./pages/EventReadinessCaseStudy";
import Countries from "./pages/Countries";
import Musika from "./pages/Musika";
import Mafunzo from "./pages/Mafunzo";
import Abantu from "./pages/Abantu";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CentralizedDashboard from "./pages/CentralizedDashboard";
import RetreatDetailPage from "./pages/RetreatDetailPage";
import ProfileModern from "./pages/ProfileModern";
import SettingsModern from "./pages/SettingsModern";

import Events from "./pages/Events";
import HRGuide from "./pages/HRGuide";
import Indaba from "./pages/Indaba";
import ArticlePage from "./pages/ArticlePage";
import CultureTokens from "./pages/CultureTokens";
import TourismTrends from "./pages/TourismTrends";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import SouthAfricaExperience from "./pages/SouthAfricaExperience";
import AdventurePackage from "./pages/AdventurePackage";
import SpeakerPackage from "./pages/SpeakerPackage";
import TEDxPackage from "./pages/TEDxPackage";
import AfricanTourism from "./pages/AfricanTourism";
import AfricanTravelCourse from "./pages/AfricanTravelCourse";
import SmokeThunderExcursion from "./pages/SmokeThunderExcursion";
import LuandaRetreat from "./pages/LuandaRetreat";
import ServiceProviderRequirements from "./pages/ServiceProviderRequirements";
import ListYourProperty from "./pages/ListYourProperty";
import ServiceProviderApplication from "./pages/ServiceProviderApplication";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import Admin from "./pages/Admin";
import TermsOfService from "./pages/TermsOfService";
import G20Showcase from "./pages/G20Showcase";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Compliance from "./pages/Compliance";
import CookieConsent from "./components/CookieConsent";
import QuotationPage from "./pages/QuotationPage";
import EnterpriseQuotationPage from "./pages/EnterpriseQuotationPage";
import QuotationFormPage from "./pages/QuotationFormPage";
import PublicQuotationPage from "./pages/PublicQuotationPage";
import VenueDetail from "./pages/VenueDetail";
import SmartRedirect from "./components/routing/SmartRedirect";
import AuthCallback from "./components/auth/AuthCallback";

import ResetPassword from "./pages/ResetPassword";

import ClientManagement from "./components/quotation/ClientManagement";
import ProductManagement from "./components/quotation/ProductManagement";
import ReportsPage from "./components/quotation/ReportsPage";
import QuotationSettings from "./components/quotation/QuotationSettings";
import FundingPage from "./pages/FundingPage";


const queryClient = new QueryClient();

function App() {
  // Initialize security monitoring hooks
  useDeviceFingerprinting();
  useSecurityAlerts();
  useSecurityMonitoring();
  useSessionTimeout();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppStateProvider>
            <AuthProvider>
              <SecurityHeaders />
              
              <NotificationManager />
              <Toaster />
              <CookieConsent />
              
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                {/* ==== PUBLIC ROUTES ==== */}
                <Route path="/" element={<LandingPageGuard />} />
                <Route path="/about" element={<About />} />
                <Route path="/about-bantu-stall" element={<About />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/case-study/luxury-health-resort" element={<CaseStudyDetail />} />
                <Route path="/case-study/event-readiness" element={<EventReadinessCaseStudy />} />
                <Route path="/countries" element={<Countries />} />
                <Route path="/events" element={<Events />} />
                <Route path="/hr-guide" element={<HRGuide />} />
                <Route path="/culture-tokens" element={<CultureTokens />} />
                <Route path="/tourism-trends" element={<TourismTrends />} />
                <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
                <Route path="/g20-showcase" element={<G20Showcase />} />
                <Route path="/funding" element={<FundingPage />} />
                
                {/* ==== EXPERIENCE PACKAGES (Public) ==== */}
                <Route path="/south-africa" element={<SouthAfricaExperience />} />
                <Route path="/adventure-package" element={<AdventurePackage />} />
                <Route path="/speaker-package" element={<SpeakerPackage />} />
                <Route path="/tedx-package" element={<TEDxPackage />} />
                <Route path="/african-travel-course" element={<AfricanTravelCourse />} />
                <Route path="/smoke-thunder" element={<SmokeThunderExcursion />} />
                <Route path="/luanda-retreat" element={<LuandaRetreat />} />
                
                {/* ==== AUTHENTICATION ROUTES ==== */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* ==== MAIN DASHBOARD HUB ==== */}
                <Route path="/dashboard" element={<ProtectedRoute><CentralizedDashboard /></ProtectedRoute>} />
                
                {/* ==== LEGACY DASHBOARD ROUTES (Redirect to main dashboard) ==== */}
                <Route path="/dashboard/unified" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard/traveler" element={<Navigate to="/dashboard?section=explorer" replace />} />
                <Route path="/dashboard/:userType" element={<Navigate to="/dashboard" replace />} />
                <Route path="/retreat-dashboard" element={<Navigate to="/dashboard?section=retreat-planning" replace />} />
                <Route path="/mafunzo/dashboard" element={<Navigate to="/dashboard?section=courses" replace />} />
                <Route path="/abantu/dashboard" element={<Navigate to="/dashboard?section=members" replace />} />
                <Route path="/service-provider/dashboard" element={<Navigate to="/dashboard?section=provider-dashboard" replace />} />
                
                 {/* ==== QUOTATION SYSTEM ==== */}
                <Route path="/quotations" element={<PublicQuotationPage />} />
                <Route path="/quotations/new" element={
                  <ProtectedRoute>
                    <QuotationFormPage />
                  </ProtectedRoute>
                } />
                <Route path="/quotations/dashboard" element={<Navigate to="/dashboard?section=quotations" replace />} />
                <Route path="/quotations/list" element={
                  <ProtectedRoute>
                    <EnterpriseQuotationPage />
                  </ProtectedRoute>
                } />
                <Route path="/quotations/legacy" element={
                  <ProtectedRoute>
                    <QuotationPage />
                  </ProtectedRoute>
                } />
                <Route path="/quotations/:id" element={
                  <ProtectedRoute>
                    <QuotationFormPage />
                  </ProtectedRoute>
                } />
                <Route path="/clients" element={<ProtectedRoute><ClientManagement /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><ProductManagement /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/quotation-settings" element={<ProtectedRoute><QuotationSettings /></ProtectedRoute>} />
                
                {/* ==== CONTENT & LEARNING ==== */}
                <Route path="/musika" element={<Musika />} />
                <Route path="/mafunzo" element={<Navigate to="/dashboard?section=courses" replace />} />
                <Route path="/mafunzo/african-tourism/module2" element={<ProtectedRoute><AfricanTourism /></ProtectedRoute>} />
                <Route path="/abantu" element={<Abantu />} />
                <Route path="/indaba" element={<Indaba />} />
                <Route path="/the-vault" element={<Navigate to="/indaba" replace />} />
                <Route path="/vault" element={<Navigate to="/indaba" replace />} />
                <Route path="/vault/:id" element={<Navigate to="/indaba/:id" replace />} />
                <Route path="/indaba/:id" element={<ArticlePage />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                
                {/* ==== PROPERTY & SERVICE PROVIDERS ==== */}
                <Route path="/list-property" element={<ListYourProperty />} />
                <Route path="/venue/:venueId" element={<VenueDetail />} />
                <Route path="/service-providers" element={<ServiceProviderRequirements />} />
                <Route path="/service-provider/apply" element={<ProtectedRoute><ServiceProviderApplication /></ProtectedRoute>} />
                
                {/* ==== USER MANAGEMENT ==== */}
                <Route path="/profile" element={<ProtectedRoute><ProfileModern /></ProtectedRoute>} />
                <Route path="/settings-modern" element={<ProtectedRoute><SettingsModern /></ProtectedRoute>} />
                
                
                {/* ==== RETREATS & EXPERIENCES ==== */}
                <Route path="/retreat/:id" element={<ProtectedRoute><RetreatDetailPage /></ProtectedRoute>} />
                
                {/* ==== ADMIN ROUTES ==== */}
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
                
                {/* ==== LEGAL & SUPPORT ==== */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/compliance" element={<Compliance />} />
                
                {/* ==== 404 HANDLER ==== */}
                <Route path="*" element={<NotFound />} />
                
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </AppStateProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
