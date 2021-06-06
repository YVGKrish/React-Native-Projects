import {AsyncStorage} from 'react-native';
import axios from 'axios';
import _ from 'underscore';

import config from '../config/Config';
var Utils = function() {};

Utils.prototype.isValidMobile = function (phoneNumber) {
    return phoneNumber && _.isNumber(phoneNumber) && (phoneNumber.toString().length === 10);
};

Utils.prototype.isValidNumber = function(value){
    return /^[0-9]*$/.test(value);
};

Utils.prototype.isValidEmail = function (email) {
    return email && /^\S+@\S+\.\S+/.test(email);
};

Utils.prototype.isValidPassword = function (pwd) {
    return _.isString(pwd) && (pwd.length >= config.appUtils.passwordLength);
};
Utils.prototype.isValidPincode=function(pin){
    console.log(pin.length)
    console.log(pin.length === config.appUtils.pincodelenghth,'gghgu');
    return _.isNumber(Number(pin)) &&(pin.length == config.appUtils.pincodelenghth);
}

Utils.prototype.commonData = function(type){
    if(type === 'Category'){
        return ['Men', 'Women', 'Kids', 'Home & Living'];
    } else if(type === 'SubCategory'){
        return [{'Men': ['Topwear', 'Bottomwear', 'Sports & Active Wear', 'Indian & Festive Wear', 'Inner & Sleepwear', 'Footwear', 'Fashion Accessories']},
        {'Women':['Indian & Fusion Wear','Western Wear','Lingerie & Sleepwear','Footwear','Sports & Active Wear', 'Fashion Accessories']},
        {'Kids': ['Boys Clothing','Girls Clothing','Boys Footwear','Girls Footwear','Kids Accessories', 'Brands']},
        {'Home & Living':['Bed Linen & Furnishing','Bath','Kitchen & Table','Home Decor','Lamps and Lighting', 'Brands']}];
    }
};

Utils.prototype.dbCall = function(url, method, header, data, callback){
    // console.log(url)
    let inputParams = {};
    if(method === 'GET'){
        inputParams = { url: config.routes.base + url, method: method, headers: header };
    } else {
        inputParams = { url: config.routes.base + url, method: method, headers: header, data:data };
    }
    if(method=== 'PUT')
    {
        inputParams= { url: config.routes.base + url, method: method, headers: header, data:data }
    }
    axios(inputParams)
    .then((response) => {
        callback(response.data, true);
    })
    .catch((error) => {
        console.log('Error: ' + error + ' = From: ' + url);
        callback(error, false);
    });
};
Utils.prototype.getToken = function(key, callBack){
    AsyncStorage.getItem('fashionpecks:' + key, (err, resp) => {
        console.log(resp,'resp');
        if(err){
            callBack('Error fetching token', false);
        }else{
            if(resp == null || resp === "")
            {
                callBack('', false);
            }else{
                callBack(JSON.parse(resp), true);
            }
    }
           
    });
};

Utils.prototype.setToken = function(key, value, callBack){
    AsyncStorage.setItem('fashionpecks:' + key, JSON.stringify(value), (err) => {
        if(err)
            callBack('Error setting token', false);
        else
            callBack(null, true);
    });
};

Utils.prototype.sortByKey = function(array, key) {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        return ((y < x) ? -1 : ((y > x) ? 1 : 0));
    });
 };
 Utils.prototype.sortByKeyLowtohigh = function(array, key) {
    return array.sort(function (a, b) {
        let x = a[key];
        let y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
 };

 
Utils.prototype.setProfilePic = function(key, value, callBack){
    AsyncStorage.setItem('fashionpecks:' + key,value, (err) => {
        if(err){
            callBack('Error addcount', false);
        }else{
            callBack(null, true);
        }
    });
    }

Utils.prototype.setWishList = function(key, value, callBack){
    AsyncStorage.setItem('fashionpecks:' + key,JSON.stringify(value), (err) => {
        if(err){
            callBack('Error addcount', false);
        }else{
            callBack(null, true);
        }
    });
    }
    Utils.prototype.getWishList = function( key,callBack){
        AsyncStorage.getItem('fashionpecks:'+ key, (err, resp) => {
            if(err){
                callBack('Error fetching cart item', false);
            }else
            if(resp == null)
            {
                callBack('', false);
            }else{
                callBack(JSON.parse(resp), true);
            }
        });
    };
    Utils.prototype.setBagCount = function(key, value, callBack){
        AsyncStorage.setItem('fashionpecks:' + key,JSON.stringify(value), (err) => {
            if(err){
                callBack('Error setting cart count', false);
            }else{
                callBack(null, true);
            }
        });
        }
        Utils.prototype.getBagCount = function( key,callBack){
            AsyncStorage.getItem('fashionpecks:'+ key, (err, resp) => {
                if(err){
                    callBack('Error fetching cart Count', false);
                }else
                if(resp == null)
                {
                    callBack('', false);
                }else{
                    callBack(JSON.parse(resp), true);
                }
            });
        };

    Utils.prototype.setCart = function(key, value, callBack){
        AsyncStorage.setItem('fashionpecks:'+ key , JSON.stringify(value), (err) => {
            if(err)
                callBack('Error setting cart', false);
            else
                callBack(null, true);
        });
        
    };
    Utils.prototype.getCart = function( key,callBack){
        AsyncStorage.getItem('fashionpecks:'+ key, (err, resp) => {
            if(err)
                callBack('Error fetching cart item', false);
            else
            if(resp == null)
            {
                callBack('', false);
            }else{
                callBack(JSON.parse(resp), true);
            }
               
        });
    };

export default new Utils();