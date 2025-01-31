import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center text-primary">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center text-primary">
        Securely share your <strong>secrets</strong> with your friends.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent my-8" />
    </div>
  );
}
