import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isRegistered = false;
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
  auth = {
    email: '',
    password: ''
  }
  loginError: string | null = null;
  storeImage: File | null = null;
  promptpayImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  jwtHelper = new JwtHelperService();
  token: any;
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (!this.token || this.jwtHelper.isTokenExpired(this.token)) {
      return;
    } else {
      // ตรวจสอบได้ว่า token ยังใช้ได้หรือไม่
      this.router.navigate(['/main/menu']);
    }
  }




  onRegister() {
    this.authService.register(this.user).subscribe(
      response => {
        console.log('✅ Registration successful!', response);
        this.isRegistered = true;
        this.token = response.token;
        localStorage.setItem('token', this.token);
        // เก็บเฉพาะ userId และ email (ไม่เก็บรหัสผ่าน)
        // localStorage.setItem('userId', response.userID);
        // localStorage.setItem('email', this.user.email);

        // ห้ามเก็บรหัสผ่านใน localStorage
        alert('✅ สมัครสมาชิกสำเร็จ!');
      },
      error => {
        console.error('❌ Error registering user:', error);

        if (error.status === 400) {
          alert('❌ ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว!');
        } else if (error.status === 500) {
          alert('❌ เกิดข้อผิดพลาดในระบบ โปรดลองใหม่อีกครั้ง!');
        } else {
          alert('❌ ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่!');
        }
      }
    );
  }


  onSubmitAdditionalInfo() {
    this.user.userID = this.jwtHelper.decodeToken(this.token).userId;
    const formData = new FormData();
    console.log('User:', this.user);



    formData.append('userID', this.user.userID);
    formData.append('storeName', this.user.storeName);
    formData.append('storeDetails', this.user.storeDetails);
    formData.append('contactInfo', this.user.contactInfo);
    formData.append('promptpay', this.user.promptpay);
    formData.append('openTime', this.user.openTime);
    formData.append('closeTime', this.user.closeTime);

    if (this.storeImage && this.promptpayImage) {
      formData.append('storeImage', this.storeImage, this.storeImage.name);
      formData.append('promptpayimage', this.promptpayImage, this.promptpayImage.name);
    } else {
      // console.warn('No store image selected');
      alert('กรุณาอัปโหลดรูปภาพร้านค้าและรูปภาพพร้อมเพย์')
      return;
    }




    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.http.put(`${environment.apiBaseUrl}/api/stores/additional-info`, formData).subscribe(
      (response: any) => {
        console.log('Data added successfully:', response);
        this.router.navigate(['/main/menu']);
      },
      (error: any) => {
        console.error('Error adding data:', error);
      }
    );
  }

  // Handler for file input change
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
