"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingCart,
    Key,
    Settings,
    Zap,
    History,
    Users,
    ShieldCheck,
    Crown,
    Sparkles,
    LogOut,
    CreditCard,
    Globe
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Sidebar({ role }: { role: string }) {
    const pathname = usePathname();

    const superMenuItems = [
        { href: "/user/dash", icon: <LayoutDashboard className="w-5 h-5" />, label: "Market Alpha" },
        { href: "/user/subscriptions", icon: <CreditCard className="w-5 h-5 text-gold" />, label: "Billing & Terminal" },
        { href: "/settings", icon: <Settings className="w-5 h-5" />, label: "Terminal Settings" },
    ];

    const vendorMenuItems = [
        { href: "/vendor/indicators", icon: <Zap className="w-5 h-5" />, label: "My Strategies" },
        { href: "/vendor/sales", icon: <ShoppingCart className="w-5 h-5" />, label: "Revenue Matrix" },
        { href: "/vendor/settings", icon: <Settings className="w-5 h-5" />, label: "Auto-Pilot" },
    ];

    const adminMenuItems = [
        { href: "/admin/dash", icon: <LayoutDashboard className="w-5 h-5 text-gold" />, label: "Command Center" },
        { href: "/admin/users", icon: <Users className="w-5 h-5" />, label: "Population Control" },
        { href: "/admin/payments", icon: <ShoppingCart className="w-5 h-5" />, label: "Fiat Gateway" },
        { href: "/admin/sales-leads", icon: <Globe className="w-5 h-5" />, label: "Alpha Leads" },
        { href: "/admin/vendor-approvals", icon: <ShieldCheck className="w-5 h-5" />, label: "Elite Approvals" },
        { href: "/admin/logs", icon: <History className="w-5 h-5" />, label: "System Matrix" },
    ];

    return (
        <aside className="w-72 bg-black border-r border-zinc-900 h-screen flex flex-col hidden lg:flex relative z-40">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-8 border-b border-zinc-900 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-700 flex items-center justify-center mr-4 shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-6 h-6 text-black" />
                </div>
                <span className="font-black text-xl tracking-tighter text-white uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                    Algo<span className="text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]">Market</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-10 px-6 flex flex-col gap-10">
                {role === "USER" && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 pl-4">Trader Ops</h3>
                        <ul className="space-y-2">
                            {superMenuItems.map((item, i) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={i}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                                ? "bg-gold/10 text-gold shadow-[inset_0_0_20px_rgba(212,175,55,0.05)] border border-gold/20"
                                                : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                                                }`}
                                        >
                                            <span className={`${isActive ? "text-gold" : "text-zinc-600 group-hover:text-gold"} transition-colors`}>{item.icon}</span>
                                            <span className={`text-sm font-bold uppercase tracking-widest ${isActive ? "text-white" : ""}`}>{item.label}</span>
                                            {isActive && <motion.div layoutId="active" className="absolute left-0 w-1 h-6 bg-gold rounded-r-full shadow-[0_0_15px_#D4AF37]" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {role === "VENDOR" && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 pl-4">Creator Hub</h3>
                        <ul className="space-y-2">
                            {vendorMenuItems.map((item, i) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={i}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                                ? "bg-gold/10 text-gold shadow-[inset_0_0_20px_rgba(212,175,55,0.05)] border border-gold/20"
                                                : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                                                }`}
                                        >
                                            <span className={`${isActive ? "text-gold" : "text-zinc-600 group-hover:text-gold"} transition-colors`}>{item.icon}</span>
                                            <span className={`text-sm font-bold uppercase tracking-widest ${isActive ? "text-white" : ""}`}>{item.label}</span>
                                            {isActive && <motion.div layoutId="active" className="absolute left-0 w-1 h-6 bg-gold rounded-r-full shadow-[0_0_15px_#D4AF37]" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {role === "PENDING_VENDOR" && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 pl-4">Verification</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/vendor/setup"
                                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${pathname === "/vendor/setup"
                                        ? "bg-gold/10 text-gold shadow-[inset_0_0_20px_rgba(212,175,55,0.05)] border border-gold/20"
                                        : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                                        }`}
                                >
                                    <Settings className={`w-5 h-5 ${pathname === "/vendor/setup" ? "text-gold" : "text-zinc-600 group-hover:text-gold"}`} />
                                    <span className={`text-sm font-bold uppercase tracking-widest ${pathname === "/vendor/setup" ? "text-white" : ""}`}>Complete Setup</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}

                {role === "ADMIN" && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 pl-4">Matrix Root</h3>
                        <ul className="space-y-2">
                            {adminMenuItems.map((item, i) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={i}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                                ? "bg-gold/10 text-gold shadow-[inset_0_0_20px_rgba(212,175,55,0.05)] border border-gold/20"
                                                : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                                                }`}
                                        >
                                            <span className={`${isActive ? "text-gold" : "text-zinc-600 group-hover:text-gold"} transition-colors`}>{item.icon}</span>
                                            <span className={`text-sm font-bold uppercase tracking-widest ${isActive ? "text-white" : ""}`}>{item.label}</span>
                                            {isActive && <motion.div layoutId="active" className="absolute left-0 w-1 h-6 bg-gold rounded-r-full shadow-[0_0_15px_#D4AF37]" />}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </nav>

            {/* Bottom Actions */}
            <div className="p-8 border-t border-zinc-900 space-y-4 bg-zinc-950/20">
                <Link
                    href="/settings"
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${pathname === "/settings"
                        ? "text-gold bg-gold/5 border border-gold/20"
                        : "text-zinc-500 hover:text-white"
                        }`}
                >
                    <Settings className={`w-5 h-5 group-hover:rotate-90 transition-transform duration-500 ${pathname === "/settings" ? "text-gold" : ""}`} />
                    <span className="text-sm font-black uppercase tracking-widest">Profile</span>
                </Link>
                <div className="flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer group">
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <LogoutButton />
                </div>
            </div>
        </aside>
    );
}

