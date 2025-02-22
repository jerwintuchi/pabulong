
// app/(dashboard)/(routes)/secret-page-1/page.tsx
import { getServerUser } from "@/utils/helpers/user-server";
import SecretPage1Client from "./_components/SecretPage1Client";

export default async function SecretPage1() {
    const user = await getServerUser({
        includeSecretMessage: true
    });
    if (!user) return <div>User not found</div>;
    return <SecretPage1Client user={user} />;
}