import React, { useEffect, useState } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Button,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import addThousandsSeparators from './addThousandsSeparators';
import useFetch, { FetchStatus } from './useFetch';

interface ProductListProps {}

const ProductList: React.FC<ProductListProps> = () => {
    const {
        data: products,
        status,
        retry,
    } = useFetch<Product[]>('https://api.example.com/products');

    const [filteredProducts, setFilteredProducts] = useState(products ?? []);

    useEffect(() => {
        if (products) {
            setFilteredProducts(products);
        }
    }, [products]);

    const renderContent = () => {
        switch (status) {
            case FetchStatus.NotStarted:
                return;
            case FetchStatus.Pending:
                return <ActivityIndicator testID={'activityIndicator'} />;
            case FetchStatus.Successful:
                return (
                    products && (
                        <>
                            <TextInput
                                placeholder={'Search'}
                                onChangeText={(text) => {
                                    const filtered = products.filter(
                                        (product) => product.name.includes(text)
                                    );
                                    setFilteredProducts(filtered);
                                }}
                            />
                            <FlatList
                                data={filteredProducts}
                                renderItem={Product}
                                keyExtractor={(item) => item.id}
                            />
                        </>
                    )
                );
            case FetchStatus.Failed:
                return <Button title={'Retry'} onPress={retry} />;
        }
    };

    return <View style={styles.container}>{renderContent()}</View>;
};

export interface ProductProps {
    item: Product;
}
export const Product: React.FC<ProductProps> = ({ item }) => (
    <View style={styles.product}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
            {addThousandsSeparators((item.price / 100).toString())}€
        </Text>
    </View>
);

export interface Product {
    id: string;
    name: string;
    price: number;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    product: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 10,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#666',
    },
});
export default ProductList;
