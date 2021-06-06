import React, {Component} from 'react';
import{Text,View,TextInput,ScrollView,Dimensions,Button,Image,StyleSheet,TouchableOpacity,FlatList,Modal} from 'react-native';
import {CText, CInput, CButton,Labelmenu,CSpinner,CRadio} from '../common/index';
import styles from '../common/styles';
import Utils from '../common/Utils';
import Config from '../config/Config'

export default class Collectionsdata extends Component{
    state={
        token:'',
        SamesDB:[],wcount:0,
        spinnerBool:false,
        Producttoaldetails:[],
        type:'',
        CNAME:'',MenBool:'none', WomenBool:'none',KidBool:'none',HomeBool:'none', ftype:[],showMe:false
    }
    componentDidMount()
    {
        const self = this;
        
        Utils.getWishList('withy',function(tResp,tStat){
            if(tStat && tResp!= '')
            {
              self.setState({wcount:tResp});
              console.log('wcount',self.state.wcount);
            }
            
          });

    }
    spinnerLoad() {
        console.log('spinner');
        if (this.state.spinnerBool)
          return <CSpinner />;
        return false;
      }
    

  componentWillMount()
  {
    const self=this;
    self.setState({spinnerBool:true})
    self.setState({ type: self.props.navigation.state.params.typedata },()=>{self.formcall()});
    Utils.getToken('user',function(tResp, tStat){
        if(tStat){
            self.setState({token:tResp.token});
        }
    });
 
  }
  formcall()
  {
      const self=this;
      let type = self.state.type
Utils.dbCall(Config.routes.Getcollection,'POST',null,{
        filter:[],
        type:type
    },function(resp){
        console.log('Formal collections',resp);
        if(resp.status)
        {
          if(resp.collections.length===0)
          {
            self.setState({spinnerBool:false,CNAME:type});
            self.setState({SamesDB:resp.collections})
            return(<View>
              <Image source={require('../images/oops-icon.png')}
              style={{width:50,height:50}}/>

              </View>)
          }
          else{
            self.setState({SamesDB:resp.collections[0].productIds,CNAME:resp.collections[0].collectionType,spinnerBool:false});
            console.log('SameDB',self.state.SamesDB)
          }
        }

    });


  }
  FilterForm(ftype)
  {
      const self=this;
      let type = self.state.type
Utils.dbCall(Config.routes.Getcollection,'POST',null,{
        filter:ftype,
        type:type
    },function(resp){
        console.log('Formal collections',resp);
        if(resp.status)
        {
          if(resp.collections.length===0)
          {
            self.setState({spinnerBool:false,CNAME:type});
            self.setState({SamesDB:resp.collections})
          }
          else{
            self.setState({SamesDB:resp.collections[0].productIds,CNAME:resp.collections[0].collectionType,spinnerBool:false});
            console.log('SameDB',self.state.SamesDB)
          }
        }

    });


  }
  AddToWishList(wishlistItem){
    const self=this;
    console.log('Trending products',self.state.Tendprods)  

    if(self.state.token === ''){
      return self.props.navigation.navigate('Login');
    }
   for (let i = 0; i < self.state.SamesDB.length; i++) {
     const element = self.state.SamesDB[i];    
       if(wishlistItem === element._id)
       {
         if(element.wishlist){
           element.wishlist =false;
           self.addproductToWishList(wishlistItem,false);
         }else{
           element.wishlist =true;
           self.addproductToWishList(wishlistItem,true);
         }
         self.state.SamesDB[i] = element;
       }
   }
   
}
addproductToWishList(id,boolean){
    const self=this;
 var dump = [];
for (let i = 0; i < self.state.SamesDB.length; i++) {
  const element = self.state.SamesDB[i]; 
  dump.push(element);
  self.setState({ SamesDB: dump });
}
//console.log('id,token',id,self.state.token);
Utils.dbCall(Config.routes.addProductToWishList, 'POST', {token:self.state.token},  
  {id: id}
, function(resp){           
      console.log('addproductToWishList ==>', resp);
      if(resp.status)
      {
        if(resp.message=='Successfully added to wishlist'){
         Utils.getWishList('withy',function(tResp,tStat){
           if(tResp!= '')
           {
             console.log('wcount',self.state.wcount);
             var count = tResp;
             count = count + 1;
             self.setState({wcount:count});
             Utils.setWishList('withy',self.state.wcount,function(tResp,tStat){
               if(tStat)
               {
                 console.log(tResp);        
               }
             });
           }           
          console.log('wishlist',self.state.wcount);
         });
          
        }
        if(resp.message=='Successfully removed from wishlist'){
         Utils.getWishList('withy',function(tResp,tStat){
           if(tResp!= '')
           {
             self.setState({wcount:tResp});
             console.log('wcount',self.state.wcount);
           }
         });
         if(self.state.wcount==0){
           console.log("Dineshhhh great  ");
           self.setState({wcount:0});
           Utils.setWishList('withy',self.state.wcount,function(tResp,tStat){
             if(tStat)
             {
               // console.log(tResp);
     
             }
           });
         }else{
           console.log("Dineshhhh tou tou ");
           Utils.getWishList('withy',function(tResp,tStat){
             if(tResp!= '')
             {
               self.setState({wcount:tResp});
               self.setState({wcount:self.state.wcount-1});
               Utils.setWishList('withy',self.state.wcount,function(tResp,tStat){
                 if(tStat)
                 {                    
                   console.log('after dec',tResp);
                 }
               });
               console.log('wcount',self.state.wcount);
             }
           });
        }}
      }
 });
}
changeFilterColl(value){
  if(value === 'Men'){
      this.setState({showMe: false, MenBool:'flex', WomenBool:'none',KidBool:'none',HomeBool:'none', ftype:["Men"]},()=>{this.FilterForm(this.state.ftype);});
  } if(value==='Women') {
      this.setState({showMe: false, MenBool:'none', WomenBool:'flex',KidBool:'none',HomeBool:'none', ftype:["Women"]},()=>{this.FilterForm(this.state.ftype);});
  }
  if(value==='Kids') {
    this.setState({showMe: false, MenBool:'none', WomenBool:'none',KidBool:'flex',HomeBool:'none', ftype:["Kids"]},()=>{this.FilterForm(this.state.ftype);});
}
if(value==='Home & Living') {
  this.setState({showMe: false, MenBool:'none', WomenBool:'none',KidBool:'none',HomeBool:'flex', ftype:["Home & Living"]},()=>{this.FilterForm(this.state.ftype);});
}

}
productfullinfo(item) {
  console.log('dkjslkslakdslakdslakkska=======', item)
    if (item.wishlist) {
      let imageUrl=Config.routes.base + Config.routes.getProductPicUser +  item.images[0] ;
      var response = Image.prefetch(imageUrl,()=>console.log('Image is being fetched'))
      //console.log('ifcond',item.categoryIds);
      return (
        <View>
          <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,borderColor:'#bababa',borderWidth:0.4}]} onPress={()=>this.props.navigation.navigate('ProductView',{colldata:item._id})}>
            <Image  resizeMode='contain' source={{ uri:imageUrl }}
               style={{width:(Dimensions.get('window').width)/2-10, height:218, resizeMode:'contain'}}/>
            <View style={styles.LikeDiscountMain}>
              <View style={styles.LikeDiscount}>
                <CText cStyle={{ color: '#FFF', paddingLeft: 3, fontFamily: 'NeueKabel-Light' }}>{item.discount}%off</CText>
              </View>
            </View>
            <View style={{ marginLeft: 5 }}>
              <CText cStyle={styles.LikeMainProductName}>{item.name.substr(0, 20)}....</CText>
              <CText cStyle={[{ fontSize: 11, }, styles.FntFaNL]}>By {item.vendorId.shopName}</CText>
              <View style={{ flexDirection: 'row', }}>
                <Image  resizeMode='contain' source={require('../images/NearLoation.png')} style={styles.LikeNavigationImg} />
                <CText cStyle={{ color: '#636363', fontSize: 9.5, fontFamily: 'NeueKabel-Light' }}>{item.vendorId.location}</CText>
              </View>
              <View style={styles.LikePricesWrap}>
                <CText cStyle={styles.LikePricesText1}>₹{item.price}</CText>
                <CText cStyle={[styles.LikePricesText2,{padding:0}]}>₹{item.discountedPrice}</CText>
              </View>
            </View>
          </CButton>
          <View style={[styles.wishImageStyle]}>
            <TouchableOpacity
              onPress={() => this.AddToWishList(item._id)}
            >
              <Image  resizeMode='contain' source={require('../images/fcheck.png')} style={{height:28,width:28}}/>
            </TouchableOpacity>
          </View>

