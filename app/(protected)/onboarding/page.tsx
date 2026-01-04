import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // In a real app, you would check if onboarding is complete
  // and redirect to dashboard if done

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Rank.brnd!
          </h1>
          <p className="text-gray-600 mb-8">
            Let&apos;s get your account set up. You&apos;re authenticated as
            user: {userId}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <span className="text-gray-700">Create your organization</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">2</span>
              </div>
              <span className="text-gray-700">
                Add your first product/website
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold">3</span>
              </div>
              <span className="text-gray-700">
                Start generating SEO content
              </span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Authentication Status:</strong> You are securely logged in
              via Clerk with httpOnly cookies. Your session is protected against
              XSS attacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
