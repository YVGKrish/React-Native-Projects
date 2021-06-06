
import React, { Component } from 'react';
import { Text, Alert, Modal, View, ScrollView, Image, TouchableOpacity, AsyncStorage, TextInput, Button, Dimensions } from 'react-native';
import Loginheader from '../common/Loginheader';
import { CText, CInput, CButton,CModal,CSpinner } from '../common/index';
import styles from '../common/styles';
import Utils from '../common/Utils';
import config from '../config/Config';
import CryptoJS from 'crypto-js';
import {LoginManager,LoginButton,AccessToken,GraphRequest,GraphRequestManager} from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

const Token = 'access_token';

class Login extends Component {

  state = {
    ModalVisibleStatus: false,spinnerBool: false,
    // inpemail: '',
    // password: '',
    hide: true,Cvisible:false,alertContent:'',inpemail: 'dinesh.dk@mtwlabs.com', password: 'dinesh8142',shoepass: true,
    mergearray: [],passwordFlag: 'INPUT',resetPasswordBool: false,fpModalCloseBool: 'flex', Femail:''
  }

  componentWillMount() {
    const self = this;
    self.getCartCountBagLogin();
    GoogleSignin.hasPlayServices({ autoResolve: true });
    GoogleSignin.configure({
      webClientId: '435138601262-7l10o1dj6r2ep2rfu7cvehq0uo46psge.apps.googleusercontent.com',
    });
  }

  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  spinnerLoad() {
    console.log('spinner');
    if (this.state.spinnerBool)
      return <CSpinner />;
    return false;
  }
  submitLogin() {
    const self = this;
    const { navigate } = this.props.navigation;
    // let mobileEmailTxt = self.state.inpMobile;
    //   if (!Utils.isValidNumber(self.state.inpmobile) && !Utils.isValidMobile(Number(self.state.inpmobile))) {
    //     alert('Enter valid phone number');
    //     return false;
    // } 
    if (!Utils.isValidEmail(self.state.inpemail)) {
      self.setState({Cvisible:true,alertContent:'please enter valid email'});
      return false;
    } else if (!Utils.isValidPassword(self.state.password)) {
      self.setState({Cvisible:true,alertContent:'please enter valid password'});
      return false;
    } else {
      self.setState({ spinnerBool: true });
       //console.warn(JSON.stringify({ email: self.state.inpemail, password: CryptoJS.SHA3(self.state.password).toString() }));
      Utils.dbCall(config.routes.Login, 'POST', null, { email: self.state.inpemail, password: CryptoJS.SHA3(self.state.password).toString() }, function (resp) {
        //console.warn(resp, ' =======');
        if (resp.status) {
          self.afterLogin(resp, 'NORMAL', '');
        } else {
          self.setState({Cvisible:true,alertContent:'Could not process log in, try again!!',spinnerBool:false});
        }
      });
    }

  }

  getCartCountBagLogin() {
    const self = this;
    var shoparr1 = {};
    Utils.getCart('carty', function (tResp, tStat) {
      if (tStat) {
        console.log('===================================', tResp);
        if (tResp === "[]") {
          self.setState({ productdetls: [] }, () => { console.log("riyazsjkc", self.state.productdetls) });
          self.setState({ BagCount: 0 })

        }
        else {
          if (tResp != '') {
            var testarr = [];
            var shoparr = [];
            var GetJsonArr = JSON.parse(tResp);
            self.setState({ BagCount: GetJsonArr.length });
            console.log('BagCount', self.state.BagCount)
            self.setState({ totalproducts: GetJsonArr }, () => { console.log('totalproducts length*****', self.state.totalproducts.length) });
            for (let i = 0; i < GetJsonArr.length; i++) {
              const element = GetJsonArr[i];
              testarr.push(element.vendorId.shopName);
            }
            for (let j = 0; j < testarr.length; j++) {
              if (shoparr.indexOf(testarr[j]) == -1) {
                shoparr.push(testarr[j]);
              }
            }
            for (let k = 0; k < shoparr.length; k++) {
              shoparr[k] = { shopname: shoparr[k], product: [] };
            }
            const prodcarts = {};
            var details = [];
            for (let j = 0; j < shoparr.length; j++) {
              var shopname = shoparr[j].shopname;
              var shopproducts = [];
              for (let index = 0; index < GetJsonArr.length; index++) {
                const element = GetJsonArr[index];
                const prodsize = GetJsonArr[index].size;
                console.log('element.size ====', prodsize);

                if (shopname === element.vendorId.shopName) {
                  console.log('prodsize', prodsize, 'element.size', element.size)
                  element.shopName = shopname;
                  element.prodName = element.name;

                  shoparr[j].product.push(element);
                }
              }
              details.push(shoparr[j].product);
              prodcarts.details = details;
              self.setState({ productdetls: prodcarts }, () => { console.log("riyazsjkc", self.state.productdetls) });
              // console.log()		
            }
            console.log("Dinesh kumar", self.state.productdetls)
            console.log('testarr-------', testarr)
            console.log('shopNames*******', shoparr);
            // console.log('shoparr product length',shoparr[0].product.length)
            var apiarr = [];
            for (let index = 0; index < shoparr.length; index++) {
              for (let i = 0; i < shoparr[index].product.length; i++) {
                apiarr.push({ id: shoparr[index].product[i]._id, size: shoparr[index].product[i].size, quantity: shoparr[index].product[i].quantity });
                console.log('shopName:', shoparr[index].product[i].shopName, 'productID:', shoparr[index].product[i]._id,
                  'productName:', shoparr[index].product[i].name,
                  'size:', shoparr[index].product[i].size,
                  'quantity:', shoparr[index].product[i].quantity);

              }
            }

            self.setState({ mergearray: apiarr }, () => { console.log('mergearray', self.state.mergearray) });

            // console.log('apiarr', apiarr[0].id);

          }
        }

      }
    })
  }

