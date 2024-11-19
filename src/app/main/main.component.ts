import { Component } from '@angular/core';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from "./category/category.component";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ProductComponent, CategoryComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

}
