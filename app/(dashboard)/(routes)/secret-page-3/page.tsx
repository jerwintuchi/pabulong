
// app/(dashboard)/(routes)/secret-page-3/page.tsx
import { getServerUser } from "@/utils/helpers/user-server";
import SecretPage3Client from "./_components/SecretPage3Client";


export default async function Page() {
    const user = await getServerUser();
    if (!user) { return null; }
    return (
        <SecretPage3Client user={user} />
    )
}
