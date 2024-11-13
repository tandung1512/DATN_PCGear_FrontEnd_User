import { Component } from '@angular/core';
import { ProductComponent } from './product/product.component';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ProductComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
