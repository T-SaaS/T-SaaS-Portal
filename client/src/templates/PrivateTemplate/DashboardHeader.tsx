import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/atoms/Badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { useRouteTitle } from "@/routes";

export function DashboardHeader() {
  const { user } = useAuth();
  const location = useLocation();
  const currentTitle = useRouteTitle(location.pathname);

  // Get user initials from email
  const getUserInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <header className="bg-card border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Mobile hamburger button - only visible on mobile */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // This will be handled by the parent component
              const event = new CustomEvent("toggleSidebar");
              window.dispatchEvent(event);
            }}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-1 md:flex-none w-full justify-end">
          {/* Search bar - responsive width */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers, files, or records..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-max-content">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User profile - hidden on small screens */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.email ? getUserInitials(user.email) : "U"}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role || "User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
