import React, { useState } from "react";
import { Eye, EyeOff, Shield, Stethoscope, Lock, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "@/hooks/use-toast";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    await login(email, password);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Reset Link Sent",
      description: "Password reset instructions have been sent to your email",
    });
    setForgotPassword(false);
  };

  const getThemeIcon = () => {
    if (theme === "system") return <Monitor className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getThemeLabel = () => {
    if (theme === "system") return "System theme";
    if (theme === "dark") return "Dark mode";
    return "Light mode";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Theme Toggle Button - Top Right */}
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            className="h-10 w-10 rounded-full bg-card shadow-md hover:shadow-lg transition-all duration-200"
            title={`Current: ${getThemeLabel()}. Click to switch.`}
          >
            {getThemeIcon()}
          </Button>
        </div>

        {/* Main Login Card */}
        <div className="clinical-card-elevated p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                PancreaticAI
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                Secure healthcare professional access
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={forgotPassword ? handleForgotPassword : handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your professional email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input h-12"
                required
              />
            </div>

            {!forgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input h-12 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="btn-primary w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : forgotPassword ? (
                "Send Reset Link"
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Secure Login
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Button
                type="button"
                variant="ghost"
                className="text-primary hover:text-primary-light p-0 h-auto"
                onClick={() => setForgotPassword(!forgotPassword)}
              >
                {forgotPassword ? "Back to Login" : "Forgot Password?"}
              </Button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="bg-muted/30 rounded-xl p-4 text-center space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Demo Access</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Physician:</strong> dr.smith@hospital.com / demo123
              </p>
              <p>
                <strong>Nurse:</strong> nurse.johnson@hospital.com / demo123
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {forgotPassword ? "Enter your email to reset your password" : "Access your clinical dashboard"}
            </p>
            <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground space-x-2">
              <Shield className="h-3 w-3" />
              <span>HIPAA Compliant • End-to-End Encrypted • SOC 2 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
