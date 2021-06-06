import React, { Component } from 'react';
import { View, Image, TouchableOpacity, ViewPagerAndroid, Text, TextInput, Animated, Easing, Dimensions} from 'react-native';
import { CText, CInput, CButton, } from '../common/index';
import styles from '../common/styles';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

export default class FashionpecksLogInnerPage extends Component {

  state = { gestureName:'none', topArrowMove:new Animated.Value(5), topArrowFade:new Animated.Value(1),
    bottomArrowMove:new Animated.Value(10), bottomArrowFade:new Animated.Value(1)
  }

  onSwipeLeft(gestureState) {
    this.props.navigation.navigate('Media');
  }

  onSwipeRight(gestureState) {
    this.props.navigation.navigate('Home');
  }

  componentDidMount(){
    this.runTopArrowAnimation();
    this.runBottomArrowAnimation();
  }

  runTopArrowAnimation(){
    setTimeout(() => {
      Animated.parallel([
        Animated.timing( this.state.topArrowMove, { toValue: 30, duration: 500, easing: Easing.bezier(0,1,1,1) }).start(),
        Animated.timing( this.state.topArrowFade, { toValue: 0, duration: 500, easing: Easing.bezier(0,1,1,1) }).start()
      ]);
      setTimeout(() => {
        Animated.parallel([
          Animated.timing( this.state.topArrowMove, { toValue: 5, duration: 10, easing: Easing.bezier(0,1,1,1) }).start(),
          Animated.timing( this.state.topArrowFade, { toValue: 1, duration: 10, easing: Easing.bezier(0,1,1,1) }).start()
        ]);
        this.runTopArrowAnimation();
      },500);
    }, 1000);
  }

  runBottomArrowAnimation(){
    setTimeout(() => {
      Animated.parallel([
        Animated.timing( this.state.bottomArrowMove, { toValue: -20, duration: 1000, easing: Easing.bezier(0,1,1,1) }).start(),
        Animated.timing( this.state.bottomArrowFade, { toValue: 0, duration: 1000, easing: Easing.bezier(0,1,1,1) }).start()
      ]);
      setTimeout(() => {
        Animated.parallel([
          Animated.timing( this.state.bottomArrowMove, { toValue: 10, duration: 10, easing: Easing.bezier(0,1,1,1) }).start(),
          Animated.timing( this.state.bottomArrowFade, { toValue: 1, duration: 10, easing: Easing.bezier(0,1,1,1) }).start()
        ]);
        this.runBottomArrowAnimation();
      },500);
    }, 1000);
  }


  render() {

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    
    return (
      <GestureRecognizer onSwipeLeft={(state) => this.onSwipeLeft(state)} 
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config} style={{ flex: 1 }}>
        <View style={{flex:1}}>
          {/* <ViewPagerAndroid style={{flex:1}} peekEnabled={true} removeClippedSubviews={false} initialPage={0}></ViewPagerAndroid>  */}
          <Image style={{flex:1, width: undefined, height: undefined}} source={require('../images/FashionpecksLogInnerPageMain.png')} resizeMode='stretch' />
          <View style={{ position: 'absolute', marginLeft: 25 }}>
            <CText cStyle={{ color: '#fff', fontSize: 35, fontFamily: 'NeueKabel-Regular' }}>FIND FOR</CText>
            <CText cStyle={{ color: '#fff', fontSize: 35, fontFamily: 'NeueKabel-Regular' }}>FASHION</CText>
            <CText cStyle={{ color: '#fff', fontSize: 35, fontFamily: 'NeueKabel-Regular' }}>AROUND</CText>
            <View style={{ flexDirection: 'row', alignItems:'center' }}>
              <CText cStyle={{ color: '#fff', fontSize: 35, fontFamily: 'NeueKabel-Regular' }}>YOU</CText>
              <Animated.Image source={require('../images/rightSideArrow.png')} 
                style={{ width: 20, height:20, resizeMode:'contain', marginLeft:this.state.topArrowMove, opacity:this.state.topArrowFade }} />
            </View>
          </View>

          <View style={{position: 'absolute', justifyContent: 'center', height: '35%', bottom: 0, left:20, right:20 }}>
            <CText cStyle={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontFamily: 'NeueKabel-Light', marginTop: 40 }}>SHARE YOUR PRODUCTS </CText>
            <CText cStyle={{ alignSelf: 'center', color: '#fff', fontSize: 16, fontFamily: 'NeueKabel-Light' }}>WITH FASHIONPECKS </CText>
            <View style={{ marginTop: 13}}>
              <TouchableOpacity style={{ alignSelf: 'center',}} onPress={()=>this.props.navigation.navigate('Media')}>
                <View style={{ flexDirection: 'row', backgroundColor:'#dd1838', paddingVertical:3, paddingHorizontal:10, alignItems:'center', borderRadius:4 }}>
                  <Animated.Image source={require('../images/SideArrow.png')} 
                    style={{width:18, height:18, resizeMode:'contain', position:'absolute', top:'33%', left:this.state.bottomArrowMove, opacity:this.state.bottomArrowFade}} />
                  <CText cStyle={{ color: '#fff', marginHorizontal: 5, marginVertical: 8, paddingLeft:20, fontFamily: 'NeueKabel-Regular' }}>SOCIAL MEDIA</CText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ position: 'absolute', bottom: (Dimensions.get('window').height/100)*25.5, alignSelf: 'center' }}>
            <Image style={{width:70, height:70, resizeMode:'contain'}} source={require('../images/FashionpecksLogInnerPageLog.png')} />
          </View>
        </View>
      </GestureRecognizer>
    );
  }
}
// const styles = {
//   socialmediaButn: {
//     backgroundColor: '#dd1838'
//   },
// }