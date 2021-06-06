import React, { Component } from 'react';
import { Text, View, TextInput, ScrollView, Dimensions, AsyncStorage, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { TabNavigator } from 'react-navigation';
import Swiper from 'react-native-swiper';
import { CText, CInput, CButton, Labelmenu, CSpinner, SSpinner, TSpinner,AlertBox } from '../common/index';
import styles from '../common/styles';
import axios from 'axios';
import Utils from '../common/Utils';
import Config from '../config/Config';
import LinearGradient from 'react-native-linear-gradient';

const { WinWidth, WinHeight } = Dimensions.get('window');

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categoryArray: Utils.commonData('Category'),
            subCategoryArray: Utils.commonData('SubCategory'),
            width: '99%',
            height: 171,
            MenData: [],
            Designerdtails: [],
            Shopesdtails: [],
            MenState: [],
            IndependentSellerdtails: [],
            Tailordtails: [],
            categorySelected: '',
            token: '',
            wcount: '',
            toppost:[],
            Tendprods: [], wcount: 0,
            TailorDetails: [],
            'spinnerBool1': false,
            'spinnerBool2': false,
            'spinnerBool3': false,
            'spinnerBool4': false,
            'spinnerBool5': false,
            SamesDB: [],
            searchstr: '',
            SearchData: [],
            spinnerLoad: false,
            searchBool: 'none',
            bgcolor:["red","#6d88d4","#B316CF","#d65f46","#2ACF16","#000","#A7A26B"],
        };
    }

    componentWillMount() {
        const { navigate } = this.props.navigation;
        const self = this;

        // To load swiper images
        setTimeout(() => { this.setState({ width: '100%', swiperShow: true }); }, 50);

        self.fetchTrendingItems();
        // self.setState({ spinnerBool1: true, spinnerBool2: true, spinnerBool3: true, spinnerBool4: true, spinnerBool5: true })

        Utils.getToken('user', function (tResp, tStat) {
            if (tStat) {
                self.setState({ token: tResp.token }, () => {
                    console.warn(self.state.token)
                    { self.wishlistcount() }
                });
            }
        });
    }

    componentDidMount() {
        const self = this;
        Utils.getWishList('withy', function (tResp, tStat) {
            if (tStat && tResp != '') {
                self.setState({ wcount: tResp });
            }
        });
    }
    wishlistcount() {
        const self = this;
        Utils.dbCall(Config.routes.getWishListProducts, 'GET', { token: self.state.token }, {}
            , function (resp) {
                console.log(resp.details + "wishlist resp")
                if (resp.status) {
                    self.setState({ wcount: resp.totalWishlist }, () => { });
                    Utils.setWishList('withy', self.state.wcount, function (tResp, tStat) {
                        if (tStat) {
                        }
                    });
                } else {
                }
            });
    }
    spinnerLoad(id) {
        if (this.state[id]) {
            return <SSpinner />;
        } else {
            return false;
        }
    }
    TspinnerLoad(id) {
        if (this.state[id]) {
            return <TSpinner />;
        } else {
            return false;
        }
    }

    fetchTrendingItems() {
        const self = this;
        Utils.dbCall(Config.routes.getAllTrendingProds, 'GET', null, { number: 4 }, function (resp) {
            // console.warn(resp)
            if (resp.status) {
                self.setState({ Tendprods: resp.trendingItems, spinnerBool1: false }, () => {
                    self.shopesDbcall('Business Owner');
                });
                // console.log('Trending Prods', self.state.Tendprods);
            }
        });
    }

    shopesDbcall(tos) {
        const self = this;
        if (tos) {
            Utils.dbCall(Config.routes.getAllShops, 'POST', null, {
                typeOfShop: tos,
                category: [],
                coordinates: [],
                locations: [],
                selectedCity: "Hyderabad",
                number: 4,
                nearMe: false,
            }, function (resp) {
                if (resp.status) {
                    if (tos === 'Business Owner') {
                        self.setState({ Shopesdtails: resp.details, spinnerBool2: false }, () => {
                            self.shopesDbcall('Designer');
                            //  console.warn("nm of Shopesdtails", self.state.Shopesdtails);
                        });
                    } else if (tos === 'Designer') {
                        self.setState({ Designerdtails: resp.details, spinnerBool3: false }, () => {
                            self.shopesDbcall('Tailor');
                            // console.log("nm of Shopesdtails", self.state.Designerdtails);
                        });
                    } else if (tos === 'Tailor') {
                        self.setState({ Tailordtails: resp.details, spinnerBool4: false }, () => {
                            self.shopesDbcall('Independent Seller');
                            // console.log("nm of Shopesdtails", self.state.Shopesdtails);
                        });
                    } else if (tos === 'Independent Seller') {
                        self.setState({ IndependentSellerdtails: resp.details, spinnerBool5: false }, () => {
                            // console.log("nm of Shopesdtails", self.state.IndependentSellerdtails);
                            self.mediatoppost();
                        });
                    }
                } else {
                    // console.log('error in shopes ==>', resp);
                }
            });
        }
    }
    mediatoppost(){
        const self = this;
        Utils.dbCall(Config.routes.MediaTopPosts, 'GET', null, { }, function (resp) {
            // console.warn(resp)
            if (resp.status) {
                self.setState({toppost:resp.topPosts},()=>{
                    console.log('Media top Posts', resp.topPosts);
                });
                
            }
        });
    }
    gotoLikePageHome() {
        const self = this;
        if (self.state.token != '') {
            Utils.getWishList('withy', function (tResp, tStat) {
                if (tStat && tResp != '') {
                    self.setState({ wcount: tResp });
                    self.props.navigation.navigate('Likepage', { token: self.state.token });
                }
                else {
                    self.props.navigation.navigate('Login');
                }
            });
        } else {
            self.props.navigation.navigate('Login');
        }
    }


    renderimage(shopesdata) {
        // console.log("<=--=>",shopesdata)
        const self = this;
      
            //console.warn("<=--=>",Config.routes.base + Config.routes.getShopBackground + shopesdata.backgroundImage);
            return (
                <View>
                    <Image source={{ uri: Config.routes.base + Config.routes.getShopLogo + '/' + shopesdata._id }}
                        style={styles.ShopNearByimg} />
                </View>
            )
        // } else {
        //     return (
        //         <View>
        //             <Image source={require('../images/ShopNearBy_Canali.png')} style={styles.ShopNearByimg} />
        //         </View>
        //     )
        // }
    }

    renderdesignimages(Designerdtails) {
        if (Designerdtails.isProfilePic) {
            // console.warn("<=--=>", Config.routes.base + Config.routes.getShopBackground + Designerdtails.backgroundImage);
            return (
                <View>
                    <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + Designerdtails._id }}
                        style={styles.Designimg} />
                </View>
            )
        } else {
            return (
                <View>
                    <Image source={require('../images/Design_Naddine.png')} style={styles.Designimg} />
                </View>
            )
        }
    }

    renderDesigners() {
    if(this.state.Designerdtails.length != 0){
        // console.log('designer details',this.state.Designerdtails[0].shopName);
        return(
            <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity activeOpacity={0.3} onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: this.state.Designerdtails[0] })}>
            <View style={{ margin: 10 }}>
                <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + this.state.Designerdtails[0]._id }} style={{ width: ((Dimensions.get('window').width) / 2) - 15, height: 250, resizeMode: 'cover' }} />
                <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,1)']} style={styles.linearGradient}>
                    <Text style={{ color: 'white', position: 'absolute', bottom: 10, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:10 }}>{this.state.Designerdtails[0].shopName.substr(0, 14).toUpperCase()}</Text>
                </LinearGradient>
            </View>
            </TouchableOpacity >
            
            <View style={{ margin: 10, marginLeft: 0, }}>
            <TouchableOpacity activeOpacity={0.3} onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: this.state.Designerdtails[1] })}>
                <View>
                    <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + this.state.Designerdtails[1]._id }} style={{ width: ((Dimensions.get('window').width) / 2) - 35, height: 120, resizeMode: 'cover' }} />
                    <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,1)']} style={styles.linearGradientsub}>
                        <Text style={{ color: 'white', position: 'absolute', bottom: 10, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:10 }}>{this.state.Designerdtails[1].shopName.substr(0, 14).toUpperCase()}</Text>
                    </LinearGradient>
                </View>
                </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.3} onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: this.state.Designerdtails[2] })}>
                <View style={{ marginTop: 10 }}>
                    <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + this.state.Designerdtails[2]._id }} style={{ width: ((Dimensions.get('window').width) / 2) - 35, height: 120, resizeMode: 'cover' }} />
                    <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,1)']} style={styles.linearGradientsub}>
                        <Text style={{ color: 'white', position: 'absolute', bottom: 10, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:10 }}>{this.state.Designerdtails[2].shopName.substr(0, 14).toUpperCase()}</Text>
                    </LinearGradient>
                </View>
                </TouchableOpacity>
            </View>
        </View>
          );
    }else{
        return false;
    }
      
    }

    renderTailorimage(Tailorsdata) {
        if (Tailorsdata.isProfilePic) {
            //console.warn("<=--=>", Config.routes.base + Config.routes.getShopBackground + '/' + Tailorsdata.backgroundImage);
            return (
                <View style={{}}>
                    <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + Tailorsdata._id }}
                        style={styles.Tailorimg} />
                </View>
            )
        } else {
            return (
                <View>
                    <Image source={require('../images/Tailor_img1.png')} style={styles.Tailorimg} />
                </View>
            )
        }
    }

    renderTailors() {
    if(this.state.Tailordtails.length != 0){
        return(
            <View style={{ flexDirection: 'row' }}>
                            <View style={{ margin: 10 }}>
                                <TouchableOpacity activeOpacity={0.3} onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: this.state.Tailordtails[0] })}>    
                                <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + this.state.Tailordtails[0]._id }} style={{ width: ((Dimensions.get('window').width) / 2) - 15, height: 250, resizeMode: 'cover' }} />
                                <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,1)']} style={styles.linearGradient}>
                                    <Text style={{ color: 'white', position: 'absolute', bottom: 20, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:10,fontWeight:'bold' }}>{this.state.Tailordtails[0].shopName}</Text>
                                    <Text style={{ color: 'white', position: 'absolute', bottom: 8, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:9 }}>{this.state.Tailordtails[0].location} , {this.state.Tailordtails[0].city}</Text>
                                </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={{ margin: 10, marginLeft: 0, }}>
                                <View>
                                 <TouchableOpacity activeOpacity={0.3} onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: this.state.Tailordtails[1] })}>
                                    <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + this.state.Tailordtails[1]._id }} style={{ width: ((Dimensions.get('window').width) / 2) - 35, height: 120, resizeMode: 'cover' }} />
                                    <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,1)']} style={styles.linearGradientsub}>
                                        <Text style={{ color: 'white', position: 'absolute', bottom: 20, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:10,fontWeight:'bold' }}>{this.state.Tailordtails[1].shopName}</Text>
                                        <Text style={{ color: 'white', position: 'absolute', bottom: 8, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:9 }}>{this.state.Tailordtails[1].location} , {this.state.Tailordtails[1].city}</Text>
                                    </LinearGradient>
                                    </TouchableOpacity> 
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity activeOpacity={0.3} onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: this.state.Tailordtails[2] })}>
                                    <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + this.state.Tailordtails[2]._id }} style={{ width: ((Dimensions.get('window').width) / 2) - 35, height: 120, resizeMode: 'cover' }} />
                                    <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,1)']} style={styles.linearGradientsub}>
                                        <Text style={{ color: 'white', position: 'absolute', bottom: 20, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:10,fontWeight:'bold' }}>{this.state.Tailordtails[2].shopName}</Text>
                                        <Text style={{ color: 'white',position: 'absolute', bottom: 8, alignSelf: 'center',fontFamily:'NeueKabel-Regular',fontSize:9 }}>{this.state.Tailordtails[2].location} , {this.state.Tailordtails[2].city}</Text>
                                    </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
        );
        
    }
}

    rendershops(shopesdata) {
        // console.warn('shopesdata====>',shopesdata);
        return (
            <ScrollView horizontal={true}>
                <View style={[styles.Shopconimages, {}]}>
                    <TouchableOpacity style={[styles.imgstyle2, styles.row]} onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: shopesdata })}>
                        <View style={styles.ShopLocation}>
                            {this.renderimage(shopesdata)}
                            <View style={{ marginTop: 10 }}>
                                <CText cStyle={styles.ShopText}>{shopesdata.shopName.toUpperCase()}</CText>
                                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                    <Image source={require('../images/ShopNearBy_Navigation.png')} style={styles.ShopNavignImg} />
                                    <CText cStyle={{ color: '#636363', fontSize: 10, fontFamily: 'NeueKabel-Light' }}>{shopesdata.location}</CText>
                                </View>
                            </View>
                        </View>
                        <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + shopesdata._id }}  style={[styles.Shopimghiwi,{resizeMode:'cover'}]} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    Independentsellerimage(Independentseller) {
        if (Independentseller.isProfilePic) {
            return (
                <View>
                    <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + Independentseller._id }}
                        style={{ height: 160, width: 161 }} />
                </View>
            )
        } else {
            return (
                <View>
                    <Image source={require('../images/Independent_Sellar_img1.png')} style={{ height: 160, width: 161 }} />
                </View>
            )
        }
    }

    renderIndependentseller(Independentseller) {
        //console.log(Independentseller)
        return (
            <View style={{}}>
                <ScrollView style={{}} horizontal={true} pagingEnabled={true}>
                    <CButton cStyle={[styles.HomeTrendconimages2, { flexDirection: 'column', width: 155, height: 230, justifyContent: 'center', backgroundColor: 'white' }]}
                        onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: Independentseller })}>
                        <View style={{ margin: 10 }}>
                            <View>
                                <Image source={{ uri: Config.routes.base + Config.routes.getShopBackground + '/' + Independentseller._id }}
                                    style={{ height: 160, resizeMode: 'cover' }} />
                            </View>
                            {/* {this.Independentsellerimage(Independentseller)} */}
                            {/* <View>
                    <Image style={{  height: 140, resizeMode: 'contain'}} source={{ uri: Config.routes.base + Config.routes.getProductPicUser + item.productId.images[0] }} />
                    </View> */}
                            <View style={[{ marginTop: 10 }]}>
                                <CText cStyle={[styles.HomeTrendtextbtn, { paddingLeft: 0, fontSize: 10.5 }]}>{Independentseller.shopName.substr(0, 15)}</CText>
                                <CText cStyle={[styles.HomeTrendText, { marginLeft: 0, fontSize: 9.5 }]}>BY {Independentseller.location}</CText>
                            </View>
                        </View>
                    </CButton>
                </ScrollView>
            </View>
        );
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

    Trendproductinfo(item) {
        // console.warn(item)
        return (
            <View style={{}}>
                <ScrollView style={{}} horizontal={true} pagingEnabled={true}>
                    <CButton cStyle={[styles.HomeTrendconimages2, { flexDirection: 'column', width: 155, height: 230, justifyContent: 'center', backgroundColor: 'white' }]} onPress={() => this.props.navigation.navigate('ProductView', { trnd: item })}>
                        <View style={{ margin: 10 }}>
                            <View>
                                <Image style={{ height: 140, resizeMode: 'contain' }} source={{ uri: Config.routes.base + Config.routes.getProductPicUser + item.productId.images[0] }} />
                            </View>
                            <View style={[{ marginTop: 10 }]}>
                                <CText cStyle={[styles.HomeTrendtextbtn, { paddingLeft: 0, fontSize: 10.5 }]}>{item.productId.name.substr(0, 15)}</CText>
                                <CText cStyle={[styles.HomeTrendText, { marginLeft: 0, fontSize: 9.5 }]}>BY {item.productId.vendorId.shopName}</CText>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../images/NearLoation.png')} style={[{ marginTop: 3, width: 10, height: 8.5, resizeMode: 'contain' }]} />
                                    <CText cStyle={[styles.HomeTrendText, { marginLeft: 2, fontSize: 9.5 }]}>{item.productId.vendorId.location}</CText>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                <CText cStyle={[styles.HomeTrendPriceText1, { fontSize: 9.5, }]}>₹{item.productId.price}</CText>
                                <CText cStyle={[styles.HomeTrendPriceText2, { fontSize: 9.5, fontWeight: 'bold' }]}>₹{item.productId.discountedPrice}</CText>
                            </View>
                        </View>
                    </CButton>
                </ScrollView>
            </View>
        )
    }

    // LoadingProds() {
    //     const self = this;
    //     Utils.dbCall(config.routes.getAllTrendingProds, 'GET', null, {}, function (resp) {
    //         if (resp.status) {
    //             self.setState({ Tendprods: resp.trendingItems });
    //             console.log('Tending======', self.state.Tendprods);

    //         }
    //     });
    // }

    formcall(typedata) {
        const self = this;
        Utils.dbCall(Config.routes.Getcollection, 'POST', { token: self.state.token }, {
            filter: [],
            type: typedata
        }, function (resp) {
            if (resp.status) {
                self.setState({ SamesDB: resp.collections[0].productIds });
                // console.log('SameDB', self.state.SamesDB)
            }
        })
    }

    SearchResults(stra) {
        this.setState({ searchstr: stra });
        if (stra.length <= 1) {
            this.setState({ searchBool: 'none' });
        } else if (stra.length > 1) {
            this.setState({ spinnerLoad: true, searchBool: 'flex' });
            let self = this;
            Utils.dbCall(Config.routes.searchProducts, 'POST', null, { str: stra }, function (resp) {
                self.setState({ spinnerLoad: false });
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
            this.setState({ searchBool: 'none' });
        }
    }

    renderNavProC(item) {
        let self = this;
        if (item) {
            Utils.dbCall(Config.routes.getNavProductsWithCategories, 'POST', null, { categories: [item.grandParent, item.parent, item.name] }, function (resp) {
                if (resp.status) {
                    self.props.navigation.navigate('HomeWomens', {/* data:item.grandParent ,*/SearchId: resp.ids })
                } else {
                    // alert('Please try again');
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

    SearchGo() {
        if (this.state.searchstr) {
            //console.warn(this.state.searchstr)
            this.props.navigation.navigate('HomeWomens', { SearchGo: this.state.searchstr })
        }
    }

    toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }
    rendertopposts(mediapost){
            // console.log('mediapost render',mediapost)
            return(
                <View style={{ margin: 10, borderColor: '#a0a0a0', borderWidth: 0.4, width: 233, height: 230 }}>
                    <View style={{}}>
                        <Image source={{ uri: Config.routes.base + Config.routes.getSocialMediaPics +'/'+ mediapost.content.images[0] }} style={{ width: 233, height: 163, resizeMode: 'contain' }} />
                        <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,1)']} style={styles.linearGradientmedia}>
                            <Text style={{fontFamily: 'NeueKabel-Regular', fontSize: 13, marginLeft: 10, color: 'white', position: 'absolute', bottom: 10 }}>{mediapost.userId.fullName}</Text>
                        </LinearGradient>

                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ShopLog', { singleshop: mediapost.content.shoppedAt })}>
                    <View style={{ margin: 10, flexDirection: 'row' }} >
                        <View style={{ backgroundColor:this.state.bgcolor[Math.floor(Math.random() * this.state.bgcolor.length)], height: 50, width: 50, borderRadius: 50 ,justifyContent:'center',alignItems:'center'}} >
                        <Text style={{fontSize:20,color:'white',marginBottom:3}}>{mediapost.firstLetter.toUpperCase()}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 25 }} >
                            <Text style={{ fontFamily: 'NeueKabel-Regular', fontSize: 11,color:'#040404'  }}>{mediapost.content.shoppedAt.shopName}</Text>
                            {/* <Text style={{ fontFamily: 'NeueKabel-Regular', fontSize: 11 }}>Hyderabad</Text>
                            <Text style={{ fontFamily: 'NeueKabel-Regular', fontSize: 11 }}>Telangana</Text> */}
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
            );
    }
    getimage(){
        console.warn('Home page looop is possiable');
        return(
            <View style={{height:250,backgroundColor:'green'}}>
            <Image source={require('../images/Home_Swiper1.png')} style={{ backgroundColor:'red',width: Dimensions.get('window').width, height: 172, resizeMode: 'contain', margin: 0, padding: 0 }} />
        </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.HomeHeaderWrap}>
                    <View style={[styles.m10, styles.row, { justifyContent: 'space-around' }]}>
                        <View style={[styles.row]}>
                            <View style={[styles.bgfff, styles.bBLRad5, styles.bTLRad5, { marginRight: 0 }]}>
                                <Image style={[styles.mL10, { height: 15, width: 15, resizeMode: 'contain', marginTop: 12 }]} source={require('../images/Search_black.png')} />
                            </View>
                            <TextInput underlineColorAndroid='transparent' onChangeText={(text) => this.SearchResults(text)} placeholder="Search for Products, Shops & Location"
                                style={[{ alignSelf: 'center', width: '74%', height: 40, backgroundColor: '#fff', fontFamily: 'NeueKabel-Light' }]} />
                            <View style={[styles.searchGoWrap, styles.jCenter, styles.aitCenter]} >
                                <TouchableOpacity onPress={() => this.SearchGo()} >
                                    <CText cStyle={{ color: 'white', fontFamily: 'NeueKabel-Regular' }} >GO</CText>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{}}>
                            <CButton onPress={() => this.gotoLikePageHome()}>
                                <Image source={require('../images/Hometrending.png')} style={{ height: 28, width: 21, resizeMode: 'contain', marginTop: 5, marginRight: 10 }} />
                                <View style={[styles.HomesymNotify, { marginTop: 0, marginLeft: 0, right: 0 }]}>
                                    <CText cStyle={[styles.cFFF, styles.aslCenter, styles.FntS8, styles.m3]}>
                                        {this.state.wcount}</CText>
                                </View>
                            </CButton>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#fff', display: this.state.searchBool }}>
                        <FlatList
                            data={this.state.SearchData}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) => this.renderSearch(item)}
                        />
                    </View>
                </View>

                <ScrollView scrollEnabled={true} keyboardDismissMode='on-drag'>
                    <View style={[styles.conimages, { backgroundColor: '#fff' }]}>
                        <ScrollView style={{ marginBottom: 5 }} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <CButton onPress={() => this.props.navigation.navigate('HomeWomens', { data: 'Men' })}>
                                <View style={[styles.imagestyle, { margin: 7, marginLeft: 10,marginTop:10 }]}>
                                    <Image source={require('../images/Home_Men.png')} style={styles.CatageryImg} />
                                    <CText cStyle={[styles.textstyle, { marginTop: 10 }]}>MEN</CText>
                                </View>
                            </CButton>
                            <CButton onPress={() => this.props.navigation.navigate('HomeWomens', { data: 'Women' })}>
                                <View style={[styles.imagestyle, { margin: 7 ,marginTop:10}]} >
                                    <Image source={require('../images/Home_Women.png')} style={styles.CatageryImg} />
                                    <CText cStyle={[styles.textstyle, { marginTop: 10 }]}>WOMEN</CText>
                                </View>
                            </CButton>

                            <CButton onPress={() => this.props.navigation.navigate('HomeWomens', { data: 'Kids' })}>
                                <View style={[styles.imagestyle, { margin: 7,marginTop:10 }]}>
                                    <Image source={require('../images/Home_Kid.png')} style={styles.CatageryImg} />
                                    <CText cStyle={[styles.textstyle, { marginTop: 10 }]}>KIDS</CText>
                                </View>
                            </CButton>

                            <CButton onPress={() => this.props.navigation.navigate('HomeWomens', { data: 'Home & Living' })}>
                                <View style={[styles.imagestyle, { margin: 7,marginTop:10 }]}>
                                    <Image source={require('../images/Home_Living.png')} style={styles.CatageryImg} />
                                    <CText cStyle={[styles.textstyle, { marginTop: 10 }]}>HOME & LIVING</CText>
                                </View>
                            </CButton>
                        </ScrollView>
                    </View>
                                {/* <AlertBox /> */}
                    {/* Dimensions.get('window').width   
                 autoplayTimeout={5} paginationStyle={{ left: '80%', bottom: 20 }} width='100%' height={300} activeDotColor={'#535353'} dotColor={'#fff'} autoplay={true} 
                    */}
                    <View>
                                       
                    {/* <Image source={require('../images/Home_Swiper1.png')} style={{ width: Dimensions.get('window').width, height: 172, resizeMode: 'contain', margin: 0, padding: 0 }} /> */}
                        
                    {/* <Swiper style={{flex:1}}  paginationStyle={{ left:'80%',bottom:20}} showsPagination={true} width={this.state.width} height={this.state.height}
                        activeDotColor={'#c01530'} dotColor={'#fff'} autoplay={true} removeClippedSubviews={false} >
                            {/* {this.getimage()} 
                            <Image source={require('../images/Home_Swiper1.png')} style={{ width: Dimensions.get('window').width, height: 172, resizeMode: 'contain', margin: 0, padding: 0 }} />
                            <Image source={require('../images/Home_Swiper.png')} style={{ width: Dimensions.get('window').width, height: 172, resizeMode: 'contain', margin: 0, padding: 0 }} />
                    </Swiper> */}
                        <Swiper  width={this.state.width} height={this.state.height} activeDotColor={'#535353'} dotColor={'#fff'} autoplay={true}>
                            <View>
                                <Image source={require('../images/Home_Swiper1.png')} style={{ width: Dimensions.get('window').width, height: 172, resizeMode: 'contain', margin: 0, padding: 0 }} />
                                <View style={{ position: 'absolute', bottom: 70, right: 0, marginRight: 10 }}>
                                    <Text style={{ fontFamily: 'NeueKabel-Medium ', color: 'white', fontSize: 12 }}>Upload your fashion on our social media</Text>
                                    <Text style={{ fontFamily: 'NeueKabel-Light', color: 'white', fontSize: 12 }}>Feel free to share your fashion with us</Text>
                                    <Text style={{ fontFamily: 'NeueKabel-Light', color: 'white', fontSize: 12 }}>spread the fashion everywhere.</Text>
                                </View>
                            </View>
                            <Image source={require('../images/Home_Swiper1.png')} style={{ width: Dimensions.get('window').width, height: 172, resizeMode: 'contain', margin: 0, padding: 0 }} />
                            <Image source={require('../images/Home_Swiper1.png')} style={{ width: Dimensions.get('window').width, height: 172, resizeMode: 'contain', margin: 0, padding: 0 }} />
                        </Swiper>
                    </View>

                    <View style={[styles.tabbar, { backgroundColor: '#c01530', marginTop: 0, marginLeft: 0, paddingLeft: 10 }]}>
                        <View style={{ marginBottom: 5, marginTop: 5 }}>
                            <CText cStyle={{ fontSize: 13, color: '#fff', fontFamily: 'NeueKabel-Regular' }}>TRENDING ITEMS</CText>
                            <CText cStyle={{ fontSize: 12, color: '#fff', fontFamily: 'NeueKabel-Light', marginTop: 2 }}>Discover Top finds from our shoppers</CText>
                        </View>
                        <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                            <CButton cStyle={{ flexDirection: 'row', alignItems: 'center' }}
                                // onPress={() => this.props.navigation.navigate('Seemore', { name: 'TRENDING ITEMS' })}
                                onPress={() => this.props.navigation.navigate('TrendSeeMore')}>
                                <CText cStyle={[styles.mT10, { fontSize: 13, color: '#fff', fontFamily: 'NeueKabel-Regular' }]}>See more</CText>
                                <Image source={require('../images/whiteseemore.png')} style={[styles.mT13, { marginLeft: 3, width: 10, height: 8.5, resizeMode: 'contain' }]} />
                            </CButton>
                        </View>
                    </View>

                    <View style={{ flex: 1, paddingLeft: 10, paddingTop: 10, height: 250, backgroundColor: '#c01530' }}>
                        {/* <HomeTrending/> */}
                        {this.TspinnerLoad('spinnerBool1')}
                        <View style={{ backgroundColor: '#ff6677', height: 240 }}>
                            <FlatList numColumns={1}
                                style={{ backgroundColor: '#c01530' }}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.Tendprods}
                                horizontal={true}
                                keyExtractor={(item, index) => index}
                                //renderItem={this.itemRender}
                                renderItem={({ item }) => this.Trendproductinfo(item)}
                                extraData={this.state.Tendprods} />
                        </View>
                    </View>


                    <View>
                        <Labelmenu field={'SHOPES NEAR BY'} onPress={() => this.props.navigation.navigate('Seemore', { name: 'SHOPES NEAR BY', type: 'Business Owner' })} />
                    </View>

                    <View style={{ width: '100%', height: 160, paddingLeft: 10,marginBottom:0 }}>
                        {this.spinnerLoad('spinnerBool2')}
                        <FlatList horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.Shopesdtails}
                            keyExtractor={(item, index) => index}
                            //renderItem={this.itemRender}
                            renderItem={({ item }) => this.rendershops(item)}
                            extraData={this.state.selectedButton}
                        />

                    </View>

                    <View style={[styles.tabbar, { backgroundColor: '#fff', marginHorizontal: 10,marginTop:0 }]}>
                        <View style={{ marginVertical: 5 }}>
                            <CText cStyle={{ fontSize: 13, marginLeft: 10, color: '#272727', fontFamily: 'NeueKabel-Regular' }}>DESIGNERS</CText>
                        </View>
                        <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                            <CButton cStyle={{ flexDirection: 'row', alignItems: 'center' }}
                                // onPress={() => this.props.navigation.navigate('Seemore', { name: 'TRENDING ITEMS' })}
                                onPress={() => this.props.navigation.navigate('Seemore', { name: 'DESIGNERS', type: 'Designer' })}>
                                <CText cStyle={[{ marginVertical: 8, fontSize: 13, color: '#525252', fontFamily: 'NeueKabel-Regular' }]}>See more</CText>
                                <Image source={require('../images/see-more-icon.png')} style={[{ marginTop: 2, marginLeft: 3, width: 10, height: 8.5, resizeMode: 'contain' }]} />
                            </CButton>
                        </View>
                    </View>


                    <View style={{ height: 270, marginHorizontal: 10, marginTop: 0, backgroundColor: '#fff' }}>
                        {this.spinnerLoad('spinnerBool3')}
                       {this.renderDesigners()}
                    </View>

                    <View style={{ backgroundColor: '#fff', marginTop: 10, marginHorizontal: 10,}}>
                        <View style={styles.Colortabbar}>
                            <View>
                                <CText cStyle={{ fontSize: 13, color: '#141414', fontFamily: 'NeueKabel-Regular' }}>TAILORS</CText>
                            </View>
                            <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                                <CButton cStyle={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Seemore', { name: 'TAILORS', type: 'Tailor' })}>
                                    <CText cStyle={{ fontSize: 13, color: '#525252', fontFamily: 'NeueKabel-Regular' }}> See more  </CText>
                                    <Image source={require('../images/see-more-icon.png')} style={{ width: 10, height: 8.5, resizeMode: 'contain' }} />
                                </CButton>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 270, marginHorizontal: 10, marginTop: 0, backgroundColor: '#fff' }}>
                        {this.spinnerLoad('spinnerBool4')}
                        {this.renderTailors()}
                    </View>
                    <View>
                        <Labelmenu field={'INDEPENDENT SELLERS '} onPress={() => this.props.navigation.navigate('Seemore', { name: 'INDEPENDENT SELLERS', type: 'Independent Seller' })} />
                    </View>

                    <View style={{ flex: 1, paddingLeft: 10, height: 225, }}>
                        {this.spinnerLoad('spinnerBool5')}
                        <FlatList horizontal={true}
                            data={this.state.IndependentSellerdtails}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index}
                            //renderItem={this.itemRender}
                            renderItem={({ item }) => this.renderIndependentseller(item)}
                            extraData={this.state.selectedButton}
                        />
                    </View>
                    <View style={[styles.tabbar, { marginHorizontal: 10 }]}>
                        <Text style={{ marginLeft: 10, marginVertical: 8, fontSize: 13, color: '#141414', fontFamily: 'NeueKabel-Regular' }}>COLLECTIONS</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#fff', marginHorizontal: 10 }}>
                        <ScrollView horizontal={true} style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', margin: 5 }}>
                                <TouchableOpacity activeOpacity={0.3} style={[styles.imgstyle2, styles.m7]}
                                    onPress={() => this.props.navigation.navigate('Collectionsdata', { typedata: 'Wedding' })}
                                >
                                    <Image source={require('../images/Collection_Wedding.png')} style={styles.Collectionimg} />

                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.3} style={[styles.imgstyle2, styles.m7]}
                                    onPress={() => this.props.navigation.navigate('Collectionsdata', { typedata: 'Travel' })}
                                >
                                    <Image source={require('../images/Collection_Travel.png')} style={styles.Collectionimg} />

                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.3} style={[styles.imgstyle2, styles.m7]}
                                    onPress={() => this.props.navigation.navigate('Collectionsdata', { typedata: 'Couple' })}

                                >
                                    <Image source={require('../images/Collection_Couple.png')} style={styles.Collectionimg} />

                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.3} style={[styles.imgstyle2, styles.m7]}
                                    onPress={() => this.props.navigation.navigate('Collectionsdata', { typedata: 'Same-Same' })}>
                                    <Image source={require('../images/samesame.png')} style={styles.Collectionimg} />

                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.3} style={[styles.imgstyle2, styles.m7]}
                                    onPress={() => this.props.navigation.navigate('Collectionsdata', { typedata: 'Formal' })}
                                >
                                    <Image source={require('../images/formal.png')} style={styles.Collectionimg} />

                                </TouchableOpacity>



                                <TouchableOpacity activeOpacity={0.3} style={[styles.imgstyle2, styles.m7]}
                                    onPress={() => this.props.navigation.navigate('Collectionsdata', { typedata: 'Sporty' })}
                                >
                                    <Image source={require('../images/sporty.png')} style={styles.Collectionimg} />

                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.3} style={[styles.imgstyle2, styles.m7]}
                                    onPress={() => this.props.navigation.navigate('Collectionsdata', { typedata: 'Funky' })}
                                >
                                    <Image source={require('../images/funkey.png')} style={styles.Collectionimg} />

                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.3} style={[styles.imgstyle2, styles.m7]}
                                    onPress={() => this.props.navigation.navigate('Collectionsdata', { typedata: 'Party' })}
                                >
                                    <Image source={require('../images/party.png')} style={styles.Collectionimg} />

                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    </View>

                    <View style={{ backgroundColor: '#fff', marginTop: 10, marginHorizontal: 10 }}>
                        <View style={[styles.Colortabbar,{marginTop:10}]}>
                            <View>
                                <CText cStyle={{ fontSize: 13, color: '#141414', fontFamily: 'NeueKabel-Regular' }}>CUSTOMERS ON OUR MEDIA PAGE</CText>
                            </View>
                            <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                                <CButton cStyle={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => this.props.navigation.navigate('Media')}>
                                    <CText cStyle={{ fontSize: 13, color: '#525252', fontFamily: 'NeueKabel-Regular' }}> See more  </CText>
                                    <Image source={require('../images/see-more-icon.png')} style={{ width: 10, height: 8.5, resizeMode: 'contain' }} />
                                </CButton>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 250, marginTop: 0, marginHorizontal: 10, backgroundColor: '#fff' }}>
                        {this.spinnerLoad('spinnerBool4')}
                        
                        <FlatList horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.toppost}
                            keyExtractor={(item, index) => index}
                            //renderItem={this.itemRender}
                            renderItem={({ item }) => this.rendertopposts(item)}
                            // extraData={this.state.selectedButton}
                        />
                    </View>

                    <View style={{ justifyContent: 'center', marginTop: 15 }}>
                        <Image source={require('../images/Homeline.png')} style={{ height: 2, width: 49, alignSelf: 'center' }} />

                        <View style={{ marginTop: 5 }}>
                            <Text style={{ color: '#696969', alignSelf: 'center', fontFamily: 'NeueKabel-Regular', fontSize: 13 }}>Style is a way to say who you are</Text>
                            <Text style={{ color: '#696969', alignSelf: 'center', fontFamily: 'NeueKabel-Regular', fontSize: 13 }}>without having to speak.</Text>
                        </View>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={{ color: '#bebebe', alignSelf: 'center', fontFamily: 'NeueKabel-Regular', fontSize: 13 }}>Rachel zoe</Text>
                    </View>

                </ScrollView>
            </View>

        );
    }
}

