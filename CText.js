import React from 'react';
import {Text} from 'react-native';
import styles from './styles';

const CText = ({children, cStyle,num}) => {
    return (
        <Text numberOfLines={num} style={[styles.cText, cStyle]}>{children}</Text>
    );
};

export {CText};