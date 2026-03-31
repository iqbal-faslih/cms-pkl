export default function WelcomeBanner({ className = "" }) {
  return (
    <div className={`w-115 bg-white rounded-2xl shadow-sm py-4 px-5 ${className}`}>
      <div className="flex items-start gap-6">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="relative w-17 h-17">
            {/* Dashed border circle */}
            <div className="absolute inset-0 rounded-full border-1 border-dashed border-blue-400"></div>
            {/* Inner content */}
            <div className="absolute inset-1 rounded-full bg-blue-50 flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-blue-500" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-blue-600 underline pb-1">
            Selamat Datang Mr. Sehun!
          </h1>
          <p className="text-gray-700 text-xs font-semibold line-clamp-1">
            Kelola aktivitas magang dan data admin dengan mudah disini.
          </p>
          <div className="inline-block bg-orange-100 px-3 rounded-xl">
            <p className="text-orange-500 font-semibold text-xs">
              PT. Hummatech
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}