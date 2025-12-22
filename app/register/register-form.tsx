'use client'

import Link from 'next/link'
import { Eye, EyeOff, Check } from 'lucide-react'
import { useState } from 'react'
import { signup } from '@/app/login/actions'

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        password: ''
    })
    const [touched, setTouched] = useState({
        email: false,
        password: false
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleBlur = (field: 'email' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }))
    }

    // Validation Logic
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    const isPasswordValid = formData.password.length >= 6
    const showEmailError = touched.email && !isEmailValid && formData.email.length > 0
    const showPasswordError = touched.password && !isPasswordValid && formData.password.length > 0

    return (
        <div className="w-full max-w-[460px] mx-auto">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Maak je account.</h2>
                <p className="text-base text-slate-500">Vul je gegevens in om te starten.</p>
            </div>

            <form action={signup} className="flex flex-col">

                {/* NAME */}
                <div className="mb-5 relative">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">Volledige Naam</label>
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Jan de Vries"
                            className="w-full p-3.5 bg-[#F7F9FC] border border-transparent rounded-lg text-base text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400"
                            defaultValue={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {formData.name.length > 2 && (
                            <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" size={18} />
                        )}
                    </div>
                </div>

                {/* COMPANY */}
                <div className="mb-5 relative">
                    <div className="flex justify-between items-baseline mb-2">
                        <label htmlFor="company" className="block text-sm font-semibold text-slate-900">Bedrijfsnaam</label>
                        <span className="text-xs text-slate-400 font-normal">(Optioneel)</span>
                    </div>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        placeholder="Jansen Bouw B.V."
                        className="w-full p-3.5 bg-[#F7F9FC] border border-transparent rounded-lg text-base text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400"
                        defaultValue={formData.company}
                        onChange={handleChange}
                    />
                </div>

                {/* EMAIL */}
                <div className="mb-5 relative">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">E-mailadres</label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="jouw@email.nl"
                            className={`w-full p-3.5 bg-[#F7F9FC] border border-transparent rounded-lg text-base text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 ${showEmailError ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                            defaultValue={formData.email}
                            onChange={handleChange}
                            onBlur={() => handleBlur('email')}
                            required
                        />
                        {isEmailValid && (
                            <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" size={18} />
                        )}
                    </div>
                </div>

                {/* PASSWORD */}
                <div className="mb-5 relative">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">Wachtwoord</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Minimaal 6 tekens"
                            className={`w-full p-3.5 bg-[#F7F9FC] border border-transparent rounded-lg text-base text-slate-900 transition-all focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400 ${showPasswordError ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : ''}`}
                            defaultValue={formData.password}
                            onChange={handleChange}
                            onBlur={() => handleBlur('password')}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0 bg-transparent border-none cursor-pointer flex items-center justify-center"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {showPasswordError && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-2">Kies een sterker wachtwoord (min. 6 tekens).</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 mb-4 p-4 text-base bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors font-medium border-none cursor-pointer"
                >
                    Account aanmaken
                </button>

                <p className="text-xs text-slate-400 text-center mb-8">
                    Door te starten ga je akkoord met de <a href="#" className="text-slate-500 underline">voorwaarden</a>.
                </p>
            </form>

            <div className="text-center">
                <p className="text-[15px] text-slate-500">
                    Heb je al een account? <Link href="/login" className="text-blue-600 font-medium hover:underline decoration-blue-600 underline-offset-2">Log hier in</Link>.
                </p>
            </div>
        </div>
    )
}
