import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart: any[] = []; // เก็บข้อมูลตะกร้า

  constructor(private router: Router) {
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


}
