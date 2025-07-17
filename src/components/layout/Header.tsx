import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Star,
  Trophy,
  Award,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useThemeStore } from "../../store/themeStore";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import logo from "../../assets/images/gyaan_logo.png";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserById, getleaderboard } from "../../services/service";

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = user?.id || "";
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!),
  });

  const userData = users?.data || [];
  const { data: leader, isLoad } = useQuery({
    queryKey: ["getleaderboard"],
    queryFn: getleaderboard,
  });

  const leaderData = leader?.data || [];
 
  const currentUserLeaderboard = leaderData.find(
    (item: any) => item.userId === userId
  );

  const navigation = [
    { name: "Browse", href: "/browse" },
    { name: "My Learning", href: "/my-learning" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} className="w-16 h-10" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search for courses..." className="pl-10" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {isAuthenticated &&
          <Link to={"/leaderpage"}>
          <div className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-sm">
            <Trophy className="h-4 w-4" />
            <span className="font-semibold">
              {currentUserLeaderboard?.points||0} pts
            </span>
          </div>
          </Link>
          }

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
              </Button>

              {/* User Menu */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="ghost"
                    className="w-8 h-8 p-0 hover:bg-transparent"
                  >
                    <Avatar.Root className="h-9 w-9 rounded-full overflow-hidden">
                      {userData?.profile_pic ? (
                        <Avatar.Image
                          src={userData?.profile_pic}
                          alt={userData?.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-primary text-white font-semibold">
                          {userData?.name?.[0]?.toUpperCase() || "U"}
                        </Avatar.Fallback>
                      )}
                    </Avatar.Root>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[200px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                    sideOffset={5}
                  >
                    <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold">
                      {userData?.name}
                    </DropdownMenu.Label>
                    <DropdownMenu.Label className="px-2 text-xs">
                      Email : {userData?.email}
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator className="m-1 h-px bg-border" />
                    <DropdownMenu.Item asChild>
                      <Link
                        to="/profile"
                        className="relative flex items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        Profile
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        to="/dashboard"
                        className="relative flex items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        Dashboard
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="m-1 h-px bg-border" />
                    <DropdownMenu.Item
                      onSelect={logout}
                      className="relative cursor-pointer flex items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Log out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search for courses..." className="pl-10" />
            </div>
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary px-2 py-1 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
