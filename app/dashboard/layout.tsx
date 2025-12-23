import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Default placeholder
    let userDetails = {
        name: "Sjef User",
        email: user?.email,
        avatarUrl: user?.user_metadata?.avatar_url
    };

    if (user) {
        // Attempt to get name from profile
        const { data: profile } = await supabase.from('profiles').select('first_name, last_name, company_name').eq('id', user.id).single();
        if (profile) {
            const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            // Prefer Full Name, then Company Name, then "Sjef User"
            userDetails.name = fullName || profile.company_name || userDetails.name;
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar user={userDetails} />
            <div className="ml-0 md:ml-64 flex-1">
                {children}
            </div>
        </div>
    );
}
