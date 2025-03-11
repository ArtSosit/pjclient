import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  password: any = {
    password: '',
    new_password: '',
    confirm_password: ''
  };
  userId: string | null = null;
  store: any;
  editStore: any = {};
  storeImage: File | null = null;
  promptpayImage: File | null = null;
  userData: any;
  token: string | null = null;
  private jwtHelper = new JwtHelperService();
  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.userData = this.authService.getUserData();
    console.log('User Data:', this.userData);
    this.token = localStorage.getItem('token');
    if (!this.token || this.jwtHelper.isTokenExpired(this.token)) {
      this.router.navigate(['/login']);
    } else {
      // ตรวจสอบได้ว่า token ยังใช้ได้หรือไม่
      this.userId = this.jwtHelper.decodeToken(this.token).userId;
      console.log('User ID:', this.userId);
      this.fetchMenus();
    }


    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
    });

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
    formData.append('storeName', this.editStore?.store_name);
    formData.append('email', this.editStore.email);
    formData.append('promptpay', this.editStore.promptpay_number);
    formData.append('promptpayimage', this.editStore.promptpay_qr || '');
    formData.append('openTime', this.editStore.open_time);
    formData.append('closeTime', this.editStore.close_time);
    formData.append('contactInfo', this.editStore.contact);
    formData.append('storeDetails', this.editStore.details)


    console.log("formdata", formData)
    this.http.put<any>(`${environment.apiBaseUrl}/api/stores/additional-info/`, formData).subscribe(
      (response) => {
        console.log('Menu updated successfully:', response);
        this.store = Object.assign({}, this.editStore);
        this.store.store_image = `${environment.apiBaseUrl}/uploads/${this.store.store_image}`;
        this.store.promptpay_qr = `${environment.apiBaseUrl}/uploads/${this.store.promptpay_qr}`
        this.fetchMenus();

      },
      (error) => {
        console.error('Error updating menu:', error);
      }
    );
  }


  onInputChange() {
    console.log('ค่าที่ป้อน:', this.password);
  }

  UpdatePassword() {
    console.log('editpassword:', this.passwordForm);

    if (this.passwordForm.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const formValues = this.passwordForm.value;

    // ตรวจสอบว่า new_password และ confirm_password ตรงกัน
    if (formValues.new_password !== formValues.confirm_password) {
      alert('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    // ✅ ใช้ JSON แทน FormData
    const data = {
      userId: this.userId || '',
      oldPassword: formValues.password,
      newPassword: formValues.new_password
    };

    console.log('รหัสผ่านที่ต้องการบันทึก:', data);

    // ✅ เรียก API ส่งเป็น JSON
    this.http.put<any>(`${environment.apiBaseUrl}/api/stores/update-password`, data).subscribe(
      (response) => {
        console.log('เปลี่ยนรหัสผ่านสำเร็จ:', response);
        alert('เปลี่ยนรหัสผ่านสำเร็จ');
        this.passwordForm.reset(); // ✅ รีเซ็ตฟอร์มให้กลับเป็นค่าว่าง
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน:', error);
        alert('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    );
  }



}



