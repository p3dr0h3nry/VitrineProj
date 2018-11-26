import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, LoadingController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Subscription } from 'rxjs/Subscription';
import { CentroFashionPage } from '../centro-fashion/centro-fashion';
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
  dataProfile:any;
  dataError:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private fBuilder: FormBuilder,
    public authServiceProvider: AuthServiceProvider,
    private alertController: AlertController,
    private alertCtrl: AlertController,
    private loadCtrl:LoadingController,
    private authService: AuthServiceProvider
    ) {

      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      console.log(this.userDatails);

      this.events.subscribe('root', data=>{
          if (localStorage.getItem('user')) {

            this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
            this.userDatails = JSON.parse(this.userDatails).success;
            this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
            console.log(this.userDatails.client_name);
          }
          
        
      });
    if (localStorage.getItem('root')) {

      this.authServiceProvider.getAllCategorys(localStorage.getItem('root')).then((result) => {
        this.responseGet = result;
        //console.log(this.responseGet);
        this.responseGet = JSON.parse(JSON.stringify(this.responseGet))._body;
        //console.log("Parse+stringify: " + this.responseGet);
        this.responseGet = JSON.parse(this.responseGet);
        this.dataCategory = this.responseGet.categoryData;
        //console.log(this.dataCategory);
      });

      this.authServiceProvider.getSectors(localStorage.getItem('root')).then((result) => {
        this.responseGet = result;
        //console.log(this.responseGet);
        this.responseGet = JSON.parse(JSON.stringify(this.responseGet))._body;
        //console.log("Parse+stringify: " + this.responseGet);
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
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),

      // repassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      //phone2:[''],

    });

  }
  setCategory(ev,id) {

    if(ev==true){
      this.categoryChecked = id;
    }else{
      this.categoryChecked = 0;
    }
  }
  setSector(ev,id) {
    if(ev==true){
      this.sectorChecked = id;
    }else{
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

      this.formProfile.controls['categoryName'].setValue(this.categoryChecked);
      this.formProfile.controls['sectorName'].setValue(this.sectorChecked);
      this.formProfile.controls['client_id'].setValue(this.userDatails.client_id);
      //////////////////////////////////////////////////////////////////////////////////////////////////

      this.authServiceProvider.postProfile(this.formProfile.value, "signupProfile").then((result) => {
        this.reponseData = result;
        this.data = JSON.parse(JSON.stringify(this.reponseData))._body;
        localStorage.removeItem('user');
        if (!JSON.parse(this.data).error) {
          localStorage.setItem('user', JSON.stringify(this.reponseData));
          setTimeout(() => {
            this.events.publish('root', "CentroFashionPage");
          }, 100);
            if(localStorage.getItem('user')){
              this.getProfileData();
            }
             
        } else {
          let alertSignup = this.alertController.create({
            title: "Falha",
            message:"Algo deu errado",
            buttons:[{
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
  ionViewDidLoad() {
    //console.log('ionViewDidLoad CreateProfilePage');
  }
  getProfileData() {
    let loader = this.loadCtrl.create({
      content: 'Buscando perfil...'
    });
    loader.present();
    this.profileToGetData.client_id = this.userDatails.client_id;
    this.authService.post(this.profileToGetData, "getProfile").then((result) => {
      this.reponseData = result;
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
