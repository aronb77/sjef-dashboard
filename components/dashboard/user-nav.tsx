"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "@/app/login/actions"
import { ChevronsUpDown, LogOut, Settings, CreditCard, User } from "lucide-react"
import Link from "next/link"

interface UserNavProps {
    user: {
        name?: string | null
        email?: string | null
        avatarUrl?: string | null
    }
}

export function UserNav({ user }: UserNavProps) {
    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-14 w-full justify-start px-2 hover:bg-slate-100 data-[state=open]:bg-slate-100">
                    <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-9 w-9 border border-slate-200">
                            <AvatarImage src={user.avatarUrl || ""} alt={user.name || ""} />
                            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start space-y-0.5 flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-none truncate w-full text-left text-slate-900">
                                {user.name || "Mijn Account"}
                            </p>
                            <p className="text-xs leading-none text-slate-500 truncate w-full text-left font-normal">
                                {user.email}
                            </p>
                        </div>
                        <ChevronsUpDown className="ml-auto h-4 w-4 text-slate-400 shrink-0" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/account" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Account Instellingen</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/facturatie" className="cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Facturatie</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    onClick={() => signOut()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Uitloggen</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
