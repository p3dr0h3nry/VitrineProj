import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
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
  public formSignup: FormGroup;
  responseGet: any;
  dataCategory: any;
  public thisPlace: any;
  categoryChecked:any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private fBuilder: FormBuilder,
    public authServiceProvider: AuthServiceProvider,
    private alertController: AlertController) {

      this.categoryChecked =[];

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
       }

  }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.formSignup = this.fBuilder.group({
      name: new FormControl('', [Validators.required]),
      category: new FormControl('false',[Validators.required])
         // email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),

      // repassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      //phone2:[''],

    });

  }
  selectCategory(category, ev){
    if(ev.value){
      this.categoryChecked.push(category);
    }
}
createProfile(){
  // falta inserir o array de check no formulario
  //console.log(this.categoryChecked);

  console.log(this.formSignup.value);
  
}
  ionViewDidLoad() {
    //console.log('ionViewDidLoad CreateProfilePage');
  }

}
