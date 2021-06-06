import { Platform, Dimensions } from 'react-native';

const { winW, winH } = Dimensions.get('window');

const Androidstyles = {
  // Login, Signup, Forgotpwd
  screenHeader: { fontSize: 20, fontWeight: 'bold' },

  TDlineth: { textDecorationLine: 'line-through' },

  cText:{ fontFamily: 'NeueKabel-Regular' },
  fontReg:{ fontFamily: 'NeueKabel-Regular' },
  fontLite:{ fontFamily: 'NeueKabel-Light' },
  fontMed:{ fontFamily: 'NeueKabel-Medium' },
  fontBook:{ fontFamily: 'NeueKabel-Book' },

  // Common usage classes
  jStart: { justifyContent: 'flex-start' },
  jCenter: { justifyContent: 'center' },
  jEnd: { justifyContent: 'flex-end' },
  jspacebn: { justifyContent: 'space-between' },
  aslStretch: { alignSelf: 'stretch' },
  aslCenter: { alignSelf: 'center' },
  aslEnd: { alignSelf: 'flex-end' },
  aslCenter: { alignSelf: 'center' },
  aitStart: { alignItems: 'flex-start' },
  aitCenter: { alignItems: 'center' },
  aitEnd: { alignItems: 'flex-end' },
  row: { flexDirection: 'column' },
  flexRow: { flexDirection: 'row'},

  //backgroundcolor
  bgefefef: { backgroundColor: '#efefef' },
  bgfff: { backgroundColor: '#fff' },
  bfc01530: { backgroundcolor: '#c01530' },
  // Margins

  mR5: { marginRight: 5 },
  mR10: { marginRight: 10 },
  mR15: { marginRight: 15 },
  mR20: { marginRight: 20 },

  mL10: { marginLeft: 10 },
  mL15: { marginLeft: 15 },
  mL5: { marginLeft: 5 },
  mT12:{marginTop:12},
  mT13:{marginTop:13},
  mT5: { marginTop: 5 },
  mT10: { marginTop: 10 },
  mT15: { marginTop: 15 },
  mT20: { marginTop: 20 },
  mT30: { marginTop: 30 },
  mT50: { marginTop: 50 },
  mT120: { marginTop: 120 },

  mB5: { marginBottom: 5 },
  mB10: { marginBottom: 10 },
  mB15: { marginBottom: 15 },
  mB20: { marginBottom: 20 },

  m13: { margin: 13 },
  m10: { margin: 10 },
  m15: { margin: 15 },
  m8:{margin:8},
  m5: { margin: 5 },
  m7: { margin: 7 },  
  m4: { margin: 4 },
  m3: { margin: 3 },
  mH5: { marginHorizontal: 5 },
  mH10: { marginHorizontal: 10 },
  mH15: { marginHorizontal: 15 },
  mH20: { marginHorizontal: 20 },
  mH40: { marginHorizontal: 40 },
  mH75: { marginHorizontal: 55 },
  mV5: { marginVertical: 5 },
  mV3: { marginVertical: 3 },
  mV10: { marginVertical: 10 },
  mV15: { marginVertical: 15 },

  p10:{padding:10},

  padHV20:{ paddingHorizontal:60 },
  padH10:{paddingHorizontal:10},
  padV5:{paddingVertical:5},

  // Text colors used
  c7c7c7c: { color: '#7c7c7c' },
  c525252: { color: '#525252' },
  cFFF: { color: '#FFF' },
  c333: { color: '#333' },
  c666: { color: '#666' },
  c000: { color: '#000' },
  c777: { color: '#777' },
  cBlue: { color: '#2B7DE1' },
  cOrg: { color: '#F89A1E' },

  // Border radius
  bNone: { borderWidth: 0 },
  bTNone: { borderTopWidth: 0 },
  bRad5: { borderRadius: 5 },
  bRad10: { borderRadius: 10 },
  bBLRad5: { borderBottomLeftRadius: 5 },
  bBRRad5: { borderBottomRightRadius: 5 },
  bTLRad5: { borderTopLeftRadius: 5 },
  bTRRad5: { borderTopRightRadius: 5 },

  //borderWidth
  bBWidth: { borderBottomWidth: 0.3 },
  bWidth: { borderWidth: 0.4 },

  brdBtmWid03:{ borderBottomWidth: 0.3 },
  brdBtmColBBB:{ borderBottomColor: '#BBB' },

  //FontSizes
  FntFaNL: { fontFamily: 'NeueKabel-Light' },

  FntS14: { fontSize: 14 },
  FntS13: { fontSize: 13 },
  FntS12: { fontSize: 12 },
  FntS11: { fontSize: 11 },
  FntS10: { fontSize: 10 },
  FntS8: { fontSize: 8 },
  // Flex
  flex1: { flex: 1 },

  //Homepage styles ===>
  searchGoWrap:{ backgroundColor: '#C01530', paddingVertical:8, paddingHorizontal:12, borderTopRightRadius:5, borderBottomRightRadius:5 },

  //Media screen styles ===>
  addPostImgWrap:{backgroundColor:'#C01530', justifyContent:'center', alignItems:'center', width: 20, height:20, borderRadius: 20, position:'absolute', top: -10, right:0},


  // Label  Component
  Labeltabbar: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  LabelText1: {
    fontSize: 13,
    fontFamily: 'NeueKabel-Regular',
    color: '#141414'
  },
  LabelText2: {
    fontSize: 13,
    fontFamily: 'NeueKabel-Regular',
    color: '#525252'
  },
  //Womensheader
  Womensheadercontaner: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
  },
  Womensheaderimages: {
    height: 94, width: 92,
  },
  WomensheaderText: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 10,
    fontFamily: 'NeueKabel-Light',
    textAlign: 'center',
    justifyContent: 'center',
  },
  //Sign up
  SignupContaner: {
    backgroundColor: '#fff',
    // justifyContent:'center',
    // alignItems:'center'
    flex: 1,
  },
  authMainView: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  SignuptextheaderName: {
    textAlign: 'center',
    fontSize: 13.3,
    color: '#323232',
  },
  SignuptextSignup: {
    color: 'white',
    margin: 10,
    textAlign: 'center'
  },
  Signuptextinput: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  SignupImage: {
    // height:(Dimensions.get('window').height),
    // width:(Dimensions.get('window').width),
    // resizeMode: 'stretch',
    flex: 1, width: undefined, height: undefined
  },
  Signupbutton: {
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: '#c81633',
    justifyContent: 'center',
    width: 246,
  },
  //Menu
  Menuheadercolor: {
    height: (Dimensions.get('window').height) - 420,
    backgroundColor: '#c01530',
    justifyContent: 'center',
  },
  Menutextname: {
    color: '#fff',
    alignItems: 'center',
    textAlign: 'center',
  },

  MenuContanersubmitButtonText: {
    textAlign: 'center',
    color: '#2b2b2b',
    fontFamily: 'NeueKabel-Regular',
    fontSize: 13,
  },

  MenuContanerfirstbutton: {
    marginTop: 15,
    marginBottom: 10,
    flexDirection: 'row',
  },
  MenuContanerimagesize: {
    marginTop: 15,
    marginLeft: 20,
  },
  //Media
  MediaHeader: {
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  MediaHeaderBtn: {
    backgroundColor: '#c01530',
    marginLeft: 13,
    borderRadius: 20
  },
  MediaHeaderText: {
    color: '#fff',
    fontFamily: 'NeueKabel-Book',
    fontSize: 15.5,
    margin: 13
  },
  MediaComments: {
    flexDirection: 'row',
    marginHorizontal: 20,
    flex: 1
  },
  MediaBtnContaner: {
    flex: 1,
    paddingVertical: 15, paddingHorizontal:5,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center'
  },
  MediaBtnAddproduct: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: '95%',
    borderRadius: 5
  },
  MediaBtnAddproductCtn: {
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    margin: 10,
    height: 200,
    borderRadius: 5
  },
  MediaBtnAddproductText: {
    alignSelf: 'center',
    color: '#979797',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10
  },

  MediaCommentsMain: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    justifyContent: 'space-between'
  },
  MediaMainImage: {
    width: (Dimensions.get('window').width) - 30,
    height: (Dimensions.get('window').height) - 360
  },
  MediaCommentsSize: {
    flexDirection: 'row',
    marginHorizontal: 7,
    flex: 1
  },
  MediaContaner: {
    margin:5,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor:'#EEE',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  MediaContanerImg: {
    justifyContent: 'space-around',
    marginRight: 5
  },
  MediaTextName: {
    color: '#1e1e1e',
    fontSize: 13,
    fontFamily: 'NeueKabel-Regular',
    alignSelf: 'center',
    flex: 1
  },
  MediaTextTime: {
    color: '#a4a4a4',
    fontSize: 13,
    fontFamily: 'NeueKabel-Regular',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginRight: 10
  },
  row: { flexDirection: 'row' },
  mTop10: { marginTop: 10 },


  //Login

  LoginContaner: {
    flex: 1,
    backgroundColor: '#fff',
  },
  LoginMainText: {
    textAlign: 'center',
    fontSize: 13.3,
    color: '#323232'
  },
  LoginforgotpassText: {
    fontSize: 10.4, color: '#c81633'
  },
  Loginsignupstyles: {
    color: 'red', fontSize: 14
  },
  Logintextinput: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  Loginbutton: {
    marginTop: 30,
    borderRadius: 5,
    backgroundColor: '#c81633',
    justifyContent: 'center',
    width: 246,
  },
  LoginBtnText: {
    color: 'white',
    textAlign: 'center',
    margin: 10,
    alignSelf: 'center'
  },
  LoginHidePass: {
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  //Like
  LikeHeader: {
    height: 48,
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  LikeHeaderText:
    {
      color: '#fff',
      alignSelf: 'center',
      fontSize: 13.5,
      marginBottom: 3
    },
  Likeconimages2: {

    paddingBottom: 6,
    paddingTop: 6,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  LikeProduct: { 
    // height:(Dimensions.get('window').height)/2,
    //width: (Dimensions.get('window').width)/2-15,
    width:180,
    height: 200, 
    resizeMode:'contain'
  },
  LikeDiscountMain: {
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
  },
  LikeDiscount: {
    backgroundColor: '#c01530',
    justifyContent: 'center',
    height: 36,
    width: 59,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  LikeDiscountSym: {
    flex: 1,
    justifyContent: 'space-around',
    right: 0,
    alignItems: 'flex-end',
    marginRight: 10
  },
  LikePricesWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10
  },
  LikeNavigationImg: {
    height: 8,
    width: 6,
    resizeMode:'contain',
    marginTop: 3,
    marginRight: 5
  },
  LikePricesText2: {
    color: '#1e1e1e',
    marginLeft: 10,
    padding: 5
  },
  LikePricesText1: {
    color: '#7c7c7c',
    textDecorationLine: 'line-through'
  },
  Likeimgstyle2: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    borderColor: '#e6e6e6',
    // borderWidth: 1,
    // borderRightWidth: 0.3,
    // borderLeftWidth: 0.3,
  },
  LikeMainProductName: {
    fontSize: 13,
    fontFamily: 'NeueKabel-Regular',
  },
  //HomeWomes
  HomeWomesHeader: {
    backgroundColor:'#1e1e1e' ,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  HomeWomesHeadershoplog: {
    position:'absolute',
    width:'100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  HomeWomensSortMain: {
    top: 180,
    backgroundColor: 'rgba(20,20,20,0.5)',
    width: '90%',
    alignSelf: 'center'
  },
  HomeWomensfilterWrap: {
    marginHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  Shoplogmodal: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  HomeWomensfilterText: {
    fontSize: 12,
    fontFamily: 'NeueKabel-Regular',
    margin: 10,
    textAlign: 'center',
  },
  HomeWomensContaner: {
    flexDirection: 'row',
    borderWidth: 0.4,
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  HomeWomensSortWrap: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10
  },
  //ForgotPassword
  ForgotpasswordContaner: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    width:'80%'
  },
  ForgotpasswordBackgd: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    
  },
  textinput: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  Forgotpasswordbutton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#c81633',
    width: 246,
  },
  Forgotpasswordsubmitbutton: {
    marginTop: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#c81633',
    width: 246,
  },
  ForgotpasswordText: {
    fontSize: 13.3,
    alignSelf: 'center',
    color: '#040404'
  },
  ForgotpasswordReset: {
    fontSize: 13.3,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  ForgotpasswordSubmit: {
    color: 'white',
    textAlign: 'center',
    margin: 10
  },
  ForgotModalWrap: {
    alignSelf: 'center',
    width: '90%',
    top: '30%',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  FilterMain: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center'
  },
  //Home
  HomeHeaderWrap: {
    backgroundColor: 'black',
    justifyContent: 'space-around',
  },
  Shopconimages: {
    
    marginBottom: 10,
    flexDirection: 'row',
  },
  CatageryImg: {
    height: 90, width: 90, resizeMode: 'contain'
  },
  Tailorconimages: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  imagestyle: {
    paddingRight: 3,
  },
  Shopimghiwi: {
    height: 155, width: 115,
    marginRight: 5,
    position: 'relative',
    resizeMode:'contain'
  },

  Collectionimg: {
    height: 106, width: 106,
    position: 'relative',
    resizeMode:'contain'
  },
  Designimg: {
    height: 190, width: 155,
    position: 'relative',
    resizeMode:'cover'
  },
  Tailorimg: {
    height: 120, width: 145,
    position: 'relative',
    resizeMode:'cover'
  },
  TailorWrap: {
    height: 45, width: 145,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginBottom:8,
  },
  TailorText: {
    fontSize: 10,
    marginLeft: 10,
    fontFamily: 'NeueKabel-Regular'
  },
  HomeTradingItemImg: {
    height: 188, width: 308,
  },
  ShopNearByimg: {
    height: 60, width: 60,
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  textstyle: {
    fontSize: 13,
    marginTop: 5,
    color:'#2b2b2b',
    fontFamily: 'NeueKabel-Regular',
    textAlign: 'center',
    justifyContent: 'center',
  },
  btntimg: {
    borderColor: '#e6e6e6',
    borderWidth: 2,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
    paddingTop: 10,
    paddingLeft: 10,
    height: 50, width: 120,
    flexDirection: 'row',
  },
  HomeTrendtextbtn: {
    fontSize: 13.5,
    fontFamily: 'NeueKabel-Regular',
    color: '#1e1e1e',
  },
  conbtn: {
    flexDirection: 'row',
    paddingTop: 5,
    backgroundColor: '#F5F5F5',
  },
  HomesymNotify: {
    backgroundColor: '#c01530',
    borderRadius: 30,
    width: 17.5,
    position: 'absolute',
    marginTop: 10,
    marginLeft: 13
  },
  HomeTrendconimages2: {
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1, borderColor: '#EEE',
    marginRight: 10
  },
  Designimgstyle2: {
    height:170,
    width:160,
    paddingLeft: 5,
    backgroundColor: '#FFF',

  },
  Tailorimgstyle2: {
    height:170,width:160,
    
    backgroundColor: '#fff',
  },
  linearGradient:{
    height:120,
    width:((Dimensions.get('window').width)/2)-15,
    bottom:0,
    position:'absolute',
  },
  linearGradientmedia:{
    height:100,
    width:233,
    bottom:0,
    position:'absolute',
  },
  linearGradientsub:{
    height:50,
    width:((Dimensions.get('window').width)/2)-35,
    bottom:0,
    position:'absolute',
  },
  tabbar: {
    paddingTop: 8,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10
  },
  Colortabbar: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingLeft: 10,
    flexDirection: 'row',
  },
  CollectionMainWrap: {
    position: 'absolute',
    alignSelf: 'center',
    top: 40
  },
  CollectionTextWrap: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: 21,
    width: 73,
    borderRadius: 20,
    justifyContent: 'center'
  },
  SellerMainWrap: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
  },
  SellerTextWrap: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    height: 40,
    width: 163,
  },
  SellerText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 10,
    fontFamily: 'NeueKabel-Regular'
  },
  DesignMainWrap: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    marginLeft: 5
  },
  DesignWrap: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    height: 29,
    width: 155,
  },
  DesignText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft:5,
    fontFamily: 'NeueKabel-Regular',
    alignSelf: 'center',
  },
  ShopLocation: {
    backgroundColor: '#fff',
    width: 125,
    height: 155,
    justifyContent: 'center'
  },
  ShopText: {
    color: '#141414',
    fontSize: 10,
    fontFamily: 'NeueKabel-Regular',
    alignSelf: 'center'
  },
  ShopNavignImg: {
    height: 9.3,
    width: 7.7,
    marginTop: 3,
    marginRight: 5,
    resizeMode:'contain'
  },
  HomeTrendDiscountWrap: {
    position: 'absolute',
    left: 0,
    top: 15,
    backgroundColor: '#c01530',
    justifyContent: 'center',
    height: 36,
    width: 58,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  HomeTrendSymWrap: {
    position: 'absolute',
    right: 10,
    top: 15,
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 15
  },
  // HomeTrendMainWrap:{
  //   position:'absolute',
  //   left:0,
  //   top:15,
  //   flexDirection:'row',
  // },
  // HomeTrendMainWrap2:{
  //   justifyContent:'space-around',
  //   position:'absolute',
  //   bottom:0,
  //   marginBottom:10,
  //   flexDirection:'row'
  // },
  HomeTrendText: {
    fontSize: 11.5,
    color: '#1e1e1e',
    fontFamily: 'NeueKabel-Light',
    marginLeft: 10
  },
  homeTrendingDescription: {
    position: 'absolute',
    bottom: 10,
    left: 0,
  },
  HomeTrendPrice: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flex: 1,
    flexDirection: 'row',
  },
  HomeTrendPriceText1: {
    textDecorationLine: 'line-through',
    color: '#7c7c7c',
    padding: 3
  },

  HomeTrendPriceText2: {
    color: 'black',
    marginLeft: 10,
    padding: 3
  },
  //Bag
  BagHeaderText: {
    fontSize: 14,
    fontFamily:'NeueKabel-Book',
    color: '#fff',
    margin: 20,
    alignSelf: 'center'
  },
  Bagproductdata:{
    width:75,
    height: 80, 
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    // borderColor: '#e6e6e6',
    // borderWidth: 1,
    // borderRightWidth: 0.3,
    // borderLeftWidth: 0.3,
  },
  BagProduct: {
    fontSize: 14,
    alignSelf: 'center'
  },
  BagproductContent: {
    borderWidth: 0.5,
    alignSelf: 'center',
    width: '95%'
  },
  BagOrder: {
    backgroundColor: '#c01530',
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 5
  },
  BagTlPrices: {
    color: '#bcbcbc',
    fontSize: 12
  },
  categoryHeader: {
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  categorymodel: {
    justifyContent: 'center',
    borderWidth: 0.5,
    borderRadius: 20,
    margin: 5
  },
  ShopLogDirection: {
    backgroundColor: '#2b2b2b',
    margin: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center'
  },
  ShopLogText: {
    alignSelf: 'center',
    marginBottom: 5,
    marginTop: 10,
    fontSize: 13,
    color: '#141414'
  },
  wishImageStyle: {
    padding: 5,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1
  },
  myprofileEmialid: {
    width: '80%'
  },
  searchText:{
    paddingVertical:5,
    paddingHorizontal:10,
    borderBottomWidth: 0.4,
    borderBottomColor: '#BBB'
  },

  //MY ORDERS
  myOrdHeader: { flexDirection:'row', justifyContent: 'space-around', padding: 15, marginBottom: 3 },
  profileImg: { height: 75, borderRadius: 120, width: 75, alignSelf: 'center', resizeMode: 'contain' },

  // Social media styles
  sMediaIcons18:{width:18, height:18, resizeMode:'contain'},
  sMediaIcons15:{width:15, height:15, resizeMode:'contain'},
  sMediaIcons30:{width:45, height:45, resizeMode:'contain', borderRadius:90},
  sMediaMainCommentText:{width:'80%',paddingLeft:10, height:40, borderWidth:0.4, borderColor:'#b4b4b4', marginLeft:5, borderRightWidth:0},
  sMediaMainCommentBtn: { backgroundColor: '#fff', borderTopRightRadius: 5, borderBottomRightRadius: 5, padding: 4.5 },
  smediaFollowBtn: { backgroundColor:'#C01530', paddingHorizontal:10, paddingVertical:4, borderRadius: 4 },
  sMediaPostContainer: {margin:10, borderWidth:1, borderColor:'#b4b4b4', borderRadius:4},
  sMediaCommentBtns: { backgroundColor: '#c01530', marginLeft: 10, borderRadius: 5 },
  sMediaAddPostBtn: { position: 'absolute', alignSelf: 'flex-end', backgroundColor: 'crimson', width: 60, height: 60, borderRadius: 60/2 },

};
const Iosstyles = {
  mainLayout: {
    flex: 1,
    backgroundColor: '#FFF'
  }
};
const style = Platform.OS === 'ios' ? Iosstyles : Androidstyles;

export default style;