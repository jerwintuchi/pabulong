import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { signOutAction } from "../actions";
import { getUser } from "@/utils/queries/queryDefinitions";
import SignOutButton from "@/components/buttons/signout-button";

export default async function ProtectedPage() {

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
        <SignOutButton />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {/*  {JSON.stringify(user, null, 2)} */}
        </pre>
      </div>
      <div>
      </div>
    </div>
  );
}
