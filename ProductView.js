import React,{Component} from 'react';
import {
  View,Image, Text,ScrollView,Animated,FlatList,TouchableOpacity,Dimensions, TextInput, TouchableNativeFeedback, TouchableWithoutFeedback
} from 'react-native';
import {CText, CInput, CButton,CSpinner,CModal} from '../common/index';
import styles from '../common/styles';

import Utils from '../common/Utils';
import Config from '../config/Config';

import Swiper from 'react-native-swiper';


export default class ProductView extends Component{
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    state = {
      token:'',selectedButton: '',Addtocart:'',wcount:0,selectionOnPress : this.selectionOnPress.bind(this),
      MTDetails:{},DBRelatedDetails:[],totaldet:[],catageryId:[],backgroundColor: 'white',selectedSize:'',selectedSizeID:'',
        cpin:'',BagCount:0,tempcount:0,tempcart:0,productsize:[],spinnerBool: false,
        Cvisible:false,
        alertContent:'',
    };
};

spinnerLoad() {
  console.log('spinner');
  if (this.state.spinnerBool)
    return <CSpinner />;
  return false;
}
componentWillMount(){
  const self=this;
  self.setState({spinnerBool:true,Cvisible:false})
  Utils.getBagCount('CartCount', function (tResp, tStat) {
    if (tStat && tResp != '') {
        self.setState({ BagCount: tResp });
    }
});
  Utils.getToken('user',function(tResp, tStat){
    if(tStat){
        if(tResp != ''){
          self.setState({tempcart:tResp.myCartCount});
                self.setState({BagCount:tResp.myCartCount});
                console.log('Bagcount: '+self.state.BagCount)
                self.setState({token:tResp.token}, () => {console.log('token in ProduectVirew',self.state.token);
                
              });
              }else{
                self.getCartCount();

        self.setState({token:''}, () => {console.log('no token found in ProduectVirew',self.state.token);
      });
      }         
    }
});
  Utils.getCart('carty',function(tResp,tStat){
    if(tStat)
    {
    console.log('===================================',tResp);
    if(tResp!='')
    {
      var data=JSON.parse(tResp);
      console.log(data.length,'bagcount');
      self.setState({BagCount:data.length});
      
    }
  }else{
    // self.setState({BagCount:0});
    self.getCartCount();
  }
  });
  if(self.props.navigation.state.params.colldata){
    self.setState({totaldet:self.props.navigation.state.params.colldata,catageryId:''},()=>{self.getProductdetails(self.state.totaldet)})
  }else if(self.props.navigation.state.params.trnd){
    self.setState({totaldet:self.props.navigation.state.params.trnd.productId._id,
      catageryId:self.props.navigation.state.params.trnd.productId.categoryIds},()=>{self.getProductdetails(self.state.totaldet)})
  }else {
  // self.getCartCount();

    self.setState({totaldet:self.props.navigation.state.params.totalpodt,
      catageryId:self.props.navigation.state.params.categaryid[1],
      productsize:self.props.navigation.state.params.prodsize},
      ()=>{ console.log('general way',self.props.navigation.state.params.categaryid)
        self.getProductdetails(self.props.navigation.state.params.totalpodt)});
      Utils.getCart('carty',function(tResp,tStat){
        if(tStat)
        {
        console.log('===================================',tResp);
        if(tResp!='')
        {
          var data=JSON.parse(tResp);
          console.log(data.length,'bagcount');
          self.setState({BagCount:data.length});
          
        }
      }else{
        // self.setState({BagCount:0});
        self.getCartCount();
      }
      });
    
   
   }
  }
  componentDidMount() {
    const self = this;
    Utils.getBagCount('CartCount', function (tResp, tStat) {
        if (tStat && tResp != '') {
            self.setState({ BagCount: tResp });
        }
    });
}

  getProductdetails(productId){
    const self = this;    
    self.refs._scroll.scrollTo({x: 0, y: 0, animated: true});
    //console.log('murthy');
    Utils.dbCall(Config.routes.getProductDetails, 'POST', null,  { id: productId}
   , function(resp){ 
      console.log(resp, '====>')          
          if(resp.status){
           self.setState({ MTDetails: resp.details,spinnerBool:false },()=>{ console.log("nm of MTDetails",self.state.MTDetails);});
          //  self.setState({productsize:self.state.MTDetails.types});
          //    console.log('Trend Sizes',self.state.productsize);
           if(!self.state.productsize)
           {
             self.setState({productsize:self.state.MTDetails.types});
             console.log('Trend Sizes',self.state.productsize);
           }

              //console.log("nm of items",resp.details);
          } else {  
               console.log('error in Men ==>', resp);
                  }
      });
      self.simlarprddbcall(productId);
   } 
