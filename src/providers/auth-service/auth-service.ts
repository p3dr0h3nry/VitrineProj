// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';

// Endereço API restful
let apiUrl = "http://www.prod.agesi.com.br/api_restful/api/";
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http, private alertCtrl:AlertController) {
    //console.log('Hello AuthServiceProvider Provider');
  }

  post(data, type) {
    console.log(apiUrl + type+JSON.stringify(data));
    return new Promise((resolve, reject) => {
      // let headers = new Headers();
      // this.http.post(apiUrl + type, JSON.stringify(data)).subscribe(res => {
      //   resolve(res);
      // }), (err) => {
      //   reject(err);
      // }
    })
  }

  postClient(data, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.post(apiUrl + type, JSON.stringify(data)).subscribe(res => {
        resolve(res);
      }), (err) => {
        reject(err);
      }
    })
  }

  postProfile(data, type) {
    console.log(apiUrl + type+JSON.stringify(data)); 
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.post(apiUrl + type, JSON.stringify(data)).subscribe(res => {
        resolve(res);
      }), (err) => {
        reject(err);
      }
    })
  }
  deletePost(data, type) {
    return new Promise((resolve, reject) => {
     let headers = new Headers();
     this.http.post(apiUrl + type, JSON.stringify(data)).subscribe(res => {
       resolve(res);
     }), (err) => {
       reject(err);
     }
   })
 }



  // Login
  getUser(data, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.post(apiUrl + type, JSON.stringify(data)).subscribe(res => {
        resolve(res);
      }), (err) => {
        reject(err);
      }
    })
  }
  getAllCategorys(from){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      //console.log(apiUrl + "getAllCategorys",JSON.stringify(from));
      this.http.post(apiUrl + "getAllCategorys",JSON.stringify(from)).subscribe(res => {
        resolve(res);
      }), (err) => {
        reject(err);
      }
    })
  }

  getSectors(from){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      //console.log(apiUrl + "getSectors",JSON.stringify(from));
      this.http.post(apiUrl + "getSectors",JSON.stringify(from)).subscribe(res => {
        resolve(res);
      }), (err) => {
        reject(err);
      }
    })
  }

  uploadImg(img,from){
    return new Promise((resolve, reject)=>{
    let headers = new Headers();
    this.http.post(apiUrl+from,JSON.stringify(img)).subscribe(res=>{
      resolve (res);
    }), (err)=>{
      reject(err);
    }
  })
  }

  newPost(img,from){
    return new Promise((resolve, reject)=>{
    let headers = new Headers();
    this.http.post(apiUrl+from,JSON.stringify(img)).subscribe(res=>{
      resolve (res);
    }), (err)=>{
      reject(err);
    }
  })
  }
  getAllPostsProfile(data,from){

    return new Promise((resolve, reject)=>{
    let headers = new Headers();
    this.http.post(apiUrl+from,JSON.stringify(data)).subscribe(res=>{
      resolve (res);
    }), (err)=>{
      reject(err);
    }
  })
  }

}
