import { Component, OnInit } from '@angular/core';
// import { OrderService } from './order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  orders: any[] = [];

  // constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    // this.orderService.getOrders().subscribe(
    //   (data) => {
    //     this.orders = data;
    //   },
    //   (error) => {
    //     console.error('Error fetching orders', error);
    //   }
    // );
  }
}
