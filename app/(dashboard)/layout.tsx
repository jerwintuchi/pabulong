// app/(dashboard)/layout.tsx
import React, { Suspense } from "react";
import NavLinks from "@/components/NavLinks";
import { Toaster } from "react-hot-toast";
import { getBasicUser } from "@/utils/helpers/user-server";
import Loading from "@/components/Loading";

// Separate component for auth check
const AuthCheck = async () => {
  const user = await getBasicUser();
  return user ? <NavLinks /> : null;
};

export default function SecretLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col min-h-screen max-w-5xl mx-auto">
        <Suspense fallback={<Loading />}>
          <AuthCheck />
        </Suspense>
        <div className="flex flex-1 flex-col gap-6 px-6 py-4 mt-20">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </>
  );
}