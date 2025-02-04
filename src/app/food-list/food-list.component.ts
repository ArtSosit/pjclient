import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrl: './food-list.component.css'
})
export class FoodListComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) { this.loadCart();}
  ngOnInit(): void {
    this.fetchMenus();
  }
  userId: string | null = null;
  categories: any[] = [];
  menus: any[] = [];
  storeId: string | null = null;
  tableId: string | null = null;
  table: any;
   selectedMenu: any = null;


  fetchMenus(): void {
    // Retrieve the userId from localStorage
    this.userId = localStorage.getItem('storeId');
    // Fetch categories
    this.http.get<any[]>('http://localhost:3000/api/categories/' + this.userId).subscribe(
      (data) => {
        this.categories = data;
        console.log(this.categories)
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );

    this.http.get<any[]>('http://localhost:3000/api/menus/' + this.userId).subscribe(
      (data) => {
        // Map over the fetched menus and update imageUrl dynamically
        console.log("data", data)
        this.menus = data.map(menu => ({
          ...menu,  // Copy the properties of the menu
          imageUrl: `http://localhost:3000/uploads/${menu.item_image}`  // Prepend the server URL to imageUrl
        }));
      },
      (error) => {
        console.error('Error loading menu items:', error);
      }
    
    );
this.http.get<any[]>('http://localhost:3000/api/tables/' + this.userId).subscribe({
  next: (data) => {
    console.log('Fetched tables data:', data); // ตรวจสอบข้อมูลที่ได้รับจาก API

    // ค้นหาว่า table_id มีอยู่ในข้อมูลหรือไม่
    const foundTable = data.find(table => table.table_id == this.tableId);

    if (foundTable) {
      console.log('✅ Table ID matches:', this.tableId);
      
      // ใส่ข้อมูลโต๊ะที่เจอ ลงใน this.table
      this.table = foundTable;

    } else {
      console.warn('⚠️ Table ID not found:', this.tableId);
    }

    console.log('Updated Table:', this.table);
  },
  error: (error) => {
    console.error('❌ Error fetching tables:', error);
  }
});
  }
quantity: number = 1; // ค่าจำนวนเริ่มต้นเป็น 1
   openModal(menu: any): void {
     this.selectedMenu = menu;
     this.quantity = 1;
  }

  // Close the modal
  closeModal(): void {
    this.selectedMenu = null;
  }
  increaseQuantity(): void {
    this.quantity++;
  }

  // ลดจำนวน (ไม่น้อยกว่า 1)
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

   validateQuantity(): void {
    if (this.quantity < 1 || isNaN(this.quantity)) {
      this.quantity = 1;
    }
  }

  
    cart: any[] = [];
   addToCart(): void {
    if (this.selectedMenu) {
      // ตรวจสอบว่าสินค้ามีอยู่แล้วหรือไม่
      const existingItem = this.cart.find(item => item.item_name === this.selectedMenu.item_name);

      if (existingItem) {
        // ถ้าสินค้าซ้ำ ให้เพิ่มจำนวนแทน
        existingItem.quantity += this.quantity;
        this.selectedMenu = null;
      } else {
        // ถ้ายังไม่มี ให้เพิ่มใหม่
        this.cart.push({
          item_name: this.selectedMenu.item_name,
          price: this.selectedMenu.price,
          quantity: this.quantity,
          imageUrl: this.selectedMenu.imageUrl,
        });
          this.selectedMenu = null;
        
      }

      this.saveCart(); // บันทึกลง localStorage
      console.log("🛒 ตะกร้าสินค้า:", this.cart);
      alert(`เพิ่ม ${this.selectedMenu.item_name} จำนวน ${this.quantity} ชิ้น ลงในตะกร้าแล้ว!`);
      this.closeModal();
    }
  }

  // ลบสินค้าจากตะกร้า
  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.saveCart(); // อัปเดต localStorage
  }

  // บันทึกตะกร้าลง localStorage
  saveCart(): void {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  // โหลดตะกร้าจาก localStorage
  loadCart(): void {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  
  
}
