export default function FloatingElements() {
  return (
     <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating circles with various animations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-ping" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-35 animate-pulse" style={{animationDelay: '2s', animationDuration: '2.5s'}}></div>
      <div className="absolute top-60 left-1/2 w-14 h-14 bg-pink-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
      <div className="absolute bottom-20 right-10 w-18 h-18 bg-green-200 rounded-full opacity-25 animate-ping" style={{animationDelay: '1.5s', animationDuration: '5s'}}></div>
      
      {/* Zoom in/out circles */}
      <div className="absolute top-96 left-16 w-24 h-24 bg-cyan-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '0s'}}></div>
      <div className="absolute top-32 right-32 w-16 h-16 bg-rose-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-80 right-16 w-20 h-20 bg-emerald-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Floating squares and shapes */}
      <div className="absolute top-80 right-40 w-8 h-8 bg-yellow-200 opacity-20 rotate-45 animate-spin" style={{animationDelay: '0s', animationDuration: '8s'}}></div>
      <div className="absolute bottom-60 left-40 w-10 h-10 bg-red-200 opacity-25 rotate-12 animate-pulse" style={{animationDelay: '2s', animationDuration: '3s'}}></div>
      <div className="absolute top-48 left-32 w-6 h-12 bg-violet-200 opacity-30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-48 right-48 w-12 h-6 bg-amber-200 opacity-25 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
      
      {/* Moving elements */}
      <div className="absolute top-32 animate-pulse">
        <div className="w-6 h-6 bg-blue-300 rounded-full opacity-40"></div>
      </div>
      <div className="absolute bottom-32 right-0 animate-bounce">
        <div className="w-8 h-8 bg-purple-300 rounded-full opacity-35"></div>
      </div>
      <div className="absolute top-72 animate-ping">
        <div className="w-10 h-10 bg-teal-300 rounded-full opacity-30"></div>
      </div>
      <div className="absolute bottom-72 left-0 animate-pulse">
        <div className="w-7 h-7 bg-orange-300 rounded-full opacity-35"></div>
      </div>
      
      {/* Rotating decorative elements */}
      <div className="absolute top-24 left-1/3 animate-spin" style={{animationDuration: '10s'}}>
        <div className="w-4 h-4 bg-indigo-300 rounded-full opacity-40"></div>
      </div>
      <div className="absolute bottom-24 right-1/3 animate-spin" style={{animationDuration: '12s'}}>
        <div className="w-5 h-5 bg-pink-300 rounded-full opacity-35"></div>
      </div>
      
      {/* Decorative icons scattered around */}
      <div className="absolute top-16 left-1/4 text-2xl opacity-30 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>⭐</div>
      <div className="absolute top-52 right-1/4 text-3xl opacity-25 animate-pulse" style={{animationDelay: '2s'}}>✨</div>
      <div className="absolute bottom-36 left-1/3 text-2xl opacity-30 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>🎯</div>
      <div className="absolute bottom-16 right-1/3 text-2xl opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}>🚀</div>
      <div className="absolute top-40 left-3/4 text-2xl opacity-30 animate-spin" style={{animationDelay: '0s', animationDuration: '6s'}}>⚡</div>
      <div className="absolute bottom-52 left-1/6 text-2xl opacity-25 animate-bounce" style={{animationDelay: '2.5s', animationDuration: '3.5s'}}>💼</div>
    </div>
  );
}
