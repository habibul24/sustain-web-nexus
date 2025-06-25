
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const aboutDropdown = [
  { name: 'Mission', href: '/about/mission' },
  { name: 'Vision', href: '/about/vision' },
  { name: 'Values', href: '/about/values' },
];
const servicesDropdown = [
  { name: 'ESG & Sustainability Courses', href: '/services/courses' },
  { name: 'GreenData software', href: '/services/software' },
  { name: 'ESG & Sustainability Gap Assessments', href: '/services/gap-assessments' },
  { name: 'ESG & Sustainability Materiality Assessment', href: '/services/materiality-assessment' },
  { name: 'ESG & Sustainability Reporting', href: '/services/reporting' },
  { name: 'ESG & Sustainability Advisory', href: '/services/advisory' },
  { name: 'Business Sustainability Analytics', href: '/services/analytics' },
];
const resourcesDropdown = [
  { name: 'Blogs', href: '/resources/blogs' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthContext();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about', dropdown: aboutDropdown },
    { name: 'Services', href: '/services', dropdown: servicesDropdown },
    { name: 'Resources', href: '/resources', dropdown: resourcesDropdown },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        navigate('/');
        setIsMenuOpen(false);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
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
    <header className="bg-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-white">SustainTech</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      className={`flex items-center text-sm font-medium transition-colors hover:text-green-400 focus:outline-none ${
                        isActive(item.href) ? 'text-green-400' : 'text-white'
                      }`}
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      onFocus={() => setOpenDropdown(item.name)}
                      onBlur={() => setOpenDropdown(null)}
                      tabIndex={0}
                      type="button"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {/* Dropdown menu */}
                    <div
                      className={`absolute left-0 mt-2 min-w-[200px] bg-white rounded-lg shadow-lg py-2 z-50 transition-all duration-150 ${
                        openDropdown === item.name ? 'block' : 'hidden'
                      } group-hover:block`}
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className="block px-4 py-2 text-sm text-gray-800 hover:bg-green-50 hover:text-green-700 rounded"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-green-400 ${
                      isActive(item.href) ? 'text-green-400' : 'text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-green-600 text-white text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm font-medium">
                    Hello, {getDisplayName()}!
                  </span>
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-white hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
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
              className="text-white hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <>
                      <button
                        className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-white hover:text-green-400 focus:outline-none"
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
                              className="block px-2 py-2 text-sm text-gray-200 hover:bg-green-700 hover:text-white rounded"
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
                          ? 'text-green-400 bg-gray-800 rounded-md'
                          : 'text-white hover:text-green-400'
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
                      <span className="text-white text-sm font-medium">
                        Hello, {getDisplayName()}!
                      </span>
                    </div>
                    <Button 
                      onClick={handleSignOut}
                      variant="ghost"
                      className="w-full text-white hover:bg-gray-800 justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button 
                    asChild 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
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
