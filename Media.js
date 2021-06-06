import React, { Component } from 'react';
import { View, Image, Modal, Picker, ScrollView, Text, Dimensions, TouchableOpacity, TextInput, FlatList, NativeModules, Alert } from 'react-native';
import { CText, CInput, CButton,CModal, CRadio, CSpinner,SSpinner } from '../common/index';
import styles from '../common/styles';
import Utils from '../common/Utils';
import Config from '../config/Config';
import ImagePicker from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';

const dWindow = Dimensions.get('window');

const imgPickerOptions = {
  title: 'Select image', storageOptions: {skipBackup: true,path: 'images'},
  maxWidth: 1024, maxHeight: 512, quality: 1, noData: true
};

export default class Media extends Component {

  state = {
    count: 0, token:'', ownid:'', spinnerBool: true, mediaData:[], gender: [], searchtext:'', showFiltersBool:false,
    addPostImgUrl: '', addPostImage: '', imageUploadBool: false, followTxt: 'Follow', ModalVisibleStatus: false,
    fMaleBool: 'none', fFemaleBool: 'none', fFollowDisplay:'none', fFollowBool: false,shopsListForPost: [],storeShopsListTemp: [],
    shopSelectedId:'', shopNameSelected: '',Cvisible:false,alertContent:'',shopsListBool:'none',smallSpinnerBool:false
    ,RemoveVisible:'none',Cmodalname:'Alert'
             ,buttonText:'Ok'
  };

  componentWillMount() {
    const self = this;
    this.imageCacheCount = 0;
    this.removepostid=null;
    this.onPickImage = this.onPickImage.bind(this);
    this.onReset = this.onReset.bind(this);
    Utils.getToken('user', function (tResp, tStat) {
      if (tStat) {
        if (tResp != '') {
          self.setState({ token: tResp.token, ownid: tResp.id }, () => {
            self.getmediaItems(self.state.ownid, false);
          });
        }
      } else {
        self.getmediaItems(null, false);
      }
    });
  }

  spinnerLoad() {
    if (this.state.spinnerBool)
      return <CSpinner />;
    return false;
  }
  smallSpinnerLoad(){
    if (this.state.smallSpinnerBool)
      return <SSpinner />;
    return false;
  }

  getmediaItems(ownerID, followBool) {
    // console.warn(this.state.gender, 'GEN => ', followBool);
    const self = this;
    Utils.dbCall(Config.routes.getPostsWithLcs, 'POST', null, { category: self.state.gender, idUser: null,
    ownId: ownerID, followersPosts:followBool, selectedCountry: [], selectedCity: [], searchText: self.state.searchtext }, function (resp) {
      self.setState({ spinnerBool: false });
      if (resp.status) {
        console.log(resp,'resp');
        let tempArr = [];
        for(let i = 0; i < resp.posts.length; i++){
          resp.posts[i].seeMoreBool = false;
          for (let j = 0; j < resp.posts[i].comments.length; j++) {
            resp.posts[i].comments[j].commentBool = 'none';
          }
          tempArr.push(resp.posts[i]);
        }
        self.setState({ mediaData: tempArr, spinnerBool: false, gender: [] });
        self.loadAllShopsForPost();
      }else{
        // alert('internal error data is not fetched'); 
        self.setState({Cvisible:true,alertContent:'internal error data is not fetched'});
      }
    });
  }

