import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Subscription } from 'rxjs/Subscription';
import { CentroFashionPage } from '../centro-fashion/centro-fashion';

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
    ) {

      this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
      this.userDatails = JSON.parse(this.userDatails).success;
      this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
      console.log(this.userDatails.client_name);

      this.events.subscribe('root', data=>{
          if (localStorage.getItem('user')) {

            this.userDatails = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('user'))))._body;
            this.userDatails = JSON.parse(this.userDatails).success;
            this.userDatails = JSON.parse(JSON.stringify(this.userDatails)).user;
            console.log(this.userDatails.client_name);
          }
          
        
      });


    if (localStorage.getItem('from')) {

      this.authServiceProvider.getAllCategorys(localStorage.getItem('from')).then((result) => {
        this.responseGet = result;
        //console.log(this.responseGet);
        this.responseGet = JSON.parse(JSON.stringify(this.responseGet))._body;
        //console.log("Parse+stringify: " + this.responseGet);
        this.responseGet = JSON.parse(this.responseGet);
        this.dataCategory = this.responseGet.categoryData;
        //console.log(this.dataCategory);
      });

      this.authServiceProvider.getSectors(localStorage.getItem('from')).then((result) => {
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
        this.dataError = JSON.parse(this.data).error;
        let status: number = this.dataError.e;
        localStorage.clear();
        if (status == 0) {
          localStorage.setItem('user', JSON.stringify(this.reponseData));
          let alertSignup = this.alertController.create({
            title: "Sucesso!",
            message:"Loja Cadastrada!",
            buttons:[{
                text: "Ok"
              }]
          });
          alertSignup.present()
          this.events.publish('root',"CentroFashionPage");
          //this.navCtrl.push(CentroFashionPage);
  
        } else if (status == 3) {
          let alertSignup = this.alertController.create({
            title: "Falha",
            message:"CPF,Email ou Usuário já cadastrado",
            buttons:[{
                text: "Ok"
              }]
          });
          alertSignup.present()
        }else if(status == 1){
          let alertSignup = this.alertController.create({
            title: "Falha",
            message:"Usuário já cadastrado",
            buttons:[{
                text: "Ok"
              }]
          });
          alertSignup.present()
        }
        else if(status == 2){
          let alertSignup = this.alertController.create({
            title: "Falha",
            message:"CPF ou Email já cadastrado",
            buttons:[{
                text: "Ok"
              }]
          });
          alertSignup.present()
        }
      }, (err) => {
  
      });
    }
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad CreateProfilePage');
  }

}
