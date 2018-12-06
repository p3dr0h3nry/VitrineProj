import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the ModalLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-login',
  templateUrl: 'modal-login.html',
})
export class ModalLoginPage {
  userfb:any={};
  userData:string;
  userToken:any;
  public events: Events;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private fb: Facebook,
    private http: HttpClient) {
  }

  ionViewDidLoad() {

  }
  ionViewWillLoad() {
    const data = this.navParams.get('data');
    console.log(data);
  }
  close(x) {
    if(x==1){
      this.viewCtrl.dismiss(null,null,null);
    }else{
      this.viewCtrl.dismiss(this.userData,this.userfb.img);
    }
   
  }
  loginfb() {
    
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        if(res.status==='connected'){
         this.userfb.img ='https://graph.facebook.com/'+res.authResponse.userID+'/picture?type=square';
         this.getData(res.authResponse.accessToken);
        }else{
          alert('Falha no login');
        }
      }).catch(e => 
        console.log('Error logging into Facebook', e));
  }

  getData(token:string){
    let url= 'https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token='+token;
    this.http.get(url).subscribe(data =>{
      this.userData=JSON.stringify(data);
      this.events.publish('accessToken',token);
      setTimeout(() => {
        this.close(0);
      }, 500);
      
    });
  }
}
