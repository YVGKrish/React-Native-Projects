import React, { Component } from 'react';
import {
    TouchableOpacity,
    TextInput,
    Text,Image,
    View,
    FlatList
} from 'react-native';
import { CText, CInput, CButton, Labelmenu, CSpinner, SSpinner } from '../common/index';
import styles from '../common/styles';
import Utils from '../common/Utils';
import Config from '../config/Config';

export default class Search extends Component {

    constructor(props) {
        super(props);
  
      this.state = {
          searchstr:'',
          SearchData:[],
          spinnerLoad:false,
          searchBool:'none',
        };
      }

    SearchResults(stra) {
        this.setState({searchstr:stra});
        if (stra.length > 1) {
            this.setState({ spinnerLoad:true ,searchBool:'flex'});
            let self = this;
            Utils.dbCall(Config.routes.searchProducts, 'POST', null, { str: stra }, function (resp) {
                self.setState({ spinnerLoad:false,searchBool:'none' });
                console.warn(resp)
                if (resp.status) {
                    self.setState({
                        SearchData: JSON.parse(JSON.stringify(resp.details)),
                        searchBool: 'flex'
                    });
                } else {
                    alert('Please try again');
                }
            });
        } else {
            this.setState({ searchBool:'none' });
        }
    }
    SearchGo(){
        if(this.state.searchstr){
            console.warn(this.state.searchstr)
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
                    alert('Please try again');
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
    
    render() {
        return (
            <View style={{flex:1,flexDirection:'column', backgroundColor:'#FFF'}} >
                <View style={{flexDirection:'row',margin:10,marginBottom:0,flexDirection:'row'}}>
                
                    <TextInput underlineColorAndroid='transparent' 
                    onChangeText={(text) =>this.SearchResults(text)} 
                    placeholder="Search for Products, Shops, Location"
                    style={[{ alignSelf: 'center', width: '85%',borderWidth:0.6, backgroundColor: '#fff', fontFamily: 'NeueKabel-Regular' }]} />
                    <View style={[styles.searchGoWrap, styles.jCenter, styles.aitCenter]} >
                    <TouchableOpacity onPress={() => this.SearchGo()} >
                        <CText cStyle={{ color: 'white', fontFamily: 'NeueKabel-Regular' }} >GO</CText>
                    </TouchableOpacity>
                    </View>
                </View>
                <View style={{ backgroundColor: '#fff',display:this.state.searchBool }}>
                        <FlatList
                            data={this.state.SearchData}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) => this.renderSearch(item)}
                        />
                    </View>
            </View>
        );
    }
}
