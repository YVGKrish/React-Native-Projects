import React, { Component } from 'react';
import { View, Image, Text, Picker, Alert, TouchableOpacity, FlatList, map, TextInput, ScrollView, AsyncStorage } from 'react-native';
import styles from '../common/styles';
import { CText, CButton, CPicker, CInput, CSpinner,CRadio,SRadioButton,CModal } from '../common/index';

import Utils from '../common/Utils';
import Config from '../config/Config';
import RazorpayCheckout from 'react-native-razorpay';

export default class Paydetail extends Component {
	state = {
        MultiAdd:[],Cvisible:false,alertContent:'',
        AllBool:'none',
        totalprice:'',
        token:'',
        finalchages:'',
        shopdetails:[],
        totalproducts: [],
        selcteadd:[],
    }
    componentWillMount() {
        const self = this;
        Utils.getToken('user', function (tResp, tStat) {
              if (tResp == '') {
                    self.props.navigation.navigate('Login');
              } else {
                    self.setState({ token: tResp.token,userdata:tResp,
                        totalprice:self.props.navigation.state.params.totalp,
                        shopdetails:self.props.navigation.state.params.details}, () => { self.fetchaddress() });
              }
        });
  }
    fetchaddress() {
        const self = this;
        console.warn(this.state.shopdetails);
        Utils.dbCall(Config.routes.getAddresses, 'GET', { token: self.state.token }, {},
              function (resp) {
                    if (resp.status) {
                        var tempaddr=[];
                          console.log('getaddress', resp);
                          for (let index = 0; index < resp.details.length; index++) {
                              const element = resp.details[index];
                              element.dis='none'
                              tempaddr.push(element);
                              
                          }
                          self.setState({ MultiAdd: tempaddr});
                    } else {
                          console.log('error in Address ==>', resp);
                    }

              });
  }
  selctedaddress(data){
      const self=this;
      var testaddr=[];
      for (let index = 0; index < self.state.MultiAdd.length; index++) {
          const element = self.state.MultiAdd[index];
          if(element.mobile=== data)
          {
              element.dis='flex'
              testaddr.push(element)
              self.setState({selcteadd:element});

          }
          else{
              element.dis='none'
              testaddr.push(element)
          }
          
      }
      self.setState({MultiAdd:testaddr},()=>{console.log(self.state.MultiAdd)});

}
  getaddress(getdata) {
      var lac=''
      if(getdata.dis==='flex')
      {
          lac='Selected Address'
      }
      else{
          lac='Address'
      }
    // this.setState({['AllBool' + getdata.mobile]:'none'});
    return (
          <View>
              <ScrollView> 
                <View style={{ margin: 10, borderWidth: 0.5}}>
                        <View>
                            {/* <CRadio activeStyle={{ display: this.state.AllBool }} onPress={() => this.selctedaddress('selceted',getdata)} />                             */}
                            <CRadio label={lac} activeStyle={{ display: getdata.dis}} onPress={() => this.selctedaddress(getdata.mobile)} />

                        </View>
                        <View style={{marginLeft:25}}> 
                            <View>
                                <CText cStyle={{ marginTop: 20, marginLeft: 20, color: '#2c2c2c', fontSize: 13.7 }}>Current address</CText>
                            </View>
                            <View style={{marginLeft:15}}>
                                    <CText cStyle={{ fontSize: 13.7, color: '#2c2c2c', fontFamily: 'NeueKabel-Book', lineHeight: 20.7, marginLeft: 20, marginRight: 5, marginTop: 5 }}>
                                            {getdata.address}
                                    </CText>
                                    <CText cStyle={{ fontSize: 13.7, color: '#2c2c2c', fontFamily: 'NeueKabel-Book', lineHeight: 20.7, marginLeft: 20, marginRight: 5, marginTop: 5 }}>
                                            {getdata.landmark},{getdata.locality}
                                    </CText>
                                    <CText cStyle={{ fontSize: 13.7, color: '#2c2c2c', fontFamily: 'NeueKabel-Book', lineHeight: 20.7, marginLeft: 20, marginRight: 5, marginTop: 5 }}>
                                            {getdata.city}
                                    </CText>
                                    <CText cStyle={{ fontSize: 13.7, color: '#2c2c2c', fontFamily: 'NeueKabel-Book', lineHeight: 20.7, marginLeft: 20, marginRight: 5, marginTop: 5 }}>
                                            {getdata.state},{getdata.pincode}
                                    </CText>
                                    <CText cStyle={{ fontSize: 13.7, color: '#2c2c2c', marginLeft: 20, margin: 10, fontFamily: 'NeueKabel-Book' }}>Mobile:{getdata.mobile}</CText>
                            </View>
                        </View>   
                </View>
                </ScrollView>
          </View>
    );
}
sendToRazorPay(){
    if(this.state.token != ''){
    if(this.state.selcteadd.length == 0){
        this.setState({Cvisible:true,alertContent:'please select address'});
    } else {
        console.warn(this.state.userdata);
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_test_UgFYlmBpY4caMP',
            amount: this.state.totalprice * 100,
            name: 'Fashion Pecks',
            prefill: {
            email: this.state.userdata.email,
            contact: '',
            name: this.state.userdata.firstName
            },
            theme: {color: '#c01530'}
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            console.warn(data)
            const self = this;
            Utils.dbCall(Config.routes.purchaseSave, 'POST', { token: self.state.token },{
                data:this.state.shopdetails,
                totalPrice:this.state.totalprice,
                addressId:this.state.selcteadd._id,
                pincodeToDeliver:this.state.selcteadd.pincode,
                addressToDeliver:this.state.selcteadd,
                paymentDetails:{paymentId:data.razorpay_payment_id}
            }, function (resp) {
                console.warn('data ------ ',resp);
                            if (resp.status) {
                                console.warn('data is set to cart<<=========<<>>=========>>',resp)
                                //alert(resp.message);
                            } else {
                                console.log('error in Men ==>', resp);
                            }
                        });

            //alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            alert(`Error: ${error.code} | ${error.description}`);
        });
       
}
}else{
    this.props.navigation.navigate('Login')
} 
  }
  shipingchargers(){
   
  }
  freecharges(){
      let elementdata = this.state.shopdetails;
      console.log('shipping charges',elementdata,elementdata.shippingFee);      
      if(elementdata.shippingFee === 0){
        return(
            <View style={[styles.jspacebn, styles.row, styles.m5]}>
                <CText cStyle={[styles.BagTlPrices, { color: '#4f4f4f' }]}>Shipping Charges </CText>
                <CText cStyle={[styles.FntS10, { color: '#4f4f4f' }]}>free</CText>
            </View> 
        );
      }else{
        let shipingcharhes = null;
            for (let i = 0; i < elementdata.length; i++) {
                shipingcharhes  += elementdata[i].shippingFee;
            }
            return(
                <View style={[styles.jspacebn, styles.row, styles.m5]}>
                    <CText cStyle={[styles.BagTlPrices, { color: '#4f4f4f' }]}>Shipping Charges </CText>
                    <CText cStyle={[styles.FntS10, { color: '#4f4f4f' }]}>{shipingcharhes}</CText>   
                </View>       
            );
            this.setState({finalchages:shipingcharhes},()=>{
                console.log('forloop',this.state.finalchages)
            });
      }
  }
