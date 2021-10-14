import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Department } from '../shared/department';
import { DepartmentService } from '../shared/department.service';
import { FormControl, FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { ProductService } from '../shared/product.service';
import { Product } from '../shared/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-new-product',
  templateUrl: './criar-produto.component.html',
  styleUrls: ['./criar-produto.component.css']
})
export class CriarProdutoComponent implements OnInit {

  //workaround to reset the material form
  @ViewChild('form') form: NgForm; // https://github.com/angular/material2/issues/4190

  public products: Product[];

  public prod: Product = null;
  public name: string = "";
  public alldepartments: Department[] = [];
  public stock: number = 0;
  public price: number = 0.00;

  public unsubscribe$: Subject<any> = new Subject();

  productForm: FormGroup = this.fb.group({
    _id: [null],
    name: ['', [Validators.required]],
    stock: ['', [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, , Validators.min(0)]],
    departments: [[], [Validators.required] ]
  });

  constructor(
    private departmentService: DepartmentService,
    private productService: ProductService,
    private  snackBar: MatSnackBar,
    private fb: FormBuilder    ) {}

  ngOnInit() {
    console.log(this.productForm.controls['departments']);
    this.productService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((prods)=>this.products = prods);
    this.departmentService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(deps => this.alldepartments = deps);
  }

  save() {
    let data = {
      ...this.productForm.value, 
      departments: Object.assign([], this.productForm.value.departments)
    };
    if (data._id != null) 
      this.productService.update(data)
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
    //this.productForm.reset();
    this.form.resetForm();
    // https://github.com/angular/material2/issues/4190
  }

  edit(p: Product) {
    this.productForm.setValue(p);
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
    this.snackBar.open(msg, "OK", {duration: 2000});
  }


}
