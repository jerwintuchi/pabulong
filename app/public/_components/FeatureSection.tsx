const FeatureSection = () => {
    return (
        <section className="text-center py-12">
            <h2 className="text-3xl font-bold mb-6">Why Pabulong?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="p-6 dark:bg-gray-900 rounded-lg shadow-lg text-white bg-black ">
                    <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
                    <p>We prioritize your privacy. All messages are encrypted, ensuring that only you and your recipient can read them.</p>
                </div>
                <div className="p-6 dark:bg-gray-900 rounded-lg shadow-lg text-white bg-black">
                    <h3 className="text-xl font-semibold mb-4">Message Self-Destruction</h3>
                    <p>Messages disappear once read, leaving no trace behind. Perfect for confidential conversations.</p>
                </div>
                <div className="p-6 dark:bg-gray-900 rounded-lg shadow-lg text-white bg-black">
                    <h3 className="text-xl font-semibold mb-4">No Traces Left</h3>
                    <p>After messages are read, they vanish, leaving no digital footprint, ensuring your secrets remain safe.</p>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
