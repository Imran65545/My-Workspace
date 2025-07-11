import Spline from '@splinetool/react-spline/next';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white px-6 relative overflow-hidden">
      {/* Spline 3D background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Spline scene="https://prod.spline.design/1QA6zU10yq9-BHSh/scene.splinecode" />
      </div>
      {/* Foreground content */}
      <div className="max-w-2xl text-center z-10 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-green-400">My Workspace</span>
        </h1>
        <p className="text-gray-200 text-lg mb-8">
          Organize your life with smart notes, actionable tasks, and AI
          summaries — all in one clean dashboard.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/login"
            className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </a>
          <a
            href="/signup"
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
      {/* Black overlay to cover Spline badge (always fixed, all devices) */}
      <div className="fixed bottom-0 right-0 mb-4 mr-4 w-40 h-12 bg-black z-50 rounded-lg pointer-events-none sm:w-40 sm:h-12 w-28 h-10"></div>
    </main>
  );
}
