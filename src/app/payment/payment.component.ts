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
        console.log('Fetched orders:', this.orders); // แสดงผลลัพธ์ที่ได้จาก API
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

  paidConfirm(id: number) {
    this.http.put<any>(`${environment.apiBaseUrl}/api/orders/complete-paid/${id}`, {}).subscribe({
      next: (data) => {
        console.log("✅ ชำระเงินสำเร็จ", data);
        alert("ออเดอร์ #" + id + " ได้รับการยืนยันการชำระเงินแล้ว!");
      },
      error: (error) => {
        console.error("❌ เกิดข้อผิดพลาดในการอัปเดตสถานะ:", error);
        alert("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
      }
    });
  }

}