finalamount(){
    console.log(this.state.finalchages,'final changes');
    if(this.state.finalchages){
        var x = this.state.finalchages;
        console.log(x);
        var y = this.state.totalprice;
        console.log(y);
        var ouput = x + y ;
        console.log(ouput);        
        return(
            <View style={[styles.jspacebn, styles.row, styles.m5]}>
                <CText cStyle={[styles.BagTlPrices, { color: '#c01530' }]}>Pay Amount</CText>
                <CText cStyle={[styles.FntS10, { color: '#c01530' }]}>₹{ouput}</CText>
            </View>
        );
    }else{
        console.log('elseloop');
        return(
            <View style={[styles.jspacebn, styles.row, styles.m5]}>
                <CText cStyle={[styles.BagTlPrices, { color: '#c01530' }]}>Pay Amount</CText>
                <CText cStyle={[styles.FntS10, { color: '#c01530' }]}>₹{this.state.totalprice}</CText>
             </View>
        );
    }
}
    render(){
        const {goBack} = this.props.navigation;
        return(
            <View style={{backgroundColor:'#FFF',flex:1}}>
            
                <View style={styles.HomeWomesHeader}>
                    <View style={{ justifyContent: 'flex-start' }}>
                        <CButton onPress={()=>goBack()}>
                        <Image resizeMode='contain' source={require('../images/back.png')} style={{height:17,width:10,margin: 15 }} />
                        </CButton>
                    </View>
                    <CText cStyle={{ color: '#fff', alignSelf: 'center', fontSize: 13.5, fontFamily: 'NeueKabel-Regular' }}></CText>
         
                </View>
                <ScrollView>
                    <View>
                    <FlatList
                    data={this.state.MultiAdd}
                    keyExtractor={(item, index) => index}
                    //renderItem={this.itemRender}
                    renderItem={({ item }) => this.getaddress(item)}
                    extraData={this.state.MultiAdd}
                        />
                </View>
                <View style={styles.m10}>
                    <View style={styles.jCenter}>
                        <CText cStyle={styles.aslCenter}>ORDER SUMMARY</CText>
                    </View>
                    <View style={[styles.jspacebn, styles.row, styles.m5]}>
						<CText cStyle={[styles.BagTlPrices, { color: '#4f4f4f' }]}>Sub Total </CText>
						<CText cStyle={[styles.FntS10, { color: '#4f4f4f' }]}>₹{this.state.totalprice}</CText>
					</View>
                   {this.freecharges()}
                   {this.finalamount()}
                    <View style={styles.BagOrder}>
						<TouchableOpacity onPress={() =>this.sendToRazorPay()} >
							<CText cStyle={[styles.aslCenter, styles.cFFF, styles.m10]}>PLACE ORDER</CText>
						</TouchableOpacity>
					</View>
                </View> 
                </ScrollView>  
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