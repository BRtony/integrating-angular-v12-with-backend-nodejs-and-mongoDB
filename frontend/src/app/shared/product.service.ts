import { Injectable } from '@angular/core';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { Department } from './department';
import { DepartmentService } from './department.service';
import { BehaviorSubject, Observable, combineLatest, pipe, of } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

@Injectable()
export class ProductService {

  private productsSubject$ : BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  readonly url = 'http://localhost:3000/products';
  private loaded : boolean = false;  

  constructor(
    private http: HttpClient, 
    private depService: DepartmentService) { }

  get(): Observable<Product[]> {
    if (!this.loaded) {
      combineLatest([
        this.http.get<Product[]>(this.url),
        this.depService.get()])
      .pipe(
        tap(([products, departments]) => {console.log(departments);}),
        filter(([products, departments]) => products!=null && departments!=null),
        tap(([products, departments]) => {console.log(departments);}),
        map(([products, departments]) => {
          console.log(products);
          for(let p of products) {
            let ids = (p.departments as string[]);
            p.departments = ids.map((id)=>departments.find(dep=>dep._id==id));
          }
          return products;
        }),
        tap(p=>console.log(p))
      )
      .subscribe(this.productsSubject$);
      this.loaded = true;
    }  
    return this.productsSubject$.asObservable();
  }

  add(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map(d=>d._id);
    return this.http.post<Product>(this.url, {...prod, departments})
      .pipe(
        tap((p: Product) => {
          this.productsSubject$.getValue()
            .push({...prod, _id: p._id});
        },
      ));
  }

  del(prod: Product): Observable<any> {
    return this.http.delete(`${this.url}/${prod._id}`)
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(d => d._id===prod._id);
          if (i>=0)
            products.splice(i, 1);
        }),
      )
  }  

  update(prod: Product): Observable<Product> {
    console.log(prod);
    let departments = (prod.departments as Department[]).map(d=>d._id);
    console.log({...prod, departments});
    return this.http.patch<Product>(`${this.url}/${prod._id}`, {...prod, departments})
      .pipe(
        tap((p: Product) => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(p => p._id===prod._id);
          if (i>=0) 
            products[i] = prod;
        }),
      )
  }

}
