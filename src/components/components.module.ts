import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import{IonicPageModule} from 'ionic-angular';
import { CustomHeaderComponent } from './custom-header/custom-header';
import { FilterBarComponent } from './filter-bar/filter-bar';
@NgModule({
	declarations: [CustomHeaderComponent,
    FilterBarComponent],
	imports: [IonicPageModule.forChild(CustomHeaderComponent)],
	exports: [CustomHeaderComponent,
    FilterBarComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
