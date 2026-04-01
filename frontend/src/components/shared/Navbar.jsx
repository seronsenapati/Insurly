import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Shield, User, LogOut, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1 text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Insurly</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated ? (
            <>
              {user?.role === "admin" ? (
                <Link to="/admin/dashboard" className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
              ) : (
                <Link to="/worker/dashboard" className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
              )}
              
              <div className="flex items-center gap-2 pl-4 border-l">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium leading-none">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.role === "admin" ? "Administrator" : "Worker"}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/onboarding">
                <Button>Get Covered</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

