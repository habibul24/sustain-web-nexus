
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
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import MyESG from "@/pages/MyESG";
import Marketplace from "@/pages/Marketplace";
import ThirdPartyCarbonData from "@/pages/ThirdPartyCarbonData";
import MyDataRequests from "@/pages/MyDataRequests";
import FundingOpportunities from "@/pages/FundingOpportunities";
import Team from "@/pages/Team";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuthContext();
  if (loading) return <div style={{padding: 40, textAlign: 'center'}}>Loading authentication...</div>;
  if (user) {
    return (
      <>
        <AuthenticatedHeader />
        <Routes>
          <Route path="/my-esg" element={<MyESG />} />
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
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
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
