import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
@NgModule({
  declarations: [LoginPage],
  	schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
  imports: [
    IonicPageModule.forChild(LoginPage),
    IonicPageModule

  ],
})
export class LoginPageModule {}
