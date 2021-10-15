import { Component, OnInit } from '@angular/core';
import { Department } from '../shared/department';
import { DepartmentService } from '../shared/department.service';
import { FormControl } from '@angular/forms';
import { ProductService } from '../shared/product.service';
import { Product } from '../shared/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public products: Product[];

  public prod: Product = null;
  public name: string = "";
  public departments: Department[] = [];
  public stock: number = 0;
  public price: number = 0.00;

  public unsubscribe$: Subject<any> = new Subject();

  selectedDepartments = new FormControl();  

  constructor(
    private departmentService: DepartmentService,
    private productService: ProductService,
    private  snackBar: MatSnackBar) {}

  ngOnInit() {
    this.productService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((prods)=>this.products = prods);
    this.departmentService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(deps => this.departments = deps);
  }

  save() {
    console.log(this.selectedDepartments.value);
    let data = {
      name: this.name,
      departments: Object.assign([], this.selectedDepartments.value),
      stock: this.stock,
      price: this.price,
    };
    if (this.prod) 
      this.productService.update({...data, _id: this.prod._id})
        .subscribe(
          (prod) => this.notify("UPDATED!"),
          (err) =>  this.notify(err.error.msg)
        );
    else 
      this.productService.add(data)
        .subscribe(
          ()    => this.notify("INSERTED!"),
          (err) => this.notify(err.error.msg)
        );      
    this.clearFields();
  }

  cancel() {
    this.clearFields();  
  }

  clearFields() {
    this.prod = null;
    this.name = '';
    this.stock = 0;
    this.price = 0.00;
    this.selectedDepartments.setValue([]);
  }

  edit(p: Product) {
    this.prod = p;
    this.name = p.name;
    this.selectedDepartments.setValue(p.departments);
    this.stock = p.stock;
    this.price = p.price;
  }

  del(p: Product) {
    this.productService.del(p)
    .subscribe(
      ()    => this.notify("REMOVED!"),
      (err) => this.notify(err.error.msg)
    );    
  }
  
  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  notify(msg: string) {
    this.snackBar.open(msg, "OK", {duration: 3000});
  }
}
