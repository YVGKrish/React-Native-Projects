import React, { Component } from 'react';
import { Text, View, Image, TextInput, Picker, FlatList, Alert, TouchableOpacity, Dimensions, ScrollView, Button } from 'react-native';
import Utils from '../common/Utils';
import Config from '../config/Config';

import { CText, CRadio, CInput, CButton,CModal,CSpinner } from '../common/index';
import styles from '../common/styles';

export default class Address extends Component {
      state = {
            display: 'none',id: '',pic: require('../images/Address_Dropdown.png'),AllBool: 'none',WorkBool: 'none',datashow: 'none',
            token: '',colorcahnge: 'save',selectedButton: '',username: '',pincode: '',locality: '',City: '', MultiAdd: '',
            Delivary: '',AlternateNumber: '',state: '',LandMark: '',MobileNumber: '',Address: '',AddressBool: false,
            ChangeAddressTitle: 'ADD NEW ADDRESS',Cvisible:false,alertContent:'',RemoveVisible:'none',Cmodalname:'Alert'
             ,buttonText:'Ok'           
      }
      componentWillMount() {
            this.removeaddresid='';
            const self = this;
            Utils.getToken('user', function (tResp, tStat) {
                  if (tResp == '') {
                        self.setState({Cvisible:true,alertContent:'Please Login'});
                        self.props.navigation.navigate('Login');
                  } else {
                        self.setState({ token: tResp.token }, () => { self.fetchaddress() });
                  }
            });
      }
      fetchaddress() {
            const self = this;
            Utils.dbCall(Config.routes.getAddresses, 'GET', { token: self.state.token }, {},
                  function (resp) {
                        if (resp.status) {
                              // console.log('getaddress', resp);
                              self.setState({ MultiAdd: resp.details }, () => { self.flatlistdata(self.state.MultiAdd) })
                              self.setState({ selectedButton: '', })
                        } else {
                        self.setState({Cvisible:true,alertContent:'error in Address'});
                        }

                  });
      }
      editable(id, add) {
            const self = this;
            this.setState({
                  display: 'flex',
                  ChangeAddressTitle: 'Edit Address',
                  datashow:'none',
                  pic: require('../images/Address_uparrow.png')
            })
            Utils.dbCall(Config.routes.getSingleAddress, 'POST', { token: self.state.token }, { id: id }, function (resp) {
                  // console.log(resp);
                  if (resp.status) {
                        // console.log('mobile', resp.details.mobile)
                        self.setState({
                              id: id,
                              username: resp.details.name,
                              pincode: parseInt(resp.details.pincode),
                              locality: resp.details.locality,
                              City: resp.details.city,
                              LandMark: resp.details.landmark,
                              state: resp.details.state,
                              MobileNumber: resp.details.mobile,
                              Address: resp.details.address,
                              AlternateNumber: parseInt(resp.details.alternateMobile),
                              Delivary: resp.details.typeOfAddress,
                              AddressBool: true
                        })
                        self.changeGenderStatus(self.state.Delivary);
                  } else {
                        self.setState({Cvisible:true,alertContent:'error in Network'});
                  }
            });
      }
      Address(add) {
            const self = this;
            if (self.state.username === '') {
                  self.setState({Cvisible:true,alertContent:'Please enter username',RemoveVisible:'none'});
                  return false;//isValidPincode
            } else if (!Utils.isValidPincode(self.state.pincode)){
                  self.setState({Cvisible:true,alertContent:'Please enter pincode & Check your pincode'});
                  return false;
            } else if (self.state.locality === '') {
                  self.setState({Cvisible:true,alertContent:'Please enter locality'});
                  return false;
            } else if (self.state.Address === '') {
                  self.setState({Cvisible:true,alertContent:'Please enter address'});
                  return false;
            } else if (self.state.City === '') {
                  self.setState({Cvisible:true,alertContent:'Please enter City'});
                  return false;
            } else if (self.state.state === '') {
                  self.setState({Cvisible:true,alertContent:'Please enter state'});
                  return false;
            } else if (self.state.LandMark === '') {
                  self.setState({Cvisible:true,alertContent:'Please enter LandMark'});
                  return false;
            } else if (!Utils.isValidNumber(self.state.MobileNumber) && !Utils.isValidMobile(Number(self.state.MobileNumber))) {
                  self.setState({Cvisible:true,alertContent:'Please enter MobileNumber'});
                  return false;
            } else if (self.state.Delivary === '') {
                  self.setState({Cvisible:true,alertContent:'Please enter Delivary'});
                  return false;
            } else if (!self.state.AddressBool) {
                  Utils.dbCall(Config.routes.addAddress, 'POST', { token: self.state.token }, {
                        details: {
                              name: self.state.username,
                              mobile: parseInt(self.state.MobileNumber, 10),
                              pincode: parseInt(self.state.pincode),
                              locality: self.state.locality,
                              address: self.state.Address,
                              city: self.state.City,
                              state: self.state.state,
                              landmark: self.state.LandMark,
                              alternateMobile: Utils.isValidNumber(self.state.AlternateNumber) && Utils.isValidMobile(Number(self.state.AlternateNumber)),
                              typeOfAddress: self.state.Delivary,
                        }, todo: add
                  }, function (resp) {
                        // console.log(resp);
                        if (resp.status) {
                              self.fetchaddress()
                                    // if (selectedButton === '') {
                                    //       self.setState({
                                    //             selectedButton: 'save'
                                    //       })
                                    // } else {
                                    //       self.setState({
                                    //             selectedButton: ''
                                    //       })
                                    // }
                              self.setState({
                                    selectedButton: 'save',Cvisible:true,alertContent:'successfully add'
                              })
                              self.cleardat()
                        } else {
                              // console.log(' error in Network==>', resp);
                              self.setState({Cvisible:true,alertContent:'error in Network'});
                        }
                  });
            } else {
                  // console.log(self.state.Address);
                  Utils.dbCall(Config.routes.addAddress, 'POST', { token: self.state.token }, {
                        details: {
                              _id: self.state.id,
                              name: self.state.username,
                              mobile: parseInt(self.state.MobileNumber, 10),
                              pincode: parseInt(self.state.pincode),
                              locality: self.state.locality,
                              address: self.state.Address,
                              city: self.state.City,
                              state: self.state.state,
                              landmark: self.state.LandMark,
                              alternateMobile: parseInt(self.state.AlternateNumber, 10),
                              typeOfAddress: self.state.Delivary,
                        }, todo: 'edit'
                  }, function (resp) {
                        // console.log(resp);
                        if (resp.status) {
                              self.fetchaddress()
                              self.setState({
                                    selectedButton: '',Cvisible:true,alertContent:'successfully add'
                              })
                              self.cleardat()
                        } else {
                              self.setState({Cvisible:true,alertContent:'error in Network'});
                              // console.log('error in Network ==>', resp);
                        }
                  });
            }
            self.setState({ AddressBool: false, selectedButton: '', })
      }
      data() {
            if (this.state.display === 'flex') {
                  this.setState({
                        display: 'none',
                        pic: require('../images/Address_Dropdown.png'),
                  })
                  this.cleardat();
            } else {
                  this.setState({
                        display: 'flex',
                        pic: require('../images/Address_uparrow.png'),
                        datashow:'none'
                  })
            }
      }
      CANCEL() {
            this.setState({
                  selectedButton: 'save',
                  display: 'none',
                  pic: require('../images/Address_Dropdown.png'),
                  ChangeAddressTitle: 'ADD NEW ADDRESS',
            })
            this.setState({
                  selectedButton: '',
            })
            this.cleardat();
      }
      changeGenderStatus(value) {
            if (value === 'ALL') {
                  this.setState({ AllBool: 'flex', WorkBool: 'none', Delivary: 'allDay' });
            } else {
                  this.setState({ AllBool: 'none', WorkBool: 'flex', Delivary: 'work' });
            }
      }
      flatlistdata() {
            return (
                  <FlatList
                        data={this.state.MultiAdd}
                        keyExtractor={(item, index) => index}
                        //renderItem={this.itemRender}
                        renderItem={({ item }) => this.getaddress(item)}
                  //extraData={this.state.selectedButton}
                  />
            );
      } 
      cleardat() {
            //   console.warn("fcghdf");
            this.setState({
                  username: '', pincode: '',locality: '',City: '',LandMark: '',state: '',MobileNumber: '', Address: '',
                  AlternateNumber: '',Delivary: '',AllBool: 'none', WorkBool: 'none',ChangeAddressTitle: 'ADD NEW ADDRESS',
                  datashow:'flex'
            })
      }
      getaddress(getdata) {
            // console.warn(getdata);
            this.setState({
                  datashow: 'flex',
                  display: 'none',
                  pic: require('../images/Address_Dropdown.png')
            })
            return (
                  <View>
                        <View style={{ margin: 10, borderWidth: 0.5, flexDirection: 'column' }}>
                              <CText cStyle={{ marginTop: 20, marginLeft: 20, color: '#2c2c2c', fontSize: 16, fontFamily: 'NeueKabel-Book' }}>Current address</CText>
                                    <View style={{marginLeft:10}}> 
                                    <CText cStyle={{ fontSize: 14, color: '#2c2c2c', fontFamily: 'NeueKabel-Light', lineHeight: 20.7, marginLeft: 20, marginRight: 5, marginTop: 10 }}>
                                    {getdata.name}
                                    </CText>
                                    <CText cStyle={{ fontSize: 14, color: '#2c2c2c', fontFamily: 'NeueKabel-Light', lineHeight: 20.7, marginLeft: 20, marginRight: 5, marginTop: 2 }}>
                                          {getdata.landmark},{getdata.locality}
                                    </CText>
                                    <CText cStyle={{ fontSize: 14, color: '#2c2c2c', fontFamily: 'NeueKabel-Light', lineHeight: 20.7, marginLeft: 20, marginRight: 5, marginTop: 2 }}>
                                          {getdata.city},{getdata.address}
                                    </CText>
                                    <CText cStyle={{ fontSize: 14, color: '#2c2c2c', fontFamily: 'NeueKabel-Light', lineHeight: 20.7, marginLeft: 20, marginRight: 5, marginTop: 2 }}>
                                          {getdata.state},{getdata.pincode}
                                    </CText>
                                    </View>
                              <CText cStyle={{ fontSize: 16, color: '#2c2c2c', marginLeft: 20, margin: 10,marginTop:15, fontFamily: 'NeueKabel-Book' }}>Mobile:+91 {getdata.mobile}</CText>
                              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', }}>
                                    <TouchableOpacity 
                                          onPress={() => {
                                          this.setState({Cvisible:true,alertContent:'Are you sure you want to Remove the Address', Cmodalname:'Remove',
                                                       RemoveVisible:'flex',buttonText:'No'
                                                       });
                                           this.removeaddresid=getdata._id           
                                                // Alert.alert('Remove', 'Are you sure you want to Remove the Address',
                                                //       [{ text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                                //       { text: 'YES', onPress: () => { this.removeAddress(getdata._id) } }]
                                                // )
                                          }} >
                                          <View style={{ borderWidth: 1, margin: 10 }}>
                                                <CText cStyle={{ marginVertical: 5, marginHorizontal: 10, fontSize: 12, color: '#313131', fontFamily: 'NeueKabel-Book' }}>Remove</CText>
                                          </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.editable(getdata._id, 'edit')}>
                                          <View style={{ borderWidth: 1, backgroundColor: '#383838', marginRight: 20, margin: 10 }}>
                                                <CText cStyle={{ marginVertical: 5, marginHorizontal: 10, fontSize: 12, color: '#ffffff', fontFamily: 'NeueKabel-Book' }}>Edit</CText>
                                          </View>
                                    </TouchableOpacity>
                              </View>
                        </View>

                  </View>
            );
            this.cleardat()
      }
      //   showaddress(){ 
      //       this.setState({
      //             display:'none',
      //             pic:require('../images/Address_Dropdown.png'),
      //         })
      //         this.getaddress(this.state.MultiAdd)

      //   }
      removeAddress() {
            const self = this;
            let id =this.removeaddresid;
            Utils.dbCall(Config.routes.removeAddress, 'POST', { token: self.state.token }, { index: id }, function (resp) {
                  // console.log(resp);
                  if (resp.status) {
                        // console.log('remove the address ==>', resp);
                        self.fetchaddress()
                        self.removeaddresid=''
                        self.setState({Cvisible:false,buttonText:'Ok',Cmodalname:'Alert',RemoveVisible:'none'});
                  } else {
                        // console.log('error in Men ==>', resp);
                  }
            });
      }
      render() {
            return (
                  <View style={{ flex: 1, backgroundColor: '#fff' }}>
                              <View style={{ backgroundColor: '#c01530', flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Menu')}>
                                          <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                                <Image resizeMode='contain' style={{ height: 20, width: 15, marginTop: 19,margin:17 }} source={require('../images/leftarrow.png')} />
                                          </View>
                                    </TouchableOpacity>
                                    <CText cStyle={{ color: '#ffffff', fontFamily: 'NeueKabel-Book', fontSize: 16, margin: 17 }}>ADDRESS DETAIL</CText>
                              </View>
                        <ScrollView>                              
                              <View style={{ margin: 10, }}>
                                    <View style={{ backgroundColor: '#ebebeb', flexDirection: 'row', justifyContent: 'space-between' }}>
                                          <View style={{ flexDirection: 'row', }}>
                                                <View>
                                                      <Image resizeMode='contain' style={{ height: 30, width: 30, margin: 10, marginLeft: 10 }} source={require('../images/Address_Nav.png')} />
                                                </View>
                                                <CText cStyle={{ color: '#2c2c2c', fontFamily: 'NeueKabel-Book', fontSize: 13.7, alignSelf: 'center', marginLeft: 10 }}>{this.state.ChangeAddressTitle}</CText>
                                          </View>
                                          <TouchableOpacity onPress={() => this.data()}>
                                                <View>
                                                      <Image resizeMode='contain' style={{ height: 21, width: 17, marginRight: 20, marginVertical: 10 }} source={this.state.pic} />
                                                </View>
                                          </TouchableOpacity>
                                    </View>

                                    <View display={this.state.display} style={{borderWidth:0.5,borderTopWidth:0}}>

                                          <View>
                                                <TextInput style={[styles.fontReg,{ borderBottomWidth: 0.5, width: '90%', marginLeft: 10, borderWidth: 0 }]}
                                                      placeholder='username'
                                                      placeholderTextColor='#434343'
                                                      value={this.state.username}
                                                      onChangeText={(username) => this.setState({ username })}
                                                      underlineColorAndroid={'transparent'}
                                                />
                                          </View>
                                          <View style={{ flexDirection: 'row' }}>
                                                <TextInput style={[styles.fontReg,{ paddingLeft: 20, borderBottomWidth: 0.5, marginLeft: 10, width: '45%', borderWidth: 0 }]}
                                                      placeholder='pincode'
                                                      placeholderTextColor='#434343'
                                                      value={String(this.state.pincode)} onChangeText={(pincode) => this.setState({ pincode })}
                                                      underlineColorAndroid={'transparent'}
                                                      maxLength={6}
                                                      keyboardType='numeric'
                                                />
                                                <TextInput style={[styles.fontReg,{ paddingLeft: 20, borderBottomWidth: 0.5, width: '45%', marginLeft: 5, borderWidth: 0}]}
                                                      placeholder='locality'
                                                      placeholderTextColor='#434343'
                                                      value={this.state.locality} onChangeText={(locality) => this.setState({ locality })}
                                                      underlineColorAndroid={'transparent'}
                                                />
                                          </View>
                                          <View>
                                                <TextInput style={[styles.fontReg,{ borderBottomWidth: 0.5, width: '90%', marginLeft: 10, borderWidth: 0 }]}
                                                      placeholder='Address'
                                                      placeholderTextColor='#434343'
                                                      value={this.state.Address} onChangeText={(Address) => this.setState({ Address })}
                                                      underlineColorAndroid={'transparent'}
                                                />
                                          </View>
                                          <View style={{ flexDirection: 'row' }}>

                                                <TextInput style={[styles.fontReg,{ paddingLeft: 20, borderBottomWidth: 0.5, marginLeft: 10, width: '45%', borderWidth: 0 }]}
                                                      placeholder='City/district/Town'
                                                      placeholderTextColor='#434343'
                                                      value={this.state.City} onChangeText={(City) => this.setState({ City })}
                                                      underlineColorAndroid={'transparent'}
                                                />
                                                <TextInput style={[styles.fontReg,{ paddingLeft: 20, borderBottomWidth: 0.5, marginLeft: 5, width: '45%', borderWidth: 0 }]}
                                                      placeholder='state'
                                                      placeholderTextColor='#434343'
                                                      value={this.state.state} onChangeText={(state) => this.setState({ state })}
                                                      underlineColorAndroid={'transparent'}
                                                />
                                          </View>
                                          <View>
                                                <TextInput style={[styles.fontReg,{ borderBottomWidth: 0.5, width: '90%', marginLeft: 10, borderWidth: 0 }]}
                                                      placeholder='LandMark'
                                                      placeholderTextColor='#434343'
                                                      value={this.state.LandMark} onChangeText={(LandMark) => this.setState({ LandMark })}
                                                      underlineColorAndroid={'transparent'}
                                                />
                                          </View>
                                          <View>
                                                <TextInput style={[styles.fontReg,{ borderBottomWidth: 0.5, width: '90%', marginLeft: 10, borderWidth: 0 }]}
                                                      placeholder='MobileNumber'
                                                      placeholderTextColor='#434343'
                                                      value={String(this.state.MobileNumber)} onChangeText={(MobileNumber) => this.setState({ MobileNumber })}
                                                      underlineColorAndroid={'transparent'}
                                                      maxLength={10}
                                                      keyboardType='numeric'
                                                />
                                          </View>
                                          <View>
                                                <TextInput style={[styles.fontReg,{ borderBottomWidth: 0.5, width: '90%', marginLeft: 10, borderWidth: 0 }]}
                                                      placeholder='AlternateNumber'
                                                      placeholderTextColor='#434343'
                                                      value={String(this.state.AlternateNumber)} onChangeText={(AlternateNumber) => this.setState({ AlternateNumber })}
                                                      underlineColorAndroid={'transparent'}
                                                      maxLength={10}
                                                      keyboardType='numeric'
                                                />
                                          </View>
                                          <View style={{ marginTop: 5 }}>
                                                <CRadio label='All day delivary' activeStyle={{fontFamily:'NeueKabel-Medium'}} activeStyle={{ display: this.state.AllBool }} onPress={() => this.changeGenderStatus('ALL')} />
                                                <CRadio label='Work (Delivery between 10AM to 5PM)' activeStyle={{fontFamily:'NeueKabel-Medium'}} activeStyle={{ display: this.state.WorkBool }} onPress={() => this.changeGenderStatus('WORK')} />
                                          </View>
                                          <View style={{ flexDirection: 'row', margin: 10 }}>
                                                <CButton cStyle={{flex: 1,justifyContent: 'center'}} onPress={() => this.CANCEL()}>
                                                      <View style={{flex: 1, alignSelf: 'center',  backgroundColor: '#fff',borderWidth: 0.5}}>
                                                            <CText cStyle={{ alignSelf: 'center', color: '#434343',marginHorizontal: 50,  marginVertical: 15 }}>CANCEL</CText>
                                                      </View>
                                                </CButton>
                                                <CButton cStyle={{ flex: 1,  justifyContent: 'center',}} onPress={() => this.Address('add')}>
                                                      <View style={{ flex: 1, justifyContent: 'center', backgroundColor:'#c01530',borderWidth: 0.5 }}>
                                                            <CText cStyle={{ alignSelf: 'center', color: '#fff', marginHorizontal: 10, marginVertical: 15 }}>SAVE</CText>
                                                      </View>
                                                </CButton>
                                          </View>
                                    </View>
                              </View>
                              <View display={this.state.datashow} >
                                    {this.flatlistdata()}
                              </View>
                              <CModal visible={this.state.Cvisible} 
                                    closeButton={()=>{this.setState({Cvisible:false});}} 
                                    buttonClick={()=>{this.setState({Cvisible:false});}}
                                    buttonText={this.state.buttonText}
                                    modalname={this.state.Cmodalname}
                                    buttonClickRemove={() => this.removeAddress()}
                                    buttonVisible={this.state.RemoveVisible}>
                              <CText style={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                              </CModal>
                        </ScrollView>
                  </View>
            );
      }
}