import React, { Component } from 'react';
import { Text, View, Image, TextInput, Picker,Modal, FlatList, Alert, TouchableOpacity, Dimensions, ScrollView, Button } from 'react-native';
import styles from '../common/styles';
import { CText, CInput, CButton,} from '../common/index';

const AlertBox = ({Canel,Ok,headlines}) => {
    state = {
        ModalVisibleStatus: false,
    }
        return(
              <View>
                  <TouchableOpacity  onPress={() => { this.ShowModalFunction(true) }}>
                      <Text> data </Text>
                      </TouchableOpacity>
                  <Modal
                transparent={true}
                animationType={'slide '}
                visible={this.state.ModalVisibleStatus}
                onRequestClose={() => { this.ShowModalFunction(this.state.ModalVisibleStatus) }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(20,20,20,0.5)', justifyContent: 'center' }}>
                  <View style={[styles.FilterMain,{}]}>
                    <View style={[styles.row, styles.jspacebn]}>
                    <View style={[styles.jStart,{}]}>
                      <CText cStyle={{ marginVertical: 15,marginLeft:35,fontFamily:'NeueKabel-Light',fontSize:20,fontWeight:'bold',color:'#323232'}}>ALERT</CText>                        
                    </View>
                      <View style={{  alignItems: 'flex-end', }}>
                        <CButton onPress={() => {this.ShowModalFunction(!this.state.ModalVisibleStatus)}} >
                          <Image resizeMode='contain' source={require('../images/Sort_close.png')} style={{height:12,width:12,marginRight: 20, marginTop: 20 }} />
                        </CButton>
                      </View>
                    </View>
                    <View style={{height:100,borderColor:'#a0a0a0',borderTopWidth:0.6,justifyContent:'center'}}>
                    <CText cStyle={{  marginLeft: 35, marginVertical: 15 ,fontFamily:'NeueKabel-Regular',color:'#040404'}}>{headlines}</CText>
                    </View>
                    <View style={{bottom:0,flexDirection: 'row', justifyContent: 'flex-end', }}>
                      <CButton onPress={Canel}>
                        <CText cStyle={{ alignSelf: 'center', marginLeft: 35, marginVertical: 15 ,fontFamily:'NeueKabel-Regular',color:'#656565'}}>CANCEL</CText>
                      </CButton>
                      <CButton onPress={Ok}>
                        <CText cStyle={{ alignSelf: 'center', marginRight:35,marginLeft:45, marginVertical: 15,fontFamily:'NeueKabel-Regular',color:'#656565' }}>OK</CText>
                      </CButton>
                    </View>

                  </View>
                 </View>
              </Modal>
                  </View>  
        );
}
function ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  export {AlertBox};