  renderMediaFlatListPosts(item, i) {
    let customShopName = '';
    let shopLocation = '';
    let ownerId = '';
    if (this.state.ownid === '') {
      ownerId = '401';
    } else {
      ownerId = this.state.ownid;
    }
    if (item._id.hasOwnProperty('shop')) {
      customShopName = item._id.shop.shopName;
      shopLocation = item._id.shop.city + ',' + item._id.shop.country
    } else {
      customShopName = item._id.content.customShopname;
      shopLocation = ''
    }
    return (<View style={[styles.sMediaPostContainer]}>
      <View style={[styles.row, styles.jspacebn, styles.padH10, styles.padV5]}>
        <View style={[styles.row, styles.jspacebn, styles.aitCenter]}>
          <Image source={{uri: Config.routes.base + Config.routes.getProfilePic + '/' + item._id.user._id }} style={[styles.sMediaIcons30]} />
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('UserPosts', { 'user': item._id.user._id})}}>
            <CText cStyle={[styles.mL10]}>{item._id.user.fullName}</CText>
          </TouchableOpacity>
        </View>
        <View style={styles.mT5}>
          <CText cStyle={[styles.FntS12]}>Shopped at {customShopName.substr(0,30)}</CText>
          <CText cStyle={[styles.FntS12]}>{shopLocation}</CText>
        </View>
      </View>
      <AutoHeightImage width={dWindow.width-22} source={{uri: Config.routes.base + '/v1/user/getPostPic/' + item._id.content.images[0] + '?d=' + this.imageCacheCount }} />
      <View style={[styles.p10]}>
        <View style={[styles.row, styles.jspacebn]}>
          <View style={[styles.row, styles.jspacebn, styles.aitCenter]}>
            <TouchableOpacity style={[styles.row, styles.jspacebn, styles.aitCenter]} onPress={() => this.LikePost(item._id._id)} >
              <Image style={[styles.sMediaIcons15]} source={require('../images/mediaLikesym.png')} />
              <CText cStyle={[styles.mL5]}>{item._id.likes.length} Likes</CText>
            </TouchableOpacity>
            <Image style={[styles.mL15, styles.sMediaIcons18]} source={require('../images/Media_Message.png')} />
            <CText cStyle={[styles.mL5]}>{item.comments.length} Comment</CText>
          </View>
          <CButton onPress={() => this.FollowDBcall(item._id.user._id)} cStyle={[styles.smediaFollowBtn]}>
            <CText cStyle={[styles.cFFF]}>{item.isFollowed ? 'Following' : 'Follow'}</CText>
          </CButton>
        </View>
        {/* Title & Description */}
        <View style={[styles.row, styles.jspacebn, styles.padV10, styles.mT10]}>
          <View>
            <CText cStyle={[styles.FntS16, styles.c000]}>{item._id.content.productName}</CText>
            <CText cStyle={[styles.FntS12, styles.c333]}>{item._id.content.description.substr(0, 70)}</CText>
          </View>
          <View>
            <CText cStyle={[styles.FntS12, styles.c777]}>{this.calculateTimePost(new Date(), new Date(item._id.createdAt))}</CText>
          </View>
        </View>

        {/* Write comments */}
        <View style={[styles.row, styles.aitCenter, styles.mT10]}>
          <Image source={{ uri: Config.routes.base + Config.routes.getProfilePic + '/' + ownerId  }} style={[styles.sMediaIcons30]} />
          <View style={[styles.row, styles.aitCenter]}>
            <TextInput style={[styles.sMediaMainCommentText]} underlineColorAndroid='transparent' multiline={true} placeholder='write a comment'
                value={this.state['commentText' + item._id._id]} onChangeText={(commentText) => this.setState({ ['commentText' + item._id._id]: commentText })} />
            <TouchableOpacity style={[styles.sMediaMainCommentBtn,{borderWidth:0.4,borderColor:'#b4b4b4'}]} onPress={() => this.CommentCall(item._id._id)}>
                <Image source={require('../images/post-comment-arrow.png')} style={{width:25, height:30, resizeMode:'contain'}} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments design - can be multiple */}
        <View style={[styles.mT10]}>
        {this.renderIndividualComments(item.comments, item._id._id)}
        </View>
        
        {this.renderViewMoreCommentSection(item.moreComments, item.seeMoreBool, item._id._id, i)}
      </View>

    </View>)
  }

  renderViewMoreCommentSection(mCommentBool, sMoreBool, postId, iVal){
    if(mCommentBool){
      return (<View>
        <View style={[styles.mT10]}>
        {this.smallSpinnerLoad()}
          {this.renderMoreComments(postId, iVal)}
        </View>
        <TouchableOpacity onPress={() => { this.MoreThanOneComment(sMoreBool, postId, iVal) }}>
          <CText cStyle={[styles.aslEnd, styles.mT5]}>{sMoreBool === false ? 'See more' : 'See less'}</CText>
        </TouchableOpacity>
      </View>);
    } else {
      return;
    }
  }
