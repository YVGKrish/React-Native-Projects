import React, { Component } from 'react';
import { Text, View, TabNavigator, Button, ScrollView, Image, Alert, AsyncStorage, StyleSheet, NativeModules, TouchableOpacity } from 'react-native';
import styles from '../common/styles';
import { CText, CButton,CSpinner, CInput,CModal} from '../common/index';
import Utils from '../common/Utils';
import Config from '../config/Config';
import ImagePicker from 'react-native-image-picker';

const imgPickerOptions = {
  title: 'Select image',
  storageOptions: {
    skipBackup: true,
    id:3,
    path: 'images'
  },
  maxWidth: 1024,
  maxHeight: 512,
  // maxWidth: 200,
  // maxHeight: 220,
  quality: 1,
  noData: true
};

export default class Menu extends React.Component {
  state = {
    token: '', ProfileData: [], image: '',ordercount:0,orderdata:[],
    imageUploadBool: false, mobile_no: null, username: '------', pic: require('../images/dummy.jpg'),
    MWishCount: 0, addPostImage: '', userID: '',Cvisible:false,alertContent:'',RemoveVisible:'none',Cmodalname:'Alert'
    ,buttonText:'Ok'           
  }
  spinnerLoad() {
    //console.log('spinner');
    if (this.state.spinnerBool)
      return <CSpinner />;
    return false;
  }
  updatewishCount()
  {
    const self=this;
    const count =0;
    const test =self.state.MWishCount;
    //console.log('test in update',test)
    Utils.getWishList('withy',function(tResp,tStat){
      if(tStat && tResp!= '')
      {
        // self.setState({MWishCount:tResp});
        self.wishCount = tResp;
        //console.log('wcount in update',self.state.MWishCount);
        self.count = tResp;
      }else{
        self.count = 0;
      }     
      
    });
    return self.count;
  }
  
  
  componentWillMount(){
    const self=this;
    self.wishCount = 0;
    self.count = 0;
    self.orderCount = 0;
    self.onPickImage = self.onPickImage.bind(self);
    self.onReset = self.onReset.bind(self);
    Utils.getWishList('withy',function(tResp,tStat){
      if(tResp!= ''){
        // self.setState({MWishCount:tResp});
        self.wishCount = tResp;
      }
    });
    Utils.getToken('user',function(tResp, tStat){
      if(tResp){
        self.setState({ userID:tResp.id, token:tResp.token },()=>{
          self.profiledata();
        });
      } else {
        // no token
      }
    });
    self.fetchProfileCacheCount();
  }

  fetchProfileCacheCount(){
    const self=this;
    Utils.getToken('profileCacheCount', function(tResp, tStat){
      console.log(tResp, ' count -------------------------------')
      if(!tStat){
        Utils.setToken('profileCacheCount', '1', function(sResp, sStat){});
        self.count = 1;
      } else {
        self.count = tResp;
      }
    });
  }

  getMyOrders() {
		const self = this;
	 if(self.state.token !== ''){
    Utils.dbCall(Config.routes.getMyOrders, 'GET', { token: self.state.token }, {}, function (resp) {
			if (resp.status) {
      // console.log(resp,'<------myorders');
        self.orderCount = resp.details.length;
				self.setState({ orderdata:resp.details }); //ordercount: resp.details.length, removed this because it is looping states.
			} else {
        self.setState({Cvisible:true,alertContent:resp.message});
				// alert(resp.message);
			}
		});
   }else{
     return false;
   }
	}

  profiledata() {
    const self = this;
    console.warn("--------token-----", self.state.token);
    if(self.state.token !== ''){
      Utils.dbCall(Config.routes.getprofiledata, 'GET', { token: self.state.token }, {}, (resp) => {
        console.log(resp);
        if (resp.status) {
          //console.warn(resp.details);
          self.setState({
            ProfileData: resp.details,
            mobile_no: resp.details.mobile,
            username: resp.details.fullName,
            image: resp.details.profilePic
          }, () => {
            self.getMyOrders();
          });
        } else {
          //console.log('error in Men ==>', resp);
        }
      });
    }else{
      return false;
    }
  }

