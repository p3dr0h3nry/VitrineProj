import { Component, OnInit, ViewChild } from '@angular/core';
import { App, MenuController, Events, Nav, LoadingController, AlertController } from 'ionic-angular';
//Modulo do sistema
import { WelcomePage } from '../pages/welcome/welcome';
import { CentroFashionPage } from '../pages/centro-fashion/centro-fashion';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
//import { Menu } from './menu';
import { CreateProfilePage } from '../pages/create-profile/create-profile';
import { ProfilePage } from '../pages/profile/profile';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
//import { componentRefresh } from '@angular/core/src/render3';

@Component({
  templateUrl: 'app.html',
  // template: '<ion-nav [root]="rootPage"></ion-nav>',

})
export class MyApp implements OnInit {
  public rootPage: any;
  // public rootPage: WelcomePage;
  @ViewChild(Nav) nav: Nav;
  public userDatails: any;
  public profileDatails: any;
  private thisPlace: any = null;
  responsePost: any;
  data: any;
  userAtive;
  profileAtive;
  //rootPage =Menu; //busca o menu na pag menu
  profileToGetData = { prof_id: "" };
  passValidation = { user_id: "",password:"" };
  updateDataPassword = { user_id: "",old_password:"",new_password:"" };
  retorno: boolean;

  constructor(
    public app: App,
    public menuCtrl: MenuController,
    public events: Events,
    public loadCtrl: LoadingController,
    private authService: AuthServiceProvider,
    private alertCtrl: AlertController
  ) {
    //localStorage.clear();
    this.rootPage = WelcomePage;
    this.events.subscribe('root', data => {
      if (data == "CentroFashionPage") {
        this.thisPlace = "CentroFashionPage";
        if (localStorage.getItem('user')) {
          //console.log(localStorage.getItem('user'));
          this.userAtive = true;
          this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
          this.userDatails = JSON.parse(this.userDatails).success;
          this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
          if (this.userDatails.profile_status == 1) {
            this.profileAtive = true;
          } else {
            this.profileAtive = false;
          }
          console.log(this.userDatails);          
        }
        if (this.rootPage == CentroFashionPage) {
          this.nav.push(CentroFashionPage);
        } else {
          let load = this.loadCtrl.create({
            content: 'Carregando...'
          });
          load.present();
          setTimeout(() => {
            load.dismiss();
            //this.rootPage = CentroFashionPage;
          }, 1000);
        }

        //console.log(this.userDatails);
      }
    });
    
    this.events.unsubscribe('local');
    //console.log(localStorage.getItem('user'));
    if (localStorage.getItem('user')) {
      
      this.userAtive = true;
      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      //console.log(this.userDatails);
      if (this.userDatails.profile_status == 1) {
        this.profileAtive = true;
      } else {
        this.profileAtive = false;
      }

    } else {
      this.userAtive = false;
    }

    this.events.subscribe('Headerlocal', (data) => {
      if (localStorage.getItem('user')) {
        this.userAtive = true;
        this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
        this.userDatails = JSON.parse(this.userDatails).success;
        this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
        if (this.userDatails.prof_id) {
          this.profileAtive = true;
        } else {
          this.profileAtive = false;
        }
      }
      this.thisPlace = JSON.parse(JSON.stringify(data));
      console.log(this.thisPlace);
    });


  }
  ngOnInit() {
  }
  changePassword(){

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
            if(data.new_password!=data.re_password){
              let alertSignup = this.alertCtrl.create({
                title: "Ops!",
                message: 'As senhas não conferem, tente novamente!',
                buttons: [{
                  text: "Ok"
                }]
              });
              alertSignup.present()
            }else{
              this.updatePassword(data.old_password,data.new_password);
            }
            //this.verifyPassword(data.password)
          }
        }
      ]
    });
    alert.present();
  }
  updatePassword(old_password,new_password){
    this.updateDataPassword.user_id=this.userDatails.user_id;
    this.updateDataPassword.old_password=old_password;
    this.updateDataPassword.new_password=new_password;

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
  editProfile(){
    console.log(this.userDatails.prof_id);
    this.profileToGetData.prof_id=this.userDatails.prof_id;
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
    this.profileToGetData.prof_id = this.userDatails.prof_id;
    this.authService.post(this.profileToGetData, "getProfile").then((result) => {
      this.responsePost = result;
      this.data = JSON.parse(JSON.stringify(this.responsePost))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.setItem('profileData', JSON.stringify(this.responsePost));
        this.events.publish('root', "CentroFashionPage");
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
    localStorage.clear();
    this.menuCtrl.toggle();
    window.location.reload();
  }
  backToWelcome() {
    this.menuCtrl.toggle();
    setTimeout(() => {
      this.events.publish('Headerlocal', "WelcomePage");
      this.nav.setRoot(WelcomePage, {}, { animate: true, direction: "back" });
    }, 300);

  }
  editClient(){
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

  verifyPassword(password){

    this.passValidation.password=password;
    this.passValidation.user_id=this.userDatails.user_id;

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