onClick() {
    console.log('clicked ');
    this.setState({backgroundColor: 'red'}); 
   
}
PinCheck(){
  const self=this;
  if(self.state.cpin){
  if(!Utils.isValidPincode(self.state.cpin)){
    console.log(self.state.cpin);
    self.setState({Cvisible:true,alertContent:'check your pincode'});
    // alert('check your pincode');
    return false;
} else {
  Utils.dbCall(Config.routes.CheckPincode, 'POST', null, {
      pincode:Number(self.state.cpin)
      }, function(resp){
        console.log(resp);
      
      if(resp.status){
    self.setState({Cvisible:true,alertContent:'Available'});        
          // alert('Available');
          // self.props.navigation.navigate('login');
      }else{
        alert(resp.message);
    self.setState({Cvisible:true,alertContent:resp.message});        
      }
  });
}
}else{
  self.setState({Cvisible:true,alertContent:'plz enter pincode'});          
  // alert('plz enter pincode')
}
}
creactdata(date){
  if(date){
   let datestr = date
  console.log(datestr);
  // var creada = new Date(date)
  //console.log(creada)
  var dt = datestr.split(/[: T-]/).map(parseFloat);
  var marr=[ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return String(marr[parseInt(dt[1])-1]+" "+dt[2]+","+dt[0]);
}else{
  return false;
}
}
// CartPinCheck()
// {
//   const self=this;
//   if(!Utils.isValidPincode(self.state.cpin)){
//     console.log(self.state.cpin);
//     alert('check your pincode');
//     return false;
// }
// else {
//   Utils.dbCall(Config.routes.CheckPincode, 'POST', null, {
//       pincode:Number(self.state.cpin)
//       }, function(resp){
//         console.log(resp);
      
//       if(resp.status){
          
//           // alert('Available');
//           // self.props.navigation.navigate('login');
//       }else{
//         alert(resp.message);
//       }
//   });
// }
// }
selectionOnPress(userType) {

  this.setState({ selectedButton: userType })
}

  Sizesrender(item){
      return (
        <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {this.selectionOnPress(item.type);
                                                    console.log(item._id);
                                                    this.setState({selectedSize:item.type,selectedSizeID:item._id},
                                                    ()=>{console.log("selected test",this.state.selectedSize)})}
                                                    }>
          <View style={[Style.viewStyle2,{ backgroundColor: this.state.selectedButton === item.type ? '#c01530' : '#fff' }]}>           
          <CText cStyle={[Style.tStyle,{fontFamily:'NeueKabel-Regular',color:'#1e1e1e',padding:8,color: this.state.selectedButton === item.type ? 'white' : 'black' }]}>{item.type}</CText>         
        </View> 
        </TouchableOpacity>
      ); 
  }
