import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CubeComponent } from './cube/cube.component';
import { PanoramaEquirectangularComponent } from './panorama-equirectangular/panorama-equirectangular.component';

@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    PanoramaEquirectangularComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
