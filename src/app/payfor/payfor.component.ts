import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@env/environment";

@Component({
  selector: "app-payfor",
  templateUrl: "./payfor.component.html",
  styleUrls: ["./payfor.component.css"],
})
export class PayforComponent implements OnInit {
  lists: any = { items: [] }; // ✅ กำหนดค่าเริ่มต้นให้เป็นอาร์เรย์ว่าง
  qrcode: any;
  groupedItems: any[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchdata();
  }

  fetchdata(): void {
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

    this.http
      .get<any>(`${environment.apiBaseUrl}/api/stores/ppqr/${storeId}`)
      .subscribe({
        next: (data) => {
          console.log("qr", data);
          this.qrcode = `${environment.apiBaseUrl}/uploads/${data.promptpay_qr || "default.jpg"}`;
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
  file: File | null = null;

  onSlipUpload(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      console.log("📎 อัปโหลดสลิป:", this.file);
    }
  }

  submit() {
    if (!this.file) {
      console.error("❌ กรุณาเลือกไฟล์ก่อนทำการอัปโหลด");
      return;
    }

    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      console.error("❌ ไม่พบ orderId");
      return;
    }
    const storeId = localStorage.getItem("storeId");
    console.log("id", storeId)
    const formData = new FormData();
    formData.append("proof", this.file);
    formData.append("storeId", storeId || "");

    this.http.put<any>(`${environment.apiBaseUrl}/api/orders/proof/${orderId}`, formData)
      .subscribe(
        (response) => {
          console.log("✅ อัปโหลดสลิปสำเร็จ:", response);
          this.router.navigate(['./bill']);

        },
        (error) => {
          console.error("❌ อัปโหลดสลิปผิดพลาด:", error);
        }
      );
  }

}
