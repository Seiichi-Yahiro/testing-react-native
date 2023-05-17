import { StyleSheet, View } from 'react-native';
import ProductList from './src/ProductList';

export default function App() {
    return (
        <View style={styles.container}>
            <ProductList />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
