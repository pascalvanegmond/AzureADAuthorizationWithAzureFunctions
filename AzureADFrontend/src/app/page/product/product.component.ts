import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Items } from 'src/app/models/Items';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  responsemessage: any = null;
  loading = false;
  items: Items;

  constructor(private service: ProductService) { }

  ngOnInit() {

    this.service.getContent()
    .subscribe(
      (response: Response) => {
        console.log(response);
        this.loading = false;
        this.items = response.items;

        console.log(this.items);

      }, error => {
        if (error.status === 401) {
          this.responsemessage = 'User not authorized!';
        } else {
          console.log(error.error.Message);
          this.responsemessage = error.error.Message;
        }
        this.loading = false;
    });
  }

}
