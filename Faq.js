import React,{Component} from 'react';
import {
    Text,
    View,
    Image, 
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {CText, CInput, CButton,Labelmenu} from '../common/index';
import styles from '../common/styles';


export default class Faq extends Component{
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#FFF'}} >
                <View style={{backgroundColor:'#c01530',flexDirection:'row',alignItems:'center'}}> 
                    <View style={{/* height:50 */}} >
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} >
                            <View style={{alignItems:'center',justifyContent:'center',marginLeft:10}}>
                                <Image resizeMode='contain' style={{height:17,width:15}}source={require('../images/leftarrow.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:12,justifyContent:'center'}} >
                        <CText cStyle={{ color:'#ffffff',fontFamily:'NeueKabel-Book',fontSize:16,margin:13}}>FAQ'S</CText> 
                    </View>
                </View>
                <View style={{margin:10,alignContent:'center',borderBottomWidth:2,borderBottomColor:'#ebebeb',flexDirection:'row',justifyContent:'space-between'}} >
                    <CText cStyle={{margin:10, paddingLeft:10,fontFamily:'NeueKabel-Light'}} >Ordering</CText>
                    <Image resizeMode='contain' style={{paddingRight:10,width:15,height:15}} source={require('../images/downarrow.png')}/>
                </View>
                <View style={{margin:10,alignContent:'center',borderBottomWidth:2,borderBottomColor:'#ebebeb',flexDirection:'row',justifyContent:'space-between'}} >
                    <CText cStyle={{margin:10, paddingLeft:10,fontFamily:'NeueKabel-Light'}} >Payment</CText>
                    <Image resizeMode='contain' style={{paddingRight:10,width:15,height:15}} source={require('../images/downarrow.png')}/>
                </View>
                <View style={{margin:10,alignContent:'center',borderBottomWidth:2,borderBottomColor:'#ebebeb',flexDirection:'row',justifyContent:'space-between'}} >
                    <CText cStyle={{margin:10, paddingLeft:10,fontFamily:'NeueKabel-Light'}} >Shipping</CText>
                    <Image resizeMode='contain' style={{paddingRight:10,width:15,height:15}} source={require('../images/downarrow.png')}/>
                </View>
                <View style={{margin:10,alignContent:'center',borderBottomWidth:2,borderBottomColor:'#ebebeb',flexDirection:'row',justifyContent:'space-between'}} >
                    <CText cStyle={{margin:10, paddingLeft:10,fontFamily:'NeueKabel-Light'}} >Tracking</CText>
                    <Image resizeMode='contain' style={{paddingRight:10,width:15,height:15}} source={require('../images/downarrow.png')}/>
                </View>
                <View style={{margin:10,alignContent:'center',borderBottomWidth:2,borderBottomColor:'#ebebeb',flexDirection:'row',justifyContent:'space-between'}} >
                    <CText cStyle={{margin:10, paddingLeft:10,fontFamily:'NeueKabel-Light'}} >Returns</CText>
                    <Image resizeMode='contain' style={{paddingRight:10,width:15,height:15}} source={require('../images/downarrow.png')}/>
                </View>
                <View style={{margin:10,alignContent:'center',borderBottomWidth:2,borderBottomColor:'#ebebeb',flexDirection:'row',justifyContent:'space-between'}} >
                    <CText cStyle={{margin:10, paddingLeft:10,fontFamily:'NeueKabel-Light'}} >Registration</CText>
                    <Image resizeMode='contain' style={{paddingRight:10,width:15,height:15}} source={require('../images/downarrow.png')}/>
                </View>
            </View>
        );
    }
}


