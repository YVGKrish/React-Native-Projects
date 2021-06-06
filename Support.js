import React,{Component} from 'react';
import {
    Text,
    View,
    Image, 
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import styles from '../common/styles';
import {CText, CInput, CButton,Labelmenu} from '../common/index';

export default class Support extends Component{
    state={databool:false}
    renderData(){
        if(this.state.databool){
            return(
                <View style={{padding:5,margin:10 }} >
                    <View style={{backgroundColor:'#ebebeb',marginBottom:5,padding:10,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}} >
                        <CText cStyle={{paddingLeft:10,fontFamily:'NeueKabel-Light'}} >I want to cancel my order</CText>
                        <Image style={{paddingRight:10,width:15,height:15}} source={require('../images/downarrow.png')} />
                    </View>
                    <View style={{backgroundColor:'#ebebeb',marginBottom:5,padding:10,justifyContent:'space-between',alignItems:'center',flexDirection:'row'}} >
                        <CText cStyle={{paddingLeft:10,fontFamily:'NeueKabel-Light'}} >I want to cancel my order</CText>
                        <Image style={{paddingRight:10,width:15,height:15}} source={require('../images/downarrow.png')} />
                    </View>
                </View>
            );
        }
    }
    Show(){
        if(this.state.databool){
            this.setState({databool:false})
        } else{
            this.setState({databool:true})
        }
    }
    render(){
        return(
            <View style={{flex:1,backgroundColor:'#FFF'}} >
                <View style={{backgroundColor:'#c01530',flexDirection:'row',alignItems:'center'}}> 
                    <View style={{/* height:50 */}} >
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} >
                            <View style={{alignItems:'center',justifyContent:'center',marginLeft:10}}>
                                <Image style={{height:17,width:15}}source={require('../images/leftarrow.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:12,justifyContent:'center'}} >
                        <CText cStyle={{ color:'#ffffff',fontFamily:'NeueKabel-Book',fontSize:16,margin:13}}>HELP/SUPPORT</CText> 
                    </View>
                </View>
                <View style={{padding:10}} >
                    <CText cStyle={{padding:10,color:"#1e1e1e",fontWeight:'bold',fontFamily:'NeueKabel-Medium'}} > YOUR QUERY </CText>
                </View>
                <View style={{padding:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} >
                    <View style={{flexDirection:'row',paddingLeft:10}}>
                        <Image style={{width:25,height:25,paddingRight:10}} source={require("../images/order.png")} />
                        <CText cStyle={{paddingLeft:15,color:'#1e1e1e', fontFamily:'NeueKabel-Regular'}} >ORDER</CText>
                    </View>
                    <View style={{paddingRight:10}} >
                        <TouchableOpacity onPress={()=>this.Show()} >
                        <Image style={{width:15,height:15}} source={require("../images/plus.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this.renderData()} 

                <View style={{padding:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} >
                    <View style={{flexDirection:'row',paddingLeft:10}}>
                        <Image style={{width:25,height:25,paddingRight:10}} source={require("../images/cancel.png")} />
                        <CText cStyle={{paddingLeft:15,color:'#1e1e1e', fontFamily:'NeueKabel-Regular'}} >CANCELLATION</CText>
                    </View>
                    <View style={{paddingRight:10}} >
                        <TouchableOpacity onPress={()=>this.Show()} >
                        <Image style={{width:15,height:15}} source={require("../images/plus.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this.renderData()} 

                <View style={{padding:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} >
                    <View style={{flexDirection:'row',paddingLeft:10}}>
                        <Image style={{width:25,height:25,paddingRight:10}} source={require("../images/return.png")} />
                        <CText cStyle={{paddingLeft:15,color:'#1e1e1e', fontFamily:'NeueKabel-Regular'}} >RETURN</CText>
                    </View>
                    <View style={{paddingRight:10}} >
                        <TouchableOpacity onPress={()=>this.Show()} >
                        <Image style={{width:15,height:15}} source={require("../images/plus.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this.renderData()}

                <View style={{padding:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} >
                    <View style={{flexDirection:'row',paddingLeft:10}}>
                        <Image style={{width:25,height:25,paddingRight:10}} source={require("../images/refund.png")} />
                        <CText cStyle={{paddingLeft:15,color:'#1e1e1e', fontFamily:'NeueKabel-Regular'}} >REFUNDS</CText>
                    </View>
                    <View style={{paddingRight:10}} >
                        <TouchableOpacity onPress={()=>this.Show()} >
                        <Image style={{width:15,height:15}} source={require("../images/plus.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this.renderData()}

                <View style={{padding:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} >
                    <View style={{flexDirection:'row',paddingLeft:10}}>
                        <Image style={{width:25,height:25,paddingRight:10}} source={require("../images/exchange.jpg")} />
                        <CText cStyle={{paddingLeft:15,color:'#1e1e1e', fontFamily:'NeueKabel-Regular'}} >EXCHANGE</CText>
                    </View>
                    <View style={{paddingRight:10}} >
                        <TouchableOpacity onPress={()=>this.Show()} >
                        <Image style={{width:15,height:15}} source={require("../images/plus.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
                {this.renderData()}
            </View>
        );
    }
}






            