import React, {Component} from 'react';
import{Text,View,TextInput,FlatList,ScrollView,Dimensions,Button,Image,StyleSheet,TouchableOpacity,Modal} from 'react-native';
import {CText, CInput, CButton,Labelmenu,CSpinner} from '../common/index';
import styles from '../common/styles';

import Utils from '../common/Utils';
import Config from '../config/Config'

export default class Seemore extends Component{
    state ={wishListItems:[],token:'',removeData:[],filename:'',toatalresp:[],Dbcalname:'',LikeCount:0,ModalVisibleStatus:false,data:[],
    selectITem: 'category' ,MTopCatagori:[],LocationData:[],Loclist:[]

}

    componentWillMount(){
      const self=this;
      Utils.dbCall(Config.routes.getMainCategories, 'GET', null,  {}, function(resp){ 
     console.log(resp, '====>')          
         if(resp.status){
             var MC=[];
             for (let index = 0; index < resp.categoriesForFilter.length; index++) {
                 const element = resp.categoriesForFilter[index];
                 element.isChecked=false
                 MC.push(element);
             }
           self.setState({ data:MC},()=>{    
               console.log("Main Categories",self.state.data);
            });
           } else {  
              console.log('error in Main Categories ==>', resp);
           }
     });
     Utils.dbCall(Config.routes.getLocationsForFilter, 'POST', null, {
        city: 'Hyderabad', number: 10
      }, function (resp) {
        console.log(resp);
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
          alert('Could not process, try again!!');
        }
      });
      
      self.setState({Dbcalname:self.props.navigation.state.params.type},()=>{self.pagesbdcall(self.state.Dbcalname)})
      self.setState({filename:self.props.navigation.state.params.name},()=>{
        console.log('Likepage',self.state.filename,self.state.Dbcalname)
      });
      Utils.getToken('user',function(tResp, tStat){
        if(tStat){
            self.setState({token:tResp.token},()=>{});
        }else{
                console.log('error in token');
        }  
    });
}
ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
pagesbdcall(typeofshop){
    const self = this;
    self.setState({spinnerBool:true})
   
    //console.log('murthy');
    Utils.dbCall(Config.routes.getAllShops, 'POST', { token: self.state.token },  {
         typeOfShop: typeofshop, 
         category: [],
         coordinates:[], 
         locations: [], 
         selectedCity: "Hyderabad", 
         nearMe: false,}
   , function(resp){ 
      console.log(resp, '====>')          
          if(resp.status){
            self.setState({ toatalresp: resp.details,spinnerBool:false },()=>{    
                console.log("nm of toatalresp",self.state.toatalresp
            );});
            } else {  
               console.log('error in shopes ==>', resp);
            }
      });
    }
