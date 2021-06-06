import React, { Component } from 'react';
import { View, Image, Text, Picker, Alert, TouchableOpacity, FlatList, map, TextInput, ScrollView, AsyncStorage, Dimensions, TouchableHighlight } from 'react-native';
import styles from '../common/styles';
import { CText, CButton, CPicker, CInput, CSpinner,CModal } from '../common/index';
import Utils from '../common/Utils';
import Config from '../config/Config';
import RazorpayCheckout from 'react-native-razorpay';

export default class Bag extends Component {

	state = {spinnerBool:false, cartData:[],placeolderprize:'', totalproducts: [],qtyid:'', token: '', BagCount:0,
	 mergearray:[],quantityselect:'',Cvisible:false,alertContent:'',temparrr:[],RemoveVisible:'none',Cmodalname:'Alert'
	 ,buttonText:'Ok' 
	};

	componentWillMount() {
		this.removeproid=null;
		this.removeorosize='';
		const self = this;
		Utils.getToken('user', function (tResp, tStat) {
			// console.log("tttttttttttttttt", tStat);
			if (tStat && tResp != "") {
				self.setState({ token: tResp.token }, () => { self.getMyCartDetails();  });
			} else {
				self.getCartCountBag();
			}
		});
	}

	spinnerLoad() {
		if (this.state.spinnerBool)
			return <CSpinner />;
		return false;
	}

	getMyCartDetails() {
		const self = this;
		self.setState({ spinnerBool: true });
		Utils.dbCall(Config.routes.getMyCartDetails, 'POST', { token: self.state.token },{ type: 'group' }, function (resp) {
			self.setState({ spinnerBool: false });
			if (resp.status) {
				// console.log('==>' + resp);
				// did not understand why to bind user: resp.details[0][0].availableQuantity
				let countbag = 0;
				for(let i = 0; i < resp.details.length; i++){
					for(let j = 0; j < resp.details[i].length; j++){
						resp.details[i][j].qtyPicker = '';
						countbag = countbag + 1;
					}
				}
				for(let k = 0; k < resp.prices.length; k++){
					resp.prices[k].cTotalShopPrice = resp.prices[k].totalPriceThisShop;
				}
				self.setState({ cartData:resp, BagCount: countbag });
				Utils.setBagCount('CartCount', countbag, function (tResp, tStat) {
					if (tStat) {
						// console.log(tResp);
					}
				});
				// console.log(resp);
			}
		});
	}

	getCartCountBag() {
		const self = this;
		var shoparr1 = {};
		Utils.getCart('carty', function (tResp, tStat) {
			if (tStat) {
				// console.log('===================================', tResp);
				if (tResp === "[]") {
					const prodcarts = {};
						var details = [];
						// details.push('');
						prodcarts.details = details;						
					self.setState({ productdetls: prodcarts, BagCount: 0  }, () => { console.log("riyazsjkc", self.state.productdetls) });
				} else {
					if (tResp != '') {
						var testarr = [];
						var shoparr = [];
						var GetJsonArr = JSON.parse(tResp);
						self.setState({ totalproducts: GetJsonArr, BagCount: GetJsonArr.length }, () => { console.log('totalproducts length*****', self.state.totalproducts) });
						for (let i = 0; i < GetJsonArr.length; i++) {
							const element = GetJsonArr[i];
							testarr.push(element.vendorId.shopName);
						}
						for (let j = 0; j < testarr.length; j++) {
							if (shoparr.indexOf(testarr[j]) == -1) {
								shoparr.push(testarr[j]);
							}
						}
						for (let k = 0; k < shoparr.length; k++) {
							shoparr[k] = { shopname: shoparr[k], product: [] };
						}
						const prodcarts = {};
						var details = [];
						for (let j = 0; j < shoparr.length; j++) {
							var shopname = shoparr[j].shopname;
							var shopproducts = [];
							for (let index = 0; index < GetJsonArr.length; index++) {
								const element = GetJsonArr[index];
								const prodsize = GetJsonArr[index].size;
								// console.log('element.size ====', prodsize);

								if (shopname === element.vendorId.shopName) {
									// console.log('prodsize', prodsize, 'element.size', element.size)
									element.shopName = shopname;
									element.prodName = element.name;

									shoparr[j].product.push(element);
								}
							}
							details.push(shoparr[j].product);
							prodcarts.details = details;
							self.setState({ productdetls: prodcarts }, () => { console.warn("riyazsjkc", self.state.productdetls) });
						}
						// console.log('testarr-------', testarr)
						// console.log('shopNames*******', shoparr);
						var apiarr = [];
						for (let index = 0; index < shoparr.length; index++) {
							for (let i = 0; i < shoparr[index].product.length; i++) {
								apiarr.push({ id: shoparr[index].product[i]._id, size: shoparr[index].product[i].size, quantity: shoparr[index].product[i].quantity });
								// console.log('shopName:', shoparr[index].product[i].shopName, 'productID:', shoparr[index].product[i]._id,
								// 	'productName:', shoparr[index].product[i].name,
								// 	'size:', shoparr[index].product[i].size,
								// 	'quantity:', shoparr[index].product[i].quantity);

							}
						}
						self.setState({ mergearray: apiarr }, () => { console.log('mergearray', self.state.mergearray) });
					}
				}
			}
		});
	}

