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

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
    { icon: FileText, label: "Offertes", href: "/quotes", active: false },
    { icon: CalendarDays, label: "Planning", href: "/planning", active: false },
    { icon: Users, label: "Klanten", href: "/customers", active: false },
    { icon: Settings, label: "Instellingen", href: "/settings", active: false },
];

export function Sidebar() {
    return (
        <div className="hidden md:flex flex-col h-screen w-64 bg-slate-50 border-r border-slate-200 fixed left-0 top-0 z-40">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight text-slate-900">Sjef.</span>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                item.active
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", item.active ? "text-orange-500" : "text-slate-400")} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-slate-200" />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Sjef B.</span>
                        <span className="text-xs text-slate-500">Bouwbedrijf Sjef</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full justify-start text-slate-500 hover:text-slate-900">
                    <LogOut className="w-4 h-4 mr-2" />
                    Uitloggen
                </Button>
            </div>
        </div>
    );
}
