import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the CreateProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
})
export class CreateProfilePage {
  private userDatails: any;
  public formProfile: FormGroup;
  responseGet: any;
  dataCategory: any;
  public thisPlace: any;
  categoryChecked;
  sectorChecked;
  sectors: any;
  checkedIdx = -1;
  checkedIdx1 = -1;
  profileToGetData = { client_id: "" };
  reponseData: any;
  data: any;
  dataProfile: any;
  dataError: any;
  profDatails: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private fBuilder: FormBuilder,
    public authServiceProvider: AuthServiceProvider,
    private alertController: AlertController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private authService: AuthServiceProvider
  ) {

    this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
    this.userDatails = JSON.parse(this.userDatails).success;
    this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
    console.log(this.userDatails);

    // this.events.subscribe('root', data => {
    //   if (localStorage.getItem('user')) {

    //     this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
    //     this.userDatails = JSON.parse(this.userDatails).success;
    //     this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;

    //   }
    // });
    if (localStorage.getItem('editProfile')) {
      console.log('editProfile');
      this.profDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('editProfile'))))._body;
      this.profDatails = JSON.parse(this.profDatails).success;
      this.profDatails = JSON.parse(JSON.stringify(this.profDatails)).profileData;
      console.log(this.profDatails);
    }

    if (localStorage.getItem('root')) {
      this.authServiceProvider.getAllCategorys(localStorage.getItem('root')).then((result) => {
        this.responseGet = result;
        this.responseGet = JSON.parse(JSON.stringify(this.responseGet))._body;
        this.responseGet = JSON.parse(this.responseGet);
        this.dataCategory = this.responseGet.categoryData;
      });

      this.authServiceProvider.getSectors(localStorage.getItem('root')).then((result) => {
        this.responseGet = result;
        this.responseGet = JSON.parse(JSON.stringify(this.responseGet))._body;
        this.responseGet = JSON.parse(this.responseGet);
        this.sectors = this.responseGet.sectorsData;
      });

    }

  }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.formProfile = this.fBuilder.group({
      name: new FormControl('', [Validators.required]),
      categoryName: [''],
      instagram: [''],
      twitter: [''],
      face: [''],
      client_id: [''],
      phone: [''], //inserir um pattern de validação
      address: new FormControl('', [Validators.required]),
      sectorName: [''],
      from: [''],
      prof_id: [''],
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),

      // repassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      //phone2:[''],

    });

  }
  setCategory(ev, id) {

    if (ev == true) {
      this.categoryChecked = id;
    } else {
      this.categoryChecked = 0;
    }
  }
  setSector(ev, id) {
    if (ev == true) {
      this.sectorChecked = id;
    } else {
      this.sectorChecked = 0;
    }


  }
  createProfile(item) {
    if (this.categoryChecked == 0) {
      let alertProfile = this.alertController.create({
        title: "Falha",
        message: "Informe uma categoria",
        buttons: [{
          text: "Ok"
        }]
      });
      alertProfile.present()
    } else if (this.sectorChecked == 0) {
      let alertProfile = this.alertController.create({
        title: "Falha",
        message: "Informe o setor",
        buttons: [{
          text: "Ok"
        }]
      });
      alertProfile.present()
    } else {

      this.thisPlace;
      this.formProfile.controls['from'].setValue('CentroFashionPage');
      this.formProfile.controls['categoryName'].setValue(this.categoryChecked);
      this.formProfile.controls['sectorName'].setValue(this.sectorChecked);
      this.formProfile.controls['client_id'].setValue(this.userDatails.client_id);
      //////////////////////////////////////////////////////////////////////////////////////////////////
      if (!this.profDatails) {
        console.log("criar perfil");
        this.authServiceProvider.postProfile(this.formProfile.value, "signupProfile").then((result) => {
          this.reponseData = result;
          this.data = JSON.parse(JSON.stringify(this.reponseData))._body;

          if (!JSON.parse(this.data).error) {
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(this.reponseData));
            setTimeout(() => {
              this.events.publish('updateUserData', "CentroFashionPage"); //verificar
              this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
              this.userDatails = JSON.parse(this.userDatails).success;
              this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
            }, 50);
            if (localStorage.getItem('user')) {
              this.getProfileData();
            }

          } else {
            let alertSignup = this.alertController.create({
              title: "Falha",
              message: "Algo deu errado",
              buttons: [{
                text: "Ok"
              }]
            });
            alertSignup.present()
          }
        }, (err) => {
          console.log(err);
        });
      } else if (this.profDatails) {
        console.log("editar perfil");
        this.formProfile.controls['prof_id'].setValue(this.profDatails.prof_id);
        this.authServiceProvider.postProfile(this.formProfile.value, "updateProfile").then((result) => {
          this.reponseData = result;
          this.data = JSON.parse(JSON.stringify(this.reponseData))._body;
          if (!JSON.parse(this.data).error) {
            setTimeout(() => {
              console.log("edição ok");
              this.getProfileData();
            }, 500);

          } else {
            let alertSignup = this.alertController.create({
              title: "Falha",
              message: "Algo deu errado",
              buttons: [{
                text: "Ok"
              }]
            });
            alertSignup.present()
          }
        }, (err) => {
          console.log(err);
        });
      }
    }
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad CreateProfilePage');
  }
  getProfileData() {
    let loader = this.loadCtrl.create({
      content: 'Buscando perfil...'
    });
    loader.present();
    this.profileToGetData.client_id = this.userDatails.client_id;
    console.log(this.userDatails.client_id);
    this.authService.post(this.profileToGetData, "getProfile").then((result) => {
      this.reponseData = result;
      console.log(this.reponseData);
      this.data = JSON.parse(JSON.stringify(this.reponseData))._body;
      if (!JSON.parse(this.data).error) { //Retorno ok
        localStorage.setItem('profileData', JSON.stringify(this.reponseData));
        this.events.publish('root', "CentroFashionPage");
        loader.dismiss();
        setTimeout(() => {
          this.navCtrl.push(ProfilePage);
        }, 200);
      } else {
        loader.dismiss();
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
}
