import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env/environment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  getorder: any[] = [];
  userId: string | null = null;
  selectedStatus: string = "all";

  constructor(private http: HttpClient) { this.fetchOrders(); }
  // newTable: any = {table_number:'',table_qr:''}
  jwtHelper = new JwtHelperService();
  token: any;
  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.token = localStorage.getItem('token');
    this.userId = this.jwtHelper.decodeToken(this.token || '').userId;
    console.log('User ID:', this.userId);

    if (!this.userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    console.log('Fetching orders for user:', this.userId);

    // ส่งคำขอไปที่ API
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/orders/` + this.userId).subscribe({
      next: (data) => {
        this.getorder = data; // เก็บข้อมูลที่ได้จาก API
        console.log('Fetched orders:', this.getorder); // แสดงผลลัพธ์ที่ได้จาก API
      },
      error: (error) => {
        console.error('Error loading orders:', error); // แสดงข้อผิดพลาดถ้ามี
      }
    });
  }

  filteredOrders() {

    if (this.selectedStatus === "all") {
      return this.getorder;
    }
    return this.getorder.filter((order) => order.orderstatus === this.selectedStatus);
  }

  Detail_complate(id: number) {
    this.http.put(`${environment.apiBaseUrl}/api/orders/complateDetail/` + id, { status })
      .subscribe({
        next: (response) => {
          console.log("Update successful", response);
          this.fetchOrders();
        },
        error: (err) => console.error("Update failed", err),
      });
  }

  Detail_cancelled(id: number) {
    this.http.put(`${environment.apiBaseUrl}/api/orders/cancelledDetail/` + id, { status })
      .subscribe({
        next: (response) => {
          console.log("Update successful", response)
          this.fetchOrders();
        },
        error: (err) => console.error("Update failed", err),
      });
  }

  Order_cancelled(id: number) {
    // Make sure to send a request body
    this.http.put(`${environment.apiBaseUrl}/api/orders/cancel-order/` + id, { status })
      .subscribe({
        next: (response) => {
          console.log("Update successful", response)
          this.fetchOrders();
        },
        error: (err) => console.error("Update failed", err),
      });
  }

  Order_success(id: number) {
    this.http.put(`${environment.apiBaseUrl}/api/orders/complete-order/` + id, { status })
      .subscribe({
        next: (response) => {
          console.log("Update successful", response)
          this.fetchOrders();
        },
        error: (err) => console.error("Update failed", err),
      });
  }

  calculateTotalPrice(items: any[]): number {

    // Filter items where status is 'success'
    const successItems = items.filter(item => item.status === 'Success');
    console.log('Calculating total price for items:', successItems);
    // Sum the price of these items
    const total = successItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return total;
  }






}


