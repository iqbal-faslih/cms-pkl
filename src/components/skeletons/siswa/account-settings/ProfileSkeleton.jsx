const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-6 h-full w-full animate-pulse">
      {/* Title */}
      <div className="h-[44px] w-48 bg-gray-300 rounded-md" />

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-x-4 h-full">
        {/* Left Column */}
        <div className="flex flex-col items-center gap-y-6 col-span-5">
          {/* Profile Card */}
          <div className="bg-white py-10 flex flex-col items-center gap-y-8 w-full rounded-2xl h-full">
            <div className="p-3 rounded-full border-2 border-gray-300">
              <div className="p-2 rounded-full relative border-2 border-gray-300">
                <div className="size-50 rounded-full bg-gray-300 border-4 border-gray-300 overflow-hidden" />
                <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-gray-400" />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 items-center justify-center w-full">
              <div className="h-5 w-32 bg-gray-300 rounded-md" />
              <div className="h-6 w-20 bg-gray-200 rounded-full mt-2" />
            </div>
          </div>

          {/* Dokumen Pemberkasan */}
          <div className="bg-white py-10 px-8 flex flex-col gap-y-6 w-full rounded-2xl h-full">
            <div className="h-8 w-56 bg-gray-300 rounded-md mb-4" />
            <div className="flex flex-col gap-y-6 w-full">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  className="p-2 flex justify-between border border-gray-300 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-20 rounded-lg bg-gray-300" />
                    <div className="flex flex-col">
                      <div className="h-4 w-28 bg-gray-300 rounded-md mb-1" />
                      <div className="h-3 w-16 bg-gray-200 rounded-md" />
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-y-6 col-span-7">
          {/* Email */}
          <div className="bg-white rounded-2xl w-full px-7 py-5 flex flex-col justify-center">
            <div className="h-4 w-16 bg-gray-300 rounded-md mb-1" />
            <div className="h-5 w-48 bg-gray-300 rounded-md" />
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl w-full px-7 py-5 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="h-4 w-20 bg-gray-300 rounded-md mb-1" />
              <div className="h-5 w-24 bg-gray-300 rounded-md" />
            </div>
            <div className="h-8 w-32 bg-gray-300 rounded-full" />
          </div>

          {/* Data Diri & Pemberkasan */}
          <div className="flex flex-col gap-y-6 h-full">
            {/* Data Diri Grid */}
            <div className="relative bg-white rounded-2xl w-full px-7 py-5 grid grid-cols-2 gap-x-4 h-full">
              <div className="flex flex-col gap-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="h-4 w-28 bg-gray-300 rounded-md mb-1" />
                    <div className="h-5 w-40 bg-gray-300 rounded-md" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="h-4 w-28 bg-gray-300 rounded-md mb-1" />
                    <div className="h-5 w-40 bg-gray-300 rounded-md" />
                  </div>
                ))}
              </div>
              
              <div className="absolute bottom-5 right-7 h-8 w-32 bg-gray-300 rounded-full" />
            </div>

            {/* Pemberkasan Section */}
            <div className="bg-white rounded-2xl w-full px-8 pt-10 pb-20">
              <div className="h-8 w-56 bg-gray-300 rounded-md mb-8" />
              <div className="grid grid-cols-3 gap-x-4">
                {[...Array(3)].map((_, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-y-4">
                    {[...Array(3)].map((_, rowIdx) => (
                      <div key={rowIdx} className="flex flex-col">
                        <div className="h-4 w-24 bg-gray-300 rounded-md mb-1" />
                        <div className="h-5 w-32 bg-gray-300 rounded-md" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
