import * as useFetch from './useFetch';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ProductList, { Product } from './ProductList';
import '@testing-library/jest-native/extend-expect';
import { ProductI } from './ProductListTypes';

describe('Product List', () => {
    afterEach(() => jest.restoreAllMocks());

    it('should render the data from the api', () => {
        const mockedReturnData: ProductI[] = [
            { id: '1', name: 'Apple', price: 199 },
            { id: '2', name: 'Orange', price: 299 },
        ];

        jest.spyOn(useFetch, 'default').mockReturnValueOnce({
            status: useFetch.FetchStatus.Successful,
            data: mockedReturnData,
            retry: () => {},
        });

        render(<ProductList />);

        expect(screen.getByText('Apple')).toBeOnTheScreen();
        expect(screen.getByText('Orange')).toBeOnTheScreen();

        expect(screen.getByText('1.99€')).toBeOnTheScreen();
        expect(screen.getByText('2.99€')).toBeOnTheScreen();
    });

    it('should inform when product list is empty', () => {
        jest.spyOn(useFetch, 'default').mockReturnValueOnce({
            data: [],
            status: useFetch.FetchStatus.Successful,
            retry: () => {},
        });

        render(<ProductList />);

        expect(screen.getByText('No products found')).toBeOnTheScreen();
    });

    it('should call retry on list refresh', () => {
        const retry = jest.fn();

        jest.spyOn(useFetch, 'default').mockReturnValueOnce({
            status: useFetch.FetchStatus.Failed,
            retry,
        });

        render(<ProductList />);

        fireEvent(screen.getByText('No products found'), 'refresh');

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

    describe('Filter products', () => {
        it('should display all products after emptying search field', () => {
            const mockedReturnData: ProductI[] = [
                { id: '1', name: 'Apple', price: 199 },
                { id: '2', name: 'Orange', price: 299 },
                { id: '3', name: 'Apple Juice', price: 399 },
                { id: '4', name: 'Orange Juice', price: 499 },
            ];

            jest.spyOn(useFetch, 'default').mockReturnValue({
                status: useFetch.FetchStatus.Successful,
                data: mockedReturnData,
                retry: () => {},
            });

            render(<ProductList />);

            const textInput = screen.getByPlaceholderText('Search');

            fireEvent.changeText(textInput, 'Orange');
            fireEvent.changeText(textInput, '');

            expect(screen.getByText('Apple')).toBeOnTheScreen();
            expect(screen.getByText('Apple Juice')).toBeOnTheScreen();
            expect(screen.getByText('Orange')).toBeOnTheScreen();
            expect(screen.getByText('Orange Juice')).toBeOnTheScreen();
        });

        it('should search for products that contain the word Orange', () => {
            const mockedReturnData: ProductI[] = [
                { id: '1', name: 'Apple', price: 199 },
                { id: '2', name: 'Orange', price: 299 },
                { id: '3', name: 'Apple Juice', price: 399 },
                { id: '4', name: 'Orange Juice', price: 499 },
            ];

            jest.spyOn(useFetch, 'default').mockReturnValue({
                status: useFetch.FetchStatus.Successful,
                data: mockedReturnData,
                retry: () => {},
            });

            render(<ProductList />);

            const apple = screen.getByText('Apple');
            const appleJuice = screen.getByText('Apple Juice');

            const orange = screen.getByText('Orange');
            const orangeJuice = screen.getByText('Orange Juice');

            fireEvent.changeText(
                screen.getByPlaceholderText('Search'),
                'Orange'
            );

            expect(orange).toBeOnTheScreen();
            expect(orangeJuice).toBeOnTheScreen();
            expect(apple).not.toBeOnTheScreen();
            expect(appleJuice).not.toBeOnTheScreen();
        });
    });
});