	renderamount(price,id){
		let selectedpickerif =  this.state.qtyid;
			if(this.state.quantityselect){
				if(selectedpickerif == id){
					let x= this.state.quantityselect;
					let y= price;
					let out =x * y;
					// console.log('out',out,'id',id, ' x:y ' + x, y);
					return(
						<CText cStyle={[styles.FntS10, { color: '#4f4f4f',marginRight:10}]}>₹{out}</CText>				
					);
				
				}else{
					return(<CText cStyle={[styles.FntS10, { color: '#4f4f4f',marginRight:10}]}>₹{price}</CText>);
				}
			}else{
				return(<CText cStyle={[styles.FntS10, { color: '#4f4f4f',marginRight:10}]}>₹{price}</CText>);
			}
		
	}
	
	bindProductDetails(){
       if(this.state.token !== '' && this.state.token !== undefined ){
		if(this.state.cartData.details){	
            let contentoffline = [];
			let prodDetailsData = this.state.cartData.details;
			let prodprizesdata = this.state.cartData.prices;
            for(let i = 0; i < prodDetailsData.length; i++){
				contentoffline.push(<View key={i} style={{ margin: 5, borderWidth: 0.4,backgroundColor:'#fff',borderColor:'#bfbfbf' }}>
				<CButton cStyle={{backgroundColor:'#fff'}} onPress={() =>this.props.navigation.navigate('ShopLog',{singleshop:prodDetailsData[i][0].vendorId})}>
					<View style={[styles.row, styles.m10]}>
						<Image resizeMode='contain' source={{ uri: Config.routes.base + Config.routes.getvendorImage + prodDetailsData[i][0].vendorId._id }} style={{ width: 55, height: 35 }} />
						<CText cStyle={[styles.BagProduct, styles.m5, { color: '#797979',marginLeft:10 }]}>{prodDetailsData[i][0].shopName.toUpperCase()}</CText>
					</View>
				</CButton> 
					<View>
						{this.bindInnerProductDetails(prodDetailsData[i], prodprizesdata[i].totalPriceThisShop, i)}
						{/* did not understand why two parameters are sent here prodprizesdata[i], it is not being used */}
					</View>
					<View style={[styles.jspacebn, styles.row, styles.m5]}>
						<CText cStyle={[styles.BagTlPrices, { color: '#4f4f4f',marginLeft:10,fontFamily:'NeueKabel-Book' }]}>TOTAL AMOUNT</CText>
						{/* {this.renderamount(prodprizesdata[i].totalPriceThisShop,prodDetailsData[i][0].prodId)} */}
						<CText>{prodprizesdata[i].cTotalShopPrice}</CText>
					</View>
					
					<View style={styles.BagOrder}>
						<TouchableOpacity onPress={() =>this.props.navigation.navigate('Paydetail',{totalp:prodprizesdata[i].cTotalShopPrice,details:prodDetailsData[i][0]})}>
							<CText cStyle={[styles.aslCenter, styles.cFFF, styles.m10,{fontFamily:'NeueKabel-Regular'}]}>PLACE ORDER</CText>
						</TouchableOpacity>
					</View>
				</View>);
            }
            return contentoffline;
        } else {
            return;
        }
	   }else{
		Utils.getCart('carty', function (tResp, tStat) {
			if(tResp!=''){
			var GetJsonArr=JSON.parse(tResp)
			// console.log(GetJsonArr.length)
	}	})
		if(this.state.productdetls   ){
            let content = [];
			let prodDetailsData = this.state.productdetls.details;
			// console.log(this.state.productdetls.details.length,'productdetls');
			for (let i = 0; i < prodDetailsData.length; i++) {
				content.push(<View key={i} style={{ margin: 5, borderWidth: 0.4,backgroundColor:'#fff',borderColor:'#bfbfbf' }}>
				<CButton cStyle={{backgroundColor:'#fff'}} onPress={() =>this.props.navigation.navigate('ShopLog',{singleshop:prodDetailsData[i][0].vendorId})}>
					<View style={[styles.row, styles.m10]}>
						<Image resizeMode='contain' source={{ uri: Config.routes.base + Config.routes.getvendorImage + prodDetailsData[i][0].vendorId._id }} style={{ width: 55, height: 35 }} />
						<CText cStyle={[styles.BagProduct, styles.m5, { color: '#797979',marginLeft:10 }]}>{prodDetailsData[i][0].shopName.toUpperCase()}</CText>
					</View>
				</CButton> 
					<View>
						{this.bindInnerProductDetailsoffline(prodDetailsData[i])}
						{/* did not understand why two parameters are sent here prodprizesdata[i], it is not being used */}
					</View>
					<View style={[styles.jspacebn, styles.row, styles.m5]}>
						<CText cStyle={[styles.BagTlPrices, { color: '#4f4f4f',marginLeft:10,fontFamily:'NeueKabel-Book' }]}>TOTAL AMOUNT</CText>
						{/* {this.renderamount(prodprizesdata[i].totalPriceThisShop,prodDetailsData[i][0].prodId)} */}
						{/* <CText>{prodprizesdata[i].cTotalShopPrice}</CText> */}
					</View>
					
					<View style={styles.BagOrder}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}  >
							<CText cStyle={[styles.aslCenter, styles.cFFF, styles.m10,{fontFamily:'NeueKabel-Regular'}]}>PLACE ORDER</CText>
						</TouchableOpacity>
					</View>
				</View>);
			}
			return content;
		
	}else {
		console.log('data');
	}
	 }
	}
	bindInnerProductDetailsoffline(subData){
		let subContentoffline = [];
			for(let j = 0; j < subData.length; j++){
				var listPicker = subData[j];
				// console.warn(subData[j]._id,'subData[j]._id',subData[j])
				subContentoffline.push(
					<View key={j} style={{  backgroundColor: '#FFF'}}>
						<View style={[styles.row, styles.jspacebn,{borderBottomWidth:0.5,borderTopWidth:0,marginHorizontal:5,borderColor:'#bfbfbf'}]}>
							<View style={{ flexDirection: 'row',marginBottom:15 }}>
							<CButton cStyle={styles.Likeimgstyle2} onPress={() => this.props.navigation.navigate('ProductView', { 'colldata': subData[j].prodId, 'catageryId': subData[j].categoryIds })}>
								<Image resizeMode='contain' source={{ uri: Config.routes.base + Config.routes.getProductPicUser + subData[j].images[0] }} style={[styles.m5, {borderRadius:20, height: 70, width: 80 }]} />
							</CButton>
							<View style={[styles.m10,{width:Dimensions.get('window').width-220}]}>
								<Text numberOfLines={2} style={{ fontSize: 12,color:'#444444',fontFamily:'NeueKabel-Book' }}>{subData[j].prodName.substr(0, 20).toUpperCase()}</Text>
		
								<View style={{ flexDirection: 'row', marginTop: 5 }}>
									<Text style={{ marginRight: 5, fontSize: 13, textDecorationLine: 'line-through',color:'#7c7c7c'  }}>₹{subData[j].price}</Text>
									<Text style={{ marginRight: 5, fontSize: 13,fontFamily:'RupeeForadian',fontWeight:'bold',color:'#1e1e1e' }}>₹{subData[j].discountedPrice}</Text>
								</View>
								{/* <View style={[styles.row]}>
									 <CPicker cStyle={{ width: 200, marginBottom:10 }} value={subData[j].qtyPicker} onChange={(value) => this.changeQtyData(value, subData[j].prodId, totalShopPrice, productIVal, subData[j].vendorId.shopUniqueId)}>
										 {this.renderQuantity(subData[j])}
									</CPicker>
								</View> */}
							</View>
						</View>	
							<View style={[styles.m10,{marginTop:15,marginRight:10}]}>
								<View style={[styles.bWidth]}>
								<TouchableOpacity onPress={() => {
									this.setState({Cvisible:true,alertContent:'Are you sure you want to Remove the product', Cmodalname:'Remove',
									RemoveVisible:'flex',buttonText:'No'
									});
								this.removeproid=subData[j]._id  ;
								this.removeorosize=subData[j].size;
									// Alert.alert('REMOVE', 'Are you sure you want to remove the product',
									// 	[{ text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
									// 	{ text: 'YES', onPress: () => { this.RemoveCart(this.state.token === '' ? subData[j]._id : item.prodId, subData[j].size) } }]
									// )
								}} >
										<Image source={require('../images/Bag_Product_Cancel.png')} style={[styles.m8, styles.aslEnd, { height: 8.5, width: 8.5 }]} />
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>
				)
			}
			return subContentoffline;
	}
	
	bindInnerProductDetails(subData, totalShopPrice, productIVal) {
		
        let subContent = [];
        for(let j = 0; j < subData.length; j++){
			var listPicker = subData[j];
			// console.warn('subData',subData,'id',subData[j]._id);
            subContent.push(
                <View key={j} style={{  backgroundColor: '#FFF'}}>
                    <View style={[styles.row, styles.jspacebn,{borderBottomWidth:0.5,borderTopWidth:0,marginHorizontal:5,borderColor:'#bfbfbf'}]}>
						<View style={{ flexDirection: 'row',marginBottom:15 }}>
                        <CButton cStyle={styles.Likeimgstyle2} onPress={() => this.props.navigation.navigate('ProductView', { 'colldata': subData[j].prodId, 'catageryId': subData[j].categoryIds })}>
                            <Image resizeMode='contain' source={{ uri: Config.routes.base + Config.routes.getProductPicUser + subData[j].images[0] }} style={[styles.m5, {borderRadius:20, height: 70, width: 80 }]} />
                        </CButton>
                        <View style={[styles.m10,{width:Dimensions.get('window').width-220}]}>
                            <Text numberOfLines={2} style={{ fontSize: 12,color:'#444444',fontFamily:'NeueKabel-Book' }}>{subData[j].prodName.substr(0, 20).toUpperCase()}</Text>
    
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <Text style={{ marginRight: 5, fontSize: 13, textDecorationLine: 'line-through',color:'#7c7c7c'  }}>₹{subData[j].price}</Text>
                                <Text style={{ marginRight: 5, fontSize: 13,fontFamily:'RupeeForadian',fontWeight:'bold',color:'#1e1e1e' }}>₹{subData[j].discountedPrice}</Text>
                            </View>
                            <View style={[styles.row]}>
		 						<CPicker cStyle={{ width: 200, marginBottom:10 }} value={subData[j].qtyPicker} onChange={(value) => this.changeQtyData(value, subData[j].prodId, totalShopPrice, productIVal, subData[j].vendorId.shopUniqueId)}>
		 							{this.renderQuantity(subData[j])}
								</CPicker>
                            </View>
                        </View>
					</View>	
                        <View style={[styles.m10,{marginTop:15,marginRight:10}]}>
                            <View style={[styles.bWidth]}>
							<TouchableOpacity onPress={() => {
								this.setState({Cvisible:true,alertContent:'Are you sure you want to Remove the product', Cmodalname:'Remove',
								RemoveVisible:'flex',buttonText:'No'
								});
							this.removeproid=subData[j].prodId  ;
							this.removeorosize=subData[j].size;	
								// Alert.alert('REMOVE', 'Are you sure you want to remove the product',
								// 	[{ text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
								// 	{ text: 'YES', onPress: () => { this.RemoveCart(this.state.token === '' ? item._id : subData[j].prodId, subData[j].size) } }]
								// )
							}} >
                                    <Image source={require('../images/Bag_Product_Cancel.png')} style={[styles.m8, styles.aslEnd, { height: 8.5, width: 8.5 }]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        return subContent;
	}

	changeQtyData(qtySelected, productId, shopPrice, iVal, shopUniqueId){
		let tempDataStr = this.state.cartData;
		var totalPrice = 0;
		for(let i = 0; i < tempDataStr.details.length; i++){
			for(let j = 0; j < tempDataStr.details[i].length; j++){
				let tempQty = '';
				let qtyNumber = 0;
				if(tempDataStr.details[i][j].vendorId.shopUniqueId === shopUniqueId){
					if(tempDataStr.details[i][j].prodId == productId){
						tempDataStr.details[i][j].qtyPicker = qtySelected;
						tempQty = qtySelected.split('Q:').join('');
						qtyNumber += parseInt(tempQty.split('#$#')[0]);
						// above condition to change the picker value.
						totalPrice += parseInt(qtyNumber) * parseInt(tempDataStr.details[i][j].discountedPrice);
						// console.log(totalPrice, qtyNumber, tempDataStr.details[i][j].discountedPrice, ' ==> C PRice - Matched => ' + parseInt(qtyNumber) * parseInt(tempDataStr.details[i][j].discountedPrice));
					} else {
						if(tempDataStr.details[i][j].qtyPicker != ''){
							tempQty = tempDataStr.details[i][j].qtyPicker.split('Q:').join('');
							qtyNumber += parseInt(tempQty.split('#$#')[0]);
							totalPrice += parseInt(qtyNumber) * parseInt(tempDataStr.details[i][j].discountedPrice);
						} else {
							totalPrice += 1 * parseInt(tempDataStr.details[i][j].discountedPrice);
						}
						// console.log(totalPrice, qtyNumber, tempDataStr.details[i][j].discountedPrice, ' ==> C PRice - Not Matched', typeof(qtyNumber));
					}
				}
			}
			tempDataStr.prices[iVal].cTotalShopPrice = totalPrice;
		}
		this.setState({ cartData:tempDataStr });
	}
	
	renderQuantity(item) {
		let arr = [];
		if (item) {
			for (let i = 1; i <= item.availableQuantity; i++) {
				let a = "Q:" + i;
				let b = a + "#$#" + item.prodId;
				arr.push(<Picker.Item key={i} label={a} value={b} />);
			}
		}
		return (arr);
	}

	RemoveCart() {
		const self = this;
		let id = this.removeproid;
		let size = this.removeorosize;	
		// console.warn(this.removeorosize,this.removeproid)
		if (self.state.token != '') {
			Utils.dbCall(Config.routes.removeProductFromCart, 'POST', { token: self.state.token }, { id: id, size: size }, function (resp) {
				if (resp.status) {
					self.getMyCartDetails();
					var BC = self.state.BagCount - 1;
					self.setState({ BagCount: self.state.BagCount - 1,Cvisible:false,buttonText:'Ok',Cmodalname:'Alert',RemoveVisible:'none' });
					self.removeaddresid=''
					Utils.setBagCount('CartCount', BC, function (tResp, tStat) {
						if (tStat) {
							// console.log(tResp);
						}
					});
				} else {
					this.setState({Cvisible:true,alertContent:'error in Network'});
					// alert(resp.message);
				}
			});
		} else {
			Utils.getCart('carty', function (tResp, tStat) {
				if (tStat) {
					if (tResp != '') {
						var GetJsonArr = JSON.parse(tResp);
						let elementIndex = 0;
						for (let index = 0; index < GetJsonArr.length; index++) {
							const element = GetJsonArr[index];
							if (element._id === id && size === element.size) {
								// console.log(element._id, element.size);
								elementIndex = index;
								break;
							}
						}
					self.setState({Cvisible:false });
						GetJsonArr.splice(elementIndex, 1);
						// console.log('element',GetJsonArr);
						Utils.setCart('carty', JSON.stringify(GetJsonArr), function (tResp, tStat) {
							if (tStat) {
								Utils.setBagCount('CartCount', GetJsonArr.length, function (tResp, tStat) {
									if (tStat) {
										// console.log(tResp);
									}
								});
								self.getCartCountBag();
							}
						});
					}
				}
			});
		}
	}

	render(){
		return (
			<View style={{ backgroundColor: '#efefef', flex: 1 }}>
				{this.spinnerLoad()}
				<ScrollView>
					<View style={{ backgroundColor: '#1e1e1e' }}>
						<CText cStyle={styles.BagHeaderText}>SHOPPING BAG</CText>
					</View>
					<View style={{ backgroundColor: '#efefef', paddingVertical: 15,borderBottomWidth:0.5,borderColor:'#bfbfbf' }}>
						<CText cStyle={[styles.BagProduct, { color: '#1e1e1e',fontSize:13, fontFamily: 'NeueKabel-Book', }]}>Products({this.state.BagCount})</CText>
						<CText cStyle={[styles.BagProduct, { color: '#4f4f4f',fontSize:13, fontFamily: 'NeueKabel-Light', marginTop: 4 }]}>Review your items and Place Order</CText>
					</View>
					<View style={{margin:8}}>
						{this.bindProductDetails()}
					</View>
				</ScrollView>
				<CModal visible={this.state.Cvisible} 
                                    closeButton={()=>{this.setState({Cvisible:false});}} 
                                    buttonClick={()=>{this.setState({Cvisible:false});}}
                                    buttonText={this.state.buttonText}
                                    modalname={this.state.Cmodalname}
                                    buttonClickRemove={() =>  this.RemoveCart()}
                                    buttonVisible={this.state.RemoveVisible}>
                              <CText style={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                              </CModal>
			</View>
		);
	}
}