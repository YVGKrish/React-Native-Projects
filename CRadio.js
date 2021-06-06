import React from 'react';
import {View, TouchableOpacity,StyleSheet} from 'react-native';
import {CText} from './index';

const CRadio = ({label, onPress, activeStyle}) => {
    return (
        <View style={{flexDirection:'row', marginHorizontal:10,marginVertical:5}}>
            <TouchableOpacity onPress={onPress} style={Styles.radioStyle}>
                <View style={[Styles.radioActiveStyle, [activeStyle]]}></View>
            </TouchableOpacity>
            <CText cStyle={[Styles.mLt10,{color:'#0e0e0e',fontFamily:'NeueKabel-Light',}]}>{label}</CText>
        </View>
    );
};

const Styles = StyleSheet.create({
mLt10:{ marginLeft: 10 },
radioStyle: {
        borderWidth:1, 
        borderColor:'#DDD', 
        borderRadius:20,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
radioActiveStyle:{ backgroundColor:'#484848', width:12, height:12, borderRadius:12 },
});
export {CRadio};