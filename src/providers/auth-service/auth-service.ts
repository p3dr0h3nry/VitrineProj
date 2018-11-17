// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

// Endereço API restful
let apiUrl = "http://www.prod.agesi.com.br/api_restful/api/";
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
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
}
