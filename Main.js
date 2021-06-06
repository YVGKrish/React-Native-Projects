import React from 'react';
import { SearchHeader, Image, Text } from 'react-native';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';

import FashionpecksLogInnerPage from './screens/FashionpecksLogInnerPage';
import Login from './screens/Login';
import Signup from './screens/Signup';
// import Forgotpassword from './screens/Forgotpassword';
import Likepage from './screens/Likepage';
import Fashionpecks from './screens/Fashionpecks';
import HomeWomens from './screens/HomeWomens';
import ProductView from './screens/ProductView';
import Address from './screens/Address';
import MyProfile from './screens/MyProfile';
import ShopLog from './screens/ShopLog';

// Home + Tab navigation screens
import Home from './screens/Home';
import Categeries from './screens/Categeries';
import Bag from './screens/Bag';
import Media from './screens/Media';
import Menu from './screens/Menu';
import Seemore from './screens/Seemore';
import Collectionsdata from './screens/Collectionsdata';
import TrendSeeMore from './screens/TrendSeeMore';

import UserPosts from './screens/UserPosts';

import Support from './screens/Support';
import Faq from './screens/Faq';
import MyOrders from './screens/MyOrders';

import Paydetail from './screens/Paydetail';
// import AlertBox from './screens/AlertBox';


import Search from './screens/Search';

const Main = StackNavigator({

  FashionpecksLogInnerPage: { screen: FashionpecksLogInnerPage, navigationOptions: { header: null }},
  Media: { screen: Media, navigationOptions: { header: null }},
  Login: { screen: Login, navigationOptions: { header: null }},
  Likepage: { screen: Likepage, navigationOptions: { header: null }},
  Signup: { screen: Signup, navigationOptions: { header: null }},
  // Forgotpassword: { screen: Forgotpassword, navigationOptions: { header: null }},
  Fashionpecks: { screen: Fashionpecks, navigationOptions: { header: null }},
  HomeWomens: { screen: HomeWomens, navigationOptions: { header: null }},
  ProductView: { screen: ProductView, navigationOptions: { header: null }},
  MyProfile: { screen: MyProfile, navigationOptions: { header: null }},
  Address: { screen: Address, navigationOptions: { header: null }},
  ShopLog: {screen:ShopLog, navigationOptions: { header: null}},
  Seemore: {screen:Seemore, navigationOptions: { header: null}},
  Collectionsdata: {screen:Collectionsdata, navigationOptions:{ header: null}},
  Seemore:{screen:Seemore, navigationOptions: { header: null}},
  TrendSeeMore:{screen:TrendSeeMore, navigationOptions: { header: null}},  
  Menu:{screen:Menu, navigationOptions: { header: null}},  
  // AlertBox:{screen:AlertBox, navigationOptions: { header: null}},  
  Support: {screen:Support,navigationOptions:{header:null}},
  Faq: {screen:Faq,navigationOptions:{header:null}},
  MyOrders: {screen:MyOrders,navigationOptions:{header:null}},
  Search:{screen:Search,navigationOptions:{header:null}},
  UserPosts:{screen:UserPosts,navigationOptions:{header:null}},
  Paydetail:{screen:Paydetail,navigationOptions:{header:null}},
  Menu:{screen:Menu,navigationOptions:{header:null}},
  Home: { screen: TabNavigator({
    Home: {
      screen: Home, 
      navigationOptions: { 
        tabBarLabel: ({tintColor}) => (<Text style={[styles.tabLabel, {color:tintColor}]}>Home</Text>),
        tabBarIcon: ({ focused, tintColor }) => (<Image style={[styles.tabImg, {tintColor: tintColor}]} source={require('./images/tabhome.png')} />),
        header: null
      },
    },
    Categories: {
      screen: Categeries,
      navigationOptions: {
        tabBarLabel: ({tintColor}) => (<Text style={[styles.tabLabel, {color:tintColor}]}>Categories</Text>),
        tabBarIcon: ({ focused, tintColor }) => (<Image style={[styles.tabImg, {tintColor: tintColor}]} source={require('./images/tab_categeris.png')} />),
        header: null
      },
    },
    Bag: {
      screen: Bag,
      navigationOptions: {
        tabBarLabel: ({tintColor}) => (<Text style={[styles.tabLabel, {color:tintColor}]}>Bag</Text>),
        tabBarIcon: ({ tintColor }) => (<Image style={[styles.tabImg, {tintColor: tintColor}]} source={require('./images/tab_Bag.png')} />),
        header: null
      },
    },
    Media: {
      screen: Media,
      navigationOptions: {
        tabBarLabel: ({tintColor}) => (<Text style={[styles.tabLabel, {color:tintColor}]}>Media</Text>),
        tabBarIcon: ({ focused, tintColor }) => (<Image style={[styles.tabImg, {tintColor: tintColor}]} source={require('./images/tab_Media.png')} />),
        header: null
      },
    },
    Menu: {
      screen: Menu,
      navigationOptions: {
        tabBarLabel: ({tintColor}) => (<Text style={[styles.tabLabel, {color:tintColor}]}>Menu</Text>),
        tabBarIcon: ({ focused, tintColor }) => (<Image style={[styles.tabImg, {tintColor: tintColor}]} source={require('./images/tab_Menu.png')} />),
        header: null
      },
    },
  }, {
      cardStyle: { backgroundColor: 'rgba(0,0,0,0.5)' },
      tabBarPosition: 'bottom',
      lazy: true,
      animationEnabled: true,
      swipeEnabled: true,
      upperCaseLabel: false,
      tabBarOptions: {
        activeTintColor: '#FF4D4D',
        inactiveTintColor: '#1b1b1b',
        showIcon: true,
        //focused: true,
        style: {
          backgroundColor: '#FFF', borderTopWidth:0.4, borderTopColor:'#EEE'
        },
        indicatorStyle: { display: 'none' },
        allowFontScaling: true, 
        labelStyle: {
          fontSize: 11,
        }
      },
    })
 }
},{ initialRouteName: 'Home' });


const styles = {
  tabImg: { width: 16, height: 14, resizeMode: 'contain' },
  tabLabel: { fontSize: 11,fontFamily:'NeueKabel-Light' }
};

export default Main;
