import React, { Component } from 'react';
import { View, Image, Text, Picker, TouchableOpacity,Alert, FlatList, TextInput, ScrollView, AsyncStorage } from 'react-native';
import styles from '../common/styles';
import { CText, CButton, CPicker, CInput, CSpinner,CModal } from '../common/index';

import Utils from '../common/Utils';
import Config from '../config/Config';

export default class MyOrders extends Component {
	state = { token: '',Cvisible:false,alertContent:'',RemoveVisible:'none',Cmodalname:'Alert'
	,buttonText:'Ok' };

	componentWillMount() {
		const self = this;
		self.removeorderdata='';
		Utils.getToken('user', function (tResp, tStat) {
			// console.warn("tttttttttttttttt", tStat);
			if (tStat && tResp != "") {
				self.setState({orderData:self.props.navigation.state.params.ordertrans,token: tResp.token},()=>{
					});
			} else {
				//   alert("Please Login");
				// self.props.navigation.navigate('Login');
			}
		});
	}

	spinnerLoad() {
		if (this.state.spinnerBool) {
			return <CSpinner />;
		} else {
			return false;
		}
	}
	checkOrderStatus(cancelstatus){
			console.log(cancelstatus,'checkOrderStatus')
			if(cancelstatus.orderStatus == "placed"){
				return(
				<View style={{ borderWidth: 0.4, borderColor: '#a3a3a3', justifyContent: 'flex-end' }}>
					<CText cStyle={[styles.mH5, styles.mV3, { fontSize: 9, color: '#313131' }]} >CANCEL
				</CText></View>
					);
			}else{

			}
	}

	innerOrderDetails(item, itemStat) {
		let innerData = item.orders;
		let content = [];
		if (innerData.length > 0) {
			for (let i = 0; i < innerData.length; i++) {
				let brdBtmWidth = 0.3;
				if (i === innerData.length - 1) {
					brdBtmWidth = 0;
				}
				content.push((<View key={i} style={[styles.row, styles.brdBtmWid03, styles.brdBtmColBBB]}>
					<CButton cStyle={[styles.m5, { height: 80, width: 90 }]}
					//onPress={() => this.props.navigation.navigate('ProductView', { 'totalpodt': item.prodId, 'categaryid': item.categoryIds })}
					>
						<Image resizeMode='contain' source={{ uri: Config.routes.base + Config.routes.getProductPicUser + innerData[i].images[0] }} style={[styles.m5, { height: 80, width: 90 }]} />
					</CButton>
					<View style={[styles.m10, { flex: 1, flexWrap: "wrap" }]}>
						<CText num={2} cStyle={[styles.fontBook, styles.FntS14, { color: '#444' }]}>{innerData[i].productName.substr(0, 45)}</CText>
						<CText cStyle={{ fontSize: 12, marginTop: 3 }}>Sold by {innerData[i].vendorId.shopName}</CText>
						<View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 3 }}>
							<CText cStyle={{ color: '#1e1e1e' }}>Q: {innerData[i].quantity}</CText>
							<CText cStyle={[styles.FntS13, styles.mL15, styles.mR5, { color: '#7c7c7c', textDecorationLine: 'line-through' }]}>₹{innerData[i].price}</CText>
							<CText cStyle={[styles.FntS13, styles.mL5, { fontWeight: 'bold', color: '#1e1e1e' }]}>₹{innerData[i].discountedPrice}</CText>
						</View>
						<View style={[styles.row, styles.jspacebn]}>
							<View>
								<CText>Status: <CText cStyle={[styles.FntS13, { color: '#c01530' }]}>{itemStat}</CText></CText>
							</View>
							<TouchableOpacity onPress={() => {
								this.setState({Cvisible:true,alertContent:'Are you sure you want to Remove the order', Cmodalname:'Remove',
								RemoveVisible:'flex',buttonText:'No'
								});
								this.removeorderdata=innerData[i] 
								// Alert.alert('REMOVE', 'Are you sure you want to remove the product',
								// 	[{ text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
								// 	{ text: 'YES', onPress: () => { this.RemoveorderCart(innerData[i]) } }]
								// )
							}}>
								{this.checkOrderStatus(innerData[i])}
							</TouchableOpacity>
						</View>
					</View>
				</View>))
			}
			return content;
		}
		return;
	}

	bindOrderDetails(item) {
		// console.log(item,'myorderd');
		return (<View style={[styles.mH10, styles.mT10, styles.bgfff]}>
			<View style={[styles.myOrdHeader, styles.brdBtmWid03, styles.brdBtmColBBB]}>
				<CText cStyle={{ fontSize: 12, color: '#141414' }} >Order id: <CText cStyle={{ color: '#c01530', fontWeight: 'bold' }}>{item._id}</CText></CText>
				<CText cStyle={{ fontSize: 12, marginLeft: 30, color: '#141414' }} >Order placed {this.convertDateFormat(item.createdAt)}</CText>
			</View>
			{this.innerOrderDetails(item, item.status)}
		</View>);
	}

	convertDateFormat(date) {
		var dt = date.split('T')[0];
		var d = new Date(dt.split('-')[1] + '/' + dt.split('-')[2] + '/' + dt.split('-')[0]);
		var daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return daysArr[d.getDay()] + ' ' + d.getDate() + ', ' + d.getFullYear();
	}

	RemoveorderCart() {
		let order = this.removeorderdata;
		console.warn(order);
		const self = this;
		self.setState({Cvisible:false,buttonText:'Ok',Cmodalname:'Alert',RemoveVisible:'none'});
		console.log(order,'order')
		// Utils.dbCall(Config.routes.cancelOrder, 'POST', { token: self.state.token },
		// 	{
		// 		orderId: order._id,
		// 		productId: order.productId,
		// 		quantity: order.quantity,
		// 		shop: order.vendorId.shopName,
		// 		size: order.size
		// 	}, function (resp) {
		// 		if (resp.status) {
		// 			alert(resp.message);
		// 			// self.setState({Cvisible:true,alertContent:resp.message});
		// 		} else {
		// 			console.log('error in Men ==>', resp);
		// 		}
		// 	});
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.spinnerLoad()}
					<View style={{ backgroundColor: '#c01530', flexDirection: 'row', alignItems: 'center' }}>
						<View style={{/* height:50 */ }} >
							<TouchableOpacity onPress={() => this.props.navigation.goBack()} >
								<View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
									<Image style={{ height: 20, width: 15, resizeMode: 'contain' }} source={require('../images/leftarrow.png')} />
								</View>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1, justifyContent: 'center' }} >
							<CText cStyle={{ color: '#ffffff', fontFamily: 'NeueKabel-Book', fontSize: 16, marginLeft: 20, margin: 13 }}>MY ORDERS</CText>
						</View>
					</View>
				<ScrollView>
					
					<FlatList
						data={this.state.orderData}
						keyExtractor={(item, index) => index}
						//renderItem={this.itemRender}
						renderItem={({ item }) => this.bindOrderDetails(item)}
					//extraData={this.state.MfiltersData}
					/>


				</ScrollView>
				<CModal visible={this.state.Cvisible} 
                          closeButton={()=>{this.setState({Cvisible:false});}} 
                          buttonClick={()=>{this.setState({Cvisible:false});}} 
                          buttonText={this.state.buttonText}
						  modalname={this.state.Cmodalname}
						  buttonClickRemove={() => this.RemoveorderCart()}
                          buttonVisible={this.state.RemoveVisible}>
                  <CText cStyle={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                  </CModal>
			</View>
		);
	}
}