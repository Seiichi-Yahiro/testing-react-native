import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, TextInput } from 'react-native';
import { ProductI } from './ProductListTypes';
import addThousandsSeparators from './addThousandsSeparators';
import useFetch, { FetchStatus } from './useFetch';

interface ProductListProps {}

const ProductList: React.FC<ProductListProps> = () => {
    const {
        data: products,
        status,
        retry,
    } = useFetch<ProductI[]>('https://api.example.com/products');

    const [filteredProducts, setFilteredProducts] = useState(products ?? []);

    const onSearch = useCallback(
        (text: string) => {
            const filtered = (products ?? []).filter((product) =>
                product.name.includes(text)
            );
            setFilteredProducts(filtered);
        },
        [products]
    );

    useEffect(() => {
        if (products) {
            setFilteredProducts(products);
        }
    }, [products]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder={'Search'}
                onChangeText={onSearch}
            />
            <View style={{ height: 500 }}>
                <FlatList
                    data={filteredProducts}
                    renderItem={Product}
                    keyExtractor={(item) => item.id}
                    onRefresh={retry}
                    refreshing={status === FetchStatus.Pending}
                    ListEmptyComponent={<Text>No products found</Text>}
                />
            </View>
        </View>
    );
};

export interface ProductProps {
    item: ProductI;
}
export const Product: React.FC<ProductProps> = ({ item }) => (
    <View style={styles.product}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
            {addThousandsSeparators((item.price / 100).toString())}€
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    search: {
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 5,
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
