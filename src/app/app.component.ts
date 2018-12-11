import { Component, OnInit, ViewChild } from '@angular/core';
import { App, MenuController, Events, Nav, LoadingController, AlertController } from 'ionic-angular';
//Modulo do sistema
import { WelcomePage } from '../pages/welcome/welcome';
import { CentroFashionPage } from '../pages/centro-fashion/centro-fashion';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { CreateProfilePage } from '../pages/create-profile/create-profile';
import { ProfilePage } from '../pages/profile/profile';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { EmailComposer } from '@ionic-native/email-composer';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  templateUrl: 'app.html',

})
export class MyApp implements OnInit {
  public rootPage: any;
  @ViewChild(Nav) nav: Nav;
  public userDatails: any;
  public profileDatails: any;
  private thisPlace: any = null;
  responsePost: any;
  data: any;
  userAtive;
  profileAtive;
  profileToGetData = { client_id: "" };
  passValidation = { user_id: "", password: "" };
  updateDataPassword = { user_id: "", old_password: "", new_password: "" };
  keyGenData = { id: "", email: "", created_by: "" };
  keycheckData = { id: "", token: "" };
  retorno: boolean;
  userAdmin: boolean;
  tokenAtive;
  constructor(
    public app: App,
    public menuCtrl: MenuController,
    public events: Events,
    public loadCtrl: LoadingController,
    private authService: AuthServiceProvider,
    private alertCtrl: AlertController,
    private emailComposer: EmailComposer,
    private fb: Facebook,
    private gplus:GooglePlus
  ) {
    //localStorage.clear();
    this.rootPage = WelcomePage;
    //console.log("Component Carregado");
    this.tokenAtive = false;

    this.events.subscribe('root', data => {
      if (data == "CentroFashionPage") {
        this.thisPlace = "CentroFashionPage";
        // if (localStorage.getItem('user')) {
        //   //console.log(localStorage.getItem('user'));
        //   this.userAtive = true;
        //   this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        //   this.userDatails = JSON.parse(this.userDatails).success;
        //   this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        //   if (this.userDatails.user_token != '0') {
        //     this.tokenAtive = true;
        //   }
        //   if (this.userDatails.profile_status != null && this.userDatails.profile_status == 1) {
        //     this.profileAtive = true;
        //   } else {
        //     this.profileAtive = false;
        //   }
    
        //   if (this.userDatails.user_lvl != null && this.userDatails.user_lvl == 1) { // Login de admin de shopping
        //     this.userAdmin = true;
        //   }
        // }
        // if (this.rootPage == CentroFashionPage) {
        //   this.nav.push(CentroFashionPage);
        // } else {
          let load = this.loadCtrl.create({
            content: 'Carregando...'
          });
          load.present();
          setTimeout(() => {
            load.dismiss();
            //this.rootPage = CentroFashionPage;
          }, 1000);
        // }

        //console.log(this.userDatails);
      }
    });

    this.events.unsubscribe('local');

    this.events.subscribe('updateUserData', data => { //O evento vai atualizar a variável user do app e modificar o menu
      if (localStorage.getItem('user')) {
        this.userAdmin = false;
        this.profileAtive = false;
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        if (this.userDatails.user_token != '0') {
          this.tokenAtive = true;
        }
        if (this.userDatails.profile_status != null && this.userDatails.profile_status == 1) {
          this.profileAtive = true;
        } else {
          this.profileAtive = false;
        }
      }
      if (this.userDatails.user_lvl != null && this.userDatails.user_lvl == 1) { // Login de admin de shopping
        this.userAdmin = true;
      }
    });

    if (localStorage.getItem('user')) {
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      //console.log(this.userDatails);
      if (this.userDatails.user_token != '0') {
        this.tokenAtive = true;
      }
      if (this.userDatails.profile_status != null && this.userDatails.profile_status == 1) {
        this.profileAtive = true;
      } else {
        this.profileAtive = false;
      }

      if (this.userDatails.user_lvl != null && this.userDatails.user_lvl == 1) { // Login de admin de shopping
        this.userAdmin = true;
      }
    }

    this.events.subscribe('Headerlocal', (data) => {
      if (localStorage.getItem('user')) {
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        if (this.userDatails.user_token != '0') {
          this.tokenAtive = true;
        }
        if (this.userDatails.profile_status != null && this.userDatails.profile_status == 1) {
          this.profileAtive = true;
        } else {
          this.profileAtive = false;
        }
  
        if (this.userDatails.user_lvl != null && this.userDatails.user_lvl == 1) { // Login de admin de shopping
          this.userAdmin = true;
        }
      }
      this.thisPlace = JSON.parse(JSON.stringify(data));
      console.log(this.thisPlace);
    });


  }

