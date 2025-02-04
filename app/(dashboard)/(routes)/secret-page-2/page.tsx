// app/(dashboard)/(routes)/secret-page-2/page.tsx
import { getServerUser } from "@/utils/helpers/user-server";
import SecretPage2Client from "./_components/SecretPage2Client";

export default async function SecretPage2() {
  const user = await getServerUser();
  if(!user) {return null;}
  return (
    <SecretPage2Client user={user} />
  )
};


