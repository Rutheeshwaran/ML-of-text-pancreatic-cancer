import React, { useState } from "react";
import { Search, Settings, Bell, User, Moon, Sun, Monitor, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";

interface MobileHeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

const MobileHeader = ({ onSearchChange, searchQuery }: MobileHeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const { theme, setTheme, actualTheme } = useTheme();
  const { user, logout } = useAuth();

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
    <header className="mobile-header px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl shadow-md">
            <div className="h-6 w-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-primary text-xs font-bold">PA</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground">PancreaticAI</h1>
            <p className="text-xs text-muted-foreground">Clinical Dashboard</p>
          </div>
        </div>

        {/* Center - Search (when expanded) */}
        {showSearch && (
          <div className="flex-1 mx-4">
            <Input
              placeholder="Search patients, reports..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input"
              autoFocus
            />
          </div>
        )}

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="h-10 w-10"
            title="Toggle search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            className="h-10 w-10"
            title={`Current: ${getThemeLabel()}. Click to switch.`}
          >
            {getThemeIcon()}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
                title="User menu"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role} • {user?.department}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
