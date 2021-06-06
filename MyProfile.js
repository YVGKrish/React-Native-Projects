import React,{Component} from 'react';
import {
    Text,View,Image, TouchableOpacity, TextInput,Dimensions,DatePickerAndroid,Platform, Alert
} from 'react-native';
import { CText,CRadio, CInput, CButton, CSpinner,CModal } from '../common/index';
import Utils from '../common/Utils';
import Config from '../config/Config';
import styles from '../common/styles';

import CryptoJS from 'crypto-js';

export default class MyProfile extends Component{
    state = {
        ChangePassword:'none',Profile:'flex',token:'',ProfileData:[],maleBool:'none',femaleBool:'none',gender:'',
        username:'',email:'',mobile_no:null,showModal:true,Dob:'',Currentpassword:'',NewPassword:'',Conformpassword:'',spinnerBool:false,
        TabHighlightPStyle: {borderBottomColor: '#c01530', borderBottomWidth: 3},
        TabHighlightCPStyle: {borderBottomColor: '#d6d6d6',borderBottomWidth: 3},Cvisible:false,alertContent:''
    };
    spinnerLoad() {
        //console.log('spinner');
        if (this.state.spinnerBool)
          return <CSpinner />;
        return false;
      }
    componentWillMount(){
        const self=this;
		Utils.getToken('user',function(tResp, tStat){
            // console.log("ttttttttttttttttresp..",tResp);
                //   console.log("ttttttttttttttttstats...",tStat);
              if(tResp ==''){
                self.props.navigation.navigate('Login');
              }else{
                self.setState({token:tResp.token},
                  () => {self.profiledata()});
          }
            
        });
        
    }
    profiledata(){
        const self=this;
        console.warn("--------token-----",self.state.token);
        self.setState({ spinnerBool: true });
        Utils.dbCall(Config.routes.getprofiledata, 'GET', {token:self.state.token} , {}, (resp) => {
            console.log(resp);
            if(resp.status){
                console.log(resp.details);
                self.setState({
                    ProfileData:resp.details,
                    mobile_no:resp.details.mobile,
                    username:resp.details.fullName,
                    email:resp.details.email,  
                    gender:resp.details.gender,            
                },()=>{ 
                    self.setState({ spinnerBool: false });                    
                });
                if(resp.details.dob==='undefined'){
                    this.setState({Dob:''})
                }else{
                    this.parseIsoDatetime(resp.details.dob)
                }
                this.Getgender()
            } else {  
                console.log('error in Men ==>', resp);
                   }
        });
    }
    parseIsoDatetime(dtstr) {
        var dt = dtstr.split(/[: T-]/).map(parseFloat);
        this.setState({Dob:dt[1]+"/"+dt[2]+"/"+dt[0]})
    }
    OnProfileClick(){
        this.setState({
        TabHighlightPStyle: {borderBottomColor: '#c01530', borderBottomWidth: 3},
        TabHighlightCPStyle: {borderBottomColor: '#d6d6d6',borderBottomWidth: 3},
        Profile:'flex',
        ChangePassword:'none'
    });
    }
    OnChangePsdClick(){
        this.setState({
            TabHighlightPStyle: {borderBottomColor: '#d6d6d6',borderBottomWidth: 3},
            TabHighlightCPStyle: {borderBottomColor: '#c01530', borderBottomWidth: 3},
            Profile:'none',
            ChangePassword:'flex'
        });
    }
    changeGenderStatus(value){
        if(value === 'M'){
            this.setState({ maleBool:'flex', femaleBool:'none', gender:'male'});
        } else {
            this.setState({ maleBool:'none', femaleBool:'flex', gender:'female'});
        }
    }
    Getgender(){
        if(this.state.gender==="male"){
            {this.changeGenderStatus('M')}
        }else{
            {this.changeGenderStatus('F')}
        }
    }

