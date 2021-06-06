import React,{Component} from 'react';
import {View,Alert,Text,ScrollView,TouchableOpacity,FlatList,Modal,AsyncStorage,Image,Dimensions,TextInput} from 'react-native';
import {CText, CInput, CButton,CSpinner,CModal} from '../common/index';
import styles from '../common/styles';
import Utils from '../common/Utils';
import Config from '../config/Config';

export default class Likepage extends Component{

  state ={wishListItems:[],token:'',removeData:[],itemdetails:[],LikeCount:0,spinnerBool: false,ShopWishlist:[],shopsData:[]
  ,Cvisible:false,alertContent:'',temparrr:[],RemoveVisible:'none',Cmodalname:'Alert'
  ,buttonText:'Ok' }

  componentWillMount(){
    const self=this;
    self.removeproid=null;
    // self.setState({itemdetails:self.props.navigation.state.params.item},()=>{
    // });
    Utils.getToken('user',function(tResp, tStat){
      if(tStat){
        if(tResp != ''){
          self.setState({token:tResp.token}, () => {
          self.callWishListProducts();
        });
        }else{
          return self.props.navigation.navigate('Login');
        }   
      }else{
        return self.props.navigation.navigate('Login');
      }  
  });
  }

  callWishListProducts(){
    const self = this;
    var tempArr =[];
    var testshop=[];
    
    self.setState({spinnerBool: true});
    Utils.dbCall(Config.routes.getWishListProducts, 'GET', {token:self.state.token}, { }, function(resp){
    console.warn(JSON.stringify(resp)+" == wishlist resp")
    if(resp.status){
      self.setState({LikeCount:resp.totalWishlist},()=>{});
      Utils.getWishList('withy',function(tResp,tStat){
        if(tResp!= '')
        {
          self.setState({LikeCount:resp.totalWishlist},()=>{});
        }
      });
      
      for (let i = 0; i < resp.details.length; i++) {
        const element = resp.details[i];
        // testshop.push(element[i].shopName);
        
        for (let index = 0; index < element.length; index++) {
          tempArr.push(element[index]);
          console.log(element[index])          
        }
      }
      self.setState({wishListItems : tempArr},()=>{});
      self.setState({removeData:tempArr,spinnerBool: false
    });
    self.CheckingShops();
    console.log(tempArr)
    }else{
    }        
     });
  }

  RemovefromWishlist(){
    let wishlistItem = this.removeproid;
    this.removeproductfromWishList(wishlistItem);
  }
  CheckingShops()
  {
    var testshop=[]
    var shoparr=[]
    const self=this;
    for (let i = 0; i < self.state.wishListItems.length; i++) {
      const element = self.state.wishListItems[i];
      testshop.push(element.shopName);
 
    }
    console.log(testshop);
    for (let j = 0; j < testshop.length; j++) {
      if (shoparr.indexOf(testshop[j]) == -1) {
        shoparr.push(testshop[j]);
      }
    }
    console.log(shoparr)
    for (let k = 0; k < shoparr.length; k++) {
      shoparr[k] = { shopname: shoparr[k], product: [] };
    }
    const prodcarts = {};
    var details = [];
    for (let j = 0; j < shoparr.length; j++) {
      var shopname = shoparr[j].shopname;
      var shopproducts = [];
      for (let index = 0; index < self.state.wishListItems.length; index++) {
        const element = self.state.wishListItems[index];

        if (shopname === element.shopName) {
          element.shopName = shopname;
          element.prodName = element.prodName;
          shoparr[j].product.push(element);
        }
      }
      details.push(shoparr[j].product);
      prodcarts.details = details;
      self.setState({ ShopWishlist: prodcarts }, () => { console.log("riyazsjkc", self.state.ShopWishlist.details) });
      // console.log()		
    }
  }

