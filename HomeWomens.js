import React, { Component } from 'react';
import {
  Text, View, FlatList, Animated, Modal, AsyncStorage,
  SectionList, TextInput, ScrollView, Button, Image, StyleSheet, SearchBar, Dimensions, TouchableOpacity
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import { CText, CInput, CButton, CSpinner,CModal } from '../common/index';
import styles from '../common/styles';
import axios from 'axios';
import index from 'axios';
import Utils from '../common/Utils';
import Config from '../config/Config';

class HomeWomens extends React.Component {
  state = {
    spinnerBool: false,Cvisible:false,alertContent:'',data: [],sellersData: [],Producttoaldetails: [],token: '',filterBool: false, ModalVisibleStatus: false,
    shopnearModalVisibleStatus:false,ModalSortVisibleStatus:false,subCategoryArray: Utils.commonData('SubCategory'),
    img: require('../images/Filter_ellipse.png'),
    img1: require('../images/Filter_ellipse.png'),
    imguncheck: require('../images/funcheck.png'),
    imgcheck: require('../images/fcheck.png'),MTopCatagori: [],sellerList: [],SellerCat: [],FTopCatagori: [],categorydata: [],
    LocationData: [],Loclist: [],disList:[],dispaly:'flex',wcount: 0,count: 0,selectITem: 'category',value: null,
    LoginData: [],
    Women: ["Indian & Fusion Wear", "Western Wear", "Lingerie & Sleepwear", "Footwear", "Sports & Active Wear", "Fashion Accessories"],
    Kids: ["Boys Clothing", "Girls Clothing", "Boys Footwear", "Girls Footwear", "Kids Accessories", "Brands"],
    HomeLiving: ["Bed Linen & Furnishing", "Bath", "Kitchen & Table", "Home Decor", "Lamps and Lighting", "Brands"],
    Men: ["Topwear", "Bottomwear", "Sports & Active Wear", "Indian & Festive Wear", "Inner & Sleepwear", "Footwear", "Fashion Accessories"],
    MfiltersData: [],
    priceData: [{id:1, price:'Rs. 159 to Rs. 454', priceMin:159, priceMax:454, isChecked:false},{id:2, price:'Rs. 455 to Rs. 629', priceMin:455, priceMax:629, isChecked:false},
      {id:3, price:'Rs. 633 to Rs. 959', priceMin:633, priceMax:959, isChecked:false},{id:4, price:'Rs. 971 to Rs. 12290', priceMin:971, priceMax:12290, isChecked:false}],
    discountData: [{id:1, discount:'upto 10%', dMin:0, dMax:10, isChecked:false},{id:2, discount:'10% and above', dMin:10, dMax:100, isChecked:false},
      {id:3, discount:'20% and above', dMin:20, dMax:100, isChecked:false},{id:4, discount:'30% and above', dMin:30, dMax:100, isChecked:false},
      {id:5, discount:'40% and above', dMin:40, dMax:100, isChecked:false},{id:6, discount:'50% and above', dMin:50, dMax:100, isChecked:false}],
    priceMinVal:0, priceMaxVal: 99999999, discountMinVal:0, discountMaxVal:100
  }
  componentWillMount() {
    const self = this;
    if(self.props.navigation.state.params.SearchGo){
      Utils.dbCall(Config.routes.getProductList, 'POST', null, {
        filters:
          {
            categoryIds: [],
            color: [],
            discountMax: self.state.discountMaxVal,
            discountMin: self.state.discountMinVal,
            locations: self.state.Loclist,            
            priceMax: self.state.priceMaxVal,
            priceMin: self.state.priceMinVal,
            sellers: self.state.sellerList,
          },str:self.props.navigation.state.params.SearchGo
      }
        , function (resp) {
          // console.log("<<=----Search Go Button-----=>>",resp);
          if (resp.status) {
            console.log(resp,'resp of the data');
            var productcoll = [];
            for (let index = 0; index < resp.details.length; index++) {
              const element = resp.details[index];
              element.wishlist = false;
              productcoll.push(element);
            }
            self.setState({ MfiltersData: productcoll,spinnerBool:false })
            // console.log("nm of items", productcoll);
          } else {
            console.log('error in Men ==>', resp);
          }
        });
    }else if(self.props.navigation.state.params.catgdata){
                // console.warn(self.props.navigation.state.params.catgdata);
    self.setState({catgdataes:self.props.navigation.state.params.catgdata,display:'none'},()=>{self.getNavCategry(self.state.catgdataes[0],self.state.catgdataes[1])}) 
    }else if(self.props.navigation.state.params.SearchId){
      this.callproducts();
    }else{
    switch (self.props.navigation.state.params.data) {
      case 'Men':
        this.getNavCategry(self.props.navigation.state.params.data, this.state.Men[0])
        break;
      case 'Women':
        this.getNavCategry(self.props.navigation.state.params.data, this.state.Women[0])
        break;
      case 'Home & Living':
        this.getNavCategry(self.props.navigation.state.params.data, this.state.HomeLiving[0])
        break;
      case 'Kids':
        this.getNavCategry(self.props.navigation.state.params.data, this.state.Kids[0])
        break;
      default:
        this.getNavCategry(self.props.navigation.state.params.data, this.state.Men[0])
        break;
    }
    self.setState({ categorydata: self.props.navigation.state.params.data });    
  }
    Utils.getToken('user', function (tResp, tStat) {
      // console.log(tResp, 'tResp');
      // console.log(tStat, 'tStat');
      if (tResp != '') {
        self.setState({ token: tResp.token }, () => { console.log('token in homewomen', self.state.token); });
        Utils.getWishList('withy', function (tResps, tStat) {
          if (tResps != '') {
            self.setState({ wcount: tResps }, () => { console.log('update', self.state.wcount) });
          }
        });
      }
    });
    Utils.dbCall(Config.routes.Sellers, 'POST', { token: self.state.token }, {
      number: '-1'
    }, function (resp) {
      // console.log(resp);
      if (resp.status) {
        var tempSeller = [];
        for (let index = 0; index < resp.details.length; index++) {
          const element = resp.details[index];
          element.isChecked = false;
          tempSeller.push(element);
          self.setState({ sellersData: tempSeller },()=>{});
        }
        //console.log('Dinesh Kumargfskjska ',self.state.sellersData);

      } else {
        self.setState({Cvisible:true,alertContent:'please try again'});
      }
    });
    Utils.dbCall(Config.routes.getLocationsForFilter, 'POST', null, {
      city: 'Hyderabad', number: '-1'
    }, function (resp) {
      // console.log(resp);
      if (resp.status) {
        //console.log('Locations',resp.locations.length);
        var tempLocation = [];
        for (let index = 0; index < resp.locations.length; index++) {
          const element = resp.locations[index];
          element.isChecked = false;
          tempLocation.push(element);
          self.setState({ LocationData: tempLocation });
        }
        //console.log('Dinesh Kumar Location ',self.state.LocationData);
      } else {
        self.setState({Cvisible:true,alertContent:'please try again'});
      }
    });
  }

  spinnerLoad() {
    // console.log('spinner');
    if (this.state.spinnerBool)
      return <CSpinner />;
    return false;
  }
  retuendata(categorydata, item) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => this.getNavCategry(categorydata, item)}>
          <CText cStyle={{ margin: 15,marginLeft:10,fontFamily:'NeueKabel-Light',fontWeight:'bold',fontSize:15,color:'#2b2b2b' }} >{item}</CText>
        </TouchableOpacity>
      </View>
    )
  }
  wears(categorydata) {
    if (categorydata === 'Men') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <FlatList horizontal={true}
            data={this.state.Men}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.retuendata(categorydata, item)}
          //extraData={this.state} 
          
          />
        </View>
      );
    }
    else if (categorydata === 'Women') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <FlatList horizontal={true}
            data={this.state.Women}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.retuendata(categorydata, item)}
          //extraData={this.state} 
          />
        </View>);
    }
    else if (categorydata === 'Home & Living') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <FlatList horizontal={true}
            data={this.state.HomeLiving}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.retuendata(categorydata, item)}
          //extraData={this.state} 
          />
        </View>);
    }
    else if (categorydata === 'Kids') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <FlatList horizontal={true}
            data={this.state.Kids}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.retuendata(categorydata, item)}
          //extraData={this.state} 
          />
        </View>
      );
    } else {
      return false;
    }
  }
  getNavCategry(category, product) {
    if(category){
    // console.log("--==--==--==--==--",category,product);
    const self = this;
    self.setState({ spinnerBool: true });
    Utils.dbCall(Config.routes.getNavProductsWithCategories, 'POST', null, {
      categories: [category, product]
    }, function (resp) {
      if (resp.status) {
        // console.log(resp);
        self.setState({ MTopCatagori: resp.ids });
        // console.log('<<<<<<<<<<<<<+++',self.state.MTopCatagori)
        self.setState({ data: resp.categoriesDropDown[0].content })
        
        self.setState({spinnerBool:true})
         self.callproducts() 
        
      } else {
        console.log('error in Men ==>', resp);
      }
    });
  }
  }

  show = (select) => {
    //console.log(select);
    let arr = [];
    var tempdata = this.state.data;
    // console.log('data', tempdata);
    for (let index = 0; index < tempdata.length; index++) {
      const element = tempdata[index];
      if (element._id === select) {
        if (element.isChecked) {
          // console.log(element);
          element.isChecked = false;
          var catgryarr = this.state.MTopCatagori;
          catgryarr = catgryarr.filter(function (item) {
            return item !== element._id
          });
          this.setState({ MTopCatagori: catgryarr }, () => { console.log('fresh', this.state.MTopCatagori) });
        } else {
          element.isChecked = true;
          this.state.MTopCatagori.push(element._id);
        }
        tempdata[index] = element;
        this.setState({ data: tempdata });
      }
    }
    // console.log('seleccted data', this.state.MTopCatagori)
  }

  SellerShow = (select) => {
    let arr = [];
    var tempSellersData = this.state.sellersData;
    for (let index = 0; index < tempSellersData.length; index++) {
      const element = tempSellersData[index];
      if (element._id === select) {
        if (element.isChecked) {
          element.isChecked = false;
          var catgryarr = this.state.sellerList;
          catgryarr = catgryarr.filter(function (item) {
            return item !== element._id
          });
          this.setState({ sellerList: catgryarr }, () => { console.log('fresh', this.state.sellerList) });
        } else {
          element.isChecked = true;
          this.state.sellerList.push(element._id);
        }
        tempSellersData[index] = element;
        this.setState({ sellersData: tempSellersData });
      }
    }
    // console.log('seleccted data', this.state.sellerList)
  }
  LocationShow = (select) => {
    let arr = [];
    var tempLocData = this.state.LocationData;
    for (let index = 0; index < tempLocData.length; index++) {
      const element = tempLocData[index];
      if (element.location === select) {
        if (element.isChecked) {
          element.isChecked = false;
          var catgryarr = this.state.Loclist;
          catgryarr = catgryarr.filter(function (item) {
            return item !== element.location
          });
          this.setState({ Loclist: catgryarr }, () => { console.log('fresh', this.state.Loclist) });
        } else {
          // console.log('murthy', element.isChecked);
          element.isChecked = true;
          this.state.Loclist.push(element.location, element.isChecked);
        }
        tempLocData[index] = element;
        this.setState({ LocationData: tempLocData });
      }
    }
    // console.log('seleccted data', this.state.Loclist)
  }
  changePriceStatus(id, minValue, maxValue){
    let tempPriceData = this.state.priceData;
    let content = [];
    for(let i = 0; i < tempPriceData.length; i++){
      if(tempPriceData[i].id === id){
        // console.log('changeprice is true',tempPriceData[i])
        tempPriceData[i].isChecked = true;
      } else {
        // console.log('changeprice is false',tempPriceData[i])        
        tempPriceData[i].isChecked = false;
      }
      content.push(tempPriceData[i]);
    }
    this.setState({ priceData: content, 
                    priceMaxVal:maxValue,
                    priceMinVal:minValue,},()=>{console.log(this.state.priceData)});
  }

  changeDiscountStatus(id, minD, maxD){
    let tempDiscountData = this.state.discountData;
    let content = [];
    for(let i = 0; i < tempDiscountData.length; i++){
      if(tempDiscountData[i].id === id){
        // console.log('changediscount is true',tempDiscountData[i])        
        tempDiscountData[i].isChecked = true;
      } else {
        tempDiscountData[i].isChecked = false;
        // console.log('changediscount is false',tempDiscountData[i])
      }
      content.push(tempDiscountData[i]);
    }
    this.setState({ priceData: content,
                    discountMaxVal:maxD,
                    discountMinVal:minD
                    },()=>{console.log(this.state.discountData)});
  }
  // discountShow= (select) => {
  //   let arr = [];
  //   var tempLocData = this.state.discountData;
  //   for (let index = 0; index < tempLocData.length; index++) {
  //     const element = tempLocData[index];
  //     if (element.location === select) {
  //       if (element.isChecked) {
  //         element.isChecked = false;
  //         var catgryarr = this.state.Loclist;
  //         catgryarr = catgryarr.filter(function (item) {
  //           return item !== element.location
  //         });
  //         this.setState({ Loclist: catgryarr }, () => { console.log('fresh', this.state.Loclist) });
  //       } else {
  //         console.log('murthy', element.isChecked);
  //         element.isChecked = true;
  //         this.state.Loclist.push(element.location, element.isChecked);
  //       }
  //       tempLocData[index] = element;
  //       this.setState({ discountData: tempLocData });
  //     }
  //   }
  //   console.log('seleccted data', this.state.Loclist)
  // }

  clearall() {
    var tempdata = this.state.data;
    for (let index = 0; index < tempdata.length; index++) {
      const element = tempdata[index];
      if (element.isChecked) {
        element.isChecked = false;
        this.state.MTopCatagori.pop(element._id);
      } else {

      }
    }
    this.setState({ data: tempdata });
    this.setState({ data: tempdata });
    var tempSellerListData = this.state.sellersData;
    for (let i = 0; i < tempSellerListData.length; i++) {
      const element = tempSellerListData[i];
      if (element.isChecked) {
        element.isChecked = false;
        this.state.sellerList.pop(element._id);
      }
    }
    this.setState({ sellersData: tempSellerListData })
    var tempLocsListData = this.state.LocationData;
    for (let j = 0; j < tempLocsListData.length; j++) {
      const element = tempLocsListData[j];
      if (element.isChecked) {
        element.isChecked = false;
        this.state.Loclist.pop(element.location);
      }
    }
    this.setState({ LocationData: tempLocsListData })

    var tempDiscListData = this.state.discountData;
    for (let k = 0; k < tempDiscListData.length; k++) {
      const element = tempDiscListData[k];
      if (element.isChecked) {
        element.isChecked = false;
        this.state.Loclist.pop(element.discount);
      }
    }
    this.setState({discountData:tempDiscListData});

    var temppriccListData = this.state.priceData;
    for (let k = 0; k < temppriccListData.length; k++) {
      const element = temppriccListData[k];
      if (element.isChecked) {
        element.isChecked = false;
        this.state.Loclist.pop(element.price);
      }
    }
  }

  applyfunction() {
    // console.log(this.state.MTopCatagori);
    // console.log('sellerList', this.state.sellerList,'min&max',this.state.priceMinVal,this.state.priceMaxVal);
    // console.log('mindiscount & maxdiscount',this.state.discountMaxVal,this.state.discountMinVal);
    { this.callproducts() }
    this.ShowModalFunction(!this.state.ModalVisibleStatus);
  }
  shopnearapply(){
    { this.callproducts() }    
    this.ShowshopnearModalFunction(!this.state.shopnearModalVisibleStatus)
  }
  oopsimage(){
      if(this.state.MfiltersData.length > 0){
          return(
            <View style={{ backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap',flex:1 }}>
            <FlatList numColumns={2}
                data={this.state.MfiltersData}
                keyExtractor={(item, index) => index}
                //renderItem={this.itemRender}
                renderItem={({ item }) => this.productfullinfo(item)}
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
  callproducts() {
    // console.log('saaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddddddd')
    const self = this;
    if(self.props.navigation.state.params.SearchId){
    Utils.dbCall(Config.routes.getNavProducts, 'POST', {token:self.state.token}, {
      filters:
        {
          categoryIds: self.props.navigation.state.params.SearchId,
          discountMin: self.state.discountMinVal,
          discountMax: self.state.discountMaxVal,
          priceMin: self.state.priceMinVal,
          priceMax: self.state.priceMaxVal,
          sellers: self.state.sellerList,
          locations: self.state.Loclist,
          color: []
        }
    }
      , function (resp) {
        if (resp.status) {

          // console.log(resp);
          var productcoll = [];
          for (let index = 0; index < resp.details.length; index++) {
            const element = resp.details[index];
            element.wishlist = false;
            productcoll.push(element);
          }
          self.setState({ MfiltersData: productcoll,spinnerBool:false })
          // console.log("nm of items", productcoll);
        } else {
          console.log('error in Men ==>', resp);
        }
      });
    }else{
      console.log(self.state.token,'self.state.token')
    Utils.dbCall(Config.routes.getNavProducts, 'POST', {token:self.state.token}, {
      filters:
        {
          categoryIds: self.state.MTopCatagori,
          discountMin: self.state.discountMinVal,
          discountMax: self.state.discountMaxVal,
          priceMin: self.state.priceMinVal,
          priceMax: self.state.priceMaxVal,
          sellers: self.state.sellerList,
          locations: self.state.Loclist,
          color: []
        }
    }
      , function (resp) {
        if (resp.status) {

          // console.log(resp);
          var productcoll = [];
          for (let index = 0; index < resp.details.length; index++) {
            console.log(resp,'resp');
               
            const element = resp.details[index];
            element.wishlist = false;
            productcoll.push(element);
          }
          self.setState({ MfiltersData: productcoll,spinnerBool:false })
          // console.log("nm of items", productcoll);
        } else {
          console.log('error in Men ==>', resp);
        }
      });
    }
  }

  getcartItemCiunt() {

    return this.state.wcount;
  }
  AddToWishList(wishlistItem) {

    if (this.state.token === '') {
      // alert('Please Login ');
      return this.props.navigation.navigate('Login');
    }
    for (let i = 0; i < this.state.MfiltersData.length; i++) {
      const element = this.state.MfiltersData[i];
      if (wishlistItem === element._id) {
        if (element.wishlist) {
          element.wishlist = false;
          this.addproductToWishList(wishlistItem, false);
        } else {
          element.wishlist = true;
          this.addproductToWishList(wishlistItem, true);
        }
        this.state.MfiltersData[i] = element;
      }
    }

  }

  addproductToWishList(id, boolean) {
    var dump = [];
    for (let i = 0; i < this.state.MfiltersData.length; i++) {
      const element = this.state.MfiltersData[i];
      dump.push(element);
      this.setState({ MfiltersData: dump });
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
    //console.log('id,token',id,self.state.token);
    Utils.dbCall(Config.routes.addProductToWishList, 'POST', { token: self.state.token },
      { id: id }
      , function (resp) {
        // console.log('addproductToWishList ==>', resp);
        if (resp.status) {
          if (resp.message == 'Successfully added to wishlist') {
            Utils.getWishList('withy', function (tResp, tStat) {
              if (tResp != '') {
                // console.log('wcount', self.state.wcount);
                var count = tResp;
                count = count + 1;
                self.setState({ wcount: count });
                Utils.setWishList('withy', self.state.wcount, function (tResp, tStat) {
                  if (tStat) {
                    // console.log(tResp);
                  }
                });
              }
              // console.log('wishlist', self.state.wcount);
            });

          }
          if (resp.message == 'Successfully removed from wishlist') {
            Utils.getWishList('withy', function (tResp, tStat) {
              if (tResp != '') {
                self.setState({ wcount: tResp });
                // console.log('wcount', self.state.wcount);
              }
            });
            if (self.state.wcount == 0) {
              // console.log("Dineshhhh great  ");
              self.setState({ wcount: 0 });
              Utils.setWishList('withy', self.state.wcount, function (tResp, tStat) {
                if (tStat) {
                  // console.log(tResp);

                }
              });
            } else {
              // console.log("Dineshhhh tou tou ");
              Utils.getWishList('withy', function (tResp, tStat) {
                if (tResp != '') {
                  self.setState({ wcount: tResp });
                  self.setState({ wcount: self.state.wcount - 1 });
                  Utils.setWishList('withy', self.state.wcount, function (tResp, tStat) {
                    if (tStat) {
                      console.log('after dec', tResp);
                    }
                  });
                  // console.log('wcount', self.state.wcount);
                }
              });
            }
          }
        }
      });
  }

  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  ShowshopnearModalFunction(visible) {
    this.setState({ shopnearModalVisibleStatus: visible});
  }
  productfullinfo(item) {
      console.log('dkjslkslakdslakdslakkska=======', item)
    if (item.wishlist) {
      let himageUrl=Config.routes.base + Config.routes.getProductPicUser + item.images[0];
            var response = Image.prefetch(himageUrl,()=>console.log('Image is being fetched'))
      //console.log('ifcond',item.categoryIds);
      return (
        <View>
          <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,borderColor:'#bababa',borderWidth:0.4}]} onPress={() => this.props.navigation.navigate('ProductView', { 'totalpodt': item._id, 'categaryid': item.categoryIds, 'prodsize': item.types })}>
            <Image source={{ uri: himageUrl}}
              style={{width:(Dimensions.get('window').width)/2-15, height:218, resizeMode:'cover'}} />
            <View style={styles.LikeDiscountMain}>
              <View style={styles.LikeDiscount}>
                <CText cStyle={{ color: '#FFF', paddingLeft: 3, fontFamily: 'NeueKabel-Light' }}>{item.discount}%off</CText>
              </View>
            </View>
            <View style={{ marginLeft: 5 }}>
              <CText cStyle={styles.LikeMainProductName}>{item.name.substr(0, 18)}...</CText>
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
              <Image resizeMode='contain' source={this.state.imgcheck} style={{height:28,width:28}} />
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      const self=this;
      let himageUrl=Config.routes.base + Config.routes.getProductPicUser + item.images[0];
      var response = Image.prefetch(himageUrl,()=>console.log('Image is being fetched'))
      return (
        <View>
          <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,borderColor:'#bababa',borderWidth:0.4}]} onPress={() => this.props.navigation.navigate('ProductView', { 'totalpodt': item._id, 'categaryid': item.categoryIds, 'prodsize': item.types })}>
            <Image 
            key={himageUrl}
            resizeMode='contain' source={{ uri:himageUrl,cache:'force-cache' }}
              style={{width:(Dimensions.get('window').width)/2-15, height:218, resizeMode:'cover'}}/>
            <View style={styles.LikeDiscountMain}>
              <View style={styles.LikeDiscount}>
                <CText cStyle={{ color: '#FFF', paddingLeft: 3, fontFamily: 'NeueKabel-Light' }}>{item.discount}%off</CText>
              </View>

            </View>
            <View style={{ marginLeft: 5 }}>
              <CText cStyle={styles.LikeMainProductName}>{item.name.substr(0, 18)}...</CText>
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
              <Image resizeMode='contain' source={this.state.imguncheck} style={{height:28,width:28}} />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    this.setState({ Producttoaldetails: item })
    

  }

  productdetails(item) {
    //console.log(item);
    if (item.isChecked) {
      //console.log('ifcond',item.isChecked);
      return (
        <View>
          <CButton onPress={() => { this.show(item._id) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10,fontFamily:'NeueKabel-Light',color:'#141414' }}>{item.categoryName.substr(0, 25)}</CText>
              <Image resizeMode='contain' source={require('../images/selected_data.png')} style={{ height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    } else {
      return (
        <View>
          <CButton onPress={() => { this.show(item._id) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10 ,fontFamily:'NeueKabel-Light',color:'#141414'}}>{item.categoryName.substr(0, 25)}</CText>
              <Image resizeMode='contain' source={require('../images/Filter_ellipse.png')} style={{ height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    }
  }

  sellerdetails(item) {
    //console.log(item.isChecked);
    if (item.isChecked) {
      //console.log('ifcond',item.isChecked);
      return (
        <View>
          <CButton onPress={() => { this.SellerShow(item._id) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10,fontFamily:'NeueKabel-Light',color:'#141414' }}>{item.shopName}</CText>
              <Image resizeMode='contain' source={require('../images/selected_data.png')} style={{ height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    } else {
      return (
        <View>
          <CButton onPress={() => { this.SellerShow(item._id) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10,fontFamily:'NeueKabel-Light',color:'#141414' }}>{item.shopName}</CText>
              <Image resizeMode='contain' source={require('../images/Filter_ellipse.png')} style={{height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    }
  }
  Locationdetails(item) {
    // console.log(item.isChecked);
    if (item.isChecked) {
      //console.log('ifcond',item.isChecked);
      return (
        <View>
          <CButton onPress={() => { this.LocationShow(item.location) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10,fontFamily:'NeueKabel-Light',color:'#141414' }}>{item.location}</CText>
              <Image resizeMode='contain' source={require('../images/selected_data.png')} style={{height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    } else {
      return (
        <View>
          <CButton onPress={() => { this.LocationShow(item.location) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10,fontFamily:'NeueKabel-Light',color:'#141414' }}>{item.location}</CText>
              <Image resizeMode='contain' source={require('../images/Filter_ellipse.png')} style={{ height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    }
  }
  gotoLikePage(itemdetails) {
    const self = this;
    if (this.state.token == '') {
      // console.log('going to like page')
      self.props.navigation.navigate('Login');
    }
    else {
      // console.log('going to like page')
      self.props.navigation.navigate('Likepage', { token: self.state.token, item: itemdetails });

    }
  }
  shopnearLoca(){
    //console.warn(this.state.LocationData)
        return (<View style={{ justifyContent: 'space-between', flex: 1 }} >
          <FlatList
            data={this.state.LocationData}
            keyExtractor={(item, location) => location}
            renderItem={({ item }) => this.Locationdetails(item)}
            extraData={this.state} />

        </View>);
 
  }
  Notic() {
    //console.warn(this.state.selectITem);
    switch (this.state.selectITem) {
      case 'category':
        return (<View style={{ justifyContent: 'space-between', flex: 1 }} >

          <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.productdetails(item)}
            extraData={this.state} />

        </View>);

        break;
      case 'sellers':
        return (<View style={{ justifyContent: 'space-between', flex: 1 }} >
          <FlatList
            data={this.state.sellersData}
            keyExtractor={(item, shopName) => shopName}
            renderItem={({ item }) => this.sellerdetails(item)}
            extraData={this.state} />

        </View>);
        break;
      case 'Prices':
        return (<View style={{  justifyContent: 'space-between', flex: 1 }} >
          <FlatList
            data={this.state.priceData}
            keyExtractor={(item, price) => price}
            renderItem={({ item }) => this.priceFilterDetails(item)}
            extraData={this.state} />
        </View>);
        break;
      case 'Discount':
        return (<View style={{  justifyContent: 'space-between', flex: 1 }} >
          <FlatList
            data={this.state.discountData}
            keyExtractor={(item, discount) => discount}
            renderItem={({ item }) => this.discountFilterDetails(item)}
            extraData={this.state} />
        </View>);
        break;
      default:
        return null;
        break;
    }
  }

  priceFilterDetails(item) {
    // console.log(item.isChecked);
    if (item.isChecked) {
      return (
        <View>
          <CButton onPress={() => { this.changePriceStatus(item.id, item.priceMin, item.priceMax) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10,fontFamily:'NeueKabel-Light',color:'#141414' }}>{item.price}</CText>
              <Image resizeMode='contain' source={require('../images/selected_data.png')} style={{height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    } else {
      return (
        <View>
          <CButton onPress={() => { this.changePriceStatus(item.id,item.priceMin, item.priceMax) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10 ,fontFamily:'NeueKabel-Light',color:'#141414'}}>{item.price}</CText>
              <Image resizeMode='contain' source={require('../images/Filter_ellipse.png')} style={{height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    }
  }
  discountFilterDetails(item) {
    // console.log(item.isChecked);
    if (item.isChecked) {
      return (
        <View>
          <CButton onPress={() => { this.changeDiscountStatus(item.id,item.dMin, item.dMax) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10,fontFamily:'NeueKabel-Light',color:'#141414' }}>{item.discount}</CText>
              <Image resizeMode='contain' source={require('../images/selected_data.png')} style={{height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    } else {
      return (
        <View>
          <CButton onPress={() => { this.changeDiscountStatus(item.id,item.dMin, item.dMax) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ margin: 5, marginLeft: 10 ,fontFamily:'NeueKabel-Light',color:'#141414'}}>{item.discount}</CText>
              <Image resizeMode='contain' source={require('../images/Filter_ellipse.png')} style={{height:14,width:14,marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    }
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

  getCache() {
    try {
      //console.log('login-riyaz',key);
      var value = AsyncStorage.getItem('fashionpecks:wishList');
      //console.log('credientails',key);
      if (value !== null) {
        var egObj = {};
        egObj = JSON.parse(value);
        this.setState({ count: egObj.count });
      } else {
        console.log('value', value.json())
      }

      return value.json();
    }
    catch (e) {
      // console.log('riyaz');
      console.log('caught error', e);
      // Handle exceptions
    }

  }
  ShowModalSortFunction(visible) {
    this.setState({ModalSortVisibleStatus: visible});
  }
  SortLowtohigh(value){
    if(value==='LH'){
      this.setState({ 
         price:Utils.sortByKeyLowtohigh(this.state.MfiltersData, 'price')
     });
     this.ShowModalSortFunction(!this.state.ModalSortVisibleStatus);
    }
  }
  SortFunctionality(value){
   if(value==='p'){
    this.setState({ 
      Popularity: Utils.sortByKey(this.state.MfiltersData, 'viewed')});
    this.ShowModalSortFunction(!this.state.ModalSortVisibleStatus);
  }else if(value==='D'){
    this.setState({ 
      Discount:Utils.sortByKey(this.state.MfiltersData, 'discount')
   });
   this.ShowModalSortFunction(!this.state.ModalSortVisibleStatus);
  }else if(value==='HL'){
    this.setState({ 
       price:Utils.sortByKey(this.state.MfiltersData, 'discountedPrice')
   });
   this.ShowModalSortFunction(!this.state.ModalSortVisibleStatus);
  }else{
    return false;
  } 
  }
  render() {
    // let a="<<";
    return (
      <View style={{ flex: 1,backgroundColor:'#fff' }}>
      {this.spinnerLoad()}
        <View style={styles.HomeWomesHeader}>
          <View style={{ justifyContent: 'flex-start' }}>
            <CButton onPress={() => this.props.navigation.navigate('Home')}>
              <Image resizeMode='contain' source={require('../images/back.png')} style={{height:17,width:11,margin: 15 }} />
            </CButton>
          </View>
          <CText cStyle={{ color: '#fff', alignSelf: 'center', fontSize: 15, fontFamily: 'NeueKabel-Regular' }}>{this.state.categorydata}</CText>
          <View style={{ flexDirection: 'row',marginRight:8 }}>
            <CButton onPress={()=>this.props.navigation.navigate('Search')} >
              <Image resizeMode='contain' source={require('../images/Search.png')} style={{ height:18,width:16,margin: 15,right:0}} />
            </CButton>
            <CButton onPress={() => this.gotoLikePage()}>
              <Image resizeMode='contain' source={require('../images/Hometrending.png')} style={{ height: 18, width: 15, marginRight: 15, marginTop: 15 }} />
              <View style={styles.HomesymNotify}>
                <CText cStyle={[styles.cFFF, styles.aslCenter, styles.FntS8, styles.m3]}>{this.getcartItemCiunt()}</CText>
              </View>
            </CButton>
          </View>
        </View>
        <View  style={[styles.Womensheadercontaner,{}]}>
        {/* <TouchableOpacity
        onPress={() => {this.refs._ScrollHome.scrollTo({x: 0, y: 0, animated: true})}}>  
        <Text style={{marginTop:11,color:'#000',marginHorizontal:5,fontSize:20}}>{a}</Text>
        </TouchableOpacity>       */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
          ref='_ScrollHome'>
            {this.wears(this.state.categorydata)}
            
          </ScrollView>
          {/* <TouchableOpacity onPress={() => {this.refs._ScrollHome.scrollToEnd({animated: true}) }}>  
        <Text style={{marginTop:11,color:'#000',marginHorizontal:5,fontSize:20}}> >> </Text>
        </TouchableOpacity> */}
        </View>
        <View style={styles.HomeWomensContaner}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity activeOpacity={0.3} style={styles.HomeWomensfilterWrap} onPress={() => { this.ShowModalSortFunction(true) }}>
              <Image resizeMode='contain' source={require('../images/Sort.png')} style={{ height: 14, width: 18 }} />
              <CText cStyle={styles.HomeWomensfilterText}>SORT </CText>
              <Modal
                    transparent={true}
                    animationType={'slide'}
                    visible={this.state.ModalSortVisibleStatus}
                    onRequestClose={ () => { this.ShowModalSortFunction(this.state.ModalSortVisibleStatus)} }>
                              <View style={{flex:1,backgroundColor:'rgba(20,20,20,0.5)',justifyContent:'center'}}>   
                                <View style={styles.FilterMain}> 
                                 <View style={[styles.row,styles.jspacebn,{borderBottomWidth:0.4,borderColor:'#e5e5e5'}]}> 
                                  <View style={[styles.jStart]}>
                                    <CText cStyle={{ marginVertical: 15,marginLeft:25,fontFamily:'NeueKabel-Light',color:'#a9a9a9'}}>SORT BY</CText>                        
                                   </View>
                                    <View style={{alignItems:'flex-end',}}>
                                      <CButton onPress={() => { this.ShowModalSortFunction(!this.state.ModalSortVisibleStatus)} } >
                                        <Image resizeMode='contain' source={require('../images/Sort_close.png')} style={{height:12,width:12,marginRight:20,marginTop:20}}/>        
                                      </CButton>
                                    </View> 
                                 </View> 
                                 <View style={{marginLeft:35}}>
                                 <TouchableOpacity onPress={()=>this.SortFunctionality('p')}>
                                 <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#141414',fontSize:12,margin:10}}>Popularity</CText>
                                 </TouchableOpacity>
                                 <TouchableOpacity onPress={()=>this.SortFunctionality('D')} >
                                 <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#141414',fontSize:12,margin:10}}>Discount</CText>
                                 </TouchableOpacity>
                                 <TouchableOpacity onPress={()=>this.SortFunctionality('HL')} >
                                 <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#141414',fontSize:12,margin:10}}>High to Low</CText>
                                 </TouchableOpacity>
                                 <TouchableOpacity onPress={()=>this.SortLowtohigh('LH')} >
                                 <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#141414',fontSize:12,margin:10}}>Low to High</CText>
                                 </TouchableOpacity>
                                 </View>
                                      </View>                       
                                </View>
                  </Modal>

            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.HomeWomensfilterWrap} onPress={() => { this.ShowModalFunction(true) }}>
              <Image resizeMode='contain' source={require('../images/Filter.png')} style={{ height: 17, width: 16 }} />
              <CText cStyle={styles.HomeWomensfilterText}>FILTER</CText>
              <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.ModalVisibleStatus}
                onRequestClose={() => { this.ShowModalFunction(this.state.ModalVisibleStatus) }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(20,20,20,0.5)', justifyContent: 'center' }}>
                  <View style={styles.FilterMain}>
                    <View style={[styles.row, styles.jspacebn]}>
                    <View style={styles.jStart}>
                      <CText cStyle={{ marginVertical: 15,marginLeft:35,fontFamily:'NeueKabel-Light',color:'#a9a9a9'}}>FILTER BY</CText>                        
                    </View>
                      <View style={{  alignItems: 'flex-end', }}>
                        <CButton onPress={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }} >
                          <Image resizeMode='contain' source={require('../images/Sort_close.png')} style={{height:12,width:12,marginRight: 20, marginTop: 20 }} />
                        </CButton>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row',borderColor:'#e5e5e5', borderTopWidth: 0.4, borderBottomWidth: 0.4 }}>
                      <View style={{ marginLeft: 10 }}>
                        <CButton onPress={() => this.setState({ selectITem: 'category' })} >
                          <CText key='category' cStyle={{ margin: 5, marginRight: 20,fontFamily:'NeueKabel-Light',color:'#141414', }}>Category</CText>
                        </CButton>
                        <CButton onPress={() => this.setState({ selectITem: 'Prices' })}>
                          <CText key='price' cStyle={{ margin: 5,fontFamily:'NeueKabel-Light',color:'#141414', marginRight: 20 }}>Price</CText>
                        </CButton>
                        <CButton onPress={() => this.setState({ selectITem: 'sellers' })}>
                          <CText key='sellers' cStyle={{ margin: 5,fontFamily:'NeueKabel-Light',color:'#141414', marginRight: 20 }}>Sellers</CText>
                        </CButton>
                        <CButton onPress={() => this.setState({ selectITem: 'Discount' })}>
                          <CText key='Discount' cStyle={{ margin: 5,fontFamily:'NeueKabel-Light',color:'#141414', marginRight: 20 }}>Discount</CText>
                        </CButton>
                        {/* <CButton onPress={() => this.setState({ selectITem: 'Locations' })}>
                          <CText key='Locations' cStyle={{ margin: 5,fontFamily:'NeueKabel-Light',color:'#141414', marginRight: 20 }}>Locations</CText>
                        </CButton> */}
                        <CButton>
                          <CText key='color' cStyle={{ margin: 5,fontFamily:'NeueKabel-Light',color:'#141414', marginRight: 20 }}>Color</CText>
                        </CButton>
                      </View>
                      <View style={{ borderLeftWidth: 0.4,borderColor:'#e5e5e5', justifyContent: 'space-between', flex: 1 }} >
                        {this.Notic()}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                      <CButton onPress={() => { this.clearall() }}>
                        <CText cStyle={{ alignSelf: 'center', marginLeft: 35, marginVertical: 15 ,fontFamily:'NeueKabel-Light',color:'#656565'}}>CLEAR ALL</CText>
                      </CButton>
                      <CButton onPress={() => this.applyfunction()}>
                        <CText cStyle={{ alignSelf: 'center', marginRight: 65, marginVertical: 15,fontFamily:'NeueKabel-Light',color:'#656565' }}>APPLY</CText>
                      </CButton>
                    </View>

                  </View>
                 </View>
              </Modal>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity style={styles.HomeWomensfilterWrap}  onPress={() => { this.ShowshopnearModalFunction(true)  }}>
              <Image resizeMode='contain' source={require('../images/Navigation_large.png')} style={{ height: 18, width: 16 }} />
              <CText cStyle={[styles.HomeWomensfilterText]}>NEAR ME</CText>
              <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.shopnearModalVisibleStatus}
                onRequestClose={() => { this.ShowshopnearModalFunction(this.state.shopnearModalVisibleStatus) }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(20,20,20,0.5)', justifyContent: 'center' }}>
                  <View style={styles.FilterMain}>
                    <View style={[styles.row,styles.jspacebn]}>
                    <View style={styles.jStart}>
                      <CText cStyle={{ marginVertical: 15,marginLeft:35,fontFamily:'NeueKabel-Light',color:'#a9a9a9'}}>NEAR ME</CText>                        
                    </View>
                      <View style={{alignItems: 'flex-end', }}>
                        <CButton cStyle={styles.aitEnd} onPress={() => { this.ShowshopnearModalFunction(!this.state.shopnearModalVisibleStatus) }} >
                          <Image resizeMode='contain' source={require('../images/Sort_close.png')} style={{height:12,width:12,marginRight: 20, marginTop: 20 }} />
                        </CButton>  
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', borderTopWidth: 0.4, borderBottomWidth: 0.4,borderColor:'#e5e5e5' }}>
                    <View style={{ borderTopWidth: 0.4,borderColor:'#e5e5e5',  flex: 1,justifyContent: 'space-between', borderBottomWidth: 0.4,height:200 }}>
                        {this.shopnearLoca()}
                    </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                      <CButton onPress={() => { this.clearall() }}>
                        <CText cStyle={{ alignSelf: 'center', marginLeft: 35, marginVertical: 15,fontFamily:'NeueKabel-Light',color:'#656565' }}>CLEAR ALL</CText>
                      </CButton>
                      <CButton onPress={() => this.shopnearapply()}>
                        <CText cStyle={{ alignSelf: 'center', marginRight: 65, marginVertical: 15,fontFamily:'NeueKabel-Light',color:'#656565' }}>APPLY</CText>
                      </CButton>
                    </View>
                  </View>
                </View>
              </Modal>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView scrollEnabled={true} keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false}>
          

           {this.oopsimage()}
         
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
export default HomeWomens;