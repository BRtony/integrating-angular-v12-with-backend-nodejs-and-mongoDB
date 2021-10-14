import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentComponent } from './department/department.component';
import { HttpClientModule } from '@angular/common/http';
import { CriarProdutoComponent } from './criar-produto/criar-produto.component';
import { ProductComponent } from './product/product.component';
import { DepartmentService } from './shared/department.service';
import { ProductService } from './shared/product.service';

@NgModule({
  declarations: [
    AppComponent,
    DepartmentComponent,
    CriarProdutoComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    DepartmentService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
