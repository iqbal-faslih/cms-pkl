
const ProfileDropdownSkeleton = () => {
  return (
    <div className="relative profile-dropdown">
      <div className="flex gap-4 bg-white py-0.5 items-center">
        <div className="size-13 rounded-2xl bg-slate-300 animate-pulse"></div>

        <div className="flex flex-col gap-1">
          <div className="h-4 w-20 bg-slate-300 rounded animate-pulse"></div>
          <div className="h-3 w-16 bg-slate-300 rounded animate-pulse"></div>
        </div>

      </div>
    </div>
  );
};

export default ProfileDropdownSkeleton;
