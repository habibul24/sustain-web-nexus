import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import AuthenticatedHeader from './components/AuthenticatedHeader';
import Footer from './components/Footer';
import Index from './pages/Index';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import MyESG from './pages/MyESG';
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
import Scope3aWaste from './pages/esg/Scope3aWaste';
import Scope3aPaper from './pages/esg/Scope3aPaper';
import Scope3aWater from './pages/esg/Scope3aWater';
import Scope3aWaterLocation from './pages/esg/Scope3aWaterLocation';
import Scope3Result from './pages/esg/Scope3Result';
import EmployeeProfile from './pages/esg/EmployeeProfile';
import Governance from './pages/esg/Governance';
import Strategy from './pages/esg/Strategy';
import RiskAssessment from './pages/esg/RiskAssessment';
import MetricsTargets from './pages/esg/MetricsTargets';
import Profile from './pages/esg/Profile';
import Onboarding from './pages/Onboarding';
import Team from './pages/Team';
import NotFound from './pages/NotFound';
import FundingOpportunities from './pages/FundingOpportunities';
import Marketplace from './pages/Marketplace';
import ConsultationForm from './pages/ConsultationForm';
import ThirdPartyCarbonData from './pages/ThirdPartyCarbonData';
import MyDataRequests from './pages/MyDataRequests';
import GreenDataSoftware from './pages/GreenDataSoftware';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {user ? <AuthenticatedHeader /> : <Header />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/team" element={<Team />} />
              <Route path="/funding-opportunities" element={<FundingOpportunities />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/consultation" element={<ConsultationForm />} />
              <Route path="/third-party-carbon-data" element={<ThirdPartyCarbonData />} />
              <Route path="/my-data-requests" element={<MyDataRequests />} />
              <Route path="/greendata-software" element={<GreenDataSoftware />} />
              
              <Route path="/my-esg" element={<MyESG />}>
                <Route index element={<Introduction />} />
                <Route path="profile" element={<Profile />} />
                <Route path="environmental/scope-1/stationary-combustion" element={<StationaryCombustion />} />
                <Route path="environmental/scope-1/process-emissions" element={<ProcessEmissions />} />
                <Route path="environmental/scope-1/mobile-combustion" element={<MobileCombustion />} />
                <Route path="environmental/scope-1/refrigerant-emissions" element={<RefrigerantEmissions />} />
                <Route path="environmental/scope-1-result" element={<Scope1Result />} />
                <Route path="environmental/scope-2" element={<Scope2 />} />
                <Route path="environmental/scope-2/electricity/:locationId" element={<Scope2aElectricityLocation />} />
                <Route path="environmental/scope-2/electricity" element={<Scope2aElectricity />} />
                <Route path="environmental/scope-2/other-energy" element={<Scope2bOtherEnergy />} />
                <Route path="environmental/scope-2-result" element={<Scope2Result />} />
                <Route path="environmental/scope-3/waste" element={<Scope3aWaste />} />
                <Route path="environmental/scope-3/waste/paper" element={<Scope3aPaper />} />
                <Route path="environmental/scope-3/waste/water/:locationId" element={<Scope3aWaterLocation />} />
                <Route path="environmental/scope-3/waste/water" element={<Scope3aWater />} />
                <Route path="environmental/scope-3-result" element={<Scope3Result />} />
                <Route path="social/employee-profile" element={<EmployeeProfile />} />
                <Route path="governance" element={<Governance />} />
                <Route path="governance/strategy" element={<Strategy />} />
                <Route path="governance/risk-assessment" element={<RiskAssessment />} />
                <Route path="governance/metrics-targets" element={<MetricsTargets />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
