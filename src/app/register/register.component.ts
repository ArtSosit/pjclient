import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
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
  
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
  
    if (storedEmail && storedPassword) {
      // ถ้ามีข้อมูลให้ทำการล็อกอินอัตโนมัติ
     
      this.auth.email = storedEmail;
      this.auth.password = storedPassword;
      this.onSubmit(this.auth.email,this.auth.password); // เรียกฟังก์ชัน onSubmit() เพื่อล็อกอิน
    }
  }

  onSubmit(email: string,password: string) {
  if (!email || !password) {
      this.loginError = 'Please enter both email and password.';
      return;
    }

    this.http.post("http://localhost:3000/api/auth/login", this.auth).subscribe(
      (response: any) => {
        console.log('Login response:', response);
        // Check the success flag in the response
        if (response) {
          console.log('Login successful:', response);
          
          // เก็บ userId และข้อมูลการล็อกอินใน localStorage
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('email', this.auth.email); 
          localStorage.setItem('password', this.auth.password);
          
          // Redirect after successful login
          this.router.navigate(['/main/menu']);
        } else {
          this.loginError = 'Invalid credentials. Please try again.';
        }
      },
      (error) => {
        // Handle login error: show user-friendly message
        console.error('Login error:', error);
        this.loginError = 'An error occurred during login. Please try again later.';
      }
    );
}

  onRegister() {
    this.authService.register(this.user).subscribe(
      response => {
        console.log('Registration successful!', response);
        // this.user.userID = response.userID;
        this.isRegistered = true;
        localStorage.setItem('userId', response.userID);
        localStorage.setItem('email', this.user.email);
        localStorage.setItem('password', this.user.password);
      },
      error => {
        console.error('Error registering user', error);
      }
    );
    this.isRegistered = true;
  }
  onSubmitAdditionalInfo() {
  const formData = new FormData();
  console.log('User:', this.user);

  formData.append('userID', localStorage.getItem('userId') || '');
  formData.append('storeName', this.user.storeName);
  formData.append('storeDetails', this.user.storeDetails);
  formData.append('contactInfo', this.user.contactInfo);
  formData.append('promptpay', this.user.promptpay);
  formData.append('openTime', this.user.openTime);
  formData.append('closeTime', this.user.closeTime);

  if (this.storeImage) {
    formData.append('storeImage', this.storeImage, this.storeImage.name);
  } else {
    console.warn('No store image selected');
  }

  if (this.promptpayImage) {
    formData.append('promptpayimage', this.promptpayImage, this.promptpayImage.name);
  } else {
    console.warn('No promptpay image selected');
  }

formData.forEach((value, key) => {
  console.log(`${key}:`, value);
});

  this.http.put('http://localhost:3000/api/stores/additional-info', formData).subscribe(
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
