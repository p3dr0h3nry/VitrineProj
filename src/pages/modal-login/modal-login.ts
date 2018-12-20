import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Platform } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Facebook } from '@ionic-native/facebook';
import { HttpClient } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-modal-login',
  templateUrl: 'modal-login.html',
})
export class ModalLoginPage {

  userData: string;
  userToken: any;
  responseLogin: any;
  private formLogin: FormGroup;
  data: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    private http: HttpClient,
    private platform: Platform,
    private events: Events,
    public formBuilder: FormBuilder, ) {


    platform.registerBackButtonAction(() => { }); //Não  permite fechar o modal pelo backbutton
  }
  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    });
  }
  ionViewDidLoad() {

  }
  ionViewWillLoad() {

    const data = this.navParams.get('data');
    //console.log(data);
  }
  close(x) {
    if (x == 1) {
      this.viewCtrl.dismiss(null);
    } else {
      this.viewCtrl.dismiss(this.userData);
    }

  }

  loginGoogle() {
    if (this.platform.is('cordova')) {
      this.nativeGooleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  async nativeGooleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      this.googlePlus.login({
        'webClientId': '777132893216-dq0qrl67fq9107gnh51a825e5n3thcec.apps.googleusercontent.com',
        'offline': true,
      }).then(res => {
        
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(response => {
          this.userData = JSON.stringify(response);
            this.close(0);
        });
      }, err => {
        console.error("Error: ", err);
      });

    } catch (err) {
      alert(err)
    }
  }
  async webGoogleLogin(): Promise<void> {
    //console.log("login web");
    try {

      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await firebase.auth().signInWithPopup(provider).then(result => {
        //console.log(JSON.stringify(result));
        this.userData = JSON.stringify(result);
          this.close(0);
      });
    } catch (err) {
      alert("FireBase error:" + err);
    }
  }

  loginfb() { //usando Firebase

    this.fb.login(['email']).then(res => {
      const fc = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
      firebase.auth().signInWithCredential(fc).then(response => {
        this.userData = JSON.stringify(response);
        this.close(0);
      }).catch(err => {
        alert("FireBase error:" + err);
      })
    }).catch(e => {
      alert(JSON.stringify(e));
    });


    // let provider = new firebase.auth.FacebookAuthProvider().setCustomParameters({ auth_type: 'reauthenticate' });
    // firebase.auth().signInWithPopup(provider).then((result) => {
    //   this.userData = JSON.stringify(result);
    //   setTimeout(() => {
    //     this.close(0);
    //   }, 500);
    // }).catch(e => {
    //   console.log('Erro login facebook: ' + e);
    // });
  }
}
