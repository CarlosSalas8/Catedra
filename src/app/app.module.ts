import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { CoreModule } from './core/core.module';
import { ActividadesComponent } from './components/admin/actividades/actividades.component';
import { RegisterComponent } from './components/home/register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    ActividadesComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    SharedModule,
    HomeModule,
    CoreModule,
    HttpClientModule
  ],

  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
