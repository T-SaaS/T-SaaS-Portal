import { Outlet, Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { NavigationItem } from "@/types";

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Applications", href: "/applications", icon: FileText },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function PrivateTemplate() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900">
              Driver Qualification
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
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
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-blue-500" : "text-slate-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="border-t border-slate-200 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate">Admin User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Admin User
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-slate-900">
              {navigation.find((item) => item.href === location.pathname)
                ?.name || "Dashboard"}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
