import React from 'react';
import {View, Modal, TouchableOpacity} from 'react-native';
import {CText, CButton,} from '../common/index';
import styles from '../common/styles';


const CModal = ({children,modalname,visible,buttonVisible,buttonClickRemove,buttonText, buttonClick, closeButton}) => {
    return (
        <Modal visible={visible} transparent animationType={'slide'} onRequestClose={() => {}}>
            <View style={{position:'absolute', top:0, left:0, right:0, bottom:0,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.7)'}}>
                <View style={{backgroundColor:'#fff',borderRadius:4, position:'absolute', top:'35%', left:20, right:20}}>
                    <View style={{paddingHorizontal:15, paddingVertical:10}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <CText cStyle={[{alignSelf:'center',fontSize:20}]}>{modalname}</CText>
                            <TouchableOpacity onPress={closeButton}>
                                <CText cStyle={[{fontSize:16,paddingHorizontal:5,marginBottom: 16,marginLeft:10 }]}>X</CText>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingHorizontal:20, marginVertical:8}}>{children}</View>
                    </View> 
                    <View style={{flexDirection:'row',alignSelf:'flex-end',marginTop:5}}>
                        <View style={{display:buttonVisible}}>
                            <CButton onPress={buttonClickRemove} cStyle={[{}]}>
                                <CText cStyle={[{padding:20,color:'#c01530'}]}>Yes</CText>
                            </CButton>
                        </View>
                        <CButton onPress={buttonClick} cStyle={[{}]}>
                            <CText cStyle={[{padding:20,color:'#c01530'}]}>{buttonText}</CText>
                        </CButton>
                       
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export {CModal};