commentusername(username){
  if(username.userId.fullName){
    return(
      <CText cStyle={[styles.c000]}>{username.userId.fullName}</CText>
    );
  }else{
    return false;
    // (
    //   <CText cStyle={[styles.c000]}>{username.userId.fullName}</CText>
    // );
  }
}
  renderMoreComments(postId, iVal){
    const self = this; 
    if(this.state['moreComments' + iVal]){
      console.log(this.state['moreComments' + iVal], ' ----->>>>');
      let content = [];
      let data = this.state['moreComments' + iVal];
      for(let i = 0; i < data.length; i++){
        // console.log(data,'data===>');
        content.push(<View key={i}>
          <View style={[styles.row, styles.aitCenter, styles.mT5,{width:'75%'}]}>
            <Image source={{ uri: Config.routes.base + Config.routes.getProfilePic + '/' + data[i].userId }} style={[styles.sMediaIcons30]} />
            <View style={[styles.mL10]}>
              {this.commentusername(data[i])}
              <CText>{data[i].content}</CText>
            </View>
            <View style={styles.aslEnd}>
              {this.viewDeleteCommentOption(data[i].userId, data[i]._id, data[i].content, iVal, 'MORE')}
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, display:data[i].editCommentBool }}>
            <View style={{ width: '80%', borderWidth: 1, borderColor: '#EEE', marginLeft: 5 }}>
              <TextInput multiline={true}
                placeholder='Write a Comment'
                value={self.state['commentTexts' + data[i]._id]} onChangeText={(commentTexts) => self.setState({ ['commentTexts' + data[i]._id]: commentTexts }, () => { console.log(self.state['commentTexts' + data[i]._id + '']); console.log(data[i]._id) })}
                underlineColorAndroid='transparent'
                style={[styles.sMediaMainCommentText]} />
            </View>
            <TouchableOpacity style={{ backgroundColor:'#fff', borderColor:'#b4b4b4',borderWidth:0.4,borderTopRightRadius: 5, borderBottomRightRadius: 5, padding: 4.5 }}
              onPress={() => self.updateComments(data[i]._id, self.state['commentTexts' + data[i]._id], postId, iVal)} >
              <Image source={require('../images/post-comment-arrow.png')} style={{ width: 25, height: 32, resizeMode: 'contain' }} />
            </TouchableOpacity>
          </View>
        </View>)
      }
      return content;
    } else {
      console.log('fdfdfdfdf')
      return;
    }
    
  }

  updateComments(commentId, comment, postId, iVal){
    console.log(JSON.stringify({
      commentId: commentId,
      content: comment
    }));
    const self = this;
    if (comment === undefined) {
      // alert('please write a comment before submitting');
      self.setState({Cvisible:true,alertContent:'please write a comment before submitting'});
      self.CommentCheck(comId)
    } else {
      Utils.dbCall(Config.routes.updateSMediaComment, 'PUT', { token: self.state.token }, {
        commentId: commentId,
        content: comment
      }, function (resp) {
        // console.log(resp, ' => commentIDDDD');
        self.getmediaItems(self.state.ownid, false);
        self.MoreThanOneComment('', postId, iVal)
      });
    }
  }

  renderIndividualComments(data, postId){
    // console.log(data, ' ----->>>>')
    const self = this;
    let content = [];
    for(let i = 0; i < data.length; i++){
      content.push(<View key={i}>
        <View style={[styles.row, styles.aitCenter, styles.mT5]}>
          <Image source={{ uri: Config.routes.base + Config.routes.getProfilePic + '/' + data[i].userId }} style={[styles.sMediaIcons30]} />
          <View style={[styles.mL10]}>
            <CText cStyle={[styles.c000]}>{data[i].userName}</CText>
            <CText>{data[i].content}</CText>
          </View>
          <View>
            {this.viewDeleteCommentOption(data[i].userId, data[i]._id, data[i].content, '', 'MAIN')}
          </View>
        </View>
        <View style={{ flexDirection: 'row',marginVertical:5, marginLeft:50,  display:data[i].commentBool }}>
            <TextInput multiline={true}
              placeholder='write a comment'
              value={self.state['commentTexts' + data[i]._id]} onChangeText={(commentTexts) => self.setState({ ['commentTexts' + data[i]._id]: commentTexts }, () => { console.log(self.state['commentTexts' + data[i]._id + '']); console.log(data[i]._id) })}
              underlineColorAndroid='transparent'
              style={[{width:'88%',paddingLeft:10, height:40, borderWidth:0.4, borderColor:'#b4b4b4'}]} />
          <TouchableOpacity style={{backgroundColor: '#fff', borderColor:'#b4b4b4',borderWidth:0.4, borderTopRightRadius: 5, borderBottomRightRadius: 5, padding: 4}}
            onPress={() => self.updateComments(data[i]._id, self.state['commentTexts' + data[i]._id], postId, data[i]._id)}>
            <Image source={require('../images/post-comment-arrow.png')} style={{ width: 25, height: 32, resizeMode: 'contain' }} />
          </TouchableOpacity>
        </View>
      </View>)
    }
    return content;
  }

  viewDeleteCommentOption(userId, comId, content, iVal, commentType) { 
    const self = this;
    // console.log('Comid   '+comId+'   content   '+content);
    if (userId === self.state.ownid) {
      return (<View style={[styles.row, styles.mH15]}>
          <TouchableOpacity style={[styles.smediaFollowBtn]} onPress={() => {
            if(commentType === 'MORE'){
              self.changeEditCommentStatus(comId, iVal);
            } else {
              console.log('main edit')
              self.changeEditMainCommentStatus(comId);
            }
          }} >
            <CText cStyle={[styles.cFFF, styles.FntS12]}>Edit</CText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smediaFollowBtn, styles.mL5]}  
            onPress={() => {
              this.setState({Cvisible:true,alertContent:'Are you sure you want to delete the post', Cmodalname:'Remove',
              RemoveVisible:'flex',buttonText:'No'
              });
            this.removepostid=comId
              // Alert.alert('Delete Comment','Are you sure u want to delete the Comment.',
              // [{text: 'NO', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              //    {text: 'YES', onPress: () => {this.DeleteComment(comId)}}])
                 }}>
            <CText cStyle={[styles.cFFF, styles.FntS12]}>Delete</CText>
          </TouchableOpacity>
      </View>);
    } else {
      return;
    }
  }

  changeEditCommentStatus(commentId, iVal){
    const self = this;
    let data = this.state['moreComments' + iVal];
    for(let i = 0; i < data.length; i++){
      if(data[i]._id === commentId){
        data[i].editCommentBool = 'flex';
      }
    }
    self.setState({ ['moreComments' + iVal]:data });
  }

  changeEditMainCommentStatus(commentId){
    const self = this;
    let data = self.state.mediaData;
    for(let i = 0; i < data.length; i++){
      for(let j = 0; j < data[i].comments.length; j++){
        if(commentId === data[i].comments[j]._id){
          data[i].comments[j].commentBool = 'flex';
        }
      }
    }
    self.setState({ mediaData: data });
  }

  LikePost(postID) {
    const self = this;
    if (self.state.token) {
      Utils.dbCall(Config.routes.addLike, 'POST', { token: self.state.token }, { postId: postID }, function (resp) {
        if (resp.status) {
          self.getmediaItems(self.state.ownid,false);
        }
      });
    } else {
      self.props.navigation.navigate('Login');
    }
  }

  FollowDBcall(User) {
    if (this.state.token) {
      const self = this;
      Utils.dbCall(Config.routes.followUser, 'PUT', { token: self.state.token }, { userId: User }, function (resp) {
        if (resp.status) {
          if (resp.message === "Successfully added follower") {
            self.setState({ followTxt: 'Following' }, () => {
              self.getmediaItems(self.state.ownid,false);
            });
          }
          if (resp.message === "Successfully removed follower") {
            self.setState({ followTxt: 'Follow' }, () => {
              self.getmediaItems(self.state.ownid,false);
            });
          }
        }
      });
    } else {
      self.props.navigation.navigate('Login');
    }
  }

  CommentCall(postid) {
    if (this.state.token) {
      const self = this;
      if (self.state.token === '') {
        self.props.navigation.navigate('Login');
      } else {
        if(self.state['commentText' + postid]=== undefined){
          self.setState({Cvisible:true,alertContent:'please write a comment before submitting'});
          // alert('please write a comment before submitting');
        } else{
          Utils.dbCall(Config.routes.addSMediaComment, 'POST', { token: self.state.token }, {
            content: self.state['commentText' + postid],
            postId: postid
          }, function (resp) {
            if (resp.status) {
              self.setState({Cvisible:true,alertContent:'Your Comment is successfully posted'});
              // alert('Your Comment is successfully posted');
              self.setState({ ['commentText' + postid]: '' });
              self.getmediaItems(self.state.ownid, false);
            }
          });
        }
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  MoreThanOneComment(value, postId, iVal) {
    const self = this;
    let tempPosts = this.state.mediaData;
    
    for(let i = 0; i < tempPosts.length; i++){
      if(tempPosts[i]._id._id === postId)
        tempPosts[i].seeMoreBool = !value;
    }
    self.setState({ mediaData: tempPosts, ['moreComments' + iVal]:[] }, () => { console.log(self.state.mediaData + 'Seemore') })
    
    if(!value){
      Utils.dbCall(Config.routes.fetchSMMoreComments, 'POST', { token: self.state.token }, {
        id: postId,
        total: 0
      }, function (resp) {
        // console.log(resp, ' ===>>>>>>>>>');
        if(resp.status){
          let tempArr = [];
          for(let i = 0; i < resp.comments.length; i++){
            if(i !== 0){
              resp.comments[i].editCommentBool = 'none';
              tempArr.push(resp.comments[i]);
            }
          }
          // console.log(tempArr, ' =====?????????????????')
          self.setState({ ['moreComments' + iVal]:tempArr });
        }
      });
    }
  }

  DeleteComment() {
    const self=this;
    let comId= self.removepostid;
    Utils.dbCall(Config.routes.deleteSMediaComment, 'POST', { token: self.state.token }, { commentId: comId }, function (resp) {
      if(resp.status) {
        self.getmediaItems(self.state.ownid, false);
        self.setState({Cvisible:false,buttonText:'Ok',Cmodalname:'Alert',RemoveVisible:'none'});
      } else {
        self.setState({Cvisible:true,alertContent:resp.message});
        // alert(resp.message);
      }
    });
  }

  calculateTimePost(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;
    if (elapsed < msPerMinute) {
      return Math.round(elapsed/1000) + ' seconds ago';   
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    } else if (elapsed < msPerDay ) {
      return Math.round(elapsed/msPerHour ) + ' hours ago';   
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed/msPerDay) + ' days ago';   
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed/msPerMonth) + ' months ago';   
    } else {
      return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
  }

  // ADDING PRODUCT FUNCTIONALITY
  renderAddProduct() {
    if (this.state.imageUploadBool) {
      return (<CText cStyle={[styles.MediaBtnAddproductText, { fontFamily: 'NeueKabel-Regular' }]}>Loading... Please wait!!</CText>)
    } else {
      return (<CText cStyle={[styles.MediaBtnAddproductText, { fontFamily: 'NeueKabel-Regular' }]}>Add Product</CText>);
    }
    this.setState({ModalVisibleStatus:false});          
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

  renderAddPostLoading() {
    if (this.state.imageUploadBool) {
      return (<View style={{ backgroundColor: '#c01530', marginHorizontal: 15, borderRadius: 5 }}>
        <CText cStyle={{ color: '#fff', margin: 10, fontFamily: 'NeueKabel-Regular' }}>Loading... Please wait!!</CText></View>)
    } else {
      return (<View style={{ backgroundColor: '#c01530', marginHorizontal: 15, borderRadius: 5 }}><CButton onPress={() => { this.submitAddPost() }}>
        <CText cStyle={{ color: '#fff', margin: 10, fontFamily: 'NeueKabel-Regular' }}> Add Post</CText></CButton></View>);
    }
    this.setState({ModalVisibleStatus:false});              
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
        this.setState({Cvisible:true,alertContent:'Could not select image'});
        // alert('Could not select image');
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
      // alert('Please add your image');
      this.setState({Cvisible:true,alertContent:'Please add your image'});
      return false;
    } else if (!this.state.addPostProductName) {
      // alert('Please provide Product Name');
      this.setState({Cvisible:true,alertContent:'Please provide Product Name'});
      return false;
    } else if (!this.state.addPostDescription) {
      // alert('Please provide Product Name');
      this.setState({Cvisible:true,alertContent:'Please provide Product Name'});
      return false;
    } else if (!cShopName) {
      // alert('Please provide where you shopped at');
      this.setState({Cvisible:true,alertContent:'Please provide where you shopped at'});
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
          self.getmediaItems(null,false);
          // alert('Post added successfully');
          self.setState({Cvisible:true,alertContent:'Post added successfully'});
          self.setState({
            ModalVisibleStatus: false, addPostProductName: '', addPostShoppedAt: '', addPostImage: '',
            addPostDescription: '', shopSelectedId: '', shopSelectedId: '', shopNameSelected: ''
          });
        } else {
          // alert('Error, adding post');
          self.setState({Cvisible:true,alertContent:'Error, adding post'});
        }
      });
    }
  }

  ShowModalFunction(visible) {
    if (this.state.token) {
      this.setState({ ModalVisibleStatus: visible });
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  filterRadioSelection(flag){
    const self = this;
    if(flag === 'M'){
      self.changeFilterStatus(self.state.fMaleBool, 'fMaleBool');
    } else {
      self.changeFilterStatus(self.state.fFemaleBool, 'fFemaleBool');
    }
  }

  changeFilterStatus(value, stateName) {
    const self = this;
    if(value === 'flex'){
      self.setState({ [stateName]: 'none' }, () => {
        self.setState({ gender: self.getGenderStatus(), showFiltersBool: !this.state.showFiltersBool }, () => {
          self.getmediaItems(self.state.ownid, self.state.fFollowBool);
          // self.changeMainData();
        });
      });
    } else {
      self.setState({ [stateName]: 'flex' }, () => {
        self.setState({ gender: self.getGenderStatus(), showFiltersBool: !this.state.showFiltersBool }, () => {
          self.getmediaItems(self.state.ownid, self.state.fFollowBool);
          // self.changeMainData();
        })
      });
    }
  }

  // changeMainData(){
  //   let tempData = this.state.mediaData;
  //   let dataArray = [];
  //   for(let i = 0; i < tempData.length; i++){
  //     if(tempData[i]._id.user.gender === this.state.gender[0]){
  //       dataArray.push(tempData[i]);
  //     }
  //   }
  //   this.setState({ mediaData: dataArray });
  // }

  getGenderStatus(){
    const self = this;
    if(self.state.fMaleBool === 'flex' && self.state.fFemaleBool === 'flex'){
      return ['Male', 'Female'];
    } else if(self.state.fMaleBool === 'none' && self.state.fFemaleBool === 'none') {
      return [];
    } else if(self.state.fMaleBool === 'flex' && self.state.fFemaleBool === 'none') {
      return ['Male'];
    } else if(self.state.fMaleBool === 'none' && self.state.fFemaleBool === 'flex') {
      return ['Female'];
    }
  }

  Followingchange(){
    const self = this;
    if(self.state.fFollowDisplay === 'flex'){
      self.setState({ fFollowDisplay: 'none', fFollowBool: false, showFiltersBool: !this.state.showFiltersBool }, () => {
        self.getmediaItems(self.state.ownid, self.state.fFollowBool);
      });
    } else {
      self.setState({ fFollowDisplay: 'flex', fFollowBool: true, showFiltersBool: !this.state.showFiltersBool }, () => {
        self.getmediaItems(self.state.ownid, self.state.fFollowBool);
      });
    }
  }
  
  loadAllShopsForPost() {
    const self = this;
    Utils.dbCall(Config.routes.getAllShopsForPost, 'GET', { token: this.state.token }, {}, function (resp) {
      if (resp.status) {
        self.setState({ shopsListForPost: resp.shops, storeShopsListTemp: resp.shops });
      }
    });
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

  render() {
    return (
      <View style={[styles.flex1, styles.bgfff]}>
        {this.spinnerLoad()}
        <View style={styles.MediaHeader}>
          <CText cStyle={[styles.MediaHeaderText, { alignSelf: 'center'}]}>MEDIA</CText>
          <TextInput style={[{ width: '55%',color:'#fff',height:40,marginTop:5}]}
            underlineColorAndroid="transparent"
            value={this.state.searchtext} onChangeText={(searchtext) => this.setState({ searchtext })}
            placeholderTextColor='#434343'
            placeholder='search' />
          <View style={[styles.m5, styles.row,{marginLeft:0,marginTop:10}]}>
            <TouchableOpacity 
            onPress={()=>this.componentWillMount()} 
            >
              <Image source={require('../images/Search.png')} style={{ height: 18, width: 16, marginTop: 10,marginRight:10,resizeMode:'contain' }} />
            </TouchableOpacity>
            <View>
              <CButton onPress={() => { this.setState({ showFiltersBool: !this.state.showFiltersBool }) }}>
                <Image style={{ height: 17, width: 16, margin: 10,resizeMode:'contain',marginHorizontal:10}} source={require('../images/mediaFilter.png')} />
              </CButton>
              <Modal visible={this.state.showFiltersBool} transparent={true} animationType={'slide'} onRequestClose={() => Console.warn("close filter")}>
                <View style={{ flex: 1, backgroundColor: 'rgba(20,20,20,0.5)',}}>
                <View
                  style={{borderWidth:0.5,backgroundColor:'#fff',margin:10,height: 265, width: (Dimensions.get('window').width) / 1.8, alignSelf: 'flex-end', marginTop: 55 }}>
                  <View style={{ borderBottomWidth: 0.5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CText cStyle={{ fontSize: 10, margin: 15 }}>FILTER BY</CText>
                    <TouchableOpacity onPress={() => {this.setState({showFiltersBool: false})}}>
                      <CText cStyle={{ fontSize: 10, margin: 15 }}>CLOSE</CText>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <View style={[styles.mTop10]}>
                      <View style={[styles.mTop10]}>
                        <CRadio label='Male' activeStyle={{ display: this.state.fMaleBool }} onPress={() => this.filterRadioSelection('M')} />
                      </View>
                      <View style={[styles.mTop10]}>
                        <CRadio label='Female' activeStyle={{ display: this.state.fFemaleBool }} onPress={() => this.filterRadioSelection('F')} />
                      </View>
                      <View style={[styles.mTop10]}>
                        <CRadio label='Following' activeStyle={{ display: this.state.fFollowDisplay }} onPress={() => this.Followingchange()} />
                      </View>
                    </View>
                  </View>
                  <CText cStyle={{ fontSize: 10, marginLeft: 15, margin: 5 }}>Country *</CText>

                  <View style={{ margin: 15, marginTop: 5, borderWidth: 0.5, borderRadius: 3 }}>
                    <Picker
                      style={{width:170,height:45}}
                      selectedValue={this.state.test}
                      onValueChange={(itemValue, itemIndex) => this.setState({ test: itemValue })}>
                      <Picker.Item label="India" value="India" />
                      <Picker.Item label="America" value="America" />
                      <Picker.Item label="Australia" value="Australia" />
                    </Picker>
                  </View>

                </View>
                </View>
              </Modal>
            </View>
          </View>
        </View>



        <ScrollView style={{marginBottom:40}}>
          {/* {this.renderMediaPosts()} */}
          <FlatList showsHorizontalScrollIndicator={false}
            data={this.state.mediaData}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => this.renderMediaFlatListPosts(item, index)}
            extraData={this.state}
          />
        </ScrollView>

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
                <TouchableOpacity onPress={() => { this.ShowModalFunction(!this.state.ModalVisibleStatus) }}>
                    <Text style={{ color: '#979797', fontFamily:'NeueKabel-Regular' }}>Cancel</Text>
                </TouchableOpacity>
                {this.renderAddPostLoading()}
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* ADD POST BUTTON */}
        <View style={[styles.jEnd, styles.mR20, styles.mB10]}>
          <View style={[styles.sMediaAddPostBtn]}>
            <TouchableOpacity style={{top:15}} onPress={() => { this.ShowModalFunction(true) }}>
                <CText cStyle={[styles.cFFF, styles.FntS11, styles.aslCenter]}>ADD</CText>
                <CText cStyle={[styles.cFFF, styles.FntS11, styles.aslCenter]}>POST</CText>
            </TouchableOpacity>
          </View>
          <CModal visible={this.state.Cvisible} 
                          closeButton={()=>{this.setState({Cvisible:false});}} 
                          buttonClick={()=>{this.setState({Cvisible:false});}} 
                          buttonText={this.state.buttonText}
                          modalname={this.state.Cmodalname}
                          buttonClickRemove={() => this.DeleteComment()}
                          buttonVisible={this.state.RemoveVisible}>
                  <CText cStyle={[styles.FntS14,{fontSize:16}]}>{this.state.alertContent}</CText>
                  </CModal>
        </View>
      </View>
    );
  }
}