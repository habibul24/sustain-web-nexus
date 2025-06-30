import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import MyESG from "@/pages/MyESG";
import Marketplace from "@/pages/Marketplace";
import ThirdPartyCarbonData from "@/pages/ThirdPartyCarbonData";
import MyDataRequests from "@/pages/MyDataRequests";
import FundingOpportunities from "@/pages/FundingOpportunities";
import Team from "@/pages/Team";
import ConsultationForm from "./pages/ConsultationForm";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ComingSoon from './components/ComingSoon';
import Introduction from './pages/esg/Introduction';
import StationaryCombustion from './pages/esg/StationaryCombustion';
import ProcessEmissions from './pages/esg/ProcessEmissions';
import MobileCombustion from './pages/esg/MobileCombustion';
import RefrigerantEmissions from './pages/esg/RefrigerantEmissions';
import Scope1Result from './pages/esg/Scope1Result';
import Scope2 from './pages/esg/Scope2';
import Scope2aElectricity from './pages/esg/Scope2aElectricity';
import Scope2aElectricityLocation from './pages/esg/Scope2aElectricityLocation';
import Scope2bOtherEnergy from './pages/esg/Scope2bOtherEnergy';
import Scope2Result from './pages/esg/Scope2Result';
import Governance from './pages/esg/Governance';
import Strategy from './pages/esg/Strategy';
import RiskAssessment from './pages/esg/RiskAssessment';
import MetricsTargets from './pages/esg/MetricsTargets';
import EmployeeProfile from './pages/esg/EmployeeProfile';

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, profile, loading } = useAuthContext();
  if (loading) return null;
  
  if (user) {
    // Check if user needs to complete onboarding
    if (profile && !profile.onboarding_completed) {
      return (
        <>
          <AuthenticatedHeader />
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </>
      );
    }
    
    return (
      <>
        <AuthenticatedHeader />
        <Routes>
          <Route path="/my-esg" element={<MyESG />}>
            <Route index element={<Introduction />} />
            <Route path="environmental">
              <Route index element={<ComingSoon label="Environmental" />} />
              <Route path="scope-1">
                <Route index element={<ComingSoon label="Scope 1" />} />
                <Route path="stationary-combustion" element={<StationaryCombustion />} />
                <Route path="process-emissions" element={<ProcessEmissions />} />
                <Route path="mobile-combustion" element={<MobileCombustion />} />
                <Route path="refrigerant-emissions" element={<RefrigerantEmissions />} />
                <Route path="coming-soon" element={<ComingSoon label="Scope 1.e" />} />
              </Route>
              <Route path="scope-1-result" element={<Scope1Result />} />
              <Route path="scope-2">
                <Route index element={<Scope2 />} />
                <Route path="electricity" element={<Scope2aElectricity />} />
                <Route path="electricity/:locationId" element={<Scope2aElectricityLocation />} />
                <Route path="other-energy" element={<Scope2bOtherEnergy />} />
              </Route>
              <Route path="scope-2-result" element={<Scope2Result />} />
              <Route path="scope-3">
                <Route index element={<ComingSoon label="Scope 3" />} />
                <Route path="purchased-goods" element={<ComingSoon label="Scope 3.a" />} />
                <Route path="capital-goods" element={<ComingSoon label="Scope 3.b" />} />
                <Route path="fuel-energy" element={<ComingSoon label="Scope 3.c" />} />
                <Route path="transportation" element={<ComingSoon label="Scope 3.d" />} />
                <Route path="waste" element={<ComingSoon label="Scope 3.e" />} />
                <Route path="business-travel" element={<ComingSoon label="Scope 3.f" />} />
                <Route path="employee-commuting" element={<ComingSoon label="Scope 3.g" />} />
              </Route>
              <Route path="scope-3-result" element={<ComingSoon label="Scope 3 Result" />} />
            </Route>
            <Route path="social">
              <Route path="employee-profile" element={<EmployeeProfile />} />
            </Route>
            <Route path="governance">
              <Route index element={<Governance />} />
              <Route path="strategy" element={<Strategy />} />
              <Route path="risk-assessment" element={<RiskAssessment />} />
              <Route path="metrics-targets" element={<MetricsTargets />} />
            </Route>
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/third-party-carbon-data" element={<ThirdPartyCarbonData />} />
          <Route path="/my-data-requests" element={<MyDataRequests />} />
          <Route path="/funding-opportunities" element={<FundingOpportunities />} />
          <Route path="/team" element={<Team />} />
          <Route path="*" element={<Navigate to="/my-esg" replace />} />
        </Routes>
      </>
    );
  }
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/consultation-form" element={<ConsultationForm />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
