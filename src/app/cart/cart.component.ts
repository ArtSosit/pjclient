import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  cart: any[] = []; // เก็บข้อมูลตะกร้า

  constructor(private router: Router, private http: HttpClient) {
    this.loadCart(); // โหลดข้อมูลตะกร้าเมื่อเปิดหน้า
  }

  // ✅ โหลดตะกร้าจาก LocalStorage
  loadCart(): void {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
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
    items: this.cart
  };

  // ✅ ถ้ามี orderId อยู่แล้ว ให้ส่งไปด้วย (อัปเดตออเดอร์เดิม)
  if (orderId) {
    orderData.order_id = orderId;
  }

  console.log("📦 ส่งคำสั่งซื้อ:", orderData);

  this.http.post<{ message: string; orderId: number }>("http://localhost:3000/api/orders/", orderData)
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

