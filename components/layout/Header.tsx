"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Menu,
  Sun,
  Moon,
  ChevronDown,
  Trophy,
  Layers,
  LogIn,
  User,
  LogOut,
  Home,
  Zap,
  Crown,
} from "lucide-react";
import MobileMenu from "./MobileMenu";
import { signOutSameOrigin } from "@/lib/authClient";
import BrandLogo, { BrandMark } from "@/components/brand/BrandLogo";

const NAV_LINKS = [
  {
    label: "Predictions",
    href: "/predictions",
    icon: <Trophy size={16} />,
    children: [
      { label: "All Predictions", href: "/predictions/all" },
      { label: "Today's Tips", href: "/predictions/today" },
      { label: "Past Results", href: "/predictions/all?tab=past" },
    ],
  },
  {
    label: "Accumulator",
    href: "/predictions/accumulator-tips",
    icon: <Layers size={16} />,
    children: [
      { label: "Accumulator of the Day", href: "/predictions/accumulator-tips" },
      { label: "Bet of the Day", href: "/predictions/bet-of-the-day" },
    ],
  },
  {
    label: "Daily Special",
    href: "/predictions/special",
    icon: <Zap size={16} />,
    children: [
      { label: "Daily Special", href: "/predictions/special" },
      { label: "1X2", href: "/predictions/special?tab=1x2" },
      { label: "BTTS", href: "/predictions/special?tab=btts" },
      { label: "Over 1.5", href: "/predictions/special?tab=over_15" },
      { label: "Over 2.5", href: "/predictions/special?tab=over_25" },
      { label: "Halftime", href: "/predictions/special?tab=halftime" },
      { label: "Goal Scorers", href: "/predictions/special?tab=goal-scorers" },
      { label: "Cards & Corners", href: "/predictions/special?tab=cards-corners" },
      { label: "Basketball", href: "/predictions/special?tab=basketball" },
      { label: "Tennis", href: "/predictions/special?tab=tennis" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 overflow-visible border-b border-white/10 bg-[#0A1433]/95 backdrop-blur-xl text-white shadow-lg shadow-black/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full overflow-visible">
          <div className="flex items-center justify-between gap-2 h-16 min-w-0 overflow-visible">
            {/* Logo — mark on phones/tablets, full wordmark on large screens */}
            <div className="flex items-center overflow-visible shrink-0 pr-1 sm:pr-2">
              <span className="hidden lg:inline-flex overflow-visible">
                <BrandLogo inverted size="md" product="prediction" />
              </span>
              <Link
                href="/"
                className="lg:hidden inline-flex items-center overflow-visible h-11"
                aria-label="LitreGre Prediction home"
              >
                <BrandMark inverted size={40} className="sm:hidden" />
                <BrandMark
                  inverted
                  size={44}
                  className="hidden sm:inline-flex lg:hidden"
                />
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === "/"
                    ? "bg-white/12 text-[#7CFF30]"
                    : "hover:bg-white/8 text-white/75"
                }`}
              >
                <Home size={15} />
                Today
              </Link>

              {NAV_LINKS.map((nav) =>
                nav.children ? (
                  <div key={nav.label} className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === nav.label ? null : nav.label)
                      }
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        pathname.startsWith(nav.href)
                          ? "bg-white/12 text-[#7CFF30]"
                          : "hover:bg-white/8 text-white/75"
                      }`}
                    >
                      {nav.icon}
                      {nav.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${
                          activeDropdown === nav.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeDropdown === nav.label && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-base-100 border border-base-300 rounded-xl shadow-xl z-50 overflow-hidden text-base-content">
                        {nav.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors ${
                              pathname === child.href
                                ? "bg-primary/10 text-primary font-medium"
                                : ""
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={nav.label}
                    href={nav.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      pathname.startsWith(nav.href)
                        ? "bg-white/12 text-[#7CFF30]"
                        : "hover:bg-white/8 text-white/75"
                    }`}
                  >
                    {nav.icon}
                    {nav.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href="/predictions/vip"
                className={`btn btn-sm gap-1.5 border-0 shadow-md font-bold rounded-full ${
                  pathname.startsWith("/predictions/vip")
                    ? "bg-[#7CFF30] text-[#0A1433]"
                    : "bg-[#22D366] hover:bg-[#7CFF30] text-[#0A1433]"
                }`}
              >
                <Crown size={15} />
                <span className="hidden sm:inline">Get VIP</span>
                <span className="sm:hidden">VIP</span>
              </Link>

              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/10"
                aria-label="Toggle theme"
              >
                {theme === "eaglelight" ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {session?.user ? (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-sm gap-2 text-white hover:bg-white/10"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#22D366] flex items-center justify-center text-[#0A1433] text-xs font-bold ring-2 ring-[#7CFF30]/50">
                      {session.user.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                      {session.user.name}
                    </span>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu menu-sm bg-base-100 border border-base-300 rounded-xl shadow-xl w-48 mt-1 z-50 text-base-content"
                  >
                    <li>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User size={15} /> My Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => signOutSameOrigin("/")}
                        className="flex items-center gap-2 text-error"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="btn btn-ghost btn-sm gap-1.5 text-white hover:bg-white/10"
                  >
                    <LogIn size={15} />
                    Login
                  </Link>
                </div>
              )}

              <button
                className="btn btn-ghost btn-sm btn-circle lg:hidden text-white hover:bg-white/10"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={NAV_LINKS}
        session={session}
      />
    </>
  );
}
