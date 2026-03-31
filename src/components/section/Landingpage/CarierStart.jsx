import { useJobs } from "../../../hooks";
import { MapPin, Users, AlertCircle, ArrowRight } from "lucide-react";
import JobsCard from "../../cards/JobsCard";
import { JobCardsSkeletonGrid } from "../../cards/JobCardSkeleton";

export default function CarrierStart() {
  const {  jobs, loading } = useJobs();

  // Ambil hanya 3 lowongan terbaru
  const latestJobs = jobs
    .slice() // biar nggak mutasi state
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  if (loading) {
    return (
        <div className="flex items-center justify-center ">

          <JobCardsSkeletonGrid count={3} gap={20} />
        </div>
    );
  }

  if (latestJobs.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Tidak ada lowongan tersedia
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">

    <div className="grid grid-cols-3 gap-20">
          {latestJobs.map((job) => (
            <JobsCard
              key={job.id}
              job={job}
            />
          ))}
        </div>
    </div>
  );
}
