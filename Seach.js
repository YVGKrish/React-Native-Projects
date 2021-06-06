import React,{Component} from 'react';
import {
  View,TextInput,Image,Text, TouchableOpacity, TabBarIOS
} from 'react-native';
import styles from '../common/styles';
import {CText, CButton, CPicker, CInput} from '../common/index';

export default class App extends Component{
  render(){
    return(
    <View style={{flex:1}}>            
        <View style={styles.categoryHeader}>
          <View style={[styles.row,styles.m10]}>
             <View style={[styles.bgfff]}>
              <Image style={[styles. mH10,styles. mT20]} source={require('../images/Search_black.png')}/>
             </View>  
               <TextInput underlineColorAndroid='transparent' placeholder="Search for Products, Shops, Location" 
                  style={{alignSelf:'center',width:'80%',backgroundColor:'#fff',}} />
                            
             <View style={{}}> 
              <CButton> 
                 <Image source={require('../images/Sort_close_White.png')} style={{marginTop:15,marginLeft:10}}/>
              </CButton>
             </View>
          </View>    
        </View>
      
    <View style={[styles.bgefefef,styles.aslEnd,styles.m10]}>
          <CButton>
            <View style={styles.row}>
              <Image  source={require('../images/Catg_LocateMe.png')}/>
              <CText cStyle={[styles.FntS10,styles.mL10]}>LOCATE ME</CText> 
            </View>
          </CButton>  
    </View>

      <View style={{backgroundColor:'#fff',height:'100%'}}>
        <CText cStyle={[styles.mT20,styles.mL10,styles.mB10]}>TRENDING SEARCHES</CText>
    <View style={[styles.row,styles.bgfff]}>
               <CButton>
                  <View style={styles.categorymodel}>
                     <CText cStyle={[styles.aslCenter,styles.m10]}>JEANS</CText>
                   </View> 
                </CButton>

                <CButton>
                <View style={styles.categorymodel}>
                   <CText cStyle={[styles.aslCenter,styles.m10]}>SAREES</CText>
                 </View> 
              </CButton>
              <CButton>
              <View style={styles.categorymodel}>
                 <CText cStyle={[styles.aslCenter,styles.m10]}>BANJARAHILLS</CText>
               </View> 
            </CButton>
    </View>
    <View style={[styles.row]}>
              <CButton>
              <View style={styles.categorymodel}>
                <CText cStyle={[styles.aslCenter,styles.m10]}>NEERUS</CText>
              </View> 
              </CButton>

              <CButton>
              <View style={styles.categorymodel}>
              <CText cStyle={[styles.aslCenter,styles.m10]}>GACHIBOWLI</CText>
              </View> 
              </CButton>
              <CButton>
              <View style={styles.categorymodel}>
              <CText cStyle={[styles.aslCenter,styles.m10]}>TOPS</CText>
              </View> 
              </CButton>
              <CButton>
              <View style={styles.categorymodel}>
              <CText cStyle={[styles.aslCenter,styles.m10]}>BAGS</CText>
              </View> 
              </CButton>
    </View>

    <CText cStyle={[styles.mT20,styles.mL10,styles.mB10]}>RECENT SEARCHES</CText>

              <View style={[styles.row]}>
              <CButton>
                <View style={styles.categorymodel}>
                    <CText cStyle={[styles.aslCenter,styles.m10]}>DRESSES</CText>
                  </View> 
              </CButton>

              <CButton>
              <View style={styles.categorymodel}>
                  <CText cStyle={[styles.aslCenter,styles.m10]}>SAREES</CText>
                </View> 
              </CButton>
              <CButton>
              <View style={styles.categorymodel}>
                <CText cStyle={[styles.aslCenter,styles.m10]}>HIMAYATH NAGAR</CText>
              </View> 
              </CButton>
              </View>
              <View style={{flexDirection:'row'}}>
              <CButton>
              <View style={styles.categorymodel}>
              <CText cStyle={[styles.aslCenter,styles.m10]}>NEERUS</CText>
              </View> 
              </CButton>

              <CButton>
              <View style={styles.categorymodel}>
              <CText cStyle={[styles.aslCenter,styles.m10]}>GACHIBOWLI</CText>
              </View> 
              </CButton>
              <CButton>
              <View style={styles.categorymodel}>
              <CText cStyle={[styles.aslCenter,styles.m10]}>TOPS</CText>
              </View> 
              </CButton>
              <CButton>
              <View style={styles.categorymodel}>
              <CText cStyle={[styles.aslCenter,styles.m10]}>BAGS</CText>
              </View> 
              </CButton>
              </View>
         </View>     
    </View>     
    );
  }
}
