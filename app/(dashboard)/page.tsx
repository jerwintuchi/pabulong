import { getAuthUser, getUser, getUserSession } from "@/utils/queries/queryDefinitions";
import HomePageClient from "./_components/HomePageClient";
import Home from "@/components/Home";

export default async function HomePage() {
    const session = await getUserSession(); // Fetch auth state on the server
    if (!session) return <Home />

    return <HomePageClient />;
}
