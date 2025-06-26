import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

// Add this type above the dropdown definitions

type DropdownItem = {
  name: string;
  href: string;
  external?: boolean;
};

const aboutDropdown: DropdownItem[] = [
  { name: 'Vision', href: '/about#vision' },
  { name: 'Mission', href: '/about#mission' },
  { name: 'Values', href: '/about#values' },
];
const servicesDropdown: DropdownItem[] = [
  { name: 'ESG & Sustainability Courses', href: 'https://www.edu.greendatabiz.com/', external: true },
  { name: 'GreenData Software', href: 'https://greendatabiz.com/', external: true },
  { name: 'ESG & Sustainability: Gap & Materiality Assessment and Reporting', href: '/services/assessment-reporting' },
  { name: 'ESG & Sustainability: Advisory and Analytics', href: '/services/advisory-analytics' },
];
const resourcesDropdown: DropdownItem[] = [
  { name: 'Blogs', href: '/resources/blogs' },
  { name: 'Client Onboarding Questionnaire', href: '/consultation-form' },
];

const Header = () => {
  const { user } = useAuthContext();
  if (user) return null; // Hide this header if logged in
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuthContext();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about', dropdown: aboutDropdown },
    { name: 'Services', href: '/services', dropdown: servicesDropdown },
    { name: 'Resources', href: '/resources', dropdown: resourcesDropdown },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error signing out",
          description: error.message || "Failed to sign out. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account.",
        });
        navigate('/');
        setIsMenuOpen(false);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (profile?.company_name) {
      return profile.company_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center -ml-16">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/0944e168-7b64-403d-8c39-5976b7a5e5f7.png" 
                alt="GreenData Logo" 
                className="h-16 w-auto mr-8"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10 items-center ml-auto">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      className={`flex items-center text-lg font-semibold transition-colors hover:text-green-600 focus:outline-none ${
                        isActive(item.href) ? 'text-green-600' : 'text-gray-900'
                      }`}
                      tabIndex={0}
                      type="button"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {/* Dropdown menu */}
                    <div className="absolute left-0 mt-2 min-w-[280px] bg-white rounded-lg shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                      {item.dropdown.map((sub) => (
                        sub.external ? (
                          <a
                            key={sub.name}
                            href={sub.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-3 text-lg text-gray-900 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 mx-2 rounded-md"
                          >
                            {sub.name}
                          </a>
                        ) : (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            className="block px-4 py-3 text-lg text-gray-900 hover:bg-green-50 hover:text-green-600 transition-colors duration-150 mx-2 rounded-md"
                          >
                            {sub.name}
                          </Link>
                        )
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`text-lg font-semibold transition-colors hover:text-green-600 ${
                      isActive(item.href) ? 'text-green-600' : 'text-gray-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4 ml-12">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-green-600 text-white text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700 text-sm font-medium">
                    Hello, {getDisplayName()}!
                  </span>
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-gray-700 hover:bg-green-50 hover:text-green-600"
                  disabled={isSigningOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </>
            ) : (
              <Button 
                asChild 
                className="btn-orange-gradient"
              >
                <Link to="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:bg-green-50 hover:text-green-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <>
                      <button
                        className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 focus:outline-none"
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        type="button"
                      >
                        {item.name}
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                      {openDropdown === item.name && (
                        <div className="pl-4 py-1">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              className="block px-2 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 rounded"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-green-600 bg-green-50 rounded-md'
                          : 'text-gray-700 hover:text-green-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 pb-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback className="bg-green-600 text-white text-sm">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700 text-sm font-medium">
                        Hello, {getDisplayName()}!
                      </span>
                    </div>
                    <Button 
                      onClick={handleSignOut}
                      variant="ghost"
                      className="w-full text-gray-700 hover:bg-green-50 hover:text-green-600 justify-start"
                      disabled={isSigningOut}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      asChild 
                      className="w-full btn-orange-gradient"
                    >
                      <Link to="/sign-up">Sign Up</Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline"
                      className="w-full"
                    >
                      <Link to="/sign-in">Sign In</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
