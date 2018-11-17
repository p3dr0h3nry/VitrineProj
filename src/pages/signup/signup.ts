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


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fBuilder: FormBuilder,
    public authServiceProvider: AuthServiceProvider,
    private alertController: AlertController) {

  }
  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.formSignup = this.fBuilder.group({
      name: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      phone1: new FormControl('', [Validators.required]),
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
  checkPassword(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.repassword.value;
    //console.log(confirmPass ? null : { notSame: true });
    return pass === confirmPass ? null : { notSame: true }
  }

  signUp() {
    this.authServiceProvider.postClient(this.formSignup.value, "signupClient").then((result) => {
      this.reponseData = result;
      this.data = JSON.parse(JSON.stringify(this.reponseData))._body;
      this.data = JSON.parse(this.data).error;
      let status: number = this.data.e;

      if (status == 0) {

        let alertSignup = this.alertController.create({
          title: "Sucesso!",
          message:"Seu cadastro foi realizado!",
          buttons:[{
              text: "Ok"
            }]
        });
        alertSignup.present()
        this.navCtrl.push(LoginPage);

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
  back_home() {
    this.navCtrl.push(WelcomePage);
    this.navCtrl.setRoot(Menu);
  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad SignupPage');
  }

}
