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
  
  constructor(private http: HttpClient) { }
  // newTable: any = {table_number:'',table_qr:''}
  orders = [
    {
      "order":1,
      "tableNumber": 1,
      "items": [
        {
          "name": "ชุดปาร์ตี้หมูรวมทะเล",
          "quantity": 1,
          "price": 499,
          "imageUrl": "assets/no-photos.png"
        },
        {
          "name": "น้ำเปล่า",
          "quantity": 2,
          "price": 20,
          "imageUrl": "assets/no-photos.png"
        }
      ],
      "totalPrice": 519
    },
    {
      "order":2,
      "tableNumber": 2,
      "items": [
        {
          "name": "ข้าวผัด",
          "quantity": 2,
          "price": 150,
          "imageUrl": "assets/no-photos.png"
        }
      ],
      "totalPrice": 300
    }
  ];

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

}
  

