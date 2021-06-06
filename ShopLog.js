import React, {Component} from 'react';
import{Text,View,FlatList,Animated,Modal,AsyncStorage,SectionList,TextInput,NativeModules,ScrollView,Button,Image,StyleSheet,SearchBar,Dimensions,TouchableOpacity} from 'react-native';

import {CText, CInput, CButton,CSpinner} from '../common/index';
import styles from '../common/styles';
import Utils from '../common/Utils';
import Config from '../config/Config';
import getDirections from 'react-native-google-maps-directions';

 class ShopLog extends React.Component {
   state = {
        filterBool:false,
        shopdetails:'',
        totalcount:'',
        wcount:0,
        count:0,
        productslist:[],
        singleShopesdtails:'',
        Latitude:0.0,
        Longitude:0.0,
        DbLatitude:0.0,
        DbLongtitude:0.0,
        fullViewbg:'#fff',
        bgcolor:["red","#6d88d4","#B316CF","#d65f46","#2ACF16","#000","#A7A26B"]
     }
 
componentDidMount(){
  const self = this;
  Utils.getWishList('withy',function(tResp,tStat){
      if(tStat && tResp!= '')
      {
        self.setState({wcount:tResp});
        console.log('wcount',self.state.wcount);
      }
      
    });
}
GetDirection(){
  NativeModules.FetchData.GetLoc((resp)=>{
    // alert(resp);
    let strResp = resp.toString();
    strResp=strResp.split('#$#');
    this.setState({Latitude:strResp[1],Longitude:strResp[0]});
    const data = {
      source: {
       latitude: strResp[1],
       longitude: strResp[0]
     },
     destination: {
       latitude: this.state.DbLongtitude,
       longitude: this.state.DbLatitude
     },
     params: [
      //  {
      //    key: "travelmode",
      //    value: "driving"        // may be "walking", "bicycling" or "transit" as well
      //  },
       {
         key: "dir_action",
         value: "navigate"       // this instantly initializes navigation using the given travel mode 
       }
     ]
   }

   getDirections(data)
  });
}
spinnerLoad() {
  if (this.state.spinnerBool)
    return <CSpinner />;
  return false;
} 
  componentWillMount() {
    const self = this;
    if(self.props.navigation.state.params.singleshop){
      self.setState({shopdetails:self.props.navigation.state.params.singleshop.shopUniqueId}
        ,()=>{self.singleshopesDbcall()})
    }else{
      self.setState({shopdetails:self.props.navigation.state.params.singleshopid}
        ,()=>{self.singleshopesDbcall()})
    }
    
}
singleshopesDbcall(){
    const self = this;
    self.setState({spinnerBool:true})
    console.log(self.state.shopdetails,'i===>d')
    Utils.dbCall(Config.routes.getShopDetails, 'POST', null,  {id:self.state.shopdetails}
   , function(resp){ 
      console.log(resp, '====>')           
          if(resp.status){
            console.log('data',resp.details.geometry.coordinates[1],'==>',resp.details.geometry.coordinates[0],resp)
            self.setState({totalcount:resp,DbLongtitude:resp.details.geometry.coordinates[1],DbLatitude:resp.details.geometry.coordinates[0]},()=>{console.log('langitude',self.state.totalcount)})
           self.setState({ singleShopesdtails: resp.details },()=>{self.renderproductsfromshop()});
          } else {  
               console.log('error in single shopes ==>', resp);
                  }
      });
   } 
   renderimage(){
     if(this.state.singleShopesdtails){
       console.log('data'); 
     let data =this.state.singleShopesdtails
     if (data.isProfilePic) {
      let shrimageUrl=Config.routes.base + Config.routes.getShopBackground +'/'+ this.state.singleShopesdtails._id;
      var response = Image.prefetch(shrimageUrl,()=>console.log('Image is being fetched'))
       return(
      <Image source={{uri: shrimageUrl}}
      style={{position:'relative',resizeMode:'contain',height:200,width:'100%'}}/>
       )}else{
         var upper=data.firstLetter;
            return(
              <View style={{backgroundColor:this.state.bgcolor[Math.floor(Math.random() * this.state.bgcolor.length)],justifyContent:'center',height:200,width:'100%'}}>
                <CText cStyle={{fontSize:35,fontWeight:'bold',color:'#fff',alignSelf:'center'}}>{upper.toUpperCase()}</CText>
              </View>
            )
       }
      }
   }
  renderproductsfromshop(){
    const self = this;
    console.log('murthy');
    Utils.dbCall(Config.routes.getProductsOfShop, 'POST', { token: self.state.token },  {
      filters:{categoryIds: [], 
              discountMin: 0, 
              discountMax: 100,
              priceMin: 0,
              priceMax: 99999999,
               sellers: []}
              ,id:self.state.shopdetails}
   , function(resp){ 
        //console.log(resp, '====>')          
          if(resp.status){
            var extradetails=[];
          for (let index = 0; index < resp.details.length; index++) {
            const element = resp.details[index];
            element.wishlist =false;
            extradetails.push(element);
          }
              self.setState({productslist:extradetails,spinnerBool:false
              })
              console.log("single shop",resp);
          } else {  
               console.log('error in single shopes ==>', resp);
                  }
      });
   } 
   AddToWishList(wishlistItem){  
    const self = this;
     console.log('AddToWishList-token',this.state.token);
     if(this.state.token === '' || this.state.token == null){
      return self.props.navigation.navigate('Login');
    }
  
    for (let i = 0; i < this.state.productslist.length; i++) {
      const element = this.state.productslist[i];    
        if(wishlistItem === element._id)
        {
          if(element.wishlist){
            element.wishlist =false;
            this.addproductToWishList(wishlistItem,false);
          }else{
            element.wishlist =true;
            this.addproductToWishList(wishlistItem,true);
          }
          this.state.productslist[i] = element;
        }
    }
  }
  getCredentailsData() {
    AsyncStorage.getItem('fashionpecks:wishList', (error, result) => {
      if (result != null) {
        var jobj = {};
        jobj = JSON.parse(result);
        var count = jobj.count + 1;
        this.setState({ count: count }, () => { console.log(this.state.count, 'wiiiii'); });
      } else {
        this.setState({ count: 0 }, () => { console.log(this.state.count, 'wiiiii') });
      }
    })

  }
  addproductToWishList(id,boolean){
    var dump = [];
   for (let i = 0; i < this.state.productslist.length; i++) {
     const element = this.state.productslist[i]; 
     dump.push(element);
     this.setState({ productslist: dump });
   }
   if (boolean) {
    this.getCredentailsData();
    if (this.state.count == 0) {
      this.setWishCount(1);
    } else {
      this.setWishCount(this.state.count);
    }
  }
   const self = this;
   console.log('id,token',id,self.state.token);
   Utils.dbCall(Config.routes.addProductToWishList, 'POST', {token:self.state.token},  
     {id: id}
   , function(resp){           
         console.log('addproductToWishList ==>', resp);
         if(resp.status)
         {
          if (resp.message == 'Successfully added to wishlist') {
            Utils.getWishList('withy', function (tResp, tStat) {
              if (tResp != '') {
                console.log('wcount', self.state.wcount);
                var count = tResp;
                count = count + 1;
                self.setState({ wcount: count });
                Utils.setWishList('withy', self.state.wcount, function (tResp, tStat) {
                  if (tStat) {
                    console.log(tResp);
                  }
                });
              }
              console.log('wishlist', self.state.wcount);
            });

          }
          if (resp.message == 'Successfully removed from wishlist') {
            Utils.getWishList('withy', function (tResp, tStat) {
              if (tResp != '') {
                self.setState({ wcount: tResp });
                console.log('wcount', self.state.wcount);
              }
            });
            if (self.state.wcount == 0) {
              console.log("Dineshhhh great  ");
              self.setState({ wcount: 0 });
              Utils.setWishList('withy', self.state.wcount, function (tResp, tStat) {
                if (tStat) {
                  // console.log(tResp);

                }
              });
            } else {
              console.log("Dineshhhh tou tou ");
              Utils.getWishList('withy', function (tResp, tStat) {
                if (tResp != '') {
                  self.setState({ wcount: tResp });
                  self.setState({ wcount: self.state.wcount - 1 });
                  Utils.setWishList('withy', self.state.wcount, function (tResp, tStat) {
                    if (tStat) {
                      console.log('after dec', tResp);
                    }
                  });
                  console.log('wcount', self.state.wcount);
                }
              });
            }
          }
       }
    });
  }
  
  gotoLikePageHome()
  {
    const self=this;
    if(self.state.token!=''){
  Utils.getWishList('withy',function(tResp,tStat){
      if(tStat && tResp!= '')
      {
        self.setState({wcount:tResp});
        console.log('wcount',self.state.wcount);
        self.props.navigation.navigate('Likepage');
      }
      else{
        self.props.navigation.navigate('Login');
      }
    });
  }
  else{
    self.props.navigation.navigate('Login');
  }
  } 
  creactdata(date){
    if(date.createdAt){
     let datestr = date.createdAt
    console.log(datestr);
    // var creada = new Date(date)
    //console.log(creada)
    var dt = datestr.split(/[: T-]/).map(parseFloat);
    var marr=[ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return String('Joined '+marr[parseInt(dt[1])-1]+" "+dt[2]+","+dt[0]);
  }else{
    return false;
  }
}
   productsView(products){
     console.log('===>',products);
     if(products.wishlist){
      let shimageUrl=Config.routes.base + Config.routes.getProductPicUser + products.images[0];
      var response = Image.prefetch(shimageUrl,()=>console.log('Image is being fetched'))
     return(
       <View style={{borderWidth:0.4,borderColor:'#bababa',width:(Dimensions.get('window').width)/2-10,margin:5}}>
         
      <View style={{backgroundColor:'#fff',flexDirection:'row' }}>
      <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,marginTop:0,marginLeft:0}]} onPress={()=>this.props.navigation.navigate('ProductView',
         { 'totalpodt': products._id, 'categaryid': products.categoryIds, 'prodsize': products.types } 
    )}> 
      <Image resizeMode='contain' source={{uri: shimageUrl}}
            style={{height:217,width:(Dimensions.get('window').width)/2-15,resizeMode:'cover'}}/>
                <View style={styles.LikeDiscountMain}>
                       <View style={styles.LikeDiscount}>   
                                 <CText cStyle={{color:'#FFF',paddingLeft:3,}}>{products.discount}%off</CText>
                       </View>
                     <View style={styles.LikeDiscountSym}>
                        <TouchableOpacity  onPress={()=> this.AddToWishList(products._id)}>
                        <Image source={require('../images/fcheck.png') } style={{height:25,width:25,resizeMode:'contain'}}/>   
                        </TouchableOpacity>
                     </View>
                </View>
                <View style={{justifyContent:'center',marginTop:10}}>
                <CText cStyle={[styles.LikeMainProductName,{alignSelf:'center',marginBottom:0}]}>{products.name.substr(0,20)}</CText>
                  <View style={[styles.LikePricesWrap,{alignSelf:'center',justifyContent:'center',marginTop:0}]}>
                    <CText cStyle={styles.LikePricesText1}>₹{products.price}</CText>
                    <CText cStyle={[styles.LikePricesText2,{marginLeft:5}]}> ₹{products.discountedPrice}</CText>
                  </View>
                  </View>
         </CButton>
      </View>
      </View>
     );
   }else{
     console.log(products);
    let shimageUrl=Config.routes.base + Config.routes.getProductPicUser + products.images[0];
    var response = Image.prefetch(shimageUrl,()=>console.log('Image is being fetched'));
     return(
    <View style={{width:(Dimensions.get('window').width)/2-10,borderWidth:0.4,borderColor:'#bababa',margin:5}}>
    <View style={{backgroundColor:'#fff',flexDirection:'row' }}>
    <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,marginTop:0,marginLeft:0}]} onPress={()=>this.props.navigation.navigate('ProductView',
          { 'totalpodt': products._id, 'categaryid': products.categoryIds, 'prodsize': products.types })}> 
    <Image  resizeMode='contain' source={{uri: shimageUrl}}
          style={{height:217,width:(Dimensions.get('window').width)/2-15,resizeMode:'cover'}}/>
              <View style={styles.LikeDiscountMain}>
                     <View style={styles.LikeDiscount}>   
                               <CText cStyle={{color:'#FFF',paddingLeft:3,}}>{products.discount}%off</CText>
                     </View>
                   <View style={styles.LikeDiscountSym}>
                      <TouchableOpacity  onPress={()=> this.AddToWishList(products._id)}>
                      <Image source={require('../images/funcheck.png') } style={{height:25,width:25,resizeMode:'contain'}}/>          
                      </TouchableOpacity> 
                   </View>
              </View>
              <View style={{justifyContent:'center',marginTop:10}}>              
          <CText cStyle={[styles.LikeMainProductName,{alignSelf:'center',marginBottom:0}]}>{products.name.substr(0,20)}</CText>
                <View style={[styles.LikePricesWrap,{alignSelf:'center',justifyContent:'center',marginTop:0}]}>
                  <CText cStyle={styles.LikePricesText1}>₹{products.price}</CText>
                  <CText cStyle={[styles.LikePricesText2,{marginLeft:5}]}> ₹{products.discountedPrice}</CText>
                </View>
                </View>
       </CButton>
    </View>
    </View>
     );
  }}
  oopsimage(){
    if(this.state.productslist.length > 0){
        return(
          <View style={{ backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap',flex:1 }}>
          <FlatList numColumns={2}
                  data={this.state.productslist}
                  keyExtractor={(item,index) => index}  
                  //renderItem={this.itemRender}
                  renderItem={({item}) =>this.productsView(item)}
                  extraData={this.state}
                  />
            </View>
        );
    }else{
      return(
        <View style={{justifyContent:'center',alignItems:'center',flex:1,height:'100%'}}>
          <Image source={require('../images/oops-icon.png')} style={{resizeMode:'contain',alignItems:'center'}}/>
          <View style={{justifyContent:'center'}}> 
            <Text style={{color:'#c01530',fontSize:20,}}>No Results Found</Text>
          </View>
        </View>
      );
    }
}
  render() {
    const {goBack} = this.props.navigation;
    return (
     <View style={{flex:1,backgroundColor:'#fff'}}>
     {this.spinnerLoad()}  
       <ScrollView  keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false}>         
          <View   style={{borderBottomWidth:0.4,borderColor:'#bababa'}}>
       {this.renderimage()}       
         <View style={[styles.HomeWomesHeadershoplog]}> 
           <View style={{justifyContent:'flex-start',flexDirection:'row'}}> 
                <CButton onPress={()=>goBack()}>
                   <Image source={require('../images/back.png')} style={{margin:15,height:18,width:14,resizeMode:'contain'}}/> 
                </CButton> 
                <CText cStyle={{marginLeft:5,marginTop:13,color:'#fff',fontSize:16,fontFamily:'NeueKabel-Regular'}}>{this.state.singleShopesdtails.shopName}</CText>
           </View> 
            <View style={{flexDirection:'row'}}>
               <CButton  onPress={()=>this.props.navigation.navigate('Search')}> 
                  <Image source={require('../images/Search.png')} style={{margin:15,height:19,width:16,resizeMode:'contain'}}/>
               </CButton>
               <CButton onPress={() => this.gotoLikePageHome()}>
                  <Image resizeMode='contain' source={require('../images/Hometrending.png')} style={{height:18,width:18,resizeMode:'contain',marginRight:15,marginTop:15}}/> 
                    <View style={[styles.HomesymNotify]}>
                          <CText cStyle={[styles.cFFF,styles.aslCenter,styles.FntS8,styles.m3]}>{this.state.wcount}</CText>
                      </View>
               </CButton>
            </View>
         </View> 
        <View style={[styles.jCenter]}>     
            <View style={[styles.bgfff,styles.jCenter]}>
               <CText cStyle={[styles.ShopLogText,{fontFamily:'NeueKabel-Regular'}]}>{this.state.singleShopesdtails.shopName}<CText cStyle={{fontSize:13,fontFamily:'NeueKabel-Light'}}>({this.state.totalcount.count} products)</CText></CText>
                 <View style={[styles.row,styles.jCenter]}>
                  <Image source={require('../images/NearLoation.png')} style={[styles.m5,{height:11,width:8,resizeMode:'contain'}]}/>
                  <CText cStyle={[styles.aslCenter,{fontSize:13,fontFamily:'NeueKabel-Light'}]}>{this.state.singleShopesdtails.landmark},
                  {this.state.singleShopesdtails.location},
                  {this.state.singleShopesdtails.locality}
                  </CText>
                 </View>   
                 <CText cStyle={[styles.mL5, styles.aslCenter,{fontSize:13,fontFamily:'NeueKabel-Light'}]}>{this.state.singleShopesdtails.state}</CText>
                 <CText cStyle={[styles.mL5,styles.mB5, styles.aslCenter,{fontSize:13,fontFamily:'NeueKabel-Light'}]}>
                    {/* {this.creactdata(this.state.singledat)} */}
                  </CText>  
                     <View style={[styles.row, styles.aslCenter,{marginBottom:10} ]}>
                         {/* <CButton cStyle={[styles.m5,{backgroundColor:'#c01530',borderRadius:5}]}>
                            <CText cStyle={[styles.cFFF,{margin:5,fontSize:11,fontFamily:'NeueKabel-Regular'}]}>SHARE</CText>
                         </CButton> */}
                         <View style={[styles.ShopLogDirection]}>
                         <TouchableOpacity onPress={()=> this.GetDirection()} style={{flexDirection:'row'}}>                         
                            <Image source={require('../images/GetDirectionWhit.png')} style={{margin:5,height:11,width:9,marginRight:0}}/>
                            <CText cStyle={[styles.m5,styles.cFFF,{fontSize:11,fontFamily:'NeueKabel-Regular'}]}>GET DIRECTION</CText>
                            </TouchableOpacity>
                         </View>
                     </View>
            </View>             
        </View>
        </View>                
        <View style={{backgroundColor:'#fff'}}>   
             {this.oopsimage()}
        </View>
        </ScrollView>
        
    </View>
    );
  }
}

export default ShopLog;