import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { LoginPage } from '../login/login';
//import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';
import { Dialogs } from '@ionic-native/dialogs';
import { WelcomePage } from '../welcome/welcome';
import { Menu } from '../../app/menu';
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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fBuilder: FormBuilder,
    public authServiceProvider: AuthServiceProvider,
    private alertController: AlertController,
    private alertCtrl: AlertController) {

    if (localStorage.getItem('user')) {
      this.userAtive = true;
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;

      this.getFullDataUser();

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
    if (this.userDatails) {
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
    } else {
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
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
        username: new FormControl('', [Validators.required, Validators.minLength(4)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        repassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        //phone2:[''],

      }, { validator: this.checkPassword });
      // },{validator: this.matchPass});
    }
  }
  checkPassword(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.repassword.value;
    //console.log(confirmPass ? null : { notSame: true });
    return pass === confirmPass ? null : { notSame: true }
  }

  signUp() {
    if (this.userDatails) {
      this.formSignup.controls['client_id'].setValue(this.userDatails.client_id);
      console.log("update");
      this.authServiceProvider.post(this.formSignup.value, "updateClient").then((result) => {
        
        this.data = JSON.parse(JSON.stringify(result))._body;
        console.log(this.data);
        if (!JSON.parse(this.data).error) { //Retorno ok
          localStorage.setItem('user',JSON.stringify(result));
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
          if(this.navCtrl.getPrevious().name!="CentroFashionPage" && this.navCtrl.getPrevious().name!="WelcomePage" && this.navCtrl.getPrevious().name!="ProfilePage"){
            this.navCtrl.remove(this.navCtrl.getPrevious().index);
          }
          setTimeout(()=>this.navCtrl.pop(),100);
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
      this.authServiceProvider.postClient(this.formSignup.value, "signupClient").then((result) => {
        this.reponseData = result;
        this.data = JSON.parse(JSON.stringify(this.reponseData))._body;
        this.data = JSON.parse(this.data).error;
        let status: number = this.data.e;

        if (status == 0) {

          let alertSignup = this.alertController.create({
            title: "Sucesso!",
            message: "Seu cadastro foi realizado!",
            buttons: [{
              text: "Ok"
            }]
          });
          alertSignup.present()
          this.navCtrl.push(LoginPage);

        } else if (status == 3) {
          let alertSignup = this.alertController.create({
            title: "Falha",
            message: "CPF,Email ou Usuário já cadastrado",
            buttons: [{
              text: "Ok"
            }]
          });
          alertSignup.present()
        } else if (status == 1) {
          let alertSignup = this.alertController.create({
            title: "Falha",
            message: "Usuário já cadastrado",
            buttons: [{
              text: "Ok"
            }]
          });
          alertSignup.present()
        }
        else if (status == 2) {
          let alertSignup = this.alertController.create({
            title: "Falha",
            message: "CPF ou Email já cadastrado",
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
