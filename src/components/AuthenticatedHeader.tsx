import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const navItems = [
  { name: "My Company's ESG", href: '/my-esg' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Third Party Carbon Data', href: '/third-party-carbon-data' },
  { name: 'My Data Requests', href: '/my-data-requests' },
  { name: 'Funding Opportunities', href: '/funding-opportunities' },
];

const AuthenticatedHeader = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthContext();

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.company_name) return profile.company_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getTeamLabel = () => {
    const name = getDisplayName();
    return `${name.split(' ')[0]}'s Team`;
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast({ title: 'Error signing out', description: error.message || 'Failed to sign out.', variant: 'destructive' });
      } else {
        toast({ title: 'Signed out', description: 'You have been signed out.' });
        navigate('/');
      }
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SustainTech</span>
            </Link>
          </div>
          <nav className="flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-green-400 ${location.pathname === item.href ? 'text-green-400' : 'text-white'}`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/team"
              className={`text-sm font-medium transition-colors hover:text-green-400 ${location.pathname === '/team' ? 'text-green-400' : 'text-white'}`}
            >
              {getTeamLabel()}
            </Link>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="text-white hover:bg-gray-800 hover:text-white"
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Button>
            <div className="flex items-center space-x-3 ml-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-green-600 text-white text-sm">
                  {getDisplayName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-white text-sm font-medium">
                {getDisplayName()}
              </span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
