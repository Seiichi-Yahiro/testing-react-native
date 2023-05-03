import { useEffect, useState } from 'react';

export enum FetchStatus {
    NotStarted = 'NotStarted',
    Pending = 'Pending',
    Successful = 'Successful',
    Failed = 'Failed',
}

export interface UseFetchData<T = any> {
    status: FetchStatus;
    data?: T;
}
const useFetch = <T = any>(url: string): UseFetchData<T> => {
    const [status, setStatus] = useState<FetchStatus>(FetchStatus.NotStarted);
    const [data, setData] = useState<T>();

    useEffect(() => {
        const fetchData = async () => {
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
        };

        fetchData();
    }, [url]);

    return { status, data };
};

export default useFetch;