getImages() {
  // console.log(this.state.MTDetails.images,'imageslaps');
  return this.state.MTDetails.images.map(function(data,i){
    //console.log('data',Config.routes.base + Config.routes.getProductPicUser + data);
    return (      
        <Image key={i} resizeMode='contain' source={{uri: Config.routes.base + Config.routes.getProductPicUser + data}} style={{flex:1,resizeMode:'contain',height:300,width:Dimensions.get('window').width}}/>
      
    );
  });
}

  renderMainContent(){
    if(this.state.MTDetails){
      return (
      <View>
         <View>
            <Swiper style={{flex:1,height:300}}
                   paginationStyle={{ left:'80%',bottom:20}}
                   width={this.state.width} activeDotColor={'#c01530'} dotColor={'#fff'} autoplay={true} removeClippedSubviews={false} >
              {this.getImages()}
            </Swiper>   
            <View style={{flexDirection:'row',position:'absolute',bottom:0,marginBottom:20}}>
                  <View style={{width:25,height:25,borderWidth:0.5,borderColor:'#fff',borderRadius:25,marginLeft:15,}}> 
                        <View style={{width:20,height:20,
                                  borderRadius:20, 
                                  margin:2,                      
                                  backgroundColor:'#feaa49',
                                  }}>
                        <CText cStyle={{color:'#feaa49'}} > </CText>
                        </View>
                  </View>
                  <TouchableOpacity>   
                      <CText cStyle={{fontFamily:'NeueKabel-Regular',fontSize:13.3,color:'#fff',marginLeft:10}}>More Colors</CText>  
                </TouchableOpacity>
               </View> 
                 
              </View> 
              <View style={{borderBottomWidth:0.4,justifyContent:'space-between',flexDirection:'row'}}>
                  <View style={{margin:15}} > 
                  <CText cStyle={{fontSize:13.3,fontFamily:'NeueKabel-Book',color:'#1e1e1e'}}>{this.state.MTDetails.name.toUpperCase()}</CText>
                    <View style={{flexDirection:'row',margin:6}}>
                      <CText cStyle={{fontSize:16.2,textDecorationLine:'line-through',color:'#7c7c7c'}}>₹{this.state.MTDetails.price}</CText>
                      <CText cStyle={{color:'black',fontSize:16.2,marginLeft:10}}>₹{this.state.MTDetails.discountedPrice}</CText>
                    </View>
                  </View>
                {/* <View style={{margin:0,marginRight:10,marginTop:18}}>
                  <TouchableOpacity style={{borderColor:'#bfbfbf',borderRadius:20,borderWidth:0.5,}}>
                    <CText cStyle={{alignSelf:'center',color:'black',fontFamily:'NeueKabel-Light',fontSize:10,marginVertical:5,marginHorizontal:10}}>Add to collections
                    </CText>
                  </TouchableOpacity>
                </View>      */}
              </View>
              <View style={{borderColor:'#bfbfbf'}}>
                  <View style={{justifyContent:'space-between',flexDirection:'row'}}>
                      <CText cStyle={{fontSize:13.3,fontFamily:'NeueKabel-Regular',marginLeft:10,color:'#1e1e1e',marginTop:15,marginRight:20}}>SELECT SIZE</CText>
                      <CText cStyle={{fontSize:10.1,fontFamily:'NeueKabel-Regular',alignSelf:'flex-end',color:'#c01530',marginTop:15,marginRight:15}}>SIZE CHART</CText>
                  </View>
              <View style={{flexDirection:'row'}}>
              
              <FlatList horizontal={true}
                          data={this.state.MTDetails.types}
                          keyExtractor={(item,index) => index}  
                          //renderItem={this.itemRender}
                          renderItem={({item}) =>this.Sizesrender(item) }
                          extraData={this.state.selectedButton}/>
              </View>
            
            <CText cStyle={{marginTop:15,marginLeft:10,color:'#1e1e1e',fontFamily:'NeueKabel-Regular',fontSize:13.3}}> CHECK DELIVERY</CText>
                  <View style={{flexDirection:'row',margin:15,marginLeft:10}}>
                      <View> 
                          <TextInput style={{width:(Dimensions.get('window').width)/2-40,height:36,paddingLeft:20,fontFamily:'NeueKabel-Light',color:'#878787',borderWidth:1,borderTopLeftRadius:20,borderBottomLeftRadius:20}}
                          underlineColorAndroid='transparent' placeholder="Enter Pincode"
                          maxLength={6}
                          keyboardType='numeric'
                          value={this.state.cpin} onChangeText={(cpin) => this.setState({cpin})}
                          />
                      </View>
                  <TouchableNativeFeedback style={{}} onPress={()=>this.PinCheck()}>
                        <View style={{backgroundColor:'black',justifyContent:'center',borderWidth:1,borderTopRightRadius:20,borderBottomRightRadius:20}}>
                            <CText cStyle={{textAlign:'center',color:'white',fontFamily:'NeueKabel-Regular',fontSize:10.1,textAlign:'center',marginHorizontal:10}}>
                            CHECK</CText>
                        </View>
                  </TouchableNativeFeedback> 
                </View> 
        </View>

      <View style={{paddingRight:30,borderWidth:0.5}}>
        <CText cStyle={Style.productDetails}>PRODUCT DETAILS</CText>  
                  <CText cStyle={{fontSize:11.7,fontFamily:'NeueKabel-Regular',color:'#434343',lineHeight:20,marginTop:8,marginLeft:10,}}>
                      {this.state.MTDetails.description.replace(/(?:\r\n|\r|\n)/g, ' ')}
                  </CText>
              <View style={{flexDirection:'row'}}>
                <View style={{borderRadius:50,marginTop:8,backgroundColor:'#434343',height:5,width:5,marginLeft:20}}>
                  <CText cStyle={[{color:'#434343'}]}></CText>
                </View>
                <CText cStyle={[{fontSize:11.7,fontFamily:'NeueKabel-Regular',marginLeft:15,marginTop:3}]}>Product viewed by {this.state.MTDetails.viewed} people</CText>
              </View>
              <View style={{flexDirection:'row'}}>
                <View style={{borderRadius:50,marginTop:8,backgroundColor:'#434343',height:5,width:5,marginLeft:20}}>
                    <CText cStyle={[{color:'#434343'}]}></CText>
                </View>
              <CText cStyle={[{fontSize:11.7,fontFamily:'NeueKabel-Regular',marginLeft:15,marginTop:3}]}>Product add on {this.creactdata(this.state.MTDetails.createdAt)}</CText>
              </View>
              <View style={{flexDirection:'row'}}>
                  <View style={{borderRadius:50,marginTop:8,backgroundColor:'#434343',height:5,width:5,marginLeft:20}}>
                      <CText cStyle={[{color:'#434343'}]}></CText>
                  </View>
                <CText cStyle={[{fontSize:11.7,fontFamily:'NeueKabel-Regular',marginLeft:15,marginTop:3}]}>Product viewed by {this.state.MTDetails.favcount} people</CText>
              </View>
              {/* <CText cStyle={{fontSize:11.7,marginTop:10,lineHeight:20,marginLeft:10,}}>
              <CText cStyle={{color:'#8d8d8d'}}>
                    Size & Fit :</CText> <CText cStyle={{color:'#434343'}}>This brand runs true to size. 
                    To ensure the best fit, we suggest consulting the size chart.</CText></CText> */}
              {/* <CText cStyle={{marginLeft:10,marginTop:12,}}>
              <CText cStyle={{color:'#8d8d8d'}}>
                Model size :</CText>
              <CText cStyle={{color:'#434343'}}> Height: 6'2"5 / Chest: 39 / Waist: 32</CText>
              </CText>  */}
                    <CText cStyle={{marginTop:17,fontFamily:'NeueKabel-Medium',marginLeft:10,marginBottom:5,fontSize:13.3,color:'#1e1e1e'}}>
                      SHIPPING DETAILS
                    </CText>

                    <CText cStyle={{fontSize:11.7,color:'#434343',fontFamily:'NeueKabel-Regular',marginTop:5,marginLeft:10}}>Shipping Charges: Rs.{this.state.MTDetails.shippingFee}</CText>
                    <CText cStyle={{fontSize:11.7,color:'#434343',fontFamily:'NeueKabel-Regular',marginTop:2,marginLeft:10}}>Dispach in {this.state.MTDetails.deliveryDuration} days</CText>

                    <CText cStyle={{marginTop:15,fontFamily:'NeueKabel-Medium',marginLeft:10,marginBottom:5,fontSize:13.3,color:'#1e1e1e'}}>
                      RETURN & REFUND
                    </CText>
                  <CText cStyle={{fontSize:11.7,lineHeight:20,color:'#434343',fontFamily:'NeueKabel-Regular',marginLeft:10,marginBottom:15}}>
                    This product is elegible for return.
                    All return request have to be intiated by the buyer with in 5 days of receipt of their package
                  </CText>
                  {/* <View style={{alignSelf:'flex-end',marginRight:17}}>
                    <TouchableOpacity><CText cStyle={{color:'#c01530',marginBottom:10,fontSize:11.7}}>More Info</CText></TouchableOpacity>
                    </View> */}
                  
            </View>
<CText cStyle={{marginTop:15,fontFamily:'NeueKabel-Medium',marginLeft:10,marginBottom:5,fontSize:13.3,color:'#1e1e1e'}}>
          SIMILAR PRODUCTS
        </CText>
        </View>)
    } else {
      return;
    }
  }
 addToCart(){
  const self = this;
  let data = 0
  // Utils.getToken('user',function(tResp, tStat){
  //     if(tStat){
  //       if(tResp != ''){
  //         data = tResp;
  //         self.setState({BagCount:data.myCartCount}, () => {console.log('count in ProduectVirew',data.myCartCount);
          

  //       });
  //       }  
  //     }  
  // });
  Utils.getBagCount('CartCount', function (tResp, tStat) {
    if (tStat && tResp != '') {
        self.setState({ BagCount: tResp });
data=tResp;
    }
});
   console.log('addToCart-token',self.state.productsize);
   if(self.state.selectedSize =self.state.selectedSize){
     if(self.state.cpin){
      Utils.dbCall(Config.routes.CheckPincode, 'POST', null, {
        pincode:Number(self.state.cpin)
        }, function(resp){
          console.log(resp);
        if(resp.status){
          if(self.state.token != ''){
            console.log('murthy',self.state.selectedSize,'+++',self.state.totaldet);
        Utils.dbCall(Config.routes.addToCart,'POST',{token:self.state.token}, 
        { productId: self.state.totaldet, size: self.state.selectedSize, quantity: 1 }
       , function(resp){           
              if(resp.status){
                if(resp.add){
                  self.setState({ Addtocart: resp })
                  self.setState({BagCount: data+1});
                  data = data+1;
                  Utils.setBagCount('CartCount', data, function (tResp, tStat) {
                    if (tStat) {
                        console.log(tResp);
                    }
                });
                  // Utils.setToken('user', data, function(tResp,tStat){
                  //     if(tStat){                
                  //       console.log('set count in set tken ==>', resp);
                  //       }
                  // });
                  // alert(resp.message);
                self.setState({Cvisible:true,alertContent:resp.message});                          
                }else{
                  // alert('Already item is in cart');
                self.setState({Cvisible:true,alertContent:'Already item is in cart'});                          
                } 
              } else {
                          console.log('error in Cart ==>', resp);
                      }
          });
        }else{
          Utils.getCart('carty',  function(tResp,tStat){
            console.log('addToCart-tResp',tResp);
            console.log('addToCart-tStat',tStat);
            if(tStat){
              if(tResp.length == 0){
                var cartHolder = [];
                
                cartHolder.push(this.state.MTDetails);
                Utils.setCart('carty', JSON.stringify(cartHolder), function(tResp,tStat){
                  if(tStat){
                  }
                });
                return;
              }
                var GetJsonArr = JSON.parse(tResp);
                var cartgryarr = [];
                catgryarr = GetJsonArr.filter(function(item) { 
                  return item._id === self.state.totaldet && item.sid==self.state.selectedSizeID;
                });
                if(catgryarr.length == 0){
                  var cartHolder = GetJsonArr;
                  var dummyObj = self.state.MTDetails;
                  
                  dummyObj.size = self.state.selectedSize;
                  dummyObj.quantity = 1;
                  for (let m = 0; m < dummyObj.types.length; m++) {
                   console.log(self.state.selectedSize ,'=='+ dummyObj.types[m].type,"dieeee");
                    if(self.state.selectedSize === dummyObj.types[m].type){
                      dummyObj.sid = dummyObj.types[m]._id;
                      console.log('dkjsjkjksd',dummyObj.sid);
                      cartHolder.push(dummyObj);
                    }
                    
                  }
                console.log('cartHolder=====',cartHolder)
                // alert('successfully added to cart ');
                self.setState({Cvisible:true,alertContent:'successfully added to cart'});                                            
                  // cartHolder.push(self.state.MTDetails);
                  Utils.setCart('carty', JSON.stringify(cartHolder), function(tResp,tStat){
                    if(tStat){
                      self.getCartCount();
                    }
                  });
                }
              }else{
                var cartHolder = [];
                var cartpid=''
                var dummyObj = self.state.MTDetails;
                  dummyObj.size = self.state.selectedSize;
                  dummyObj.quantity = 1;
                  for (let m = 0; m < self.state.productsize.length; m++) {
                    // const testingsize = self.state.productsize[m];
                    if(self.state.selectedSize==self.state.productsize[m].type){
                      dummyObj.sid=self.state.productsize[m]._id;
                      console.log('dkjsjkjksd',dummyObj.sid)
                    }
                    
                  }
                cartHolder.push(dummyObj);
                cartpid=cartHolder._id;
                console.log('cartHolder=====',cartHolder)
                // alert('successfully added to cart ');
                self.setState({Cvisible:true,alertContent:'successfully added to cart'});                                                            
                Utils.setCart('carty', JSON.stringify(cartHolder), function(tResp,tStat){
                  if(tStat){
                    console.log('cartpid===========',cartpid);
                    self.getCartCount();
                  }
                });
              }
        });
        }
        }else{
          // alert(resp.message);
          self.setState({Cvisible:true,alertContent:resp.message});                                                                      
        }
      });
  }else{
    //  alert('Please enter the pincode')
     self.setState({Cvisible:true,alertContent:'plz enter pincode'});                                                                           
   }}
   else{
    // alert('plz selected size');
    this.setState({Cvisible:true,alertContent:'plz selected size'});
    // this.Cvisible=true;
   }
 }
 simlarprddbcall(productID){
  const self = this;
  console.log(productID,'productID-similar');
  console.log(this.state.catageryId);
  Utils.dbCall(Config.routes.getRelatedProducts, 'POST',{token:self.state.token},  
  { categoryId: this.state.catageryId,
    currentId: productID} 
 , function(resp){ 
    console.log( '====>',resp)          
        if(resp.status){
          var extradetails=[];
          for (let index = 0; index < resp.products.length; index++) {
            const element = resp.products[index];
            element.wishlist =false;
            extradetails.push(element);
          }
         self.setState({DBRelatedDetails: extradetails});
            console.log("simlar nm of items",extradetails);
        } else {  
             console.log('error in Men ==>', resp);
             return false;
                }
    });
 } 
 AddToWishList(wishlistItem){  
  const self = this;
   console.log('AddToWishList-token',this.state.token);
   if(this.state.token === '' || this.state.token == null){
    return self.props.navigation.navigate('Login');
  }

  for (let i = 0; i < this.state.DBRelatedDetails.length; i++) {
    const element = this.state.DBRelatedDetails[i];    
      if(wishlistItem === element._id)
      {
        if(element.wishlist){
          element.wishlist =false;
          this.addproductToWishList(wishlistItem,false);
        }else{
          element.wishlist =true;
          this.addproductToWishList(wishlistItem,true);
        }
        this.state.DBRelatedDetails[i] = element;
      }
  }
}
addproductToWishList(id,boolean){
  var dump = [];
 for (let i = 0; i < this.state.DBRelatedDetails.length; i++) {
   const element = this.state.DBRelatedDetails[i]; 
   dump.push(element);
   this.setState({ DBRelatedDetails: dump });
 }
 const self = this;
 console.log('id,token',id,self.state.token);
 Utils.dbCall(Config.routes.addProductToWishList, 'POST', {token:self.state.token},  
   {id: id}
 , function(resp){           
       console.log('addproductToWishList ==>', resp);
       if(resp.status)
       {
         
       }else{
         
       }
         
      
  });
}