 removeproductfromWishList(id){   
  const self = this;
  Utils.dbCall(Config.routes.RemoveProductfromWishlist, 'POST', {token:self.state.token},  
    {id: id}
  , function(resp){           
       if(resp.status){
        Utils.getWishList('withy',function(tResp,tStat){
          if(tResp!= '')
          {
            self.setState({LikeCount:tResp});
          }
        });
        if(self.state.LikeCount == 0){
          self.setState({LikeCount:0});
          Utils.setWishList('withy',self.state.LikeCount,function(tResp,tStat){
            if(tStat)
            {
              Utils.getWishList('withy',function(tResp,tStat){
                if(tResp!= '')
                {
                  self.setState({LikeCount:tResp-1});
                }
              });
            }
          });
        }else{
          Utils.getWishList('withy',function(tResp,tStat){
            if(tResp!= '')
            {
              self.setState({LikeCount:tResp-1});
              Utils.setWishList('withy',tResp-1,function(tResp,tStat){
                if(tStat)
                {
                }
              });
            }
          });
       }     
      self.callWishListProducts(self.state.token);
        self.setState({Cvisible:false,buttonText:'Ok',Cmodalname:'Alert',RemoveVisible:'none'})    
          }else{
          }
      });
}

spinnerLoad() {
  if (this.state.spinnerBool)
    return <CSpinner />;
  return false;
}
InnercardLike(item)
{
  let limageUrl=Config.routes.base + Config.routes.getProductPicUser + item.images[0];
      var response = Image.prefetch(limageUrl,()=>console.log('Image is being fetched'))
      return(
      <View style={{flex:1 }}>
     
      <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,borderColor:'#bababa',borderWidth:0.4}]} onPress={()=>this.props.navigation.navigate('ProductView',{'totalpodt':item.prodId,'categaryid':item.categoryIds})}> 
      <Image source={{uri: limageUrl}}            
         style={{width:(Dimensions.get('window').width)/2-15, height:218, resizeMode:'cover'}} />

          <View style={styles.LikeDiscountMain}>
                 <View style={styles.LikeDiscount}>   
                           <CText cStyle={{color:'#FFF',paddingLeft:3,}}>{item.discount}%off</CText>
                 </View>
               <View style={styles.LikeDiscountSym}>
               <TouchableOpacity
               onPress={() => {
                this.setState({Cvisible:true,alertContent:'Are you sure you want to Remove the product', Cmodalname:'Remove',
                RemoveVisible:'flex',buttonText:'No'
                });
                this.removeproid=item.prodId;
              //    Alert.alert('Delete','Are you sure you want to Delete the product',
              //  [{text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              //  {text: 'YES', onPress: () => {this.RemovefromWishlist(item.prodId)}}])
             } } >
                     <Image source={require('../images/del.png')} style={{height:28,width:28,resizeMode:'contain'}}/>
                     </TouchableOpacity>
               </View>
          </View>
          <View style={{marginLeft:5}}>
      <CText cStyle={styles.LikeMainProductName}>{item.prodName.substr(0,20)}</CText>
            <View>
              <CText cStyle={[{fontSize:11,},styles.FntFaNL]}>{item.shopName}</CText>
            </View>
            {/* <View style={{flexDirection:'row',}}>
              <Image source={require('../images/NearLoation.png')} style={styles.LikeNavigationImg}/>
              <CText cStyle={{color:'#636363',fontSize:9.5,}}>Madhapur</CText>
            </View> */}
            <View style={styles.LikePricesWrap}>
              <CText cStyle={styles.LikePricesText1}>₹{item.price}</CText>
              <CText cStyle={[styles.LikePricesText2,{padding:0}]}> ₹{item.discountedPrice}</CText>
            </View>
            </View>
   </CButton>
   </View>
    );
}
  renderWishItems(shopsData){
    console.log(shopsData,'shopsData')
    return(
      <View>
      <View>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('ShopLog',{singleshopid:shopsData[0].shopUniqueId})}>
						<CText cStyle={[styles.BagProduct, styles.m5,styles.fontReg, {color: 'blue',alignSelf:'center',fontSize:20}]}>{shopsData[0].shopName}</CText>
            </TouchableOpacity>
					</View>
					<View style={{margin:4}}>					
          <FlatList 
          numColumns={2}
						data={shopsData}
						keyExtractor={(item, index) => index}
						renderItem={({ item }) => this.InnercardLike(item)}
					/>
					</View>
          </View>
    );
  }

	render(){
    const {goBack} = this.props.navigation;
		return(
         <View style={{flex:1,backgroundColor:'#fff'}}>
          {this.spinnerLoad()}
         <View style={styles.LikeHeader}> 
           <CButton onPress={()=>goBack()}>
           <View style={{justifyContent:'flex-start',marginTop:15}}> 
            <Image source={require('../images/back.png')} style={[{height:17,width:10,resizeMode:'contain',marginLeft:10}]}/>
           </View> 
          </CButton> 
            <CText cStyle={styles.LikeHeaderText}>MY LIKES({this.state.LikeCount})</CText> 
            <CButton onPress={()=>this.props.navigation.navigate('Search')}>
            <View style={{marginTop:15,marginRight:10}}>
              <Image source={require('../images/Search.png')} style={{height:18,width:16,resizeMode:'contain'}}/>
            </View>
            </CButton>
         </View> 
      
      <View style={{flex:1}}>               
      <ScrollView>
         
      <View style={{flex:1,backgroundColor:'#fff',flexDirection:'row',flexWrap:'wrap',}}>

              <FlatList
						data={this.state.ShopWishlist.details}
						keyExtractor={(item, index) => index}
						//renderItem={this.itemRender}
						renderItem={({ item }) => this.renderWishItems(item)}
						extraData={this.state.ShopWishlist.details}
					/>
             </View>
           

       </ScrollView>  
       <CModal visible={this.state.Cvisible} 
                                    closeButton={()=>{this.setState({Cvisible:false});}} 
                                    buttonClick={()=>{this.setState({Cvisible:false});}}
                                    buttonText={this.state.buttonText}
                                    modalname={this.state.Cmodalname}
                                    buttonClickRemove={() => this.RemovefromWishlist()}
                                    buttonVisible={this.state.RemoveVisible}>
                              <CText style={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                              </CModal>
         </View>
      </View> 
			);
	}
} 
