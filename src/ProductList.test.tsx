import * as useFetch from './useFetch';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ProductList, { Product } from './ProductList';
import '@testing-library/jest-native/extend-expect';

describe('Product List', () => {
    afterEach(() => jest.restoreAllMocks());

    it('should render the data from the api', () => {
        const mockedReturnData: Product[] = [
            { id: '1', name: 'Foo', price: 199 },
            { id: '2', name: 'Foo 2', price: 299 },
        ];

        jest.spyOn(useFetch, 'default').mockReturnValueOnce({
            status: useFetch.FetchStatus.Successful,
            data: mockedReturnData,
            retry: () => {},
        });

        render(<ProductList />);

        expect(screen.getByText('Foo')).toBeOnTheScreen();
        expect(screen.getByText('Foo 2')).toBeOnTheScreen();

        expect(screen.getByText('1.99€')).toBeOnTheScreen();
        expect(screen.getByText('2.99€')).toBeOnTheScreen();
    });

    it('should render a pending text while waiting for the api', () => {
        jest.spyOn(useFetch, 'default').mockReturnValueOnce({
            status: useFetch.FetchStatus.Pending,
            retry: () => {},
        });

        render(<ProductList />);

        expect(screen.getByTestId('activityIndicator')).toBeOnTheScreen();
    });

    it('should be able to retry a failed api call', () => {
        const retry = jest.fn();

        jest.spyOn(useFetch, 'default').mockReturnValueOnce({
            status: useFetch.FetchStatus.Failed,
            retry,
        });

        render(<ProductList />);

        const retryButton = screen.getByText('Retry');
        expect(retryButton).toBeOnTheScreen();

        fireEvent.press(retryButton);
        expect(retry).toBeCalledTimes(1);
    });

    describe('Product', () => {
        it('should display the product name', () => {
            render(<Product item={{ id: '1', name: 'Foo', price: 299 }} />);

            expect(screen.getByText('Foo')).toBeOnTheScreen();
        });

        it('should display cents', () => {
            render(<Product item={{ id: '1', name: 'Foo', price: 299 }} />);

            expect(screen.getByText('2.99€')).toBeOnTheScreen();
        });

        it('should add thousand separators to the price', () => {
            render(<Product item={{ id: '1', name: 'Foo', price: 234599 }} />);

            expect(screen.getByText('2,345.99€')).toBeOnTheScreen();
        });
    });
});
