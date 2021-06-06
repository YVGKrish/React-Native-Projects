import React, { Component } from 'react';
import { View, Image, Modal, Picker, ScrollView, Text, Dimensions, TouchableOpacity, TextInput, FlatList, NativeModules, Alert } from 'react-native';
//import styles from './Styles';
import { CText, CInput, CButton, CRadio, CSpinner } from '../common/index';
import styles from '../common/styles';
import Utils from '../common/Utils';
import Config from '../config/Config';
import ImagePicker from 'react-native-image-picker';

const imgPickerOptions = {
  title: 'Select image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  maxWidth: 1024,
  maxHeight: 512,
  // maxWidth: 200,
  // maxHeight: 220,
  quality: 1,
  noData: true
};

export default class UserPosts extends Component {
  state = {
    showMe: false,
    commentdisplay: '',
    category: 'Country',
    ModalVisibleStatus: false,
    maleBool: 'none',
    femaleBool: 'none',
    gendermale:'',
    followbool: 'none',
    count: 0,
    test: 'India',
    searchtext: "",
    tcount: 0,
    fcount: 0,
    genderfemale: '',
    // gender:{0:[],1:[]}
    gender: [], token: '',
    ownid: '', idUser: "",
    MPostData: [],
    timetext: '',
    spinnerBool: false,
    fol: 'Follow',
    commentText: '',
    addPostImgUrl: '',
    addPostImage: '',
    shopsListForPost: [],
    storeShopsListTemp: [],
    shopsListBool: 'none',
    shopNameSelected: '',
    shopSelectedId: '',
    imageUploadBool: false,
    context: '',
    commentTexts: '',
    userID:''
  }
  spinnerLoad() {
    //console.log('spinner');
    if (this.state.spinnerBool)
      return <CSpinner />;
    return false;
  }
  ShowModalFunction(visible) {

    if (this.state.token) {
      this.setState({ ModalVisibleStatus: visible });
    } else {
      alert('Please login');
      this.props.navigation.navigate('Login');
    }

  }
  onValueChange(value) {
    // console.log(key+':'+value);
    this.setState({ category: value });
    // console.log(this.state.category);
    return this.state.category;
  }
  DeleteComment(comId)
  {
    const self=this;
    Utils.dbCall(Config.routes.deleteSMediaComment, 'POST', { token: self.state.token }, {
      commentId: comId,
    }, function (resp) {
      console.log(resp,'Delete Comment');
      if(resp.status)
      {
        self.getUserSpecificPosts(self.state.ownid,false);

      }
    });

  }
  viewDeleteCommentOption(userId, comId, content,check) {
    // console.log('Comid   '+comId+'   content   '+content);
    // this.setState({ ['commentdisplay' + comId]: 'flex' })

    if (userId === this.state.ownid && check=== 'flex') {

      return (
        <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:15}}>
          <TouchableOpacity style={{ backgroundColor: '#c01530', marginLeft: 10, borderRadius: 5 }} onPress={() =>this.CommentCheck(comId,this.state.userID)} >
            <CText cStyle={{ margin: 5, marginRight: 10, marginLeft: 10, color: '#222', fontSize: 11.7, fontFamily: 'NeueKabel-Regular' }}>Edit</CText>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: '#c01530', marginLeft: 10, borderRadius: 5 }}  onPress={() => {Alert.alert('Delete Comment','Are you sure u want to delete the Comment.',
                 [{text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                 {text: 'YES', onPress: () => {this.DeleteComment(comId)}}]
               )} } >
            <CText cStyle={{ margin: 5, marginRight: 10, marginLeft: 10, color: '#222', fontSize: 11.7, fontFamily: 'NeueKabel-Regular' }}>Delete</CText>
          </TouchableOpacity>
      </View>
      );
    } else {
      return;
    }
  }
  componentWillMount() {
    const self = this;
    this.onPickImage = this.onPickImage.bind(this);
    this.onReset = this.onReset.bind(this);
    self.setState({ count: 0 })
    Utils.getToken('user', function (tResp, tStat) {
      if (tStat) {
        if (tResp != '') {
          self.setState({ token: tResp.token, ownid: tResp.id }, () => {
            console.log('token in Media', self.state.token, 'ID of the user', tResp.id);
            // self.getmediaItems(self.state.ownid);

          });
          self.setState({userID:self.props.navigation.state.params.user},()=>{self.getUserSpecificPosts(self.state.userID,false)})

        }
        // console.log('hjsagjklz',self.state.ownid)
      }
     

    });
    self.setState({ spinnerBool: true })


    // self.convertDateTime();
  }
  FilterMediaPage(folc)
  {
    const self=this;
    if(folc===true){
    if(self.state.gendermale==='male' && self.state.genderfemale==='female')
    {
      self.setState({gender:["Male","Female"]},()=>
      {
        self.getUserSpecificPosts(self.state.userID,folc);

      })
    }
    else if(self.state.gendermale==='' && self.state.genderfemale==='')
    {
      self.setState({gender:["Male","Female"]},()=>
      {
        self.getUserSpecificPosts(self.state.userID,folc);

      })
    }
    
    
    else if(self.state.genderfemale===''){
      self.setState({gender:["Male"]},()=>
      {        self.getUserSpecificPosts(self.state.userID,folc);

      }
    )
    }
    else if(self.state.gendermale==='')
    {
      self.setState({gender:["Female"]},()=>{
        self.getUserSpecificPosts(self.state.userID,folc);

      })
    }}
    else{
      
    if(self.state.gendermale==='male' && self.state.genderfemale==='female')
    {
      self.setState({gender:["Male","Female"]},()=>{
        self.getUserSpecificPosts(self.state.userID,folc);

      })
    }
    else if(self.state.gendermale==='' && self.state.genderfemale==='')
    {
      self.setState({gender:["Male","Female"]},()=>{
        self.getUserSpecificPosts(self.state.userID,folc);

      });
    }
    else if(self.state.genderfemale===''){
      self.setState({gender:["Male"]},()=>{        self.getUserSpecificPosts(self.state.userID,folc);

      })
    }
    else if(self.state.gendermale==='')
    {
      self.setState({gender:["Female"]},()=>{
        self.getUserSpecificPosts(self.state.userID,folc);

    })
    }
   
    
  
  }}
  
  CommentCheck(comItem,UserID) {    
    for (let i = 0; i < this.state.MPostData.length; i++) {
      const element = this.state.MPostData[i];
        for (let j = 0; j < element.comments.length; j++) {
          if (comItem === element.comments[j]._id) 
          {
            var temparr = element.comments[j];
            temparr.check = 'flex';
            element.comments = temparr;
            this.state.MPostData[i] = element;
            this.setState({MPostData:this.state.MPostData},()=>{console.log('changed clickmedia',this.state.MPostData);});
              break;
          }        
        }
      }
      //console.log('changed resp in media',this.state.MPostData);
      // this.EditComment(comItem,this.state.commentTexts);
      this.commentsDB(comItem,UserID);
    }
  EditComment(comId,content) {
    const self = this;
    
    var testcomm='super';
    var testing=content;
    if(content===undefined)
    {
      alert('please write a comment before submittting');
      self.CommentCheck(comId,self.state.userID)
    }
   else
   {
    Utils.dbCall(Config.routes.updateSMediaComment, 'PUT', { token: self.state.token }, {
      commentId: comId,
      content: content
    }, function (resp) {
      console.log(resp);
      if (resp.status) {
        self.setState({ ['commentTexts' + comId]: testing }, () => { console.log(self.state['commentTexts' + comId])});
                let CID=comId;
                //  console.log('category=======',self.state.gender);
                Utils.dbCall(Config.routes.getPostsWithLcs, 'POST', null, {
                  category: [],
                  idUser: null,
                  ownId: self.state.ownid,
                  selectedCountry: [],
                  selectedCity: [],
                  searchText: self.state.searchtext
                }, function (resp) {
                  console.log(resp, 'getPostsWithLcs');
            
                  if (resp.status) {
                        var postcoll = [];
                        for (let index = 0; index < resp.posts.length; index++) {
                          const element = resp.posts[index];
                          if(resp.posts[index].comments.length>0)
                          {
                            for (let i = 0; i < element.comments.length; i++) {
                              
                            
                              element.comments[i].check='none'
                              
                            }
                            postcoll.push(element);
                
                
                          }
                          else{
                            postcoll.push(element);
                          }
                
                          
                        }
                        self.setState({ MPostData: postcoll });
                        console.log("nm of items in post in updated commment",self.state.MPostData);
                        alert('Your Comment is successfully updated');
                    // self.props.navigation.navigate('login');
                  }
                });

      }
    }
    );
    }
  }
  commentsDB(ComID,UserID)
  {
    let CID=ComID;
    const self = this;
    //  console.log('category=======',self.state.gender);
    Utils.dbCall(Config.routes.getPostsWithLcs, 'POST', null, {
      category: [],
      id:"",
      idUser: UserID,
      selectedCountry: [],
      selectedCity: [],
      searchText: self.state.searchtext,
      userSpecificPosts:false
    }, function (resp) {
      console.log(resp, 'getPostsWithLcs');

      if (resp.status) {

        // console.log(resp.posts);
        self.setState({ gender: [] })

        var postcoll = [];
        for (let index = 0; index < resp.posts.length; index++) {
          const element = resp.posts[index];
          if(resp.posts[index].comments.length>0)
          {
            for (let i = 0; i < element.comments.length; i++) {
              if(CID === element.comments[i]._id)
              {
                element.comments[i].check='flex';
              }
              else
              {
              element.comments[i].check='none'
              }
            }
            postcoll.push(element);


          }
          else{
            postcoll.push(element);
          }

          
        }
        self.setState({ MPostData: postcoll, spinnerBool: false });
        console.log("nm of items in post in CommDB",self.state.MPostData);
        // self.props.navigation.navigate('login');
      }
    });

  }
  GenderMale(value) {
    var test = false;
    const self = this;
    self.setState({ spinnerBool: true })
    if(self.state.tcount===0 && self.state.count==1)
    {
      self.state.count = 1 ? test = true : false
      
      self.setState({ maleBool: 'flex', tcount: 1, gendermale: 'male' },()=>{self.FilterMediaPage(test);});
    }
    else if (self.state.tcount === 0) {
      self.state.count = 1 ? test = false : true
      
      self.setState({ maleBool: 'flex', tcount: 1, gendermale: 'male' },()=>{self.FilterMediaPage(test);});
      
      
   
    }
    else {
      self.setState({ spinnerBool: true });
      self.state.count=1?test=false:true;
      
      self.setState({ maleBool: 'none', tcount: 0, gendermale:'' },()=>{self.FilterMediaPage(test)})
      
    }
  }

  GenderFeMale(value) {
    var test = false;
    const self = this;
    self.setState({ spinnerBool: true })
    if(self.state.fcount===0 && self.state.count==1)
    {
      self.state.count = 1 ? test = true : false
      
      self.setState({ femaleBool: 'flex', fcount: 1, genderfemale: 'female' },()=>{self.FilterMediaPage(test);});
    }
    else if (self.state.fcount === 0) {
      self.state.count = 1? test = false : true
      
      self.setState({ femaleBool: 'flex', fcount: 1, genderfemale: 'female' },()=>{self.FilterMediaPage(test);});
      
      
   
    }
    else {
      self.setState({ spinnerBool: true });
      self.state.count=1?test=false:true;
      
      self.setState({ femaleBool: 'none', fcount: 0, genderfemale:'' },()=>{self.FilterMediaPage(test)})
      
    }
  }

  Followingchange() {

    const self = this;
   
    if (self.state.token === '') {
      self.props.navigation.navigate('Login');
    }
    else {
      var test = false;
      const self = this;
      self.setState({ spinnerBool: true })
      if (self.state.count === 0) {
        self.setState({ followbool: 'flex', count: 1 });
        self.state.count = 1 ? test = true : false
        self.FilterMediaPage(test);
        
        // self.setState({ followBool: 'flex', count: 1 },()=>{self.FilterMediaPage(test);});
        
        
     
      }

      else {
        var test = false;
        self.setState({ spinnerBool: true });
        
        self.setState({ followbool: 'none', count: 0 })
        self.state.count=0?test=true:false;
       self.FilterMediaPage(test)
        
    }
  }
}
MoreThanOneComment(value,ID)
{
const self=this;
var test=[];
console.log(self.state.MPostData);
if(value===false){
for (let index = 0; index < self.state.MPostData.length; index++) {
  const element = self.state.MPostData[index];
  if(element._id._id===ID)
  {  element.SCheck=true;
    for (let i = 0; i < element.comments.length; i++) {
    if(element.comments.length===0 || element.comments.length===1)
    {
      Alert.alert('This Post has either Zero or one Comment')
    }
    
      element.comments[i].Ccheck='flex'
 
  }
    
  }
  test.push(element);

  
}
self.setState({MPostData:test},()=>{console.log(self.state.MPostData+'Seemore')})
}
else if(value===true)
{
  for (let index = 0; index < self.state.MPostData.length; index++) {
    const element = self.state.MPostData[index];
    if(element._id._id===ID)
    {
      element.SCheck=false;
        for (let i = 0; i < element.comments.length; i++) {
      if(i==0)
      {
      console.log('Pressed see less')
        element.comments[i].Ccheck='none'
   }
   else{
    //  element.comments[i].check='none'
   }
    }
      
    }
    test.push(element);
  
    
  }
  self.setState({MPostData:test},()=>{console.log(self.state.MPostData+'Seemore')})
  

}


}

  getUserSpecificPosts(userId,fol)
  {
    const self = this;
    Utils.dbCall(Config.routes.getPostsWithLcs, 'POST', null, {
      category: self.state.gender,
      followersPosts:fol,
      id:"",
      idUser: userId,
      ownId:self.state.ownid,
      selectedCountry: [],
      selectedCity: [],
      searchText: self.state.searchtext,
      userSpecificPosts:false
    }, function (resp) {
      console.log(resp, 'getPostsWithLcs');

      if (resp.status) {

        console.log(resp.posts);

        var postcoll = [];
        for (let index = 0; index < resp.posts.length; index++) {
          const element = resp.posts[index];
          if(resp.posts[index].comments.length>0)
          {
            element.Sstate='flex'

            // if(resp.posts[index].comments.length<=1 &&resp.posts[index].comments.length>0)
            // {
            //   element.Sstate='none'
            // }
            // else{
            //   element.Sstate='flex'

            // }
            for (let i = 0; i < element.comments.length; i++) {
              element.comments[i].check='none'
              element.SCheck=false;

              if(i===0)
              {
                element.comments[i].Ccheck='flex'

              }
              else{
                element.comments[i].Ccheck='none'
              }
              
            }
            postcoll.push(element);


          }
          else{
            element.Sstate='none'
            
            postcoll.push(element);
          }

          
        }
        self.setState({ MPostData: postcoll, spinnerBool: false });
        console.log("nm of items in Media post",self.state.MPostData);
        self.loadAllShopsForPost();
        // self.props.navigation.navigate('login');
      }
    });
  }
  loadAllShopsForPost() {
    const self = this;
    Utils.dbCall(Config.routes.getAllShopsForPost, 'GET', { token: this.state.token }, {}, function (resp) {
      if (resp.status) {
        self.setState({ shopsListForPost: resp.shops, storeShopsListTemp: resp.shops });
      }
    });
  }

  LikePost(postID) {
    const self = this;
    if (self.state.token != '') {
      Utils.dbCall(Config.routes.addLike, 'POST', { token: self.state.token }, {
        postId: postID
      }, function (resp) {
        if (resp.status) {
          // console.log(resp,'self.state.ownid==calling refaresh');
          // self.getmediaItems(self.state.ownid);
          self.getUserSpecificPosts(self.state.userID,false)

        }
      });
    }
    if (self.state.token === '' || self.state.ownid === '') {
      self.props.navigation.navigate('Login');
    }

  }

  FollowDBcall(User) {
    if (this.state.token) {
      const self = this;
      Utils.dbCall(Config.routes.followUser, 'PUT', { token: self.state.token }, {
        userId: User
      }, function (resp) {
        if (resp.status) {
          if (resp.message === "Successfully added follower") {
            self.setState({ fol: 'Following' });
            // console.log(self.state.fol);
            self.getUserSpecificPosts(self.state.ownid,false);
          }
          if (resp.message === "Successfully removed follower") {
            self.setState({ fol: 'Follow' });
            // console.log(self.state.fol);
            self.getUserSpecificPosts(self.state.ownid,false);
          }
        }
      });
    } else {
      alert('Please login');
      this.props.navigation.navigate('Login');
    }
  }

  CommentCall(postid) {
    if (this.state.token) {
      const self = this;
      if (self.state.token === '') {
        self.props.navigation.navigate('Login');
      } else {
        // console.log('Testing comment'+self.state['commentText' + postid])
        if(self.state['commentText' + postid]=== undefined)
        {
          alert('please write a comment before submitting');
        }
        else{
        Utils.dbCall(Config.routes.addSMediaComment, 'POST', { token: self.state.token }, {
          content: self.state['commentText' + postid],
          postId: postid
        }, function (resp) {
          // console.warn('resp in add comment',resp);
          if (resp.status) {
            self.setState({ ['commentText' + postid]: '' });
            self.getUserSpecificPosts(self.state.ownid,false);
            alert('Your Comment is successfully posted');
          }
        });
      }
      }
    } else {
      alert('Please login');
      this.props.navigation.navigate('Login');
    }
  }

  postproductfullinfo(item) {

    
    let MimageUrl=Config.routes.base + Config.routes.getSocialMediaPics + '/' + item._id.content.images[0];
    var response = Image.prefetch(MimageUrl,()=>console.log('Image is being fetched'))
    

    // console.warn(item._id)
    const self = this;

    let ID = '';
    if (self.state.ownid === '') {
      ID = '401';
    }
    else {
      ID = self.state.ownid;
    }
    let customShopName = '';
    let shoploc = ''
    if (item._id.hasOwnProperty('shop')) {
      customShopName = item._id.shop.shopName;
      shoploc = item._id.shop.city + ',' + item._id.shop.country
    } else {
      customShopName = item._id.content.customShopname;
      shoploc = ''
    }

    return (
      <ScrollView style={[styles.MediaContaner]}>
        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
          <View style={{ width: (Dimensions.get('window').width) - 10, borderWidth: 0.3 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, marginHorizontal: 15 }}>
              <View style={{flexDirection:'row'}}>
              <Image source={{ uri: Config.routes.base + Config.routes.getProfilePic + '/' + item._id.user._id }}
                style={{ resizeMode: 'contain', width: 40, height: 40, borderRadius: 150, marginRight: 10 }} />
                <TouchableOpacity onPress={()=>{this.getUserSpecificPosts(item._id.user._id,false)}}>
                    <CText cStyle={styles.MediaTextName}>{item._id.user.fullName}</CText>
              </TouchableOpacity>
              </View>
              <View>
                <CText cStyle={{ color: '#1e1e1e', alignSelf: 'flex-end', fontSize: 10, marginTop: 15, fontFamily: 'NeueKabel-Regular', }}>Shopped at {customShopName}</CText>
                <CText cStyle={{ alignSelf: 'flex-end', fontSize: 10, fontFamily: 'NeueKabel-Regular', }}>{shoploc}</CText>
              </View>
            </View>
            <View style={styles.MediaContanerImg}>
              <Image source={{ uri:MimageUrl }}
                resizeMode='contain'
                style={{ width: (Dimensions.get('window').width), height: 200 }}
              />
            </View>
            <View style={{ margin: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.LikePost(item._id._id)} >
                    <Image style={{ margin: 2, marginTop: 5, width: 12, height: 12, resizeMode: 'contain' }} source={require('../images/Menu_My_Likes.png')} />
                  </TouchableOpacity>
                  <CText cStyle={{ margin: 5, marginLeft: 2, fontSize: 10, color: "#393939", fontFamily: 'NeueKabel-Regular' }}>{item._id.likes.length} Likes</CText>
                  <Image style={{ margin: 5, width:15, height:15, resizeMode:'contain' }} source={require('../images/Media_Message.png')} />
                  <CText cStyle={{ margin: 5, marginLeft: 2, fontSize: 10, color: "#393939", fontFamily: 'NeueKabel-Regular' }}>{item.comments.length} Comments</CText>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.FollowDBcall(item._id.user._id)} >
                    <View style={{ backgroundColor: '#c01530', borderRadius: 5 }}>
                      <CText cStyle={{ margin: 5, color: '#fff', fontSize: 11.7, fontFamily: 'NeueKabel-Regular' }}>{item.isFollowed ? 'Following' : 'Follow'}</CText>
                    </View>
                  </TouchableOpacity>
                  {this.viewDeletePostOption(item._id.user._id, item._id)}
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, }}>
                <View>
                  <CText cStyle={{ fontSize: 13, color: '#0e0e0e', fontFamily: 'NeueKabel-Regular' }}>{item._id.content.productName} </CText>
                  <CText cStyle={{ fontSize: 10, color: '#393939', fontFamily: 'NeueKabel-Regular' }}>{item._id.content.description.substr(0, 90)}</CText>
                </View>
                <CText cStyle={{ fontSize: 9, color: '#7a7a7a', fontFamily: 'NeueKabel-Regular' }}>{this.convertDateTime(item._id.createdAt)}</CText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
              <Image style={{ resizeMode: 'contain', width: 50, height: 50, marginTop: 5, borderRadius: 150 }}
                source={{ uri: Config.routes.base + Config.routes.getProfilePic + '/' + ID  }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                <View style={{ width: '80%', borderWidth: 1, borderColor: '#EEE', marginLeft: 5 }}>
                  <TextInput multiline={true}
                    value={self.state['commentText' + item._id._id]} onChangeText={(commentText) => self.setState({ ['commentText' + item._id._id]: commentText }, () => { console.log(self.state.commentText) })}
                    underlineColorAndroid='transparent' placeholder="Write a comment..."
                    style={{ height: 40 }} />
                </View>
                <TouchableOpacity style={{ backgroundColor: '#c01530', borderTopRightRadius: 5, borderBottomRightRadius: 5, padding: 5 }}
                  onPress={() => this.CommentCall(item._id._id)} >
                    <Image source={require('../images/post-comment-arrow.png')} style={{width:25, height:32, resizeMode:'contain'}} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'column' }}>
              {
                item.comments.map(function (data, index) {
                  var commdate = new Date(data.createdAt)
                  var currr = new Date();
                  var testime = 0
                  var test = '', test1 = ''
                  var trick = [], trick1 = [], count = 0;
                  var commtime = '', currrtime = '';
                  var commentctime = ''
                  if (currr.getFullYear() === commdate.getFullYear()) {
                    count = count + 1;
                    test = commdate.toLocaleDateString();

                    test1 = currr.toLocaleDateString();
                    trick = test.split(/[/]/).map(parseFloat)
                    trick1 = test1.split(/[/]/).map(parseFloat)
                    commtime = commdate.toTimeString().split(/[: T-]/).map(parseFloat);
                    currrtime = currr.toTimeString().split(/[: T-]/).map(parseFloat);
                    // console.log(commtime)
                    if (trick[0] === trick1[0] && trick[1] === trick1[1]) {
                      // console.log('commentTime====='+' '+Math.abs(currrtime[0]-commtime[0])+' Hours  '+Math.abs(currrtime[1]-commtime[1])+' minutes'+Math.abs(currrtime[2]-commtime[2])+' seconds ago');
                      commentctime = Math.abs(currrtime[0] - commtime[0]) + ' Hours  ' + Math.abs(currrtime[1] - commtime[1]) + ' minutes' + Math.abs(currrtime[2] - commtime[2]) + ' seconds ago'

                    }
                    if (trick[0] != trick1[0] && trick[1] != trick1[1]) {
                      commentctime = Math.abs(trick[0] - trick1[0]) + ' months ' + Math.abs(trick[1] - trick1[1]) + ' days ago';
                    }

                    if (trick1[0] === trick[0]) {
                      // console.log('commentTime====='+' '+Math.abs(trick[1]-trick1[1])+' days ago');
                      commentctime = Math.abs(trick[1] - trick1[1]) + ' days ago';

                      // console.log('same day',trick)

                    }

                    else if (trick1[0] != trick[0]) {
                      // console.log('commentTime====='+' '+Math.abs(trick[0]-trick1[0])+' months'+Math.abs(trick[1]-trick1[1])+' days ago');
                      commentctime = Math.abs(trick[0] - trick1[0]) + ' months ' + Math.abs(trick[1] - trick1[1]) + ' days ago';

                    }
                  }
                  else {
                    //  console.log('commentTime====='+' '+Math.abs(currr.getFullYear()- commdate.getFullYear())+'  years ago')
                    commentctime = Math.abs(currr.getFullYear() - commdate.getFullYear()) + '  years ago'
                  }

                  return (
                  <View>
                  <View key={index} style={{ flexDirection: 'row', margin: 10, marginHorizontal: 15, alignItems: 'center' }}
                  display={data.Ccheck}
                  >

                    <Image style={{ resizeMode: 'contain', height: 50, width: 50, borderRadius: 120 }} source={{ uri: Config.routes.base + Config.routes.getProfilePic + '/' + data.userId }} />
                    <View style={{ flexDirection: 'column' }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CText cStyle={{ fontSize: 13, color: '#0e0e0e', marginLeft: 5, fontFamily: 'NeueKabel-Regular' }}>{data.userName} </CText>
                        <CText cStyle={{ fontSize: 9, color: '#7a7a7a', fontFamily: 'NeueKabel-Regular' }}>({commentctime}</CText>
                        
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <CText cStyle={{ fontSize: 10, color: '#393939', marginLeft: 5, fontFamily: 'NeueKabel-Regular' }}>{data.content}
                        {console.log(data.content+'  '+data.check)}
                        </CText>
                       
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15}} display={data.check}>
                          <View style={{ width: '80%', borderWidth: 1, borderColor: '#EEE', marginLeft: 5 }}>
                          {/* {console.warn(data._id)} */}
                            <TextInput multiline={true}
                              value={self.state['commentTexts' + data._id]} onChangeText={(commentTexts) => self.setState({ ['commentTexts' + data._id]: commentTexts }, () => { console.log(self.state['commentTexts' + data._id+'']); console.log(data._id) })}
                              underlineColorAndroid='transparent'
                              style={{ height: 40 }} />
                          </View>
                          <TouchableOpacity style={{ backgroundColor: '#c01530', borderTopRightRadius: 5, borderBottomRightRadius: 5, padding: 5 }}
                            onPress={() => self.EditComment(data._id, self.state['commentTexts' + data._id])} >
                            <Image source={require('../images/post-comment-arrow.png')} style={{ width: 25, height: 32, resizeMode: 'contain' }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{width:'100%'}}>
                      {self.viewDeleteCommentOption(data.userId, data._id, data.content,data.Ccheck)}
                      </View>
                  </View>);
                })
              }
            </View>
            <View display={item.Sstate}>
            <TouchableOpacity onPress={()=>{this.MoreThanOneComment(item.SCheck,item._id._id)}}>
              <CText cStyle={{ alignSelf: 'flex-end', marginRight: 15, marginBottom: 10, fontSize: 13, fontFamily: 'NeueKabel-Regular' }}>{item.SCheck===false?'See More':'See Less'}</CText>
          </TouchableOpacity>
            </View>
          </View>

        </View>

      </ScrollView>
    )
  }
  MoreThanOneComment(value,ID)
  {
  const self=this;
  var test=[];
  console.log(self.state.MPostData);
  if(value===false){
  for (let index = 0; index < self.state.MPostData.length; index++) {
    const element = self.state.MPostData[index];
    if(element._id._id===ID)
    {  element.SCheck=true;
      for (let i = 0; i < element.comments.length; i++) {
        
    
      
        element.comments[i].Ccheck='flex'
   
    }
      
    }
    test.push(element);
  
    
  }
  self.setState({MPostData:test},()=>{console.log(self.state.MPostData+'Seemore')})
  }
  else if(value===true)
  {
    for (let index = 0; index < self.state.MPostData.length; index++) {
      const element = self.state.MPostData[index];
      if(element._id._id===ID)
      {
        element.SCheck=false;
          for (let i = 0; i < element.comments.length; i++) {
        if(i==0)
        {
        console.log('Pressed see less')
          element.comments[i].Ccheck='none'
     }
     else{
      //  element.comments[i].check='none'
     }
      }
        
      }
      test.push(element);
    
      
    }
    self.setState({MPostData:test},()=>{console.log(self.state.MPostData+'Seemore')})
    
  
  }
  
  
  }

  viewDeletePostOption(userId, commentId) {
    if (userId === this.state.ownid) {
      return (<TouchableOpacity style={{ backgroundColor: '#c01530', marginLeft: 10, borderRadius: 5 }} onPress={() => {
        Alert.alert('Delete Post', 'Are you sure u want to delete the Post?',
          [
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => { this.setState({ spinnerBool: true }, () => this.deletePost(commentId)) } },
          ],
          { cancelable: false }
        )
      }}>
        <CText cStyle={{ margin: 5, color:'#FFF', fontSize: 11.7, fontFamily: 'NeueKabel-Regular' }}>Delete Post</CText>
      </TouchableOpacity>);
    } else {
      return;
    }
  }
 

  
 
  deletePost(postId) {
    const self = this;
    Utils.dbCall(Config.routes.deleteSMediaPost, 'POST', { token: self.state.token }, { postId: postId._id }, function (resp) {
      // console.warn(resp);
      if (resp.status) {
        let tempPostData = self.state.MPostData;
        let newArr = [];
        for (let i = 0; i < tempPostData.length; i++) {
          if (tempPostData[i]._id._id !== postId._id) {
            newArr.push(tempPostData[i]);
          }
        }
        self.setState({ MPostData: newArr, spinnerBool: false });
      } else {
        self.setState({ spinnerBool: false });
        alert('Could not delete the post');
      }
    }
    );
  }

  onPickImage() {
    const self = this;
    ImagePicker.showImagePicker(imgPickerOptions, response => {
      console.warn(response)
      if (!response.didCancel && !response.error) {
        self.setState({ imageUploadBool: true });
        NativeModules.FetchData.GetImg(response.uri, (resp) => {
          self.setState({ addPostImgUrl: '' + resp, addPostImage: { uri: response.uri }, imageUploadBool: false }, () => {
            console.warn(self.state.addPostImgUrl);
          });
        });
      } else if (response.didCancel) {
        self.setState({ addPostImgUrl: '', addPostImage: '', imageUploadBool: false });
      } else {
        alert('Could not select image');
      }
    })
  }

  onReset() {
    this.setState({ addPostImgUrl: '', addPostImage: '' });
  }

  submitAddPost() {
    let cShopName = this.state.addPostShoppedAt;
    if (this.state.shopSelectedId) {
      cShopName = this.state.shopNameSelected;
    }
    if (!this.state.addPostImgUrl) {
      alert('Please add your image');
      return false;
    } else if (!this.state.addPostProductName) {
      alert('Please provide Product Name');
      return false;
    } else if (!this.state.addPostDescription) {
      alert('Please provide Product Name');
      return false;
    } else if (!cShopName) {
      alert('Please provide where you shoppedat');
      return false;
    } else {
      let self = this
      Utils.dbCall(Config.routes.addSMediaPost, 'POST', { token: self.state.token }, {
        details: {
          content: {
            productName: this.state.addPostProductName,
            description: this.state.addPostDescription,
            shoppedAt: this.state.shopSelectedId,
            customShopname: cShopName,
            errorMessage: ""
          }
        },
        files: this.state.addPostImgUrl
      }, function (resp) {
        if (resp.status) {
          self.getUserSpecificPosts(self.state.ownid,false);
          alert('Post added successfully');
          self.setState({
            ModalVisibleStatus: false, addPostProductName: '', addPostShoppedAt: '', addPostImage: '',
            addPostDescription: '', shopSelectedId: '', shopSelectedId: '', shopNameSelected: ''
          });
        } else {
          alert('Error, adding post');
        }
      });
    }
  }

  convertDateTime(dtstr) {
    var commdate = new Date(dtstr)
    var currr = new Date();
    var testime = 0
    var test = '', test1 = ''
    var trick = [], trick1 = [], count = 0;
    var commtime = '', currrtime = '';
    var posttime = ''
    if (currr.getFullYear() === commdate.getFullYear()) {
      count = count + 1;
      test = commdate.toLocaleDateString();

      test1 = currr.toLocaleDateString();
      trick = test.split(/[/]/).map(parseFloat)
      trick1 = test1.split(/[/]/).map(parseFloat)
      commtime = commdate.toTimeString().split(/[: T-]/).map(parseFloat);
      currrtime = currr.toTimeString().split(/[: T-]/).map(parseFloat);
      // console.log(commtime)
      if (trick[0] === trick1[0] && trick[1] === trick1[1]) {
        // console.log('commentTime====='+' '+Math.abs(currrtime[0]-commtime[0])+' Hours  '+Math.abs(currrtime[1]-commtime[1])+' minutes'+Math.abs(currrtime[2]-commtime[2])+' seconds ago');
        posttime = Math.abs(currrtime[0] - commtime[0]) + ' Hours  ' + Math.abs(currrtime[1] - commtime[1]) + ' min' + Math.abs(currrtime[2] - commtime[2]) + ' sec ago'
        return posttime;

      }
      if (trick[0] != trick1[0] && trick[1] != trick1[1]) {
        posttime = Math.abs(trick[0] - trick1[0]) + ' months ' + Math.abs(trick[1] - trick1[1]) + ' days ago';
        return posttime;
      }

      if (trick1[0] === trick[0]) {
        // console.log('commentTime====='+' '+Math.abs(trick[1]-trick1[1])+' days ago');
        posttime = Math.abs(trick[1] - trick1[1]) + ' days ago';
        return posttime;

        // console.log('same day',trick)

      }

      else if (trick1[0] != trick[0]) {
        // console.log('commentTime====='+' '+Math.abs(trick[0]-trick1[0])+' months'+Math.abs(trick[1]-trick1[1])+' days ago');
        posttime = Math.abs(trick[0] - trick1[0]) + ' months ' + Math.abs(trick[1] - trick1[1]) + ' days ago';
        return posttime;

      }
    }
    else {
      posttime = Math.abs(currr.getFullYear() - commdate.getFullYear()) + '  years ago'
      return posttime;
    }
  }

  renderAddPostImage() {
    if (this.state.addPostImage) {
      return (<View>
        <Image source={this.state.addPostImage} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
        <TouchableOpacity onPress={this.onReset} style={styles.addPostImgWrap}>
          <CText cStyle={{ color: '#FFF', padding: 5 }}>X</CText>
        </TouchableOpacity>
      </View>);
    } else {
      return;
    }
  }

  renderShopsList(item) {
    return (<TouchableOpacity style={{ borderBottomWidth: 1, borderBottomColor: '#DDD', paddingVertical: 5, paddingHorizontal: 10 }}
      onPress={() => this.setState({ shopsListBool: 'none', shopSelectedId: item._id, shopNameSelected: item.shopName, addPostShoppedAt: item.shopName })}>
      <CText>{item.shopName}</CText></TouchableOpacity>);
  }

  addPostSearchResult(value) {
    const self = this;
    this.setState({ addPostShoppedAt: value });
    let text = value.toLowerCase();
    let filterName = self.state.storeShopsListTemp.filter((item) => {
      if (item.shopName)
        return item.shopName.toLowerCase().match(text);
    });
    if (!text || text === '') {
      self.setState({ shopsListForPost: self.state.store, shopSelectedId: '', addPostShoppedAt: '' });
    } else if (!filterName.length) {
      self.setState({ shopsListForPost: [], noData: true });
    } else {
      self.setState({ noData: false, shopsListForPost: filterName });
    }
    self.setState({ shopsListBool: 'flex' });
  }

  renderAddProduct() {
    if (this.state.imageUploadBool) {
      return (<CText cStyle={[styles.MediaBtnAddproductText, { fontFamily: 'NeueKabel-Regular' }]}>Loading... Please wait!!</CText>)
    } else {
      return (<CText cStyle={[styles.MediaBtnAddproductText, { fontFamily: 'NeueKabel-Regular' }]}>Add Product</CText>);
    }
  }

  renderAddPostLoading() {
    if (this.state.imageUploadBool) {
      return (<View style={{ backgroundColor: '#c01530', marginHorizontal: 15, borderRadius: 5 }}>
        <CText cStyle={{ color: '#fff', margin: 10, fontFamily: 'NeueKabel-Regular' }}>Loading... Please wait!!</CText></View>)
    } else {
      return (<View style={{ backgroundColor: '#c01530', marginHorizontal: 15, borderRadius: 5,marginTop:10 }}><CButton onPress={() => { this.submitAddPost() }}>
        <CText cStyle={{ color: '#fff', margin: 10, fontFamily: 'NeueKabel-Regular' }}> Add Post</CText></CButton></View>);
    }
    this.setState({ModalVisibleStatus:false});    
  }

  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'#fff' }}>
        {this.spinnerLoad()}

        <View style={styles.MediaHeader}>

          <CText cStyle={[styles.MediaHeaderText, { alignSelf: 'center' }]}>MEDIA</CText>
          <TextInput style={[{ width: '40%',color:'#fff' }]}
            underlineColorAndroid="transparent"
            value={this.state.searchtext} onChangeText={(searchtext) => this.setState({ searchtext })}
            placeholderTextColor='#434343'
            placeholder='search' />

          <View style={[styles.m5, styles.row]}>
              <TouchableOpacity 
              onPress={()=>this.componentWillMount()}
               >
                <Image source={require('../images/Search.png')} style={{ height: 18, width: 16, marginTop: 10 }} />
              </TouchableOpacity>
            <View>
              <CButton onPress={() => { this.setState({ showMe: !this.state.showMe }) }}>
                <Image style={{ height: 17, width: 16, margin: 10 }} source={require('../images/mediaFilter.png')} />
              </CButton>
              <Modal visible={this.state.showMe} transparent={true}
                onRequestClose={() => Console.warn("close filter")}
              >

                <View
                  style={{ backgroundColor: '#ffffff', height: (Dimensions.get('window').height) / 3, width: (Dimensions.get('window').width) / 1.8, alignSelf: 'flex-end', marginTop: 70 }}>

                  <View style={{ borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CText cStyle={{ fontSize: 10, margin: 15 }}>FILTER BY</CText>
                    <TouchableOpacity onPress={() => {
                      this.setState({
                        showMe: false
                      })
                    }
                    }>
                      <CText cStyle={{ fontSize: 10, margin: 15 }}>CLOSE</CText>
                    </TouchableOpacity>

                  </View>

                  <View style={{ flexDirection: 'column' }}>
                    <View style={[styles.mTop10]}>
                      <View style={[styles.mTop10]}>
                        <CRadio label='Male' activeStyle={{ display: this.state.maleBool }} onPress={() => this.GenderMale('M')} />
                      </View>
                      <View style={[styles.mTop10]}>
                        <CRadio label='Female' activeStyle={{ display: this.state.femaleBool }} onPress={() => this.GenderFeMale('F')} />
                      </View>
                      <View style={[styles.mTop10]}>
                        <CRadio label='Following' activeStyle={{ display: this.state.followbool }} onPress={() => this.Followingchange()} />
                      </View>
                    </View>
                  </View>
                  <CText cStyle={{ fontSize: 10, marginLeft: 15, margin: 5 }}>Country *</CText>

                  {/* <View style={{ margin: 15, marginTop: 5, borderWidth: 0.5, borderRadius: 3 }}>
                    <Picker
                      selectedValue={this.state.test}
                      onValueChange={(itemValue, itemIndex) => this.setState({ test: itemValue })}>
                      <Picker.Item label="India" value="India" />
                      <Picker.Item label="America" value="America" />
                      <Picker.Item label="Australia" value="Australia" />
                    </Picker>
                  </View> */}

                </View>
              </Modal>
              <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.ModalVisibleStatus}
                onRequestClose={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }}>

                <View style={styles.MediaBtnContaner}>
                  <ScrollView style={styles.MediaBtnAddproduct}>
                    <View style={styles.MediaBtnAddproductCtn}>
                      <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={this.onPickImage} style={{ justifyContent: 'center' }}>
                          {this.renderAddProduct()}
                        </TouchableOpacity>
                        {this.renderAddPostImage()}
                      </View>
                    </View>
                    <CText cStyle={{ color: '#D20000', fontSize: 11, textAlign: 'center' }}>*For larger images it takes time to upload:*</CText>
                    <View style={[styles.mH10, styles.mT5]}>
                      <CText cStyle={{ margin: 3, fontFamily:'NeueKabel-Regular' }}>Product Name</CText>
                      <View style={{borderWidth: 0.4, borderColor:'#EEE'}}>
                        <TextInput style={{ fontFamily:'NeueKabel-Regular' }} value={this.state.addPostProductName}
                          onChangeText={(addPostProductName) => this.setState({ addPostProductName })}
                          underlineColorAndroid="transparent"
                          placeholderTextColor='#434343'
                          multiline={true}
                        />
                      </View>
                    </View>
                    <View style={[styles.mH10, styles.mT5]}>
                      <CText cStyle={{ margin: 3, fontFamily:'NeueKabel-Regular' }}>Description</CText>
                      <View style={{borderWidth: 0.4, borderColor:'#EEE'}}>
                        <TextInput style={{ fontFamily:'NeueKabel-Regular' }} value={this.state.addPostDescription}
                          onChangeText={(addPostDescription) => this.setState({ addPostDescription })}
                          underlineColorAndroid="transparent"
                          placeholderTextColor='#434343'
                          multiline={true}
                        />
                      </View>
                    </View>
                    <View style={[styles.mH10, styles.mT5]}>
                      <CText cStyle={{ margin: 3, fontFamily:'NeueKabel-Regular' }}>Shopped at</CText>
                      <View style={{borderWidth: 0.4, borderColor:'#EEE'}}>
                        <TextInput style={{fontFamily:'NeueKabel-Regular' }} value={this.state.addPostShoppedAt}
                          onChangeText={(addPostShoppedAt) => this.addPostSearchResult(addPostShoppedAt)}
                          underlineColorAndroid="transparent"
                          placeholderTextColor='#434343'
                          multiline={true}
                        />
                        <View style={{ display: this.state.shopsListBool, backgroundColor: '#EEE' }}>
                          <FlatList numColumns={1}
                            data={this.state.shopsListForPost}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) => this.renderShopsList(item)}
                            extraData={this.state.shopsListForPost} />
                        </View>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent:'space-between', margin: 10, alignItems:'center' }}>
                    <CButton onPress={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }}>
                      <CText cStyle={{ color: '#979797', fontFamily:'NeueKabel-Regular' }} >Cancel</CText>
                    </CButton>
                    {this.renderAddPostLoading()}
                    </View> 
                  </ScrollView>
                </View>

              </Modal>
            </View>
          </View>
        </View>
        <ScrollView scrollEnabled={true} keyboardDismissMode='interactive' showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap' }}>
            <FlatList numColumns={1}
              data={this.state.MPostData}
              keyExtractor={(item, index) => index}
              //renderItem={this.itemRender}
              renderItem={({ item }) => this.postproductfullinfo(item)}
              extraData={this.state.MPostData} />
          </View>
        </ScrollView>

        <View style={{ justifyContent: 'flex-end', marginRight: 20, bottom: 20 }}>
          <View style={{ position: 'absolute', alignSelf: 'flex-end', backgroundColor: 'crimson', width: 60, height: 60, borderRadius: 80 }}>
            <TouchableOpacity onPress={() => { this.ShowModalFunction(true) }}>
              <View style={{ margin: 12, alignSelf: 'center', }}>
                <CText cStyle={{ fontSize: 11.7, marginLeft: 2, color: '#ffffff' }}>ADD</CText>
                <CText cStyle={{ fontSize: 11.7, color: '#ffffff' }}>POST</CText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

