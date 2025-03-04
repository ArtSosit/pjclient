import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  userId: string | null = null;
  store: any;
  editStore: any;
  storeImage: File | null = null;
  promptpayImage: File | null = null;
  constructor(private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      this.router.navigate(['/login']);
    } else {
      this.fetchMenus();

    }
  }
  fetchMenus() {
    const userId = this.userId; // หรือดึงจาก service อื่น
    this.http.get<any>(`${environment.apiBaseUrl}/api/stores/${userId}`).subscribe({
      next: (data) => {
        console.log("Data received:", data);
        // จัดการข้อมูลที่ดึงมา เช่น บันทึกลงตัวแปร
        this.store = data;
        this.store.store_image = `${environment.apiBaseUrl}/uploads/${this.store.store_image}`;
        this.store.promptpay_qr = `${environment.apiBaseUrl}/uploads/${this.store.promptpay_qr}`
        console.log(this.store)
      },
      error: (error) => {
        console.error("Error fetching menus:", error);
      }
    });
  }

  onFileChange(event: any, fileType: 'storeImage' | 'promptpayImage') {
    const file = event.target.files[0];
    console.log(fileType + " selected file:", file);  // ตรวจสอบไฟล์ที่เลือก

    if (fileType === 'storeImage') {
      this.editStore.store_image = file;
    } else if (fileType === 'promptpayImage') {
      this.editStore.promptpay_qr = file;
    }
  }


  edit() {
    this.editStore = Object.assign({}, this.store);

    console.log(this.editStore)

  }
  Updateinfo() {
    console.log("editStore", this.editStore)

    const formData = new FormData();
    formData.append('userID', this.userId || '');
    formData.append('storeImage', this.editStore.store_image || '');
    formData.append('storeName', this.editStore.store_name);
    formData.append('email', this.editStore.email);
    formData.append('promptpay', this.editStore.promptpay);
    formData.append('promptpayimage', this.editStore.promptpay_qr || '');
    formData.append('openTime', this.editStore.open_time);
    formData.append('closeTime', this.editStore.close_time);
    formData.append('contactInfo', this.editStore.contact);
    formData.append('storeDetails', this.editStore.details)

    this.http.put<any>(`${environment.apiBaseUrl}/api/stores/additional-info/`, formData).subscribe(
      (response) => {
        console.log('Menu updated successfully:', response);
        this.store = Object.assign({}, this.editStore);
        this.store.store_image = `${environment.apiBaseUrl}/uploads/${this.store.store_image}`;
        this.store.promptpay_qr = `${environment.apiBaseUrl}/uploads/${this.store.promptpay_qr}`
      },
      (error) => {
        console.error('Error updating menu:', error);
        // คุณสามารถเพิ่มโค้ดเพื่อแสดงข้อความผิดพลาดได้ที่นี่
        console.error('Error updating menu:', error);
      }
    );
  }

}