renderdata(data){
  console.log('data is transfor for shoplog',data);
  let simageUrl=Config.routes.base + Config.routes.getShopBackground +'/'+ data._id;
  var response = Image.prefetch(simageUrl,()=>console.log('Image is being fetched'))
    return(
        <View style={{borderWidth:0.4,borderColor:'#bababa',width:(Dimensions.get('window').width)/2-8,marginLeft:5,marginVertical:5,justifyContent:'center'}}> 
        <CButton cStyle={[styles.Likeimgstyle2,{width:(Dimensions.get('window').width)/2-10,marginTop:0,marginLeft:0,marginRight:0}]} onPress={()=>this.props.navigation.navigate('ShopLog',{singleshop:data})}>
          <Image  source={{ uri: simageUrl}}
            style={{height:200,width:(Dimensions.get('window').width)/2-10,resizeMode:'cover'}} />
          <View style={{justifyContent:'center',margin:5}}>
            <CText cStyle={[{ fontSize: 13,color:'#1e1e1e',alignSelf:'center' }, styles.FntFaNL]}>{data.shopName.substr(0, 20)}</CText>
                <View style={{ flexDirection: 'row',alignSelf:'center' ,marginTop:5,marginBottom:5}}>
                    <Image source={require('../images/NearLoation.png')} style={[styles.LikeNavigationImg,{height:10,width:8}]} />
                    <CText cStyle={{ color: '#636363', fontSize: 12, fontFamily: 'NeueKabel-Light', }}>{data.location}</CText>
                </View>
          </View>
        </CButton>
      </View>
    );
}
spinnerLoad() {
    //console.log('spinner');
    if (this.state.spinnerBool)
      return <CSpinner />;
    return false;
} 
productdetails(item) {
    console.log(item);
    if (item.isChecked) {
      //console.log('ifcond',item.isChecked);
      return (
        <View>
          <CButton onPress={() => { this.show(item._id) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ fontFamily:'NeueKabel-Light',color:'#141414',margin: 5, marginLeft: 10 }}>{item.categoryName}</CText>
              <Image source={require('../images/selected_data.png')} style={{height:14,width:14, marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    } else {
      return (
        <View>
          <CButton onPress={() => { this.show(item._id) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#141414', margin: 5, marginLeft: 10 }}>{item.categoryName}</CText>
              <Image source={require('../images/Filter_ellipse.png')} style={{height:14,width:14, marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    }
  }
show = (select) => {
    //console.log(select);
    let arr = [];
    var tempdata = this.state.data;
    console.log('data', tempdata);
    for (let index = 0; index < tempdata.length; index++) {
      const element = tempdata[index];
      if (element._id === select) {
        if (element.isChecked) {
          console.log(element);
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
    console.log('seleccted data', this.state.MTopCatagori)
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
          console.log('murthy', element.isChecked);

          element.isChecked = true;
          this.state.Loclist.push(element.location, element.isChecked);
        }
        tempLocData[index] = element;
        this.setState({ LocationData: tempLocData });
      }
    }
    console.log('seleccted data', this.state.Loclist)
  }
  Locationdetails(item) {
    // console.log(item.isChecked);
    if (item.isChecked) {
      //console.log('ifcond',item.isChecked);
      return (
        <View>
          <CButton onPress={() => { this.LocationShow(item.location) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#141414', margin: 5, marginLeft: 10 }}>{item.location}</CText>
              <Image source={require('../images/selected_data.png')} style={{height:14,width:14, marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    } else {
      return (
        <View>
          <CButton onPress={() => { this.LocationShow(item.location) }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <CText cStyle={{ fontFamily:'NeueKabel-Light',color:'#141414',margin: 5, marginLeft: 10 }}>{item.location}</CText>
              <Image source={require('../images/Filter_ellipse.png')} style={{height:14,width:14, marginRight: 10, marginTop: 10 }} />
            </View>
          </CButton>
        </View>
      );
    }
  }
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

    var tempLocsListData = this.state.LocationData;
    for (let j = 0; j < tempLocsListData.length; j++) {
      const element = tempLocsListData[j];
      if (element.isChecked) {
        element.isChecked = false;
        this.state.Loclist.pop(element.location);
      }
    }
    this.setState({ LocationData: tempLocsListData })
  }
  applyfunction() {
    console.log(this.state.MTopCatagori);
    console.log('sellerList', this.state.sellerList);
    { this.callShops() }
    this.ShowModalFunction(!this.state.ModalVisibleStatus);
  }
  callShops()
  {
      const self=this;
    Utils.dbCall(Config.routes.getAllShops, 'POST', { token: self.state.token },  {
        typeOfShop: self.state.Dbcalname, 
        category:self.state.MTopCatagori,
        coordinates:[], 
        locations: self.state.Loclist, 
        selectedCity: "Hyderabad", 
        nearMe: false,}
  , function(resp){ 
     console.log(resp, '====>')          
         if(resp.status){
           self.setState({ toatalresp: resp.details,spinnerBool:false },()=>{    
               console.log("nm of toatalresp",self.state.toatalresp
           );});
           } else {  
              console.log('error in shopes ==>', resp);
           }
     });

  }
Notic() {
    switch (this.state.selectITem) {
      case 'category':
        return (<View style={{  justifyContent: 'space-between', flex: 1 }} >

          <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => this.productdetails(item)}
            extraData={this.state} />

        </View>);

        break;
      case 'Locations':
        return (<View style={{  justifyContent: 'space-between', flex: 1 }} >

          <FlatList
            data={this.state.LocationData}
            keyExtractor={(item, location) => location}
            renderItem={({ item }) => this.Locationdetails(item)}
            extraData={this.state} />

        </View>);
        break;
      default:
        return null;
        break;
    }
  }
    render(){
        const {goBack} = this.props.navigation;
        return(
            <View style={{backgroundColor:'#fff',flex:1}}>
                {this.spinnerLoad()}
            <View style={styles.LikeHeader}> 
                <CButton onPress={()=>goBack()}>
                    <View style={{justifyContent:'flex-start',marginTop:15,marginLeft:10}}> 
                        <Image source={require('../images/back.png')} style={[{height:17,width:10,resizeMode:'contain',marginLeft:10}]}/>
                    </View> 
                </CButton> 
                    <CText cStyle={[styles.LikeHeaderText,{fontFamily:'NeueKabel-Regular'}]}>{this.state.filename}</CText> 
                    <View style={{justifyContent:'flex-end',flexDirection:'row'}}>
                    <CButton onPress={()=>this.props.navigation.navigate('Search')}>
                        <View style={{marginTop:15,marginRight:10}}>
                        <Image source={require('../images/Search.png')} style={{height:18,width:16,resizeMode:'contain'}}/>
                        </View>
                    </CButton>
                    
                  <TouchableOpacity  onPress={() => { this.ShowModalFunction(true) }}>
                  <View style={{marginTop:15,marginRight:15}}>
                    <Image source={require('../images/mediaFilter.png')} style={{ height: 17, width: 16,marginLeft:10}} />
                    </View>
                    <Modal
                  style={{width:150,height:250}}
                transparent={true}
                animationType={'slide'}
                visible={this.state.ModalVisibleStatus}
                onRequestClose={() => { this.ShowModalFunction(this.state.ModalVisibleStatus) }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(20,20,20,0.5)', justifyContent: 'center',}}>
                  <View style={styles.FilterMain}>
                    <View style={[styles.row,styles.jspacebn]}>
                    <View style={styles.jStart}>
                      <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#a9a9a9',marginVertical: 15,marginLeft:20}}>FILTER BY</CText>                        
                    </View>
                      <View style={{alignItems: 'flex-end', }}> 
                        <CButton onPress={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }} >
                          <Image source={require('../images/Sort_close.png')} style={{height:12,width:12, marginRight: 20, marginTop: 20 }} />
                        </CButton>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', borderTopWidth: 0.4, borderBottomWidth: 0.4,height:150 }}>
                      <View style={{ marginLeft: 10,}}>
                        <CButton onPress={() => this.setState({ selectITem: 'category' })} >
                          <CText key='category' cStyle={{fontFamily:'NeueKabel-Light',color:'#141414',margin: 5, marginRight: 20 }}>Category</CText>
                        </CButton>
                        
                        <CButton onPress={() => this.setState({ selectITem: 'Locations' })}>
                          <CText key='Locations' cStyle={{fontFamily:'NeueKabel-Light',color:'#141414',margin: 5, marginRight: 20 }}>Locations</CText>
                        </CButton>
                        
                      </View>
                      <View style={{ borderLeftWidth: 0.4,borderColor:'e5e5e5', justifyContent: 'space-between', flex: 1,height:180}} >
                        {this.Notic()}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                      <CButton onPress={() => { this.clearall() }}>
                        <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#656565',alignSelf: 'center', marginLeft: 35, marginVertical: 15 }}>CLEAR ALL</CText>
                      </CButton>
                      <CButton onPress={() => this.applyfunction()}>
                        <CText cStyle={{fontFamily:'NeueKabel-Light',color:'#656565',alignSelf: 'center', marginRight: 65, marginVertical: 15 }}>APPLY</CText>
                      </CButton>
                    </View>

                  </View>
                </View>
              </Modal>
                  </TouchableOpacity>
                  </View>    
         </View> 
                <View style={{flex:1}}>
                    <FlatList  numColumns={2}
                    data={this.state.toatalresp}
                    keyExtractor={(item,index) => index}  
                    //renderItem={this.itemRender}
                    renderItem={({item}) =>this.renderdata(item) }
                    extraData={this.state.selectedButton}
                    />
                </View>
              </View>
               );
        }
    }        