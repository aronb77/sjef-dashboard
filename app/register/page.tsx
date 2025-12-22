import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RegisterForm } from './register-form'

export default async function RegisterPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Al ingelogd? Direct doorsturen!
    if (user) {
        redirect('/dashboard/settings')
    }

    return (
        <div className="flex min-h-screen w-full font-sans flex-col lg:flex-row">
            {/* LEFT COLUMN: BRANDING */}
            <div className="flex-1 bg-[#1A202C] text-white flex flex-col justify-between p-16 relative overflow-hidden lg:flex-none lg:w-1/2 before:absolute before:inset-0 before:opacity-10 before:bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] before:bg-[length:50px_50px] before:pointer-events-none">
                <div className="z-10">
                    <Link href="/" className="text-3xl font-extrabold text-white no-underline">Sjef.</Link>
                </div>

                <div className="z-10 max-w-[500px]">
                    <h1 className="text-[3.5rem] font-bold leading-[1.1] mb-6 -tracking-[0.03em]">Start met 3 gratis offertes.</h1>
                    <p className="text-lg text-slate-400 leading-[1.6]">Ervaar hoe Sjef werkt. Geen creditcard nodig, binnen 1 minuut geregeld.</p>
                </div>

                <div className="z-10 text-sm text-slate-500">
                    <span>&copy; {new Date().getFullYear()} Sjef.</span>
                </div>
            </div>

            {/* RIGHT COLUMN: FORM */}
            <div className="flex-1 bg-white flex items-center justify-center p-8 overflow-y-auto">
                <RegisterForm />
            </div>
        </div>
    )
}