    onPickdate() {
        if (Platform.OS === 'ios') {
            this.setState({ showModal: !this.state.showModal})
        } else {
            try {
                let currDate = new Date();
                const { action, year, month, day } = DatePickerAndroid.open({
                     date: new Date(),
                    //minDate: currDate.setDate(currDate.getDate() + 2),
                    maxDate: new Date(),
                }).then((response) => {
                    if (response.action === "dateSetAction") {
                        var month = response.month + 1
                        let date = response.day + "/" + month + "/" + response.year;
                        var pdate = new Date(month + "/" + response.day + "/" + response.year);
                        // console.warn(month+"<--month--"+date+"<--date--"+pdate+"<--donn ---");
                        this.setState({Dob:date});
                         return false;
                    }
                }).catch((error) => {
                    console.log(error);
                });
            } catch ({ code, message }) {
                console.warn('Cannot open date picker', message);
            }
        }
    }

    Validate(){
        const self=this;        
        // let mno = parseInt(self.state.mobile_no, 10 );
        // console.warn(mno);
        if(self.state.username===''){
            this.setState({Cvisible:true,alertContent:'Enter your full Name'});
            return false;
        } else if(!Utils.isValidEmail(self.state.email)){
            // alert('mail');
            // self.setState({Cvisible:true,alertContent:'Enter your valid email'});
            return false;
        }
        else if (!Utils.isValidNumber(self.state.mobile_no) && !Utils.isValidMobile(Number(self.state.mobile_no))) {
            this.setState({Cvisible:true,alertContent:'Enter valid phone number'});
            // alert('phone');
            return false;
        }
        else if(self.state.Dob===''){
            this.setState({Cvisible:true,alertContent:'Select your Dob'});
            // alert('Select your Dob');
            return false;
        }
        else if(self.state.gender===''){
            this.setState({Cvisible:true,alertContent:'Choose Your Gender'});
            // alert('Choose Your Gender');
            return false;
        }else {
            console.warn(
                "Full name  "+this.state.username+
            "email  "+this.state.email+"mobile  "+this.state.mobile_no+"gender  "+
            this.state.gender+"Dob   "+this.state.Dob)
            Utils.dbCall(Config.routes.updateprofiledata, 'POST', {token:self.state.token}, {details: {
                fullName: self.state.username,
                email: self.state.email,
                mobile: parseInt(self.state.mobile_no, 10 ),
                gender: self.state.gender,
                dob: self.state.Dob
                }}, function(resp){
                console.log(resp);
                if(resp.status){
                    // console.log(resp.lalala);
                    self.setState({Cvisible:true,alertContent:'Your Profile Updated successfully'});
                    // alert("Your Profile Updated successfully");
                }else{
                    alert(resp);
                    self.setState({Cvisible:true,alertContent:resp});
                }
            });
        }
    }
    Chpwd(){
        const self=this; 
        console.warn(self.state.NewPassword, '===> PASSS')
        if(self.state.Currentpassword == '' ){
            self.setState({Cvisible:true,alertContent:'Please enter password'});            
            return false;
        }else if(self.state.NewPassword == '' ){
            self.setState({Cvisible:true,alertContent:'Please enter newpassword'});            
        }else if(self.state.Conformpassword == ''){
            self.setState({Cvisible:true,alertContent:'Please enter Conformpassword'});                                    
        }else if(self.state.NewPassword !== self.state.Conformpassword){
            self.setState({Cvisible:true,alertContent:'password not matched'});
            return false;
        }else{
            console.warn('Chpwd',self.state.Currentpassword,'<===new' , +self.state.NewPassword,'cnf===>' ,+ self.state.Conformpassword)
            
            Utils.dbCall(Config.routes.UpdatePassword, 'POST', {token:self.state.token}, { details: {
                currentPassword:CryptoJS.SHA3(self.state.Currentpassword).toString() ,
                newPassword:CryptoJS.SHA3(self.state.NewPassword).toString() ,
                confirmPassword:CryptoJS.SHA3(self.state.Conformpassword).toString()
            }}, function(resp){
                console.log(resp);
                if(resp.status){
                    // alert("Your Password Updated successfully");
                    self.setState({Cvisible:true,alertContent:'Your Password Updated successfully'});
                }else{
                    alert(resp.message)
                    self.setState({Cvisible:true,alertContent:'please check your current password'});
                }
            });
        }
    }
  render(){
    return(
    <View style={{flex:1.3,backgroundColor:'white'}}>
      {this.spinnerLoad()}
            <View style={{ flex:1,backgroundColor:'#c01530',flexDirection:'row',alignItems:'center'}}> 
            <View style={{flex:1}} >
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()} >
                <View style={{alignItems:'center',justifyContent:'center',marginLeft:10}}>
                    <Image style={{height:20,width:15,resizeMode:'contain'}}source={require('../images/leftarrow.png')}/>
                </View>
            </TouchableOpacity>
            </View>
            <View style={{flex:12,justifyContent:'center'}} >
                <CText cStyle={{ color:'#ffffff',fontFamily:'NeueKabel-Book',fontSize:16,margin:13,marginLeft:5}}>MY PROFILE</CText> 
                </View>
            </View>

        <View style={{flex:1,flexDirection:'row'}} >
        <View style={[this.state.TabHighlightPStyle,{flex:1,justifyContent:'center',alignItems:'center'}]} >
        <TouchableOpacity onPress={()=>this.OnProfileClick()} >
        <CText cStyle={{color:'#1a1a1a',fontSize:14,margin:20,fontFamily:'NeueKabel-Book'}}>Profile</CText>
        </TouchableOpacity>
        </View>
        <View style={[this.state.TabHighlightCPStyle,{flex:1,justifyContent:'center',alignItems:'center'}]} >
        <TouchableOpacity onPress={()=>this.OnChangePsdClick()} >
        <CText cStyle={{color:'#7e7e7e',fontSize:14,margin:20,fontFamily:'NeueKabel-Book'}}>Change password</CText>
        </TouchableOpacity>
        </View>
        </View>
        <View style={{flex:9}} >
        <View style={[{display:this.state.Profile}]} >
            
        <View style={{borderBottomWidth:0.5,flexDirection:'column',marginTop:10,marginLeft:20,marginRight:20}}>
            <CText cStyle={{color:'#9e9e9e',fontSize:11.7,fontFamily:'NeueKabel-Book'}}>User Name</CText>
            <CInput cStyle={styles.fontReg} value={this.state.username} onChangeText={(username) => this.setState({username})} />
        </View>

      
        <View style={{borderBottomWidth:0.5,flexDirection:'column',marginTop:10,marginLeft:20,marginRight:20}}>
            <CText cStyle={{color:'#9e9e9e',fontSize:11.7,fontFamily:'NeueKabel-Book'}}>Email Id</CText>
            <CInput cStyle={styles.fontReg} value={this.state.email} onChangeText={(email) => this.setState({email})} />
        </View>

        <View style={{borderBottomWidth:0.5,marginTop:10,marginLeft:20,marginRight:20}}>
             <CText cStyle={{color:'#9e9e9e',fontSize:11.7,fontFamily:'NeueKabel-Book'}}>Mobile Number</CText>
             <CInput cStyle={styles.fontReg} Type='phone-pad' 
             value={String(this.state.mobile_no)} 
             onChangeText={(mobile_no) => this.setState({mobile_no})} />
        </View>
      
        <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:0.8,marginLeft:20,marginRight:20}}>
        <View style={{flexDirection:'column'}}>
            <CText cStyle={{color:'#9e9e9e',fontSize:11.7,marginTop:10, fontFamily:'NeueKabel-Book'}}>Date of birth</CText>
            <CInput cStyle={styles.fontReg} value={this.state.Dob} placeholder='DD/MM/YYYY    ' onChangeText={(Dob) => this.setState({Dob})} />
        </View>
        {/* placeholder='1/12/1998' */}
            <View style={{marginTop:25}}>
                <TouchableOpacity onPress={()=>this.onPickdate()} >
                    <Image source={require('../images/dob.png')} style={{height:17,width:17,marginRight:5,resizeMode:'contain'}}/>
                </TouchableOpacity>
            </View>
       </View>

      <View style={{marginLeft:5}}>
            <CText cStyle={{color:'#9e9e9e',fontSize:11.7,marginLeft:20,margin:10,fontFamily:'NeueKabel-Book'}}>Gender</CText>
        </View>
            <View style={{flexDirection:'row',marginTop: 5,marginLeft:10}}>
                <CRadio label='Male' activeStyle={{display:this.state.maleBool}} onPress={() => this.changeGenderStatus('M')} />
                <CRadio label='Female' activeStyle={{display:this.state.femaleBool}} onPress={() => this.changeGenderStatus('F')} />
            </View>


            <TouchableOpacity onPress={()=>this.Validate()} >
            <View style={{backgroundColor:'#c81633',width:(Dimensions.get('window').width)/1.5,borderRadius:5,alignSelf:'center',margin:20}}>
                <CText cStyle={{margin:15,alignSelf:'center',color:'#ffffff',fontSize:13.3}}>SAVE</CText>
            </View>
            </TouchableOpacity>


        </View>
        <View style={[{display:this.state.ChangePassword}]}>

        <View style={{borderBottomWidth:0.5,flexDirection:'column',marginTop:10,marginLeft:20,marginRight:20}}>
        {/* <TextInput style={styles.fontReg}
                  placeholder='Current password'
                  placeholderTextColor='#434343'
                  value={this.state.Currentpassword} onChangeText={(Currentpassword) => this.setState({ Currentpassword },()=>{console.log(this.state.Currentpassword)})}
                  underlineColorAndroid={'transparent'}
                /> */}
            <CInput cStyle={styles.fontReg} value={this.state.Currentpassword} placeholder='Current password'  onChangeText={(Currentpassword) => this.setState({Currentpassword},()=>{console.log(this.state.Currentpassword)})} />
        </View>
        <View style={{borderBottomWidth:0.5,flexDirection:'column',marginTop:10,marginLeft:20,marginRight:20}}>
        {/* <TextInput style={styles.fontReg}
                  placeholder='New password'
                  placeholderTextColor='#434343'
                  value={this.state.NewPassword} onChangeText={(NewPassword) => this.setState({ NewPassword:NewPassword },()=>{console.log(this.state.NewPassword)})}
                  underlineColorAndroid={'transparent'}
                /> */}
            <CInput cStyle={styles.fontReg} value={this.state.NewPassword} placeholder='New password'  onChangeText={(NewPassword) => this.setState({NewPassword},()=>{console.log(this.state.NewPassword)})} />
        </View>
        <View style={{borderBottomWidth:0.5,flexDirection:'column',marginTop:10,marginLeft:20,marginRight:20}}>
            <CInput cStyle={styles.fontReg} value={this.state.Conformpassword} placeholder='Confirm password'  onChangeText={(Conformpassword) => this.setState({Conformpassword},()=>{console.log(this.state.Conformpassword)})} />
        </View>
        <TouchableOpacity onPress={()=>this.Chpwd()} >
            <View style={{backgroundColor:'#c81633',width:(Dimensions.get('window').width)/1.5,borderRadius:5,alignSelf:'center',margin:20}}>
                <CText cStyle={{margin:20,alignSelf:'center',color:'#ffffff'}}>SAVE</CText>
            </View>
        </TouchableOpacity>

        </View>
        </View>
        <CModal visible={this.state.Cvisible} 
                          closeButton={()=>{this.setState({Cvisible:false});}} 
                          buttonClick={()=>{this.setState({Cvisible:false});}} 
                          buttonText='ok'
                          modalname='Alert'
                          buttonVisible='none'>
                  <CText cStyle={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                  </CModal>
    </View>
    );
  }
}



          