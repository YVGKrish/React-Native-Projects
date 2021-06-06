
import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, Button, Dimensions, ScrollView } from 'react-native';
import { CText, CInput, CButton,CRadio,CModal,CSpinner  } from '../common/index';
import Loginheader from '../common/Loginheader';
import styles from '../common/styles';
import Utils from '../common/Utils';
import config from '../config/Config';
import CryptoJS from 'crypto-js';

class Signup extends Component {
    state = {
        fullName: '', email: '',inpmobile: '',password: '',femaleBool:'none',maleBool:'none',gender: '',role: 'user',
        hide: true,Cvisible:false,alertContent:'',spinnerBool: false,
    }

    VerifySignUp() {
        const self = this;
        if (self.state.fullName === '') {
            this.setState({Cvisible:true,alertContent:'Enter your User Name'});
            return false;
        } else if (!Utils.isValidEmail(self.state.email)) {
            this.setState({Cvisible:true,alertContent:'Enter your valid email'});
            return false;
        }
        else if (!Utils.isValidNumber(self.state.inpmobile) && !Utils.isValidMobile(Number(self.state.inpmobile))) {
            this.setState({Cvisible:true,alertContent:'Enter valid phone number'});
            return false;
        }
        else if (!Utils.isValidPassword(self.state.password)) {
            this.setState({Cvisible:true,alertContent:'Enter your password'});
            return false;
        }
        else if(self.state.gender===''){
            this.setState({Cvisible:true,alertContent:'Choose Your Gender'});
            return false;
        }else {
            self.setState({ spinnerBool: true });
            Utils.dbCall(config.routes.SignUp, 'POST', null, {
                fullName: self.state.fullName,
                email: self.state.email,
                mobile: Number(self.state.inpmobile),
                password: CryptoJS.SHA3(self.state.password).toString(),
                gender: self.state.gender,
                role: self.state.role
            }, function (resp) {
                if (resp.status) {
            this.setState({spinnerBool:false,Cvisible:true,alertContent:'Your registration process successfully completed'});
                    // self.props.navigation.navigate('login');
                }
                else{
                    this.setState({spinnerBool:false,Cvisible:true,alertContent:resp.message});
                }
            });
        }
    }
    spinnerLoad() {
        console.log('spinner');
        if (this.state.spinnerBool)
          return <CSpinner />;
        return false;
      }
    changeGenderStatus(value){
        if(value === 'M'){
            this.setState({ maleBool:'flex', femaleBool:'none', gender:'Male'});
        } else {
            this.setState({ maleBool:'none', femaleBool:'flex', gender:'Female'});
        }
    }
    render() {
        return (
            <View style={styles.SignupContaner}>
            {this.spinnerLoad()}
                <Image source={require('../images/Login_page.png')} resizeMode='stretch' style={styles.SignupImage} />
                <View style={styles.authMainView}>
                    <ScrollView>
                        <View style={[styles.flex1, {marginTop:100}]}>
                            <View style={{ marginBottom: 15, alignSelf: 'center' }}>
                                <CText>SIGNUP WITH</CText>
                            </View>
                            <View>
                                <Loginheader />
                            </View>
                            <View style={[styles.aitCenter, styles.mH75]}>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', margin: 10 }}>
                                    <CText cStyle={{ fontSize: 14 }}>Already have an account?</CText>
                                    <CButton onPress={() => this.props.navigation.navigate('Login')}>
                                        <CText cStyle={styles.Loginsignupstyles}> Login </CText>
                                    </CButton>
                                </View>
                                <View style={styles.Signuptextinput}>
                                    <CInput cStyle={styles.fontReg} placeholder='User Name' value={this.state.fullName} onChangeText={(fullName) => this.setState({ fullName })} />
                                </View>
                                <View style={styles.Signuptextinput}>
                                    <CInput cStyle={styles.fontReg} placeholder='Email Id' value={this.state.email} onChangeText={(email) => this.setState({ email })} />
                                </View>
                                <View style={styles.Signuptextinput}>
                                    <CInput cStyle={styles.fontReg} placeholder='Mobile Number' value={this.state.inpmobile} onChangeText={(inpmobile) => this.setState({ inpmobile })} />
                                </View>
                                <View style={styles.Signuptextinput}>
                                    <CInput cStyle={styles.fontReg} placeholder='password (min 8 char)' value={this.state.password} onChangeText={(password) => this.setState({ password })} secureTextEntry={this.state.hide} />
                                    <View style={{ position: 'absolute', alignSelf: 'flex-end', marginTop: 20,marginRight:15}}>
                                        <CButton cStyle={styles.aslEnd} onPress={() => this.setState({ hide: !this.state.hide })} >
                                            <Image source={require('../images/Login_touch.png')} style={{height:15,width:20,resizeMode:'contain'}} />
                                        </CButton>
                                    </View>
                                </View>
                                <View style={{flexDirection:'row',marginTop: 5}}>
                                    <CRadio label='Male' activeStyle={{display:this.state.maleBool}} onPress={() => this.changeGenderStatus('M')} />
                                    <CRadio label='Female' activeStyle={{display:this.state.femaleBool}} onPress={() => this.changeGenderStatus('F')} />
                                </View>
                                <CModal visible={this.state.Cvisible} 
                                        closeButton={()=>{this.setState({Cvisible:false});}} 
                                        buttonClick={()=>{this.setState({Cvisible:false});}} 
                                        buttonText='ok'
                                        buttonVisible='none'>
                                <CText style={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                                </CModal>
                                <View>
                                    <View style={styles.Signupbutton}>
                                        <CButton onPress={() => this.VerifySignUp()}>
                                            <CText cStyle={styles.SignuptextSignup}>SIGN UP</CText>
                                        </CButton>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const Styles = {
    SignuptextAccount: {
        fontSize: 13,
        alignSelf: 'center',
        color: '#434343'
    },
    Signuptextlogin: {
        color: 'red',
        fontSize: 13,
        marginLeft: 5
    },
}
export default Signup;
