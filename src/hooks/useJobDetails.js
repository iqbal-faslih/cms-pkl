import { useState, useEffect } from "react";
import { fetchMapJobDetail } from "../helpers/jobDetailsHelper";

const useJobDetails = (jobId) => {
    const [ jobDetails, setJobDetails ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (!jobId) return;

        setLoading(true);
        setError(null);

        fetchMapJobDetail(jobId)
        .then((data) => {
            setJobDetails(Array.isArray(data) ? (data[0] ?? null) : null);
        })
        .catch((err) => {
            setError(err);
            setJobDetails(null);
        })
        .finally(() => {
            setLoading(false);
        })
    }, [jobId])

    return { jobDetails, loading, error };
};

export default useJobDetails;
