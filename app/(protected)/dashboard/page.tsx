import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Welcome back! You are now authenticated.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Authentication Status
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">✓</span>
            <span className="text-gray-700">User ID: {userId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">✓</span>
            <span className="text-gray-700">
              Email: {String(sessionClaims?.email || 'N/A')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">✓</span>
            <span className="text-gray-700">
              Organization ID: {String(sessionClaims?.orgId || 'None')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-semibold">✓</span>
            <span className="text-gray-700">
              Session Token: Stored in httpOnly cookie (secure)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Security Note:</strong> Your JWT token is securely stored in
          an httpOnly cookie and automatically refreshed by Clerk. This prevents
          XSS attacks and ensures your session remains secure.
        </p>
      </div>
    </div>
  );
}
