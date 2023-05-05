import { useCallback, useEffect, useState } from 'react';

export enum FetchStatus {
    NotStarted = 'NotStarted',
    Pending = 'Pending',
    Successful = 'Successful',
    Failed = 'Failed',
}

export interface UseFetchData<T = any> {
    status: FetchStatus;
    retry: () => void;
    data?: T;
}
const useFetch = <T = any>(url: string): UseFetchData<T> => {
    const [status, setStatus] = useState<FetchStatus>(FetchStatus.NotStarted);
    const [data, setData] = useState<T>();

    const fetchData = useCallback(async () => {
        if (status === FetchStatus.Pending) {
            return;
        }

        setStatus(FetchStatus.Pending);

        try {
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setData(data);
                setStatus(FetchStatus.Successful);
            } else {
                setStatus(FetchStatus.Failed);
            }
        } catch (error) {
            setStatus(FetchStatus.Failed);
        }
    }, [url, status]);

    useEffect(() => {
        fetchData();
    }, [url]);

    return { status, data, retry: fetchData };
};

export default useFetch;
