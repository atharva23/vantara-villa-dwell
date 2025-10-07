import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Destinations", path: "/destinations" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Vantara Living
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/book">Book a Stay</Link>
            </Button>
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
            {user ? (
              <Button variant="ghost" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                Book a Stay
              </Link>
            </Button>
            {isAdmin && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
            {user ? (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button asChild variant="ghost" className="w-full">
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
