"use client"

import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    CalendarDays,
    Users,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Offertes", href: "/dashboard/offertes" },
    { icon: CalendarDays, label: "Planning", href: "/dashboard/planning" },
    { icon: Users, label: "Klanten", href: "/dashboard/klanten" },
    { icon: Settings, label: "Configurator", href: "/dashboard/configurator" },
];

// ... imports
import { UserNav } from "@/components/dashboard/user-nav";

interface SidebarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        avatarUrl?: string | null;
        credits?: number;
    }
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex flex-col h-screen w-64 bg-slate-50 border-r border-slate-200 fixed left-0 top-0 z-40">
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-slate-900">Sjef.</span>
                    </div>
                </div>

                {user && (
                    <div className="mb-6 bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-yellow-100 p-1.5 rounded-full">
                                <span className="text-yellow-600 text-xs">🪙</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Credits</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{user.credits || 0}</span>
                    </div>
                )}

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "text-orange-500" : "text-slate-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-slate-200">
                {user ? (
                    <UserNav user={user} />
                ) : (
                    <div className="p-2 text-sm text-slate-400 text-center">Laden...</div>
                )}
            </div>
        </div>
    );
}
