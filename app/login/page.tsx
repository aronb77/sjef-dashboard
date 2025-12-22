import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from './actions' // We will need to create this too

export default async function LoginPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Al ingelogd? Direct doorsturen!
    if (user) {
        redirect('/dashboard/settings')
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Inloggen</CardTitle>
                    <CardDescription>
                        Voer je e-mailadres in om in te loggen op je dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={login} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Wachtwoord</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">Inloggen</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
