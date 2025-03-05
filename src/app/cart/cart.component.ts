import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) { }
  cart: any[] = []; // เก็บข้อมูลตะกร้า
  openTime: any;
  closeTime: any;
  serverTime: any;

  ngOnInit(): void {
    this.loadCart(); // โหลดข้อมูลตะกร้าเมื่อเปิดหน้า
    this.loadTime();
    this.getServerTime();
  }


  // ✅ โหลดตะกร้าจาก LocalStorage
  loadCart(): void {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  getServerTime(): void {
    this.http.get<{ serverTime: string }>(`${environment.apiBaseUrl}/server-time`)
      .subscribe(response => {
        this.serverTime = new Date(response.serverTime);
        console.log("⏰ เวลาปัจจุบันของเซิร์ฟเวอร์:", this.serverTime);
      });
  }
  loadTime(): void {
    const store_id = localStorage.getItem("storeId");
    this.http.get(`${environment.apiBaseUrl}/api/stores/time/${store_id}`).subscribe({
      next: (response: any) => {
        console.log("response", response);
        this.openTime = response.open_time;
        this.closeTime = response.close_time;
        console.log("เวลาเปิด-ปิด:", this.openTime, this.closeTime);
      },
      error: (error) => {
        console.error("ERROR:", error);
      }
    });
  }

  // ✅ ลบสินค้าออกจากตะกร้า
  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  // ✅ อัปเดตจำนวนสินค้า
  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cart[index].quantity = newQuantity;
    } else {
      if (confirm("Do you really want to remove this item?")) {
        this.removeFromCart(index);
      } else {
        this.cart[index].quantity = 1;
      }
    }
    this.saveCart();
  }

  // ✅ บันทึกตะกร้าลง LocalStorage
  saveCart(): void {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  ordering(): void {
    if (this.cart.length === 0) {
      alert("ไม่มีสินค้าในตะกร้า");
      return;
    }

    // ❗❗ ใช้ค่าที่ได้จากฟังก์ชันอื่น แทนการดึง API ใหม่
    const currentTime = this.serverTime.getHours() * 60 + this.serverTime.getMinutes(); // แปลงเป็นนาที

    const [openHour, openMinute] = this.openTime.split(":").map(Number);
    const [closeHour, closeMinute] = this.closeTime.split(":").map(Number);

    const openTime = openHour * 60 + openMinute;  // เวลาเปิดเป็นนาที
    const closeTime = closeHour * 60 + closeMinute; // เวลาปิดเป็นนาที

    if (currentTime < openTime && currentTime > closeTime) {
      alert(`❌ ร้านเปิดให้สั่งซื้อได้เฉพาะ ${this.openTime} - ${this.closeTime} เท่านั้น`);
      return;
    }

    // ✅ ผ่านการเช็คเวลา → ดำเนินการสั่งอาหาร
    const store_id = localStorage.getItem("storeId");
    const table_id = localStorage.getItem("tableId");
    let orderId = localStorage.getItem("orderId"); // ✅ ดึง orderId ที่มีอยู่

    if (!store_id || !table_id) {
      alert("ข้อมูลร้านหรือโต๊ะไม่ถูกต้อง!");
      return;
    }

    const orderData: any = {
      store_id: store_id,
      table_id: table_id,
      items: this.cart,
      price: this.cart,
    };

    console.log("📦 ส่งคำสั่งซื้อ:", orderData);

    // ✅ ถ้ามี orderId อยู่แล้ว ให้ส่งไปด้วย (อัปเดตออเดอร์เดิม)
    if (orderId) {
      orderData.order_id = orderId;
    }

    this.http.post<{ message: string; orderId: number }>(`${environment.apiBaseUrl}/api/orders/`, orderData)
      .subscribe({
        next: (response) => {
          console.log("✅ คำสั่งซื้อตอบกลับ:", response);

          // ✅ ถ้าเป็นออเดอร์ใหม่ ให้เก็บ orderId ลง localStorage    
          if (!orderId) {
            localStorage.setItem("orderId", response.orderId.toString());
          }

          alert(`✅ สั่งอาหารสำเร็จ!\n หมายเลขออเดอร์: ${response.orderId}`);

          // ล้างตะกร้าหลังสั่งเสร็จ
          this.cart = [];
          localStorage.removeItem("cart");
        },
        error: (error) => {
          alert("เกิดข้อผิดพลาดในการสั่งอาหาร");
          console.error("ERROR:", error);
        }
      });
  }





}

