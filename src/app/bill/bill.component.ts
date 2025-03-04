import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {
  bill: any;
  lists: any = { items: [] };
  groupedItems: any[] = [];
  constructor(private router: Router, private http: HttpClient) { }
  ngOnInit(): void {
    this.fetchBill();

  }
  fetchBill() {
    console.log("data");
    const orderId = localStorage.getItem("orderId");
    const storeId = localStorage.getItem("storeId");

    if (!orderId || !storeId) {
      console.warn("ไม่พบ orderId หรือ storeId");
      return;
    }

    this.http
      .get<any>(`${environment.apiBaseUrl}/api/orders/${storeId}/${orderId}`)
      .subscribe({
        next: (data) => {
          console.log("รายการสินค้าในออเดอร์:", data);

          if (!data || !data.items) {
            console.warn("ไม่มีรายการสินค้าในออเดอร์");
            return;
          }

          this.lists = data;
          this.lists.items = data.items.map((item: any) => ({
            ...item,
            imageUrl: `http://localhost:3000/uploads/${item.image || "default.jpg"}`,
          }));

          // ✅ เรียกใช้ groupItemsByName() หลังจากโหลดข้อมูลเสร็จแล้ว
          this.groupedItems = this.groupItemsByName(this.lists.items);
        },
        error: (error) => {
          console.error("โหลดข้อมูลผิดพลาด:", error);
        },
      });
  }

  groupItemsByName(items: any[]) {
    if (!items || !Array.isArray(items)) {
      return []; // ✅ ป้องกัน error ถ้า items เป็น undefined หรือไม่ใช่อาร์เรย์
    }

    console.log("test");
    const grouped = items.reduce((acc, item) => {
      if (item.status === "Success") {
        const existing = acc.find((i: any) => i.itemId === item.itemId);
        if (existing) {
          existing.quantity = parseInt(existing.quantity, 10) + parseInt(item.quantity, 10);
        } else {
          acc.push({ ...item });
        }
      }
      return acc;
    }, []);

    console.log("group", grouped);
    return grouped;
  }

  getTotalAmount(): number {
    return this.groupedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

}
