import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  userId: any;
  orders: any = [];
  jwtHelper = new JwtHelperService();
  token: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.getOrders();
  }

  getOrders(): void {
    this.token = localStorage.getItem('token');
    this.userId = this.jwtHelper.decodeToken(this.token).userId;

    if (!this.userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    console.log('Fetching orders for user:', this.userId);

    // ส่งคำขอไปที่ API
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/orders/paid/` + this.userId).subscribe({
      next: (data) => {
        this.orders = data; // เก็บข้อมูลที่ได้จาก API
        console.log('Fetch  ed orders:', this.orders); // แสดงผลลัพธ์ที่ได้จาก API
      },
      error: (error) => {
        console.error('Error loading orders:', error); // แสดงข้อผิดพลาดถ้ามี
      }
    });
  }

  viewSlip(proof: string) {
    if (!proof || proof.trim() === '') {
      console.warn("ไม่มีสลิปให้แสดง");
      return;
    }

    const imageUrl = `${environment.apiBaseUrl}/uploads/${proof}`;
    window.open(imageUrl, "_blank"); // เปิดสลิปในหน้าต่างใหม่
  }

  paidConfirm(orderId: number) {
    this.http.put<any>(`${environment.apiBaseUrl}/api/orders/complete-paid/${orderId}`, {}).subscribe({
      next: (data) => {
        console.log("✅ ชำระเงินสำเร็จ", data);
        alert("ออเดอร์ #" + orderId + " ได้รับการยืนยันการชำระเงินแล้ว!");
      },
      error: (error) => {
        console.error("❌ เกิดข้อผิดพลาดในการอัปเดตสถานะ:", error);
        alert("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
      }
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
