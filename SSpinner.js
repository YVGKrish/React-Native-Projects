import React from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';

const SSpinner = ({ size }) => {
    return (
        <View style={[styles.loadingWrapper]}>
            <View >
                <ActivityIndicator size={size || 'large'} />
            </View>
        </View>
    );
};

const styles = {
    loadingWrapper:{
        width: '100%',
        height: 150,
        position: 'absolute',
        zIndex: 9999999999,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

export {SSpinner};