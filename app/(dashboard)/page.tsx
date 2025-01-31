import { getUserAuthState } from "@/utils/supabase/getUserAuthState";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Home from "@/components/Home";
import { signOutAction } from "../actions";

export default async function HomePage() {
    const user = await getUserAuthState();

    if (user) {
        // Authenticated User → Show Dashboard
        return (
            <div className="p-4">
                <h1 className="text-xl font-bold">Welcome to Your Dashboard</h1>
                <nav className="mt-4">
                    <Link href="/page1" className="mr-4">Page 1</Link>
                    <Link href="/page2" className="mr-4">Page 2</Link>
                    <Link href="/page3">Page 3</Link>
                </nav>
                <form action={signOutAction} className="mt-4">
                    <Button type="submit" variant="outline">Sign out</Button>
                </form>
            </div>
        );
    }

    // Unauthenticated User → Show Landing Page
    return (
        <Home />
    );
}
