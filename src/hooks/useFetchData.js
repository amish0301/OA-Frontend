import { useCallback, useEffect, useState } from "react";
import axiosInstance from "./useAxios";

const useFetchQuery = (url, method = "GET", data = null, config = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance({
        url,
        method,
        data,
        ...config,
      });
      if (res.data.success) setResponse(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || err);
    } finally {
      setIsLoading(false);
    }
  }, [url, method, data, config]);

  useEffect(() => {
    fetchData();
  }, []);

  return { response, error, isLoading, refetch: fetchData };
};

export default useFetchQuery;
