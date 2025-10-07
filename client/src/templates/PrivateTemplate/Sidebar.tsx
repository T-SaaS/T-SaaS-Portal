import { Link, useLocation } from "react-router-dom";
import { Button } from "@/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  User,
  X,
  Building2,
  Shield,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  BarChart3,
  FileCheck,
  UserCheck,
  Building,
  Cog,
  ClipboardCheck,
  FileBarChart,
  Receipt,
  TestTube,
  Activity,
  Shuffle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationCategory {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavigationItem[];
}

// Navigation structure with categories
const navigationCategories: NavigationCategory[] = [
  {
    name: "Driver Files",
    icon: FolderOpen,
    items: [
      { name: "Applications", href: "/applications", icon: FileCheck },
      { name: "Drivers", href: "/drivers", icon: UserCheck },
    ],
  },
  {
    name: "Compliance",
    icon: ClipboardCheck,
    items: [
      { name: "IFTA", href: "/compliance/ifta", icon: FileBarChart },
      { name: "2290", href: "/compliance/2290", icon: Receipt },
    ],
  },
  {
    name: "Drug Testing",
    icon: TestTube,
    items: [
      {
        name: "Drug Screens",
        href: "/drug-testing/drug-screens",
        icon: Activity,
      },
      {
        name: "Random Pulls",
        href: "/drug-testing/random-pulls",
        icon: Shuffle,
      },
    ],
  },
  {
    name: "Management",
    icon: Building,
    items: [{ name: "Companies", href: "/companies", icon: Building2 }],
  },
  {
    name: "System",
    icon: Cog,
    items: [{ name: "Settings", href: "/settings", icon: Settings }],
  },
];

interface SidebarProps {
  isMobile: boolean;
  onClose: () => void;
}

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const isCategoryExpanded = (categoryName: string) => {
    return expandedCategories.includes(categoryName);
  };

  const isItemActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">TSaaS Portal</span>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {/* Standalone Dashboard */}
        <Link
          to="/"
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            location.pathname === "/"
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard
            className={`mr-3 h-5 w-5 ${
              location.pathname === "/" ? "text-blue-500" : "text-slate-400"
            }`}
          />
          Dashboard
        </Link>

        {/* Categories */}
        {navigationCategories.map((category) => {
          const isExpanded = isCategoryExpanded(category.name);
          const hasActiveItem = category.items.some((item) =>
            isItemActive(item.href)
          );

          return (
            <div key={category.name} className="space-y-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  hasActiveItem
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center">
                  <category.icon
                    className={`mr-3 h-5 w-5 ${
                      hasActiveItem ? "text-blue-500" : "text-slate-400"
                    }`}
                  />
                  {category.name}
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {category.items.map((item) => {
                    const isActive = isItemActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <item.icon
                          className={`mr-3 h-4 w-4 ${
                            isActive ? "text-blue-500" : "text-slate-400"
                          }`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Menu */}
      <div className="border-t border-slate-200 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-left">
              <User className="mr-2 h-4 w-4" />
              <span className="truncate">{user?.email || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.email || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role || "User"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
