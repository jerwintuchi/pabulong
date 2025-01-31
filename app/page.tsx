
import Hero from "@/components/Hero";
import FeatureSection from "./public/_components/FeatureSection";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-12 px-4 py-12  dark:bg-black dark:text-white">

        {/* Feature Section */}
        <FeatureSection />

        {/* Call to Action Section */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Send Your First Secret?</h2>
          <p className="text-lg mb-8">
            Try Pabulong today and start messaging securely and privately.
          </p>
          <Button className="bg-blue-600 text-white text-lg py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
            <a href="sign-up">Get Started Now</a>
          </Button>
        </section>
      </main>
    </>
  );
}
