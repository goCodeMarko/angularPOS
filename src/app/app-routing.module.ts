import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ShopComponent } from './components/shop/shop.component';
import { ProductsComponent } from './components/products/products.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SecuredPageComponent } from './components/secured-page/secured-page.component';
import { DailysalesComponent } from "./components/dailysales/dailysales.component";
import { GeneralsalesComponent } from './components/generalsales/generalsales.component';

import { BasicGuard } from "./guards/basic.guard";
import { HigherGuard } from "./guards/higher.guard";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: "shop/:category", component: ShopComponent, canActivate: [BasicGuard],
    children: [
      { path: "product", component: ProductsComponent }
    ]
  },
  { path: "dailysales", component: DailysalesComponent, canActivate: [HigherGuard] },
  { path: "generalsales", component: GeneralsalesComponent, canActivate: [HigherGuard] },
  { path: "securedpage", component: SecuredPageComponent },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routedComponents: any[] = [LoginComponent, ShopComponent, ProductsComponent, DailysalesComponent, GeneralsalesComponent, NotFoundComponent, SecuredPageComponent];
