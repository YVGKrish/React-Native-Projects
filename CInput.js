import React from 'react';
import {View, TextInput} from 'react-native';
//import styles from './Styles';

const CInput = ({value,cStyle, Type, onChangeText,secureTextEntry, placeholder, multiline}) => {
    return (
        <View>
            <TextInput value={value} style={[cStyle]}  onChangeText={onChangeText} keyboardType={Type}
                underlineColorAndroid="transparent"
                placeholderTextColor='#434343'
                placeholder={placeholder} multiline={multiline || false}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

export {CInput};