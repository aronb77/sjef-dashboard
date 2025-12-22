'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { login } from './actions'

export function LoginForm() { // Removed 'default' export
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState(false)

    const verified = searchParams.get('verified') === 'true'
    const error = searchParams.get('error')

    return (
        <div className="w-full max-w-[420px]">
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welkom terug.</h2>
                <p className="text-base text-slate-500">Log in met je e-mailadres en wachtwoord.</p>

                {/* ALERTS */}
                {verified && (
                    <div className="mt-6 flex items-start gap-4 p-4 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100">
                        <span className="text-emerald-500 text-xl font-bold">✓</span>
                        <div>
                            <strong className="block font-semibold">Je e-mail is bevestigd!</strong>
                            <p className="text-sm">Log in om te starten.</p>
                        </div>
                    </div>
                )}

                {error === 'verification_failed' && (
                    <div className="mt-6 flex items-start gap-4 p-4 bg-red-50 text-red-900 rounded-lg border border-red-100">
                        <span className="text-red-500 text-xl font-bold">!</span>
                        <div>
                            <strong className="block font-semibold">Er ging iets mis.</strong>
                            <p className="text-sm">De link is ongeldig of verlopen. Probeer het opnieuw.</p>
                        </div>
                    </div>
                )}
            </div>

            <form action={login} className="flex flex-col">
                <div className="mb-6 relative">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">E-mailadres</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="jouw@email.nl"
                        className="w-full p-4 bg-[#F7F9FC] border border-transparent rounded-lg text-base text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">Wachtwoord</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            className="w-full p-4 bg-[#F7F9FC] border border-transparent rounded-lg text-base text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0 bg-transparent border-none cursor-pointer flex items-center justify-center"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <Link href="/forgot-password" className="inline-block mt-3 text-sm text-slate-500 hover:text-slate-900 transition-colors no-underline">
                        Wachtwoord vergeten?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 mb-8 p-4 text-base bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors font-medium border-none cursor-pointer"
                >
                    Inloggen
                </button>
            </form>

            <div className="text-center">
                <p className="text-[15px] text-slate-500">
                    Nog geen account? <Link href="/register" className="text-blue-600 font-medium hover:underline decoration-blue-600 underline-offset-2">Maak er hier een aan</Link>.
                </p>
            </div>
        </div>
    )
}
