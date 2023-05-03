import * as useFetch from './useFetch';
import { render } from '@testing-library/react-native';
import ProductList, { Product } from './ProductList';

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
        });

        const { getByText } = render(<ProductList />);

        expect(getByText('Foo')).not.toBeNull();
        expect(getByText('Foo 2')).not.toBeNull();

        expect(getByText('1.99')).not.toBeNull();
        expect(getByText('2.99')).not.toBeNull();
    });

    it('should render a pending text while waiting for the api', () => {
        jest.spyOn(useFetch, 'default').mockReturnValueOnce({
            status: useFetch.FetchStatus.Pending,
        });

        const { getByText } = render(<ProductList />);

        expect(getByText('Pending')).not.toBeNull();
    });
});
