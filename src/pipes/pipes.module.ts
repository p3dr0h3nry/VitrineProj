import { NgModule } from '@angular/core';
import { Pipe } from './pipe/pipe';
import { ShowPipe } from './show/show';
@NgModule({
	declarations: [Pipe,
    ShowPipe],
	imports: [],
	exports: [Pipe,
    ShowPipe]
})
export class PipesModule {}
