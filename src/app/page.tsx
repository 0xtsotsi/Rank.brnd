export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-primary-600">
          Welcome to Rank.brnd
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          AI-Powered SEO Platform for Content That Ranks
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white shadow-medium transition-colors hover:bg-primary-700"
          >
            Get Started
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-subtle transition-colors hover:bg-gray-50"
          >
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
