import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WelcomePage } from '../welcome/welcome';
import { Menu } from '../../app/menu';
import { CreateProfilePage } from '../create-profile/create-profile';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public formSignup: FormGroup;
  public matchPass;
  reponseData: any;
  data: any;
  userAtive;
  userDatails: any;
  passValidation = { user_id: "", client_id: "" };
  clientFlag: boolean; //Testa se há cliente cadastrado

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fBuilder: FormBuilder,
    public authServiceProvider: AuthServiceProvider,
    private alertController: AlertController,
    private alertCtrl: AlertController,
    private events: Events) {

    if (localStorage.getItem('user')) {
      this.userAtive = true;
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      if (this.userDatails.client_id != null) {
        this.clientFlag = true;
        this.getFullDataUser();
      } else {
        this.clientFlag = false;
      }


    }

  }
  getFullDataUser() {
    this.passValidation.user_id = this.userDatails.user_id;
    this.passValidation.client_id = this.userDatails.client_id;

    this.authServiceProvider.post(this.passValidation, "getFullDataUser").then((result) => {
      this.data = JSON.parse(JSON.stringify(result))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok

        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      } else {
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        //console.log(msg);
        let alertSignup = this.alertCtrl.create({
          title: "Ops!",
          message: msg,
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()

      }
    }, (err) => {

      let alertSignup = this.alertCtrl.create({
        title: "Ops!",
        message: 'Falha de conexão, verifique sua internet.',
        buttons: [{
          text: "Ok"
        }]
      });
      alertSignup.present()

    });
  }
  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.formSignup = this.fBuilder.group({
      name: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      phone1: new FormControl('', [Validators.required]),
      phone2: new FormControl(''),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      neigh: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      client_id: [''],
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      //phone2:[''],
    });

  }
  // checkPassword(group: FormGroup) {
  //   let pass = group.controls.password.value;
  //   let confirmPass = group.controls.repassword.value;
  //   //console.log(confirmPass ? null : { notSame: true });
  //   return pass === confirmPass ? null : { notSame: true }
  // }

  signUp() {
    if (this.clientFlag) {
      this.formSignup.controls['client_id'].setValue(this.userDatails.client_id);
      console.log("update");
      this.authServiceProvider.post(this.formSignup.value, "updateClient").then((result) => {

        this.data = JSON.parse(JSON.stringify(result))._body;
        console.log(this.data);
        if (!JSON.parse(this.data).error) { //Retorno ok
          localStorage.setItem('user', JSON.stringify(result));
          this.userDatails = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(result))))._body;
          this.userDatails = JSON.parse(this.userDatails).success;
          this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
          let alertSignup = this.alertCtrl.create({
            title: "Sucesso!",
            message: "Seus cadastro foi atualizado",
            buttons: [{
              text: "Ok"
            }]
          });
          alertSignup.present()
          if (this.navCtrl.getPrevious().name != "CentroFashionPage" && this.navCtrl.getPrevious().name != "WelcomePage" && this.navCtrl.getPrevious().name != "ProfilePage") {
            this.navCtrl.remove(this.navCtrl.getPrevious().index);
          }
          setTimeout(() => this.navCtrl.pop(), 100);
        } else {
          this.data = JSON.parse(this.data).error;
          let msg: string = this.data.e; //busca msg de erro
          //console.log(msg);
          let alertSignup = this.alertCtrl.create({
            title: "Ops!",
            message: msg,
            buttons: [{
              text: "Ok"
            }]
          });
          alertSignup.present()

        }
      }, (err) => {

        let alertSignup = this.alertCtrl.create({
          title: "Ops!",
          message: 'Falha de conexão, verifique sua internet.',
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()

      });
    } else {
      this.formSignup.controls['client_id'].setValue(this.userDatails.user_id);
      this.authServiceProvider.postClient(this.formSignup.value, "signupClient").then((result) => {
        this.reponseData = JSON.parse(JSON.stringify(result))._body;
        if (!JSON.parse(this.reponseData).error) {
          localStorage.setItem('user', JSON.stringify(result));
          localStorage.setItem('root', 'CentroFashionPage');
          setTimeout(() => {
            this.events.publish('updateUserData', JSON.stringify(result));
          }, 50);
 
          setTimeout(() => {
            this.navCtrl.push(CreateProfilePage);
          }, 100);
          

        } else {
          let alertSignup = this.alertController.create({
            title: "Falha",
            message: "CPF já cadastrado",
            buttons: [{
              text: "Ok"
            }]
          });
          alertSignup.present()
        }
      }, (err) => {
      });
    }
  }
  back_home() {
    this.navCtrl.push(WelcomePage);
    this.navCtrl.setRoot(Menu);
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad SignupPage');
  }

}
