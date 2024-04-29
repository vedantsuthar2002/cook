// Loader.tsx
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface LoaderProps {
    loading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
    if (!loading) return null;

    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FB9400" />
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Loader;
