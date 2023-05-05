import { act, renderHook, waitFor } from '@testing-library/react-native';
import useFetch, { FetchStatus } from './useFetch';

describe('useFetch hook', () => {
    afterEach(() => jest.restoreAllMocks());

    it('should return the data when the API call was successful', async () => {
        const mockedApiResult = ['a', 'b'];

        jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockedApiResult),
            } as Response)
        );

        const { result } = renderHook(() =>
            useFetch<string[]>('https://mock.example.com/products')
        );

        expect(global.fetch).toHaveBeenCalledTimes(1);

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Successful)
        );

        expect(result.current.data).toEqual(mockedApiResult);
    });

    it('should have status pending while waiting for the api to respond', async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        const result = Promise.resolve({
                            ok: true,
                            json: () => Promise.resolve(),
                        } as Response);

                        resolve(result);
                    }, 200);
                })
        );

        const { result } = renderHook(() =>
            useFetch<string[]>('https://mock.example.com/products')
        );

        expect(global.fetch).toHaveBeenCalledTimes(1);

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Pending)
        );

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Successful)
        );
    });

    it('should have status failed when api fails', async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        const result = Promise.reject();
                        resolve(result);
                    }, 200);
                })
        );

        const { result } = renderHook(() =>
            useFetch<string[]>('https://mock.example.com/products')
        );

        expect(global.fetch).toHaveBeenCalledTimes(1);

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Pending)
        );

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Failed)
        );
    });

    it('should have status failed when status not ok', async () => {
        jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve(),
            } as Response)
        );

        const { result } = renderHook(() =>
            useFetch<string[]>('https://mock.example.com/products')
        );

        expect(global.fetch).toHaveBeenCalledTimes(1);

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Pending)
        );

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Failed)
        );
    });

    it('retry should fetch again', async () => {
        const mockedApiResult = ['a'];

        jest.spyOn(global, 'fetch')
            .mockImplementationOnce(() => Promise.reject())
            .mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            const result = Promise.resolve({
                                ok: true,
                                json: () => Promise.resolve(mockedApiResult),
                            } as Response);
                            resolve(result);
                        }, 200);
                    })
            );

        const { result } = renderHook(() =>
            useFetch<string[]>('https://mock.example.com/products')
        );

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Failed)
        );

        await act(result.current.retry);

        await waitFor(() =>
            expect(result.current.status).toBe(FetchStatus.Successful)
        );

        expect(result.current.data).toEqual(mockedApiResult);
    });
});
