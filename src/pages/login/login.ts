import { Component, animate } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { WelcomePage } from '../welcome/welcome';
import { TabsPage } from '../tabs/tabs';
import { CentroFashionPage } from '../centro-fashion/centro-fashion';
import { MyApp} from '../../app/app.component'
import { Menu } from '../../app/menu';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  responseLogin: any;
  private formLogin: FormGroup;
  data: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public app: App,
    public alertCtrl: AlertController,
    public authServiceProvider: AuthServiceProvider,
    public formBuilder: FormBuilder,
    public events: Events,
    public myapp:MyApp

  ) {
  }
  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ionViewDidLoad() {

  }
  back_home() {
    this.events.publish('local',"WelcomePage");
    this.navCtrl.push(WelcomePage);
    this.navCtrl.setRoot(Menu);
  }

  login() {

      this.authServiceProvider.getUser(this.formLogin.value, "loginUser").then((result) => {
      this.responseLogin = result;
      this.data = JSON.parse(JSON.stringify(this.responseLogin))._body;

      if (!JSON.parse(this.data).error) { //login ok

        localStorage.setItem('user', JSON.stringify(this.responseLogin));
        this.events.publish('Headerlocal',"WelcomePage");
         //this.navCtrl.setRoot(Menu);
        this.navCtrl.setRoot(WelcomePage,{},{animate: true, direction: "back"});
        //this.navCtrl.setRoot(WelcomePage);
        
        } else { //fail

        this.data = JSON.parse(this.data).error;
        let msg: string = this.data.e; //busca msg de erro
        let alertSignup = this.alertCtrl.create({
          title: "Erro!",
          message: msg,
          buttons: [{
            text: "Ok"
          }]
        });
        alertSignup.present()

      }
    }, (err) => {
      // Msg de erro
    });

  }

}