  ionViewWillLoad() {
    console.log("ionViewWillLoad");
  }
  ngOnInit() {
  }
  keyGenAlert() {
    let alert = this.alertCtrl.create({
      title: 'Gerar Chave de acesso',
      message: 'A chave de acesso, irá permitir que seja criado o perfil de uma loja dentro do sistema. A chave gerada será enviada por email.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'text'
        },
        {
          name: 'id',
          placeholder: 'CPF ou CNPJ (apenas números)',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Gerar',
          handler: data => {
            this.keyGen(data.id, data.email);
            //this.verifyPassword(data.password)
          }
        }
      ]
    });
    alert.present();
  }
  keyGen(id, e) {
    this.keyGenData.email = e;
    this.keyGenData.id = id;
    this.keyGenData.created_by = this.userDatails.user_id;
    console.log(this.keyGenData);
    this.authService.post1(this.keyGenData, "keyGen").then((result) => {
      this.responsePost = result;
      console.log(result);
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        //Enviando email com a key gerada
        this.responsePost = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(this.responsePost))))._body;
        this.responsePost = JSON.parse(this.responsePost).success;
        this.responsePost = JSON.parse(JSON.stringify(this.responsePost)).key;
        // this.emailComposer.requestPermission
        this.emailComposer.requestPermission().then((available: boolean) => {
          console.log("enviando email1");
          console.log(available);
          if (available) {
            let email = {
              to: e,
              cc: this.responsePost.user_email,
              attachments: [
                this.userDatails.user_img
              ],
              subject: 'Chave de acesso - VitrineApp',
              body: 'Parabéns, sua chave de acesso é: <br><br><h1 style="background-color: #ccc;">' + this.responsePost.key_hash + '</h1><br><br> Para utilizar sua chave você terá que informar o CPF ou CNPJ que foi cadastrado ao adquirir a sua chave.',
              isHtml: true
            };
            this.emailComposer.open(email);
          }
        });


        // let alertSignup = this.alertCtrl.create({
        //   title: "Sucesso!",
        //   message: 'chave gerada!',
        //   buttons: [{
        //     text: "Ok"
        //   }]
        // });
        // alertSignup.present()
      } else {

        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        console.log(msg);
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
      console.log(err);
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
  checkToken() { //Vai validar o token inserido para criação do perfil da loja
    let alert = this.alertCtrl.create({
      title: 'Cadastrar loja',
      message: 'Caso você não possua o token de acesso, por favor entrar em contato com a administração do shopping e solicitar seu token.',
      inputs: [
        {
          name: 'token',
          placeholder: 'Informe seu token',
          type: 'text'
        },
        {
          name: 'id',
          placeholder: 'CPF ou CNPJ (apenas números)',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Validar Token',
          handler: data => {
            this.validationtoken(data.id, data.token);
          }
        }
      ]
    });
    alert.present();
  }

  validationtoken(id, token) {
    this.keycheckData.id = id;
    this.keycheckData.token = token;
    this.authService.post(this.keycheckData, "checkToken").then((result) => {
      this.responsePost = result;
      
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        //this.events.publish('root','CentroFashionPage');
        this.menuCtrl.toggle();
        this.nav.push(SignupPage);
        //this.createProfile();
      } else {

        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro

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
      console.log(err);
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

  changePassword() {

    let alert = this.alertCtrl.create({
      title: 'Alterar senha',
      inputs: [
        {
          name: 'old_password',
          placeholder: 'Senha antiga',
          type: 'password'
        },
        {
          name: 'new_password',
          placeholder: 'Nova senha ',
          type: 'password'
        },
        {
          name: 're_password',
          placeholder: 'Repetir senha ',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Validar',
          handler: data => {
            if (data.new_password != data.re_password) {
              let alertSignup = this.alertCtrl.create({
                title: "Ops!",
                message: 'As senhas não conferem, tente novamente!',
                buttons: [{
                  text: "Ok"
                }]
              });
              alertSignup.present()
            } else {
              this.updatePassword(data.old_password, data.new_password);
            }
            //this.verifyPassword(data.password)
          }
        }
      ]
    });
    alert.present();
  }
  updatePassword(old_password, new_password) {
    this.updateDataPassword.user_id = this.userDatails.user_id;
    this.updateDataPassword.old_password = old_password;
    this.updateDataPassword.new_password = new_password;

    this.authService.post(this.updateDataPassword, "updatePassword").then((result) => {
      this.responsePost = result;

      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        let alertSignup = this.alertCtrl.create({
          title: "Sucesso!",
          message: 'Senha alterada',
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      } else {

        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        console.log(msg);
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
      console.log(err);
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
  editProfile() {
    console.log(this.userDatails.prof_id);
    this.profileToGetData.client_id = this.userDatails.client_id;
    this.authService.post(this.profileToGetData, "getProfile").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.setItem('editProfile', JSON.stringify(this.responsePost));
        this.menuCtrl.toggle();
        setTimeout(() => {
          this.nav.push(CreateProfilePage);
        }, 200);
      } else {
        this.menuCtrl.toggle();
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        console.log(msg);
        let alertSignup = this.alertCtrl.create({
          title: "Ops!",
          message: 'Esse perfil não existe!',
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      }
    }, (err) => {
      console.log(err);
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

  getProfileData() {
    let loader = this.loadCtrl.create({
      content: 'Buscando perfil...'
    });
    loader.present();
    this.profileToGetData.client_id = this.userDatails.client_id;
    this.authService.post(this.profileToGetData, "getProfile").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.setItem('profileData', JSON.stringify(this.responsePost));
        this.events.publish('root', "CentroFashionPage");
        localStorage.setItem('root',"CentroFashionPage");
        loader.dismiss();
        this.menuCtrl.toggle();
        setTimeout(() => {
          this.nav.push(ProfilePage);
        }, 200);
      } else {
        loader.dismiss();
        this.menuCtrl.toggle();
        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        console.log(msg);
        let alertSignup = this.alertCtrl.create({
          title: "Ops!",
          message: 'Esse perfil não existe!',
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()
      }
    }, (err) => {
      loader.dismiss();
      console.log(err);
      let alertSignup = this.alertCtrl.create({
        title: "Ops!",
        message: 'Falha de conexão, verifique sua internet.',
        buttons: [{
          text: "Ok"
        }]
      });
      alertSignup.present()
    });
    //return retorno;

  }
  // Criação do perfil da loja
  createProfile() {
    this.menuCtrl.toggle();
    localStorage.setItem('root','CentroFashionPage');
    this.nav.push(CreateProfilePage);
  }

  login(page: any) {
    this.menuCtrl.toggle();
    this.app.getActiveNav().setRoot(LoginPage);
  }
  signup() {
    this.app.getActiveNav().setRoot(SignupPage);
    //this.menuCtrl.toggle();
  }
  logout(page: any) {
    
    firebase.auth().signOut().then(() => {
      this.fb.logout();
      this.gplus.logout();
      localStorage.clear();
      this.menuCtrl.toggle();
      this.nav.push(WelcomePage);
    }).catch(e => {
      alert("Erro ao desconectar: " + e);
    });


  }
  backToWelcome() {
    this.menuCtrl.toggle();
    setTimeout(() => {
      this.events.publish('Headerlocal', "WelcomePage");
      this.nav.setRoot(WelcomePage, {}, { animate: true, direction: "back" });
    }, 300);

  }
  editClient() {
    let alert = this.alertCtrl.create({
      title: 'Confirme sua senha',
      inputs: [
        {
          name: 'password',
          placeholder: 'Senha',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Validar',
          handler: data => {
            this.verifyPassword(data.password)
          }
        }
      ]
    });
    alert.present();
  }

  verifyPassword(password) {

    this.passValidation.password = password;
    this.passValidation.user_id = this.userDatails.user_id;

    this.authService.post(this.passValidation, "passValidation").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        this.menuCtrl.toggle();
        this.nav.push(SignupPage);
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

}