  faceBookSignInCall(){
    const self = this;
    LoginManager.logInWithReadPermissions(["email", "user_friends", "public_profile"]).then((result) => {
      if(result.isCancelled){
        this.setState({Cvisible:true,alertContent:'Login was cancelled'});
      } else {
          // alert('Login was success -- ' + result.grantedPermissions.toString());
          AccessToken.getCurrentAccessToken().then((data) => {
              const responseInfoCallback = (error, result) => {
                  if (error) {
                    this.setState({Cvisible:true,alertContent:'Error while logging with FB'});
                  } else {
                    console.log('==>>>>> ' + JSON.stringify(result));
                    Utils.dbCall(config.routes.checkSocialLoginDetails, 'POST', null, { 
                      name: result.first_name + ' ' + result.last_name, email: result.email 
                    }, function (resp) {
                      // alert(resp);
                      self.afterLogin(resp, 'SOCIAL', result.email);
                    });
                  }
                }
                const infoRequest = new GraphRequest('/me', { 
                  accessToken: data.accessToken,
                  parameters: { fields: { string: 'email, name, first_name, middle_name, last_name' }} 
                }, responseInfoCallback);
                // Start the graph request.
                new GraphRequestManager().addRequest(infoRequest).start()
            });
        }
    }, (err) => {
      this.setState({Cvisible:true,alertContent:'An error occurred in Facebook' + err });
    });
  }

  googleSignInCall() {
    const self = this;
    GoogleSignin.signIn().then((user) => {
        // alert(JSON.stringify(user));        
        let firstName = ''; let lastName = '';
        if (user.givenName) {
          firstName = user.givenName;
        }
        if (user.familyName) {
          lastName = user.familyName;
        }
        let email = user.email;
        
        Utils.dbCall(config.routes.checkSocialLoginDetails, 'POST', null, { name: firstName + ' ' + lastName, email: email }, function (resp) {
          // alert(resp);
          self.afterLogin(resp, 'SOCIAL', email);
        });
      }).catch((err) => {
        this.setState({Cvisible:true,alertContent:'An error occurred in google signUp' + err });
        // console.warn('WRONG SIGNIN', err);
      }).done();
  }

  renderForgotPassword(){
    if(this.state.passwordFlag === 'INPUT'){
      return (<View style={[styles.mH40]}>
        <CText cStyle={[styles.ForgotpasswordText]}>RESET PASSWORD</CText>
        <TextInput placeholder='Enter Your Email Id' value={this.state.Femail} underlineColorAndroid='#EEE'
          onChangeText={(Femail) => this.setState({Femail})} style={styles.fontReg}/> 
        <CButton cStyle={styles.Forgotpasswordsubmitbutton} onPress={()=> this.changeForgotPassword()}>
            <CText cStyle={styles.ForgotpasswordSubmit}>SUBMIT</CText>
        </CButton>
      </View>)
    } else if(this.state.passwordFlag === 'VERIFY'){
      return (<View style={styles.mT30}>
        <CText cStyle={[styles.ForgotpasswordText]}>FASHIONPECKS</CText>
          <CText cStyle={[styles.ForgotpasswordText, styles.mT20]}>Reset instructions has been sent to </CText>
          <CText cStyle={[styles.ForgotpasswordText, styles.mT5, styles.mB15]}>Your Email Address</CText> 
            <View style={[styles.Forgotpasswordbutton, {width:'100%'}]}>
              <CButton onPress={() => {this.setState({resetPasswordBool:!this.state.resetPasswordBool})} }>
                  <CText cStyle={{color:'white',textAlign:'center',margin:15}} > OK</CText>
              </CButton>
            </View>
        </View>)
    }
  }

  changeForgotPassword(){
    const self=this;
    if (this.state.Femail === '') {
      this.setState({Cvisible:true,alertContent:'please enter your email'});
    } else {
      Utils.dbCall(config.routes.Forgot, 'POST', null, {
        email: self.state.Femail
      }, function (resp) {
        // console.log(resp)
        if (resp.status) {
          self.setState({ passwordFlag: 'VERIFY', fpModalCloseBool: 'none' });
        } else {
      this.setState({Cvisible:true,alertContent:'please try again'});
        }
      });
    }
  }

