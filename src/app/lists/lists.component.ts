import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  lists: any;

  constructor(private router: Router, private http: HttpClient) { }
  ngOnInit(): void {

    this.loadList()
  }

  loadList() {
    const orderId = localStorage.getItem("orderId");
    const storeId = localStorage.getItem("storeId");

    if (!orderId || !storeId) {
      console.warn("ไม่พบ orderId หรือ storeId");
      return;
    }

    this.http.get<any>(`${environment.apiBaseUrl}/api/orders/${storeId}/${orderId}`)
      .subscribe({
        next: (data) => {
          console.log("รายการสินค้าในออเดอร์:", data);

          if (!data || !data.items) {
            console.warn("ไม่มีรายการสินค้าในออเดอร์");
            return;
          }

          this.lists = data; // เก็บข้อมูลทั้งหมดไว้
          this.lists.items = data.items.map((item: any) => ({
            ...item,  // คัดลอกข้อมูลเดิมของสินค้า
            imageUrl: `${environment.apiBaseUrl}/uploads/${item.image || "default.jpg"}`  // ป้องกันภาพที่ไม่มี
          }));

          console.log("รูปภาพสินค้า:", this.lists.items);
        },
        error: (error) => {
          console.error("โหลดข้อมูลผิดพลาด:", error);
        }
      });
  }



}
