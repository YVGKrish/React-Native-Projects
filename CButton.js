import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const CButton = ({children, cStyle, onPress}) => {
    return (
        <TouchableOpacity style={[cStyle]} onPress={onPress}>
            {children}
        </TouchableOpacity>
    );
};

export {CButton};