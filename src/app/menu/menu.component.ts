import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menus: any[] = [];
  userId: string | null = null;
  categories: any[] = [];
  newMenu: any = { name: '', price: 0, category: '', imageUrl: '' };
  selectedMenu: any = null;
  newCategory: string = '';
  addingNewCategory: boolean = false;
  showModal: boolean = false;
  editModal: boolean = false;
  imageUrl: File | null = null;
  isChecked: boolean = true;
  selectedcate: string = "all";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchMenus();
    this.getPopularMenus();
  }
  fetchMenus(): void {
    // Retrieve the userId from localStorage
    this.userId = localStorage.getItem('userId');

    // Fetch categories
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/categories/` + this.userId).subscribe(
      (data) => {
        this.categories = data;
        console.log("cate", this.categories)
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );

    // Fetch menus
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/menus/` + this.userId).subscribe(
      (data) => {
        // Map over the fetched menus and update imageUrl dynamically
        console.log("food", data)
        this.menus = data.map(menu => ({
          ...menu,  // Copy the properties of the menu
          imageUrl: `${environment.apiBaseUrl}/uploads/${menu.item_image}`  // Prepend the server URL to imageUrl
        }));
      },
      (error) => {
        console.error('Error loading menu items:', error);
      }
    );
  }

  checkCategory(event: any) {
    // เช็คว่าผู้ใช้เลือก "เพิ่มหมวดหมู่ใหม่" หรือไม่
    if (event.target.value === 'new') {
      this.addingNewCategory = true;
    } else {
      this.addingNewCategory = false;
    }
  }

  addMenu() {
    if (this.addingNewCategory) {
      this.http.post<any>(`${environment.apiBaseUrl}/api/categories`, { store_id: this.userId, name: this.newCategory }).subscribe(
        (response) => {
          const newCategoryId = response.id;
          console.log('New category ID:', newCategoryId);
          this.saveMenu(newCategoryId);
          this.newCategory = '';
        },
        (error) => {
          console.error('Error adding new category:', error);
        }
      );
    } else {
      console.log('Selected category:', this.newMenu.category.category_id);
      const categoryId = this.newMenu.category.category_id;
      this.saveMenu(this.newMenu.category.category_id);
    }
  }
  saveMenu(categoryId: string) {
    // Validate input
    if (!categoryId || !this.newMenu.name || !this.newMenu.price) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const formData = new FormData();
    formData.append("category_id", categoryId);
    formData.append("store_id", this.userId || '');
    formData.append("name", this.newMenu.name);
    formData.append("price", this.newMenu.price);
    formData.append("item_image", this.imageUrl || ''); // Ensure the key matches backend expectations

    const apiUrl = `${environment.apiBaseUrl}/api/menus`;

    this.http.post<any>(apiUrl, formData).subscribe(
      (response) => {
        // Update the menus array with the new menu item
        this.menus.push(response);
        this.resetForm();
        location.reload(); // Optionally refresh the page to reflect changes
      },
      (error) => {
        console.error('Error adding new menu:', error);
        alert('เกิดข้อผิดพลาดในการเพิ่มเมนูใหม่ โปรดลองอีกครั้ง');
      }
    );
  }


  resetForm() {
    this.newMenu = { name: '', price: 0, category: '', imageUrl: '' };
    this.newCategory = '';
    this.addingNewCategory = false;
    this.showModal = false;
  }


  DeleteMenu(id: string) {
    if (confirm('คุณต้องการลบหรือไม่?')) {
      this.http.delete<any>(`${environment.apiBaseUrl}/api/menus/${id}`).subscribe(
        (response) => {

          const index = this.menus.findIndex((menu) => menu.id === id);
          if (index !== -1) {
            this.menus.splice(index, 1);
          }
          location.reload()
        },
        (error) => {
          console.error('Error deleting menu:', error);
        }
      );
    }

  }
  editMenu(menu: any) {
    this.newMenu = {
      id: menu.item_id,
      name: menu.item_name,
      price: menu.price,
      category: menu.category, // ตั้งค่า category ที่ถูกเลือก 
      imageUrl: menu.item_image
    }; // คัดลอกข้อมูลเมนูที่เลือกเพื่อให้สามารถแก้ไขได้
    this.editModal = true; // เปิด modal
    this.addingNewCategory = false; // รีเซ็ตการเพิ่มหมวดหมู่ใหม่
    console.log("Edit Menu:", this.newMenu);
  }


  editcategory() {
    if (this.addingNewCategory) {
      // เรียก API เพื่อเพิ่มหมวดหมู่ใหม่
      this.http.post<any>(`${environment.apiBaseUrl}/api/categories`, { store_id: this.userId, name: this.newCategory }).subscribe(
        (response) => {
          const newCategoryId = response.id; // รับ ID ของหมวดหมู่ที่เพิ่มใหม่
          console.log('New category ID:', newCategoryId);
          // เพิ่มเมนูใหม่พร้อมกับใช้ ID ของหมวดหมู่ที่เพิ่มใหม่
          this.updateMenu(newCategoryId);

          // รีเซ็ตหมวดหมู่ใหม่
          this.newCategory = '';
        },
        (error) => {
          console.error('Error adding new category:', error);
        }
      );
    } else {
      // ใช้หมวดหมู่ที่เลือกจาก dropdown (ไม่ใช่หมวดหมู่ใหม่)
      console.log('Selected category:', this.newMenu.category.category_id);
      const categoryId = this.newMenu.category.category_id;
      this.updateMenu(this.newMenu.category.category_id);
    }
  }

  updateMenu(id: string) {
    // สร้างข้อมูลสำหรับอัปเดตเมนู
    const formData = new FormData();
    formData.append('category_id', id);
    formData.append('store_id', this.userId || '');
    formData.append('name', this.newMenu.name);
    formData.append('price', this.newMenu.price.toString());
    formData.append("item_image", this.imageUrl || '');


    // เรียก API เพื่ออัปเดตเมนู
    this.http.put<any>(`${environment.apiBaseUrl}/api/menus/${this.newMenu.id}`, formData).subscribe(
      (response) => {
        // จัดการกับการตอบกลับเมื่ออัปเดตสำเร็จ
        console.log('Menu updated successfully:', response);
        this.editModal = false; // ปิด modal
        location.reload();
      },
      (error) => {
        console.error('Error updating menu:', error);
        // คุณสามารถเพิ่มโค้ดเพื่อแสดงข้อความผิดพลาดได้ที่นี่
        console.error('Error updating menu:', error);
      }
    );
  }

  clearMenu() {
    this.newMenu = { name: '', price: 0, category: '', imageUrl: '' };
    this.editModal = false
    this.showModal = false;
  }

  onFileChange(event: any, fileType: 'menuImage') {
    // จัดการอัปโหลดไฟล์ที่ผู้ใช้เลือก
    const file = event.target.files[0];
    console.log('food img', file)
    if (file) {
      this.imageUrl = file;
      console.log(`${fileType} selected:`, file);
    }
  }
  menu = { status: '' };
  toggleStatus(id: number) {
    const menuItem = this.menus.find(menu => menu.item_id === id);
    if (!menuItem) return;

    // เปลี่ยนค่าใน UI ก่อน
    menuItem.status = menuItem.status === "available" ? "unavailable" : "available";

    // สร้างข้อมูลเพื่อส่งไปอัปเดตเซิร์ฟเวอร์
    const formData = new FormData();
    formData.append("menuId", id.toString());
    formData.append("status", menuItem.status);

    this.http.post(`${environment.apiBaseUrl}/api/menus/status`, formData)
      .subscribe({
        next: (res) => console.log("✅ Status updated:", res),
        error: (err) => {
          console.error("❌ Error:", err);
          // ถ้าเกิด error ให้เปลี่ยนค่า status กลับ
          menuItem.status = menuItem.status === "available" ? "unavailable" : "available";
        }
      });
  }

  filteredMenus() {
    if (this.selectedcate === "all") {
      return this.menus;
    }
    console.log(this.selectedcate)
    return this.menus.filter((menu) => menu.category === this.selectedcate);
  }

  toggleRecommended(itemId: number, isRecommended: number) {
    // สลับค่า recommended (1 -> 0, 0 -> 1)
    const newStatus = isRecommended === 1 ? 0 : 1;

    console.log("🔄 กำลังอัปเดต recommended:", newStatus);

    this.http
      .put(`http://localhost:3000/api/menus/recommend/${itemId}`, { recommended: newStatus })
      .subscribe({
        next: (response: any) => {
          console.log("✅ อัปเดตสำเร็จ:", response.message);

          // อัปเดตค่าใน UI (สมมติว่า this.menus มีข้อมูลที่ดึงมาแล้ว)
          const menu = this.menus.find((m) => m.item_id === itemId);
          if (menu) {
            menu.is_recommended = newStatus;
          }
        },
        error: (err) => {
          console.error("❌ เกิดข้อผิดพลาด:", err);
        },
      });
  }
  getDiscountedPrice(price: number, discount: number): number {
    return price - discount;
  }


  setDiscount(menu: any) {
    this.selectedMenu = menu;
    console.log("menu", this.selectedMenu)
  }
  discountMenu(id: any) {
    console.log("id", id)
    this.http.put<any>(`${environment.apiBaseUrl}/api/menus/discount/${id}`, { discount: this.newMenu.discount }).subscribe(
      (response) => {
        console.log('Discount updated successfully:', response);
        location.reload();
      },
      (error) => {
        console.error('Error updating discount:', error);
      }
    );

  }

  resetDiscountForm() {
    this.newMenu.discount = null; // Reset the discount value
    this.selectedMenu = null; // Optional: Reset selected menu

  }
  cancelDiscount(itemId: number) {
    const menu = this.menus.find(m => m.item_id === itemId);
    if (menu) {
      menu.discount = 0; // รีเซ็ตส่วนลดเป็น 0
      this.http.put<any>(`${environment.apiBaseUrl}/api/menus/discount/${itemId}`, { discount: 0 }).subscribe(
        (response) => {
          console.log('Discount updated successfully:', response);
          location.reload();
        },
        (error) => {
          console.error('Error updating discount:', error);
        }
      );
      console.log(`ยกเลิกการลดราคาเมนู ID: ${itemId}`);
    }
  }

  topMenus: any;

  getPopularMenus(): void {
    const storeId = localStorage.getItem("storeId");
    console.log(storeId)
    this.http.get(`${environment.apiBaseUrl}/api/menus/top-menu/${storeId}`).subscribe({
      next: (response: any) => {
        this.topMenus = response;
        console.log("🔥 เมนูยอดนิยม (ตามจำนวนการสั่ง):", this.topMenus);
      },
      error: (error) => {
        console.error("❌ ERROR:", error);
      }
    });
  }

  isBestSeller(menuId: number): boolean {
    // ตรวจสอบว่ามี topMenus และมีค่าอยู่หรือไม่
    if (!this.topMenus) return false;

    return this.topMenus.some((menu: any) => menu.item_id === menuId);
  }




}