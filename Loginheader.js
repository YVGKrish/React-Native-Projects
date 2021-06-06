import React, {Component} from 'react';
import {Text,View,Image,TouchableOpacity,TextInput,Button,Dimensions} from 'react-native';


class Loginheader extends Component {

	render(){
	  return(
             <View>
               
               <View style={styles.btnalign}>   
                
                  <View style={styles.buttons}>
                     <TouchableOpacity onPress={this.props.faceBookClick}> 
                        <Image source={require('../images/Login_facebook.png')} style={{height:42,width:102}}/>                                               
                     </TouchableOpacity>
                  </View>
                
                 <View style={{marginLeft:10}}>
                     <TouchableOpacity onPress={this.props.googleClick}> 
                         <Image source={require('../images/Login_Google.png')}style={{height:42,width:102}}/>                                    
                     </TouchableOpacity>
                 </View>
               </View>
             </View>  
           );
    }
}
const styles = {

    
buttons: {
       
  alignItems:'center'
	},
	btnalign:{
    justifyContent:'center',      
     flexDirection:'row',
   },
       
  }          
  export default Loginheader;
