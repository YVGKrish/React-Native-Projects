import React from 'react';
import {View, TouchableOpacity,style,StyleSheet} from 'react-native';
import {CText} from './index';

function SRadioButton({props,onpress}) {
    return (
        <View style={[{
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#000',
          alignItems: 'center',
          justifyContent: 'center',
        }]} onPress={onpress}>
          {
            props.selected ?
              <View style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#000',
              }}/>
              : null
          }
        </View>
    );
  }
  export {SRadioButton};