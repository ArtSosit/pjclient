import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  getorder: any[] = [];
  userId: string | null = null;
  selectedStatus: string = "all"; // ค่าเริ่มต้นแสดงทั้งหม
  
  constructor(private http: HttpClient) {this.fetchOrders(); }
  // newTable: any = {table_number:'',table_qr:''}
  ngOnInit(): void {
    this.fetchOrders();
    
  }

fetchOrders(): void {
  // ตรวจสอบว่า userId มีอยู่ใน localStorage หรือไม่
  this.userId = localStorage.getItem('userId');
  
  if (!this.userId) {
    console.error('User ID not found in localStorage');
    return;
  }

  console.log('Fetching orders for user:', this.userId);
  
  // ส่งคำขอไปที่ API
  this.http.get<any[]>('http://localhost:3000/api/orders/' + this.userId).subscribe({
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

  // Make sure to send a request body
  this.http.put('http://localhost:3000/api/orders/complateDetail/' + id, { status })
    .subscribe({
      next: (response) => console.log("Update successful", response),
      error: (err) => console.error("Update failed", err),
    });
}
  
Detail_cancelled(id: number) {

  // Make sure to send a request body
  this.http.put('http://localhost:3000/api/orders/cancelledDetail/' + id, { status })
    .subscribe({
      next: (response) => console.log("Update successful", response),
      error: (err) => console.error("Update failed", err),
    });
}
  
  Order_cancelled(id:number) {
    // Make sure to send a request body
  this.http.put('http://localhost:3000/api/orders/cancel-order/' + id, { status })
    .subscribe({
      next: (response) => console.log("Update successful", response),
      error: (err) => console.error("Update failed", err),
    });
  }

  Order_success(id: number) {
    this.http.put('http://localhost:3000/api/orders/complete-order/' + id, { status })
    .subscribe({
      next: (response) => console.log("Update successful", response),
      error: (err) => console.error("Update failed", err),
    });
  }
  
  
  


}
  

