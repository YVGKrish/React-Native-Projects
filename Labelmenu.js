import React, {Component} from 'react';
import{Text,View,TouchableOpacity,Dimensions,ScrollView,Image} from 'react-native';
import {CText, CInput, CButton,} from '../common/index';
import styles from '../common/styles';

const Labelmenu = ({field, onPress}) => (
           
       <View style={[styles.Labeltabbar,{paddingLeft:10}]} >
                <View style={{}}> 
                    <CText cStyle={styles.LabelText1}> {field} </CText>
                </View> 
                <View style={{paddingRight:10}}>
                  <CButton  cStyle={{flexDirection:'row', alignItems:'center'}}  onPress={onPress}>
                       <CText cStyle={styles.LabelText2}> See more  </CText>
                       <Image source={require('../images/see-more-icon.png')} style={{marginTop:2,width:10, height:8.5,resizeMode:'contain'}} />
                  </CButton>
                </View> 
           </View>    
    );
export  {Labelmenu};