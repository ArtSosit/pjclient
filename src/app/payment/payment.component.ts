import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  userId: any;
  orders: any = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.userId = localStorage.getItem('userId');
    // ตรวจสอบว่า userId มีอยู่ใน localStorage หรือไม่
    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    console.log('Fetching orders for user:', this.userId);

    // ส่งคำขอไปที่ API
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/orders/paid/` + this.userId).subscribe({
      next: (data) => {
        this.orders = data; // เก็บข้อมูลที่ได้จาก API
        this.orders = data.map(order => ({
          ...order,  // Copy the properties of the menu
          imageUrl: `${environment.apiBaseUrl}/uploads/${order.proof}`  // Prepend the server URL to imageUrl
        }));
        console.log('Fetched orders:', this.orders); // แสดงผลลัพธ์ที่ได้จาก API
      },
      error: (error) => {
        console.error('Error loading orders:', error); // แสดงข้อผิดพลาดถ้ามี
      }
    });
  }
}
