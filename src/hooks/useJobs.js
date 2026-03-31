import { useCallback, useEffect, useState } from "react";
import { fetchAndMapJobs, extractDivisions } from "../helpers/jobHelper";

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const data = await fetchAndMapJobs();
    setJobs(data);
    setDivisions(extractDivisions(data));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return { jobs, divisions, loading };
};

export default useJobs;