getCartCount(){
  const self=this;
  Utils.getCart('carty',function(tResp,tStat){
    if(tStat)
    {
      console.log('===================================',tResp);
      if(tResp!='')
      {
        var GetJsonArr = JSON.parse(tResp);
        self.setState({BagCount:GetJsonArr.length},()=>{console.log('getCartCount****BagCount======',self.state.BagCount)});
        Utils.setBagCount('CartCount', GetJsonArr.length, function (tResp, tStat) {
          if (tStat) {
              console.log(tResp);
          }
      });
      }
    }
  })
}
gatway(){
  let sizebuy=this.state.selectedSize;
  const self=this;
  if(sizebuy){
    if(self.state.cpin){      
      Utils.dbCall(Config.routes.CheckPincode, 'POST', null, {
        pincode:Number(self.state.cpin)
        }, function(resp){
        if(resp.status){
          self.props.navigation.navigate('Paydetail',{totalp:self.state.MTDetails.discountedPrice,details:self.state.MTDetails});      
        }else{
          // console.warn('Error',resp);
          self.setState({Cvisible:true,alertContent:resp.message});
        }
    });
    }else{
      // alert('Plz Enter pincode');
    this.setState({Cvisible:true,alertContent:'Plz Enter pincode'});      
    }
  }else{
    // alert('plz selected size');
    this.setState({Cvisible:true,alertContent:'plz selected size'});
    
  }
}

 RelatedDetails(item){
   //console.log(item);
   if(item.wishlist){
    let pimageUrl=Config.routes.base + Config.routes.getProductPicUser + item.images[0];
    var response = Image.prefetch(pimageUrl,()=>console.log('Image is being fetched'))
   return(
            <View style={Style.conimages2} >
                <TouchableOpacity activeOpacity={0.3} style={[Style.imgstyle2, {width:(Dimensions.get('window').width)/2-10,borderWidth:0.4,borderColor:'#bababa'}]}  
                    onPress={()=> this.getProductdetails(item._id)}>  
                  <Image source={{uri:pimageUrl}} 
                                style={{width: (Dimensions.get('window').width)/2-15, height:218,resizeMode:'cover'}} />
                     <View style={{position:'absolute',flexDirection:'row',marginTop:10,}}>
                         <View style={{backgroundColor:'#c01530',justifyContent:'center',height:36,width:58,borderTopRightRadius: 10,borderBottomRightRadius: 10}}>   
                                   <CText cStyle={{color:'#FFF',paddingLeft:3,}}>{item.discount}%off</CText>
                         </View>
                         <View style={{marginTop:8,flex:1,alignItems:'flex-end',marginRight:10}}>
                            <TouchableOpacity onPress={()=> this.AddToWishList(item._id)}>
                                  <Image source={require('../images/fcheck.png') } style={{height:28,width:28,resizeMode:'contain'}}/>
                              </TouchableOpacity>         
                         </View>
                      </View>
                      <View style={{marginLeft:5}}>
                  <CText cStyle={Style.MainProductName}>{item.name.substr(0,20)}</CText>
                      <View>
                          <CText cStyle={{fontSize:11,fontFamily:'NeueKabel-Light'}}>{item.vendorId[0].shopName}</CText>
                        </View>
                        <View style={{flexDirection:'row',}}>
                          <Image source={require('../images/NearLoation.png')} style={{height:8,width:6,resizeMode:'contain',marginTop:3,marginRight:5}}/>
                          <CText cStyle={{color:'#636363',fontSize:9.5,}}>{item.vendorId[0].location}</CText>
                        </View>
                        <View style={{ flex:1,flexDirection:'row',justifyContent:'flex-end',marginTop:5,marginRight:10}}>
                          <CText cStyle={{color:'#7c7c7c',marginTop:5,textDecorationLine:'line-through'}}>₹{item.price}</CText>
                          <CText cStyle={{color:'#1e1e1e',marginLeft:10,padding:5}}> ₹{item.discountedPrice}</CText>
                        </View>
                    </View>
                </TouchableOpacity>
             </View>
   );
  }
   else{
    let pimageUrl=Config.routes.base + Config.routes.getProductPicUser + item.images[0];
    var response = Image.prefetch(pimageUrl,()=>console.log('Image is being fetched'))
    return(
           <View style={Style.conimages2} >
               <TouchableOpacity activeOpacity={0.3} style={[Style.imgstyle2,{width:(Dimensions.get('window').width)/2-10,borderWidth:0.4,borderColor:'#bababa'}]}
                onPress={()=> this.getProductdetails(item._id)}  > 
                 <Image source={{uri: pimageUrl}} 
                               style={{width: (Dimensions.get('window').width)/2-15, height:218,resizeMode:'cover'}} />
                    <View style={{position:'absolute',flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                        <View style={{backgroundColor:'#c01530',justifyContent:'center',height:36,width:58,borderTopRightRadius: 10,borderBottomRightRadius: 10}}>   
                                  <CText cStyle={{color:'#FFF',paddingLeft:3,}}>{item.discount}%off</CText>
                        </View>
                        <View style={{marginTop:8,flex:1,alignItems:'flex-end',marginRight:10}}>
                           <TouchableOpacity  onPress={()=> this.AddToWishList(item._id)}>
                                 <Image source={require('../images/funcheck.png') } style={{height:28,width:28,resizeMode:'contain'}}/>
                             </TouchableOpacity>         
                        </View>
                     </View>
                     <View style={{marginLeft:5}}>
                 <CText cStyle={Style.MainProductName}>{item.name.substr(0,20)}</CText>
                     <View>
                         <CText cStyle={{fontSize:11,fontFamily:'NeueKabel-Light'}}>{item.vendorId[0].shopName}</CText>
                       </View>
                       <View style={{flexDirection:'row',}}>
                         <Image source={require('../images/NearLoation.png')} style={{height:8,width:6,resizeMode:'contain',marginTop:3,marginRight:5}}/>
                         <CText cStyle={{color:'#636363',fontSize:9.5,}}>{item.vendorId[0].location}</CText>
                       </View>
                       <View style={{ flex:1,flexDirection:'row',justifyContent:'flex-end',marginTop:5,marginRight:10}}>
                         <CText cStyle={{color:'#7c7c7c',marginTop:5,textDecorationLine:'line-through'}}>₹{item.price}</CText>
                         <CText cStyle={{color:'#1e1e1e',marginLeft:10,padding:5}}> ₹{item.discountedPrice}</CText>
                       </View>
                   </View>
               </TouchableOpacity>
            </View>
  );

   }
 }
  render(){
    const {goBack} = this.props.navigation;
    return(
   <View style={{backgroundColor:'#fff',flex:1}}>
   {this.spinnerLoad()}  
    <View style={{position:'absolute',bottom:0,zIndex:1,borderWidth:0.5,flexDirection:'row',backgroundColor:'#c01530'}}>
        <View style={{flex:1,justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>this.addToCart()} >
            <CText cStyle={{marginLeft:10,color:'white',fontSize:13.3,margin:15,fontFamily:'NeueKabel-Regular'}}>ADD TO CART</CText></TouchableOpacity>
        </View>
        <View style={{flex:1,justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>{this.gatway()}}>
                <CText cStyle={{color:'white',alignSelf:'flex-end',marginRight:10,fontSize:13.3,margin:15,fontFamily:'NeueKabel-Regular'}}>BUY NOW</CText>
          </TouchableOpacity>
        </View>
        
  </View> 
   
      <View style={{backgroundColor:'black',flexDirection:'row',justifyContent:'space-between'}}>
        <TouchableOpacity onPress={()=>goBack()}>
          <Image style={{height:19,width:15,alignSelf:'center',margin:18,resizeMode:'contain'}} source={require('../images/back.png')}/>
        </TouchableOpacity>
          <View style={{flexDirection:'row'}}>
          {/* <TouchableOpacity>
            <Image style={{height:19,width:19,alignSelf:'center',margin:20,resizeMode:'cover'}} source={require('../images/ProductView_Share.png')}/>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Bag')}>
            <Image style={{width:16,height:19,resizeMode:'contain',alignSelf:'center',marginTop:18,marginRight:23}} source={require('../images/Product_View_Bag.png')}/>
                  <View style={styles.HomesymNotify}>
                      <CText cStyle={[styles.cFFF,styles.aslCenter,styles.FntS8,styles.m3]}>{this.state.BagCount}</CText>
                  </View>
            </TouchableOpacity>
          </View>
      </View>
     
      <ScrollView pagingEnabled={true}
  ref='_scroll'
  > 
          <View>
              {this.renderMainContent()}
             
            </View>
            <ScrollView>
          <View style={{flex:1,backgroundColor:'#fff',marginBottom:38}}>
          
          <FlatList numColumns={2}
                  data={this.state.DBRelatedDetails}
                  keyExtractor={(item,index) => index}  
                  //renderItem={this.itemRender}
                  renderItem={({item}) =>this.RelatedDetails(item) }
                  //extraData={this.state.selectedButton}
                  /> 
          </View>
          </ScrollView>
  </ScrollView>
  {console.log(this.state.Cvisible,this.state.BagCount,this.state.spinnerBool)}
  <CModal visible={this.state.Cvisible}   
                          closeButton={()=>{this.setState({Cvisible:false});}} 
                          buttonClick={()=>{this.setState({Cvisible:false});}} 
                          buttonText='Ok'
                          modalname='Alert'
                          buttonClickRemove={() => this.RemovefromWishlist()}
                          buttonVisible='none'>
                  <CText cStyle={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                  </CModal>
  </View>  
    );
  }
}

  const Style={
    arrowStyle:{
        marginLeft:15,
    },
    buyStyle:{
        position:'absolute',
    },
    shareStyle:{
        position:'absolute',
            },
    
       //size
    viewStyle2:{
      flexDirection:'row',
      justifyContent:'center',
      alignSelf:'center',
      borderWidth:1,
      width:35,height:35,
      borderRadius:40,
      marginTop:15,
      marginLeft:10,
        justifyContent:'center',
        borderColor:'#000',
    },
    viewStyle3:{
      backgroundColor:'#c01530',
      justifyContent:'center',
      alignSelf:'center',
      borderWidth:0.5,
      width:40,height:40,
      borderRadius:40,
      marginTop:15,
      marginLeft:10,
        justifyContent:'center',
        borderColor:'#646464',
    },
   conimages2:{
      flex:1,
      backgroundColor:'#fff',
      paddingBottom:6,
      paddingTop:6,
      justifyContent:'center',
    },
    imgstyle2:{
      marginLeft:5,
      marginRight:5,
      borderColor:'#e6e6e6',
      borderWidth:2,
      borderRightWidth:0.3,
      borderLeftWidth:0.3,
    },
    MainProductName:{
      fontSize:13,
      fontFamily: 'NeueKabel-Regular',
    },
    tStyle:{
        alignSelf:'center',
        fontFamily:'NeueKabel-Regular',
        color:'black',
        fontSize:11
    },
    tStyle1:{
      fontFamily:'NeueKabel-Regular',
      color:'white',
      fontSize:11
  },
    productDetails:{
        marginTop:10,
        marginLeft:10,
        fontFamily:'NeueKabel-Medium',
        color:'#1e1e1e',
        fontSize:13.3
    },
    //similarText
    textStyle:{
        color:'black',
        fontSize:13.3
    },
    textStyle2:{
        color:'black',
        fontSize:11.
    } 

};