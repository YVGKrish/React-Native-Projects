import React,{Component} from 'react';
import {View,Text,ScrollView,TouchableOpacity,FlatList,Modal,AsyncStorage,Image,Dimensions,TextInput} from 'react-native';
import {CText, CInput, CButton,CSpinner} from '../common/index';
import styles from '../common/styles';
import Utils from '../common/Utils';
import Config from '../config/Config';

export default class TrendSeeMore extends Component{

  state ={Tendprods:[],token:'',removeData:[],itemdetails:[],spinnerBool:true,wcount:0,he:0,we:0}
  spinnerLoad() {
    console.log('spinner');
    if (this.state.spinnerBool)
      return <CSpinner />;
    return false;
  }

  componentWillMount(){
    const self=this;
    // self.setState({itemdetails:self.props.navigation.state.params.item},()=>{
    //   console.log('Likepage',self.state.itemdetails);
    // });
        Utils.dbCall(Config.routes.getAllTrendingProds, 'GET', null, { number: 4 }, function (resp) {
            if (resp.status) {
                self.setState({ Tendprods: resp.trendingItems, spinnerBool: false });
            }
        });
    Utils.getToken('user',function(tResp, tStat){
      if(tStat){
        if(tResp != ''){
          self.setState({token:tResp.token}, () => {console.log('token in TrendSeeMore',self.state.token);
          
        });
        }   
      }  
  });
  }
  setWishCount(value) {
    var fashion = { count: value }
    AsyncStorage.setItem('fashionpecks:wishList', JSON.stringify(fashion), (err) => {
      console.log(err);
    });
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

  AddToWishList(wishlistItem) {
    const self = this;
    if (self.state.token === '') {
        return self.props.navigation.navigate('Login');
    }
    for (let i = 0; i < self.state.Tendprods.length; i++) {
        const element = self.state.Tendprods[i];
        if (wishlistItem === element.productId._id) {
            if (element.wishlist) {
                element.wishlist = false;
                self.addproductToWishList(wishlistItem, false);
            } else {
                element.wishlist = true;
                self.addproductToWishList(wishlistItem, true);
            }
            self.state.Tendprods[i] = element;
        }
    }

}
  addproductToWishList(id, boolean) {
    const self = this;
    var dump = [];
    for (let i = 0; i < self.state.Tendprods.length; i++) {
        const element = self.state.Tendprods[i];
        dump.push(element);
        self.setState({ Tendprods: dump });
    }
    //console.log('id,token',id,self.state.token);
    Utils.dbCall(Config.routes.addProductToWishList, 'POST', { token: self.state.token },
        { id: id }
        , function (resp) {
            console.log('addproductToWishList ==>', resp);
            if (resp.status) {
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

   renderTrendItems(item)
   {
        console.log('renderWishItems',item);
        if(item.wishlist)
        {
            let imageUrl=Config.routes.base + Config.routes.getProductPicUser + item.productId.images[0];
            var response = Image.prefetch(imageUrl,()=>console.log('Image is being fetched'))
            return(
            <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,borderWidth:0.4,borderColor:'#bababa'}]} onPress={()=>this.props.navigation.navigate('ProductView',{trnd:item})}> 
            <Image source={{uri: imageUrl}} style={{width:(Dimensions.get('window').width)/2-15, height:218, resizeMode:'cover'}}/>
                <View style={styles.LikeDiscountMain}>
                        {this.spinnerLoad()}
                                <View style={styles.LikeDiscount}>   
                                    <CText cStyle={{color:'#FFF',paddingLeft:3,}}>{item.productId.discount}%off</CText>
                                </View>
                            <View style={styles.LikeDiscountSym}>
                            <TouchableOpacity onPress={()=> this.AddToWishList(item.productId._id)}>
                            <Image source={require('../images/fcheck.png')} style={{height:28,width:28,resizeMode:'contain'}}/>
                            </TouchableOpacity>
                                        
                            </View>
                </View>
                <View style={{marginLeft:5}}>
            <CText cStyle={styles.LikeMainProductName}>{item.productId.name.substr(0, 20)}</CText>
                    <View>
                    <CText cStyle={[{fontSize:11,},styles.FntFaNL]}>By {item.productId.vendorId.shopName}</CText>
                    </View>
                    <View style={{flexDirection:'row',}}>
                    <Image source={require('../images/NearLoation.png')} style={styles.LikeNavigationImg}/>
                    <CText cStyle={{color:'#636363',fontSize:9.5,fontFamily:'NeueKabel-Light'}}>{item.productId.vendorId.location}</CText>
                    </View>
                    <View style={styles.LikePricesWrap}>
                    <CText cStyle={styles.LikePricesText1}>₹{item.productId.price}</CText>
                    <CText cStyle={[styles.LikePricesText2,{padding:0}]}> ₹{item.productId.discountedPrice}</CText>
                    </View>
                </View>
        </CButton>
            );
        }
        else{
            let imageUrl=Config.routes.base + Config.routes.getProductPicUser + item.productId.images[0];
            var response = Image.prefetch(imageUrl,()=>console.log('Image is being fetched'))
            Image.getSize(imageUrl, (width, height) => {
                console.log(`The image dimensions are ${width}x${height}`);
                this.setState({he:height,we:width},()=>{console.log(this.state.we+'*'+this.state.he)})
                
              }, (error) => {
                console.error(`Couldn't get the image size: ${error.message}`);
              });
            
    return(
        <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,borderWidth:0.4,borderColor:'#bababa'}]} onPress={()=>this.props.navigation.navigate('ProductView',{trnd:item})}> 
        <Image source={{uri: imageUrl}}  style={{width:(Dimensions.get('window').width)/2-15, height:218,resizeMode:'cover'}}/>
            <View style={styles.LikeDiscountMain}>
            {this.spinnerLoad()}
                   <View style={styles.LikeDiscount}>   
                             <CText cStyle={{color:'#FFF',paddingLeft:3,}}>{item.productId.discount}%off</CText>
                   </View>
                 <View style={styles.LikeDiscountSym}>
                 <TouchableOpacity
              onPress={()=> this.AddToWishList(item.productId._id)}
              >
                       <Image source={require('../images/funcheck.png')} style={{height:28,width:28,resizeMode:'contain'}}/>
                       </TouchableOpacity>
                          
                 </View>
            </View>
            <View style={{marginLeft:5}}>
        <CText cStyle={styles.LikeMainProductName}>{item.productId.name.substr(0, 20)}</CText>
              <View>
                <CText cStyle={[{fontSize:11,},styles.FntFaNL]}>By {item.productId.vendorId.shopName}</CText>
              </View>
              <View style={{flexDirection:'row',}}>
                <Image source={require('../images/NearLoation.png')} style={styles.LikeNavigationImg}/>
                <CText cStyle={{color:'#636363',fontSize:9.5,fontFamily:'NeueKabel-Light'}}>{item.productId.vendorId.location}</CText>
              </View>
              <View style={styles.LikePricesWrap}>
                <CText cStyle={styles.LikePricesText1}>₹{item.productId.price}</CText>
                <CText cStyle={[styles.LikePricesText2,{padding:0}]}> ₹{item.productId.discountedPrice}</CText>
              </View>
              </View>
     </CButton>
      );
        }
  }

	render(){
    const {goBack} = this.props.navigation;
		return(
         <View style={{flex:2}}>
         <View style={[styles.LikeHeader,{paddingTop:8}]}> 
           <CButton onPress={()=>goBack()}>
           <View style={{justifyContent:'flex-start',marginTop:10}}> 
            <Image source={require('../images/back.png')} style={[{height:17,width:10,marginLeft:10}]}/>
           </View> 
          </CButton>  
          <CText cStyle={{ fontSize: 13, color: '#FFF', fontFamily: 'NeueKabel-Regular',marginTop:10}}>TRENDING ITEMS</CText>
            <CButton onPress={()=>this.props.navigation.navigate('Search')}>
            <View style={{marginTop:10,marginRight:10}}>
              <Image source={require('../images/Search.png')} style={{height:18,width:16}}/>
            </View>
            </CButton>
         </View> 
      
      <View style={{flex:1}}>               
      <ScrollView>
         
      <View style={{flex:1,backgroundColor:'#fff',flexDirection:'row',flexWrap:'wrap'}}>
                                          
        <FlatList  numColumns={2}
              data={this.state.Tendprods}
              keyExtractor={(item,index) => index}  
              //renderItem={this.itemRender}
              renderItem={({item}) =>this.renderTrendItems(item) }
              extraData={this.state.Tendprods}
              />
             </View>
           

       </ScrollView>  
         </View>
      </View> 
			);
	}
} 
