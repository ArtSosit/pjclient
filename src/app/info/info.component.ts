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
  img: string | null = null;
  user = {
    userID: '',
    username: '',
    email: '',
    password: '',
    storeImage: '',
    storeName: '',
    storeDetails: '',
    contactInfo: '',
    promptpay: '',
    promptpayimage: '',
    openTime: '',
    closeTime: ''
  };
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
        this.img = `${environment.apiBaseUrl}/uploads/${this.store.store_image}`;
        console.log(this.img)
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
      this.storeImage = file;
    } else if (fileType === 'promptpayImage') {
      this.promptpayImage = file;
    }
  }


}
