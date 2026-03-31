export function DataPerusahaanSkeleton() {
  return (
    <div className="w-full mx-auto rounded-xl bg-white p-8 min-h-screen relative shadow-sm animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-52 bg-gray-200 rounded" />
        <div className="h-4 w-72 bg-gray-200 rounded mt-2" />
      </div>

      <hr className="border-t border-gray-200 my-6" />

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-28 bg-gray-200 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-4">
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-24 bg-gray-200 rounded-lg" />

        <div className="h-6 w-44 bg-gray-200 rounded mt-6" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-3">
              <div className="w-24 h-20 bg-gray-200 rounded-md border border-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="h-7 w-20 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <div className="h-10 w-28 bg-gray-200 rounded-lg" />
          <div className="h-10 w-28 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DataAdminPerusahaanSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 min-h-[500px] animate-pulse">
      <div className="mb-8">
        <div className="h-7 w-60 bg-gray-200 rounded" />
        <div className="h-4 w-72 bg-gray-200 rounded mt-2" />
      </div>

      <hr className="border-t border-gray-200 my-6" />

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-11 bg-gray-200 rounded-lg" />
          <div className="h-11 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-11 w-1/2 bg-gray-200 rounded-lg" />

        <div className="flex justify-end gap-3 mt-8">
          <div className="h-10 w-28 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
