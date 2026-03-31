import { useState, useEffect } from "react";
import { fetchRelatedJobs } from "../helpers/relatedJobsHelper";

const useRelatedJobs = (currentJob, currentJobId, limit = 5) => {
    const [ relatedJobs, setRelatedJobs ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (!currentJob || !currentJobId) {
            setRelatedJobs([]);
            return;
        }

        setLoading(true);
        setError(null);

        fetchRelatedJobs(currentJob, currentJobId, limit)
            .then((data) => {
                setRelatedJobs(data || []);
            })
            .catch((err) => {
                console.error("Error fetching related jobs:", err);
                setError(err);
                setRelatedJobs([]);
            })
            .finally(() => {
                setLoading(false);
            })

    }, [currentJob, currentJobId, limit]);

    return { relatedJobs, loading, error };
};

export default useRelatedJobs;