  afterLogin(loginResp, loginType, email){
    const self = this;
    if(loginType === 'NORMAL'){
      Utils.dbCall(config.routes.mergeOfflineCart, 'POST', { token: loginResp.token }, { ids: self.state.mergearray }, function (resp) {
        console.warn(resp, 'mergeOfflineCart');
        if (resp.status) {}
      });
    }
    if(loginType === 'SOCIAL'){
      loginResp.role = 'user';
      loginResp.myCartCount = 0;
      loginResp.wishListCount = 0;
      loginResp.email = email;
    }
    console.warn(loginResp, ' ===>>>>>>>>>>>');
    let myCartCount = loginResp.myCartCount + self.state.mergearray.length;
    Utils.setBagCount('CartCount', myCartCount, function (tResp, tStat) {
      if (tStat) {
        Utils.setWishList('withy', loginResp.wishListCount, function (tWResp, tWStat) {
          if (tWStat) {
            Utils.setToken('user', loginResp, function (tUResp, tUStat) {
              if (tUStat) {
                self.props.navigation.navigate('Home');
                self.setState({ spinnerBool: false });
              }
            });
          }
        });
      }
    });
  }
modalvisiabal(Visable){
this.setState({Cvisible:Visable})
}
  render() {

    return (
      <View style={styles.LoginContaner}>
            {this.spinnerLoad()}
        <Image source={require('../images/Login_page.png')} style={styles.SignupImage} resizeMode='stretch' />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.flex1, styles.mT120, styles.padHV20]}>

              <CText cStyle={styles.LoginMainText} > LOGIN WITH </CText>
              <View style={[styles.jCenter, styles.mT15]}>
                <Loginheader googleClick={() => this.googleSignInCall()} faceBookClick={() => this.faceBookSignInCall()} />
              </View>

              <View style={[styles.flexRow, styles.aslCenter, styles.mH10, styles.mT10]}>
                <CText cStyle={{ fontSize: 14 }}>Don't have an account? </CText>
                <CButton onPress={() => this.props.navigation.navigate('Signup')}>
                  <CText cStyle={styles.Loginsignupstyles}> Sign Up </CText>
                </CButton>
              </View>

              <View style={[styles.Logintextinput, styles.mT20, { borderBottomWidth: 1, borderBottomColor: '#DDD' }]}>
                <TextInput style={styles.fontReg}
                  underlineColorAndroid="transparent"
                  value={this.state.inpemail} onChangeText={(inpemail) => this.setState({ inpemail })}
                  placeholderTextColor='#434343'
                  placeholder='Phone Number / Mail id'
                />
              </View>
              <View style={[styles.Logintextinput, { borderBottomWidth: 1, borderBottomColor: '#DDD' }]}>
                <TextInput secureTextEntry={this.state.hide} style={styles.fontReg}
                  placeholder='Password (Min 8 characters)'
                  placeholderTextColor='#434343'
                  value={this.state.password} onChangeText={(password) => this.setState({ password })}
                  underlineColorAndroid={'transparent'}
                />
                <View style={styles.LoginHidePass}>
                  <CButton cStyle={styles.aslEnd}
                    onPress={() => { this.setState({ hide: !this.state.hide }) }}>
                    <Image source={require('../images/Login_touch.png')} style={{ height: 15, width: 20, resizeMode: 'contain', marginBottom: 10 }} />
                  </CButton>
                </View>
              </View>
              <View style={[styles.aitEnd, styles.mTop10]}>
                <CButton onPress={() => this.setState({ resetPasswordBool:!this.state.resetPasswordBool })}>
                  <CText cStyle={styles.LoginforgotpassText}>Forgot password?</CText>
                </CButton>
              </View>
              <View style={[styles.Loginbutton,{alignSelf:'center'}]}>
                <CButton onPress={() => this.submitLogin()}>
                  <CText cStyle={styles.LoginBtnText}>
                    LOGIN
                  </CText>
                  <CModal visible={this.state.Cvisible} 
                          closeButton={()=>{this.setState({Cvisible:false});}} 
                          buttonClick={()=>{this.setState({Cvisible:false});}} 
                          buttonText='ok'
                          modalname='Alert'
                          buttonVisible='none'>
                  <CText cStyle={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                  </CModal>
                </CButton>
              </View>

            </View>
          </ScrollView>
        </View>

        <Modal transparent={true} animationType={'slide'} visible={this.state.resetPasswordBool}
          onRequestClose={() => { console.log('submitted') }}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,.5)'}}> 
            <View style={styles.ForgotModalWrap}>
              <TouchableOpacity style={[styles.aitEnd, styles.p10, {display:this.state.fpModalCloseBool}]} 
                onPress={() => this.setState({ resetPasswordBool:!this.state.resetPasswordBool })}>
                  <CText cStyle={[styles.c666]}>X</CText>
              </TouchableOpacity>
              {this.renderForgotPassword()}    
            </View>
          </View> 
        </Modal>

      </View>
    );
  }
}


export default Login;
