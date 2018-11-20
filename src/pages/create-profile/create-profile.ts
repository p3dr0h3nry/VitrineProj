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
  public formSignup: FormGroup;
  responseGet: any;
  dataCategory: any;
  public thisPlace: any;
  categoryChecked=0;
  sectorChecked=0;
  sectors:any;
  checkedIdx =-1;
  checkedIdx1 =-1;
  sec_id=0;
  status=1;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private fBuilder: FormBuilder,
    public authServiceProvider: AuthServiceProvider,
    private alertController: AlertController) {



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
          console.log(this.sectors);
        });
        
       }

  }

  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.formSignup = this.fBuilder.group({
      name: new FormControl('', [Validators.required]),
      category: new FormControl(false,[Validators.required]),
      instagram: [''],
      twitter: [''],
      face:  [''],
      phone: [''],
      address: new FormControl('',[Validators.required]),
      sectorName: new FormControl('',[Validators.required]),
      email: new FormControl('', [ Validators.pattern(EMAILPATTERN)]),

      // repassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      //phone2:[''],

    });

  }
setCategory(id){
  
  console.log("categoria"+id);
  this.categoryChecked=id;
}
setSector(id){
  console.log(id);

  this.sectors.forEach(sect => {
    console.log("id:"+id+"sec Id:"+sect.sector_id)
    if(sect.sector_id==id){
      sect.sector_checked=1;
    }else{
      sect.sector_checked=0;
    }
  });
    // for(let i=0; this.sectors.lenght; i++){
    //   console.log("id:"+id+"sec Id:"+this.sectors[i].sector_id)
    //   if(this.sectors[i].sector_id==id){
    //     this.sectors[i].sector_checked=1;
    //   }else{
    //     this.sectors[i].sector_checked=0;
    //   }
      
    }

  
  

createProfile(){
  // falta inserir o array de check no formulario
  //console.log(this.categoryChecked);
  //console.log(this.formSignup.controls['sectorName'].na);
  this.formSignup.controls['category'].setValue(this.categoryChecked);
  this.formSignup.controls['sectorName'].setValue(this.sectorChecked);
  console.log(this.formSignup.value);
  this.navCtrl.push(CentroFashionPage);
  
}
  ionViewDidLoad() {
    //console.log('ionViewDidLoad CreateProfilePage');
  }

}
