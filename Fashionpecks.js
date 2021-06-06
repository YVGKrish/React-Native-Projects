import React,{Component} from 'react';
import {View,Image, TextInput} from 'react-native';
//import styles from './Styles';

export default class Fashionpecks extends Component{
   render(){ 
    return (
        <View style={{height:'100%',width:'100%',justifyContent:'center'}}>
           <Image resizeMode='contain' source={require('../images/fashion_main.png')} />
              <View style={{position:'absolute',alignSelf:'center'}}>
                 <Image resizeMode='contain'  source={require('../images/fashion_log.png')} />
              </View>          
        </View>
    ); 
  }
}