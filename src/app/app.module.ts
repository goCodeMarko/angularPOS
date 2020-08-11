import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { FlashMessagesModule } from "angular2-flash-messages";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routedComponents } from "./app-routing.module";
import { NavbarComponent } from './components/navbar/navbar.component';

import { BasicGuard } from "./guards/basic.guard";
import { HigherGuard } from "./guards/higher.guard";

@NgModule({
  declarations: [
    AppComponent,
    routedComponents,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    FlashMessagesModule.forRoot()
  ],
  providers: [BasicGuard, HigherGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
