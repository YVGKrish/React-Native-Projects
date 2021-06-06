import React from 'react';
import {View, Picker} from 'react-native';


const CPicker = ({value, onChange, children, cStyle}) => {
    return (
        <View style={{width:80,height:30}}>
            <Picker style={[cStyle]} selectedValue={value} onValueChange={onChange}>
                {children}
            </Picker>
        </View>
    );
};

export {CPicker};