        </View>
      )
    } else {
      let imageUrl=Config.routes.base + Config.routes.getProductPicUser + item.images[0] ;
      var response = Image.prefetch(imageUrl,()=>console.log('Image is being fetched'))
      return (
        <View>
          <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,borderColor:'#bababa',borderWidth:0.4}]} onPress={()=>this.props.navigation.navigate('ProductView', {'colldata':item._id})} >
            <Image source={{ uri:imageUrl }}
               style={{width:(Dimensions.get('window').width)/2-10, height:218, resizeMode:'contain'}}/>
            <View style={styles.LikeDiscountMain}>
              <View style={styles.LikeDiscount}>
                <CText cStyle={{ color: '#FFF', paddingLeft: 3, fontFamily: 'NeueKabel-Light' }}>{item.discount}%off</CText>
              </View>

            </View>
            <View style={{ marginLeft: 5 }}>
              <CText cStyle={styles.LikeMainProductName}>{item.name.substr(0, 20)}....</CText>
              <CText cStyle={[{ fontSize: 11, }, styles.FntFaNL]}>By {item.vendorId.shopName}</CText>
              <View style={{ flexDirection: 'row', }}>
                <Image source={require('../images/NearLoation.png')} style={styles.LikeNavigationImg} />
                <CText cStyle={{ color: '#636363', fontSize: 9.5, fontFamily: 'NeueKabel-Light' }}>{item.vendorId.location}</CText>
              </View>
              <View style={styles.LikePricesWrap}>
                <CText cStyle={styles.LikePricesText1}>₹{item.price}</CText>
                <CText cStyle={[styles.LikePricesText2,{padding:0}]}>₹{item.discountedPrice}</CText>
              </View>
            </View>
          </CButton>
          <View style={[styles.wishImageStyle]}>
            <TouchableOpacity
              onPress={() => this.AddToWishList(item._id)}
            >
              <Image resizeMode='contain' source={require('../images/funcheck.png')} style={{height:28,width:28}}/>
            </TouchableOpacity>
          </View>
        </View>
      ) 
    }
    this.setState({ Producttoaldetails: item })
  }
  oopsimage(){
    if(this.state.SamesDB.length > 0){
        return(
          <View style={{backgroundColor:'#fff',flexDirection:'row',flexWrap:'wrap',flex:1}}>
                                         
        <FlatList  numColumns={2}
              data={this.state.SamesDB}
              keyExtractor={(item,index) => index}  
              //renderItem={this.itemRender}
              renderItem={({item}) =>this.productfullinfo(item) }
              />
             </View>
        );
    }else{
      return(
        <View style={{justifyContent:'center',alignItems:'center',flex:1,height:'100%'}}>
          <Image source={require('../images/oops-icon.png')} style={{resizeMode:'contain',alignSelf:'center'}}/>
          <View style={{justifyContent:'center'}}> 
            <Text style={{color:'#c01530',fontSize:20,}}>No Results Found</Text>
          </View>
        </View>
      );
    }
}
    render(){
        const {goBack} = this.props.navigation;
        return(
            <View style={{backgroundColor:'#fff',flex:1}}>
                {this.spinnerLoad()}
            <View style={styles.LikeHeader}> 
                <CButton onPress={()=>goBack()}>
                    <View style={{justifyContent:'flex-start',marginTop:13}}> 
                        <Image resizeMode='contain' source={require('../images/back.png')} style={[{height:17,width:10,marginLeft:10}]}/>
                    </View> 
                </CButton> 
                <View style={{flexDirection:'row'}}>
                    <CText cStyle={styles.LikeHeaderText}>{this.state.CNAME}</CText>
                    <CText cStyle={styles.LikeHeaderText}> Collections</CText>
                 </View>  
                 <View style={{flexDirection:'row'}}> 
                    <CButton onPress={()=>this.props.navigation.navigate('Search')}>
                        <View style={{marginTop:13,marginRight:10}}>
                        <Image resizeMode='contain' source={require('../images/Search.png')} style={{height:18,width:16}}/>
                        
                        </View>
                    </CButton>
                    <View>
                    <CButton onPress={() => { this.setState({ showMe: !this.state.showMe }) }}>
                      <Image style={{ height: 17, width: 16, margin: 10,resizeMode:'contain',marginRight:15,marginTop:13 }} source={require('../images/mediaFilter.png')} />
                    </CButton>
              <Modal visible={this.state.showMe}
                      transparent={true}
                      animationType={'slide'}
                      onRequestClose={() => Console.warn("close filter")}>
                <View style={{ flex: 1, backgroundColor: 'rgba(20,20,20,0.5)',}}>
                <View
                  style={{ backgroundColor:'#fff',margin:10,height: 180, width: (Dimensions.get('window').width) / 1.8, alignSelf: 'flex-end', marginTop: 55 }}>
                  <View style={{ borderBottomWidth: 0.4, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CText cStyle={{ fontSize: 10, margin: 15,fontFamily:'NeueKabel-Light',color:'#0e0e0e' }}>FILTER BY</CText>
                    <TouchableOpacity onPress={() => {this.setState({showMe: false})}}>
                      <CText cStyle={{ fontSize: 10, margin: 15,fontFamily:'NeueKabel-Light',color:'#0e0e0e'  }}>CLOSE</CText>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                   <View style={[ styles.mTop10]}>
                      <CRadio label='Men' activeStyle={{display:this.state.MenBool}} onPress={() => this.changeFilterColl('Men')} />
                      <CRadio label='Women' activeStyle={{display:this.state.WomenBool}} onPress={() => this.changeFilterColl('Women')} />
                      <CRadio label='Kids' activeStyle={{display:this.state.KidBool}} onPress={() => this.changeFilterColl('Kids')} />
                      <CRadio label='Home & Living' activeStyle={{display:this.state.HomeBool}} onPress={() => this.changeFilterColl('Home & Living')} />
                  </View>
                  </View>
                  </View>
                </View>
              </Modal>
              </View>
              </View>
         </View> 

              <ScrollView>
         
            {this.oopsimage()}
       </ScrollView>  
              </View>
               );
        }
    }        