  renderProfilePic(){
    console.log('fddddddddddd', this.state.image)
    if (this.state.token && this.state.image) {
      return (<View style={{alignSelf:'center'}}>
        {this.renderAddPostImage()}
        <TouchableOpacity onPress={() => this.onPickImage()} style={{position:'absolute',alignSelf:'flex-end'}}>
            <View style={{}}> 
                <Image source={require('../images/edit.png')} style={{height:18,width:18,resizeMode:'contain'}}/>                      
              </View>
          </TouchableOpacity>
      </View>);
    } else {
      return (<Image source={this.state.pic} style={styles.profileImg} />);
    }
  }

  renderAuthText() {
    if (this.state.token) {
      return (
        <CButton cStyle={[styles.MenuContanerfirstbutton]}
          onPress={() => {
            this.setState({Cvisible:true,alertContent:'Are you sure you want to logout', Cmodalname:'Remove',
              RemoveVisible:'flex',buttonText:'No'
              });
            // Alert.alert('Logout', 'Are you sure you want to logout',
            //   [{ text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            //   { text: 'YES', onPress: () => { this.Logfunction() } }]
            // )
          }}>
          <Image source={require('../images/Menu_Logout.png')} style={{ height: 15.3, width: 15.3, resizeMode: 'contain', marginRight: 15 }} />
          <CText cStyle={styles.MenuContanersubmitButtonText}>LOGOUT</CText>
        </CButton>
      );
    } else {
      return (
        <CButton cStyle={[styles.MenuContanerfirstbutton]}
          onPress={() => this.props.navigation.navigate('Login')} >
          <Image source={require('../images/Menu_Logout.png')} style={{ height: 14.3, width: 14.3, resizeMode: 'contain', marginRight: 15 }} />
          <CText cStyle={styles.MenuContanersubmitButtonText}>LOGIN</CText>
        </CButton>
      );
    }
  }

  onReset() {
    this.setState({ addPostImgUrl: '', addPostImage: '' });
  }
  
  onPickImage() {
    const self = this;
    ImagePicker.showImagePicker(imgPickerOptions, response => {
      //console.warn(response)
      if (!response.didCancel && !response.error) {
        self.setState({ imageUploadBool: true });
        NativeModules.FetchData.GetImg(response.uri, (resp) => {
          self.setState({ addPostImgUrl: '' + resp, addPostImage: { uri: response.uri }, imageUploadBool: false }, () => {
            console.log(self.state.addPostImgUrl, '--->', self.state.addPostImage, '<----');
            self.count = parseInt(self.count) + 1;
            self.submitAddImage();
          });
        });
      } else if (response.didCancel) {
        self.setState({ addPostImgUrl: '', addPostImage: '', imageUploadBool: false });
      } else {
        // alert('Could not select image');
        this.setState({Cvisible:true,alertContent:'Could not select image'});
      }
    })
  }
  
  submitAddImage() {
    //console.warn('daskkdjfdhasbdmfbsakdjfnaskd',this.state.addPostImgUrl)
    if (!this.state.addPostImgUrl) {
      this.setState({Cvisible:true,alertContent:'Please add your image'});
      return false;
    } else {
      let self = this
      self.setState({spinnerLoad:true})
      Utils.dbCall(Config.routes.addProfilePic, 'POST', { token: self.state.token }, {
        files: this.state.addPostImgUrl
      }, function (resp) {
        if (resp.status) {
          // alert(resp.message);
          self.setState({Cvisible:true,alertContent:resp.message,spinnerLoad:false});
          // self.setState({ ModalVisibleStatus:false, addPostProductName:'', addPostShoppedAt:'', addPostImage:'',
          //   addPostDescription:'', shopSelectedId:'', shopSelectedId:'', shopNameSelected:'' });
          
          Utils.setToken('profileCacheCount', self.count.toString(), function(sResp, sStat){
            self.profiledata();
          });
          //self.setState({ image: '', addPostImage: '', addPostImgUrl: '' });
        } else {
          // alert('Error adding post');
          self.setState({spinnerLoad:false,Cvisible:true,alertContent:'Error adding post'});
        }
      });
    }
  }

