const DetailPesertaSkeleton = () => (
  <div className="animate-pulse">
    <div className="rounded-2xl mb-4 p-6 bg-[#f4f5f7]">
      <div className="h-7 w-40 bg-gray-200 rounded-md mb-8" />
      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        <div className="w-[140px] h-[140px] rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-8 w-64 bg-gray-200 rounded-md mb-3" />
          <div className="h-5 w-80 bg-gray-200 rounded-md mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx}>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="h-[150px] rounded-2xl bg-gray-200" />
      ))}
    </div>

    <div className="grid grid-cols-2 md:grid-cols-12 gap-3">
      <div className="col-span-8 space-y-4">
        <div className="rounded-2xl bg-white p-6 border border-gray-100">
          <div className="h-6 w-60 bg-gray-200 rounded mb-4" />
          <div className="h-[320px] bg-gray-200 rounded-xl" />
        </div>
        <div className="rounded-2xl bg-white p-6 border border-gray-100">
          <div className="h-6 w-52 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-4 space-y-3">
        <div className="rounded-2xl bg-white p-6 border border-gray-100 h-72" />
        <div className="rounded-2xl bg-white p-6 border border-gray-100 h-48" />
        <div className="rounded-2xl bg-white p-6 border border-gray-100 h-96" />
      </div>
    </div>
  </div>
);

export default DetailPesertaSkeleton;
