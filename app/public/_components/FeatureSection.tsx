const FeatureSection = () => {
    return (
        <section className="text-center py-12">
            <h2 className="text-3xl font-bold mb-6">Why Pabulong?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="p-6 dark:bg-gray-900 rounded-lg shadow-lg text-white bg-black ">
                    <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
                    <p>We prioritize your privacy. All messages with friends only, can be shared.</p>
                </div>
                <div className="p-6 dark:bg-gray-900 rounded-lg shadow-lg text-white bg-black">
                    <h3 className="text-xl font-semibold mb-4">Simple Messaging</h3>
                    <p>A straightforward way to send and receive messages with your added friends.</p>
                </div>
                <div className="p-6 dark:bg-gray-900 rounded-lg shadow-lg text-white bg-black">
                    <h3 className="text-xl font-semibold mb-4">Stay in Touch</h3>
                    <p>Keep up with your friends by sending them messages directly through the app.</p>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