  renderAddPostImage() {
    
    if (this.state.addPostImage) {
      console.log('this is ifffffffffffff loooopppppinnnnggg');
    //   Utils.setWishList('withy', , function (tResp, tStat) {
    //     if (tStat) {
    //     }
    // });
      return (
        <Image source={this.state.addPostImage} style={styles.profileImg} />
      );
      // this.setState({ image: this.state.addPostImage }); , Config.routes.base + Config.routes.getProfilePicInProfile + '/' + this.state.image
    } else {
      console.log('this is else loooppppp', this.count);
    
      return (
        <Image source={{ uri: Config.routes.base + Config.routes.getProfilePicInProfile + '/' + this.state.image + '?id=' + this.count }} style={styles.profileImg} />
      );
    }
  }

  Logfunction() {
    // const self = this;
    //console.log(' this.props.navigation-men', this.props);
    // AsyncStorage.clear();
    AsyncStorage.multiRemove(['token'])
    // AsyncStorage.removeItem('token',(err) => console.log('finished', err));
    // AsyncStorage.removeItem('wishCount');
    
    Utils.getToken('user', function (tResp, tStat) {
      if (tResp) {
        tResp.token = '';
      }
      Utils.setToken('user', "", function (tResp, tStat) {
        if (tStat) {
          //console.log('murthy',tStat);
          //self.props.navigation.navigate('Home');
        }
      });
    })

    this.setState({
      username: '----',
      mobile_no: null,
      image: '',
      addPostImage: '',
      token: '',
      Cvisible:false,buttonText:'Ok',Cmodalname:'Alert',RemoveVisible:'none'
    });
    this.orderCount = 0;   
    this.wishCount = 0;    
    // this.profiledata()
  }

  navigationuserpost(){
    if(this.state.token === ''|| this.state.token === undefined){
      this.props.navigation.navigate('Login');
    }else{
      this.props.navigation.navigate('UserPosts', { 'user': this.state.userID});      
    }
  }

  UserLikePage() {
    const self = this;
    Utils.getWishList('withy', function (tResp, tStat) {
      if (tStat) {
        // self.setState({ MWishCount: tResp });
        //console.log('wcount',self.state.MWishCount);
        self.wishCount = tResp;
        self.props.navigation.navigate('Likepage', { token: self.state.token });
      }
      else {
        self.props.navigation.navigate('Login');
      }
    });
  }

  orderpage(){
    if(this.state.token && this.state.orderdata){
      this.props.navigation.navigate('MyOrders', {ordertrans:this.state.orderdata})
    }else{
          self.props.navigation.navigate('Login');
    }
  }
  renderaddresspage(){
    if(this.state.token){
      this.props.navigation.navigate('Address')
    }else{
      this.props.navigation.navigate('Login');
    }
  }

  // renderOrderCount(){
  //   if(this.state.ordercount){
  //     return <CText cStyle={[{ color: '#fff', fontFamily: 'NeueKabel-Book',alignSelf:'center'}]}>{this.state.ordercount}</CText>;
  //   } else {
  //     return;
  //   }
  // } Commented because it is update states.

