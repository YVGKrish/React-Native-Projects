import React, { Component } from 'react';
import {
  View, TextInput, Image, Text, Picker, dropdown, FlatList, LayoutAnimation, UIManager, Platform, TouchableOpacity, TabBarIOS, ScrollView
} from 'react-native';
import axios from 'axios';
import styles from '../common/styles';
import { CText, CButton, CPicker, CInput, CSpinner } from '../common/index';
import Utils from '../common/Utils';
import Config from '../config/Config';

export default class App extends Component {

  state = {
    img: require('../images/Catg_DownArrow.png'),
    talCategori: [], display: 'none', innerMenData: [], innerWomenData: [], innerKidData: [], innerHomeData: [],
    innerWomensubData: [], subinsubofflatcategory: [], flatlistView: [],searchstr:'',SearchData:[],spinnerLoad:false,
    searchBool:'none',subarry: [],transdata:[],value: [], spinnerBool: true,
    categoryimg:[require('../images/Cat_Mens.png'),
                require('../images/Catg_Womens.png'),
                require('../images/Catg_kids.png'),
                require('../images/Catg_Home&leaving.png')],
  }
  SearchResults(stra) {
    this.setState({searchstr:stra});
    if (stra.length > 1) {
        this.setState({ spinnerLoad:true ,searchBool:'flex'});
        let self = this;
        Utils.dbCall(Config.routes.searchProducts, 'POST', null, { str: stra }, function (resp) {
            self.setState({ spinnerLoad:false,searchBool:'none' });
            // console.warn(resp)
            if (resp.status) {
                self.setState({
                    SearchData: JSON.parse(JSON.stringify(resp.details)),
                    searchBool: 'flex'
                });
            } else {
                // alert('Please try again');
            }
        });
    } else {
        this.setState({ searchBool:'none' });
    }
}
SearchGo(){
    if(this.state.searchstr){
        // console.warn(this.state.searchstr)
        this.props.navigation.navigate('HomeWomens',{SearchGo:this.state.searchstr})
    }    
}
toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}
renderNavProC(item){
    let self=this;
    if(item){
        Utils.dbCall(Config.routes.getNavProductsWithCategories,'POST',null,{categories: [item.grandParent,item.parent,item.name]},function(resp){
            if(resp.status){
                self.props.navigation.navigate('HomeWomens',{/* data:item.grandParent ,*/SearchId:resp.ids})
            }else{
                // alert('No data found');
            }
        });
    }
}
renderSearch(item) {
    if (item.name) {
        return (
            <TouchableOpacity onPress={() => this.renderNavProC(item)} >
                <CText cStyle={[styles.searchText]}>{this.toTitleCase(item.name)}</CText>
            </TouchableOpacity>
        );
    } else if (item.shopName) {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: item })} >
                <CText cStyle={[styles.searchText]}>{this.toTitleCase(item.shopName)}</CText>
            </TouchableOpacity>
        );
    }
}
  componentWillMount() {
    const self = this;
    self.fetchingCategories();
    Utils.getToken('user', function (tResp, tStat) {
      // console.log("state==>", tStat);
      if (tStat) {
        self.setState({ token: tResp.token });
      } else {
        self.props.navigation.navigate('login');
      }
    });
  }

  spinnerLoad() {
    //console.log('spinner');
    if (this.state.spinnerBool)
      return <CSpinner />;
    return false;
  }

  fetchingCategories() {
    const self = this;
    Utils.dbCall(Config.routes.getAllCategories, 'GET', { token: self.state.token }, {}, (resp) => {
      if (resp.status) {
        let tempCategories = resp.Categories;
        let categoryArr = [];
        for (let i = 0; i < tempCategories.length; i++) {
          tempCategories[i].status = 'none';
          tempCategories[i].img = require('../images/Catg_DownArrow.png')
          categoryArr.push(tempCategories[i]);
          let subCategory = tempCategories[i].categoriesDropDown;
          for (let j = 0; j < subCategory.length; j++) {
            subCategory[j].subStatus = 'none';
            subCategory[j].img = require('../images/Catg_DownArrow.png')
            let subSubCategory = subCategory[j].content;
            for (let k = 0; k < subSubCategory.length; k++) {
              subSubCategory[k].subunderStatus = 'none';
              subSubCategory[k].img = require('../images/Catg_DownArrow.png')
              this.setState({ finalvalue: subSubCategory })
            }
          }
        }
        self.setState({ talCategori: categoryArr, spinnerBool:false }, () => { console.log(self.state.talCategori) });
      }
    });
  }

  renderCategories() {
    let tempStr = this.state.talCategori;
    let content = [];
    for (let i = 0; i < tempStr.length; i++) {
      content.push(<View key={i}>
      <TouchableOpacity onPress={() => this.changeCategoriesStatus(tempStr[i].categoriesDropDown, tempStr[i].categoryName)}>
        <View style={[styles.row, { margin: 15, justifyContent: 'space-between' }]}>
          <View style={styles.row}>
            <View>
              <Image resizeMode='cover' style={{ height: 40, width: 40, resizeMode: 'cover' }} source={this.state.categoryimg[i]} />
            </View>
            <View>
              <CText cStyle={[styles.mL10, { fontSize: 15, color: '#2b2b2b', fontFamily: 'NeueKabel-Regular' }]}>{tempStr[i].categoryName}</CText>
              <CText cStyle={[styles.mL10, { fontSize: 13.5, color: '#878787', fontFamily: 'NeueKabel-Light' }]}>{tempStr[i].categoriesDropDown[0].title},{tempStr[i].categoriesDropDown[1].title}... </CText>
            </View>
          </View>
          <View>
            <View style={{ alignSelf: 'flex-end',justifyContent:'center'}} >
              <Image resizeMode='contain' source={require('../images/Catg_Circle.png')} style={{height:20,width:21,alignSelf: 'flex-end',resizeMode:'contain',justifyContent:'center'}} />
              <View style={{ position: 'absolute',alignSelf:'center',marginTop:4}}>
                <Image  resizeMode='cover' source={tempStr[i].img} style={{width:10,height:5 }} />
              </View>
            </View>
          </View>
        </View>
        <View style={{ display: tempStr[i].status }}>
          <FlatList
            data={this.state.value}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.renderSubCategories(item, tempStr[i].categoryName)}
            extraData={this.state}
          />
        </View>
        </TouchableOpacity>
      </View>);
    }
    return content;
  }

  renderSubCategories(data, categoryName) {
    if (data.content.length > 0) {    
      for (let i = 0; i < data.content.length; i++) {
        return (<View key={i}>
            <View>
              <TouchableOpacity onPress={() => this.changeSubCategoriesStatus(data.content, data.title, data)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <CText cStyle={{ marginLeft: 64, fontFamily: 'NeueKabel-Regular', fontSize: 13, color: '#2b2b2b', flex: 1, margin: 5 }}>{data.title}</CText>
                  <Image source={data.content[i].img} style={{ margin: 8,marginRight:20,height:8,width:8 ,resizeMode:'contain'}} />
                </View>
              </TouchableOpacity>
              <View  style={{ display: data.content[i].subunderStatus }}>
                <FlatList
                  data={this.state.subinsubofflatcategory}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item }) => this.renderSubSubCategories(item, categoryName, data.title)}
                />
              </View>
            </View>
          </View>
        );
      }
    } else {    
      return (
        <TouchableOpacity onPress={()=>{this.senddata(categoryName,data.title)}}>
        <CText cStyle={[styles.mL10, { marginLeft: 64, fontSize: 13, color: '#2b2b2b', fontFamily: 'NeueKabel-Regular', margin: 5 }]}>{data.title}</CText>
        </TouchableOpacity>
      );
    }
  }
  senddata(name,subname,id) {
    let arr = [name,subname,id]
    // console.warn(arr);
    if (id) {
      this.props.navigation.navigate('HomeWomens',{catgdata:arr});
    }else{
      this.props.navigation.navigate('HomeWomens',{catgdata:arr});
    }
  }
  
  renderSubSubCategories(subdata, categoryName, subCategoryName){
    return(
      <CButton onPress={()=>{this.senddata(categoryName,subCategoryName,subdata._id)}}>
      <CText cStyle={[styles.mL10, {marginLeft:68,fontSize: 13, color: '#878787', fontFamily: 'NeueKabel-Light',margin:5}]}>{subdata.categoryName}</CText>
      </CButton>
    )
  }

  changeCategoriesStatus(dropDownData, selectedCategoryName){
    let tempCategories = this.state.talCategori;
    let categoryArr = [];
    for(let i = 0; i < tempCategories.length; i++){
      if(tempCategories[i].categoryName === selectedCategoryName){
          if (tempCategories[i].status === 'flex') {
            tempCategories[i].status = 'none';
            tempCategories[i].img = require('../images/Catg_DownArrow.png');
          } else {
            tempCategories[i].status = 'flex';
            tempCategories[i].img = require('../images/Catg_Uparrow.png');
          }
      } else {
        tempCategories[i].status = 'none';
        tempCategories[i].img = require('../images/Catg_DownArrow.png');        
      }
      categoryArr.push(tempCategories[i]);
    }
    this.setState({ talCategori:categoryArr, value:dropDownData });
  }

  changeSubCategoriesStatus(contentarr, subcategoryname, subname){
    // console.log("changesubcateg --- entered----",this.state.value);
    let tempSubCategories = this.state.value;
    let dropDownData = [];
    let subSubData = [];
    for(let j = 0; j < tempSubCategories.length; j++){
      let tempData = tempSubCategories[j].content;
      for(let i = 0; i < tempData.length; i++){
        if(tempSubCategories[j].title === subcategoryname){
          if (tempData[i].subunderStatus === 'flex') {
            tempData[i].subunderStatus = 'none';
            tempData[i].img = require('../images/Catg_DownArrow.png');                    
          } else {
            tempData[i].subunderStatus = 'flex';
            tempData[i].img = require('../images/Catg_Uparrow.png');            
          }   
        } else {
          tempData[i].subunderStatus = 'none';
          tempData[i].img = require('../images/Catg_DownArrow.png');                  
        }
      }
      if(tempSubCategories[j].title === subcategoryname){
        subSubData.push(tempSubCategories[j]);
      }
    }
    // console.log("changesubcateg --- exit----",this.state.value);    
    this.setState({ subinsubofflatcategory:subSubData[0].content });
  }

  render() {
    return (
       <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.spinnerLoad()}
       <View style={[styles.categoryHeader,{}]}>
              <View style={[styles.row, styles.m10,{alignSelf:'center',marginLeft:7}]}>
                <View style={[styles.bgfff, styles.bBLRad5, styles.bTLRad5,{marginRight:0}]}>
                  <Image resizeMode='cover' style={[styles.mL10, { height: 15, width: 15, resizeMode: 'contain', marginTop:12}]} source={require('../images/Search_black.png')} />
                </View>
                <TextInput underlineColorAndroid='transparent' placeholder="Search by category" 
                onChangeText={(text) =>this.SearchResults(text)}
                  style={{ alignSelf: 'center', width: '77%', backgroundColor: '#fff', height: 40, fontFamily: 'NeueKabel-Light'  }} />
                   <View style={[styles.searchGoWrap, styles.jCenter, styles.aitCenter]} >
                    <TouchableOpacity onPress={() => this.SearchGo()} >
                        <CText cStyle={{ color: 'white', fontFamily: 'NeueKabel-Regular',marginRight:5 }} >GO</CText>
                    </TouchableOpacity>
                </View>
              </View>
       </View>
       <View style={{ backgroundColor: '#fff',display:this.state.searchBool }}>
                        <FlatList
                            data={this.state.SearchData}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) => this.renderSearch(item)}
                        />
                    </View>
       {/* <View style={{backgroundColor:'#efefef',height:37,width:'100%'}}>
       <View style={[styles.aslEnd, styles.m10,styles.bgefefef]}>
         <CButton>
           <View style={[styles.row]}>
             <Image source={require('../images/Catagories__Near.png')} />
             <CText cStyle={[styles.FntS10, styles.mL10]}>NEAR ME</CText>
           </View>
         </CButton>
       </View>
       </View> */}
       <ScrollView>
       {this.renderCategories()}
       </ScrollView>
     </View>
    );
  }
}