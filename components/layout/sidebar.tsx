"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Radio, 
  BarChart3, 
  Settings,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Sources",
    href: "/sources",
    icon: Radio,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-[280px] glass border-r">
      <div className="flex h-full flex-col px-6 py-8">
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            FeedCentral
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">Professional RSS Aggregator</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.08] text-white shadow-sm"
                    : "text-white/60 hover:bg-white/[0.04] hover:text-white/90"
                )}
              >
                {/* Active indicator - Vercel style */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }}
                  />
                )}
                
                <Icon className={cn(
                  "h-[18px] w-[18px] transition-transform duration-200",
                  "group-hover:scale-110"
                )} />
                <span className="tracking-wide">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-white/[0.06]">
          <p className="text-[11px] text-white/40 font-medium tracking-wide">
            © 2025 BENZOO
          </p>
        </div>
      </div>
    </aside>
  );
}