  render() {
    return (
      <View style={{ flex: 1 }}>
      {this.spinnerLoad()}
        <ScrollView scrollEnabled={true} keyboardDismissMode='on-drag' showsVerticalScrollIndicator={true}>
          <View style={styles.Menuheadercolor}>
            {this.renderProfilePic()}
            <CText cStyle={[styles.Menutextname, { fontFamily: 'NeueKabel-Regular' }]} >{this.state.username.toUpperCase()}</CText>
            <CText cStyle={styles.Menutextname}>{this.state.mobile_no}</CText>
          </View>
          <View>
            <View style={{ backgroundColor: '#fff' }}>
              <View style={styles.MenuContanerimagesize}>
                <View style={[styles.MenuContanerfirstbutton]}>
                  <Image source={require('../images/Menu_SellOnFashion.png')} style={{ height: 14, width: 11, resizeMode: 'contain', marginRight: 15 }} />
                  <View style={{ borderBottomWidth: 1, borderColor: '#c01530' }}>
                    <CText cStyle={[styles.MenuContanersubmitButtonText, { marginBottom: 5 }]}>SELL ON FASHIONPECKS</CText>
                  </View>
                </View>
                <CButton cStyle={[styles.MenuContanerfirstbutton]} onPress={() => this.props.navigation.navigate('MyProfile')}>
                  <Image source={require('../images/Menu_My_Profile.png')} style={{ height: 13, width: 14, resizeMode: 'contain', marginRight: 15 }} />
                  <CText cStyle={styles.MenuContanersubmitButtonText}> MY PROFILE</CText>
                </CButton>

                <CButton cStyle={[styles.MenuContanerfirstbutton,{justifyContent:'space-between'}]} onPress={() => this.orderpage()} >
                  <View style={{flexDirection:'row'}}>
                    <Image source={require('../images/Menu_My_Order.png')} style={{ height: 14, width: 15, resizeMode: 'contain', marginRight: 15 }} />
                    <CText cStyle={styles.MenuContanersubmitButtonText}>MY ORDERS</CText>
                  </View>
                  <View style={{ height:20,width:20,borderRadius:20, marginRight: 20,backgroundColor:'#aeaeae',justifyContent:'center' }}>
                    <CText cStyle={[{ color: '#fff', fontFamily: 'NeueKabel-Book',alignSelf:'center'}]}>{this.orderCount}</CText>
                  </View>
                </CButton>

                <CButton cStyle={[styles.MenuContanerfirstbutton,{justifyContent:'space-between'}]} onPress={() => this.UserLikePage()}>
                <View style={{flexDirection:'row'}}>
                  <Image source={require('../images/Menu_My_Likes.png')} style={{ height: 16, width: 16, resizeMode: 'contain', marginRight: 15 }} />
                  <CText cStyle={styles.MenuContanersubmitButtonText}>MY LIKES</CText>
                 </View>
                  <View style={{ height:20,width:20,borderRadius:20, marginRight: 20,backgroundColor:'#aeaeae',justifyContent:'center'}}>
                    <CText cStyle={[ { color: '#fff', fontFamily: 'NeueKabel-Book',alignSelf:'center' }]}>
                      {/* {this.updatewishCount()} */}
                      {this.wishCount}
                    </CText>
                  </View>
                </CButton>

                <CButton cStyle={[styles.MenuContanerfirstbutton]} onPress={() => this.renderaddresspage()}>
                  <Image source={require('../images/Navigation_large.png')} style={{ height: 19, width: 15, resizeMode: 'contain', marginRight: 15 }} />
                  <CText cStyle={styles.MenuContanersubmitButtonText}>ADDRESS BOOK</CText>
                </CButton>
                <CButton cStyle={[styles.MenuContanerfirstbutton]} onPress={() => this.navigationuserpost()}>
                  <Image source={require('../images/Menu_Media_Post.png')} style={{ height: 16, width: 15, marginRight: 15 }} />
                  <CText cStyle={styles.MenuContanersubmitButtonText}>MEDIA POST</CText>
                </CButton>
                <CButton cStyle={[styles.MenuContanerfirstbutton]} onPress={() => this.props.navigation.navigate('Support')}>
                  <Image source={require('../images/Menu_Support.png')} style={{ height: 16, width: 16, resizeMode: 'contain', marginRight: 15 }} />
                  <CText cStyle={styles.MenuContanersubmitButtonText}>SUPPORT</CText>
                </CButton>
                <CButton cStyle={[styles.MenuContanerfirstbutton]} onPress={() => this.props.navigation.navigate('Faq')} >
                  <Image source={require('../images/Menu_Faq.png')} style={{ height: 16, width: 16, resizeMode: 'contain', marginRight: 15 }} />
                  <CText cStyle={styles.MenuContanersubmitButtonText}>FAQ<CText style={{ fontSize: 10 }}>(TERMS AND CONDITIONS)</CText></CText>
                </CButton>
                {this.renderAuthText()}
              </View>
            </View>
          </View>
          <CModal visible={this.state.Cvisible} 
                                    closeButton={()=>{this.setState({Cvisible:false});}} 
                                    buttonClick={()=>{this.setState({Cvisible:false});}}
                                    buttonText={this.state.buttonText}
                                    modalname={this.state.Cmodalname}
                                    buttonClickRemove={() => this.Logfunction()}
                                    buttonVisible={this.state.RemoveVisible}>
                              <CText style={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                              </CModal>
        </ScrollView>
      </View>
    );
  }
}
