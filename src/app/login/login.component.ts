import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loginError: string | null = null;

  private apiUrl = `${environment.apiBaseUrl}/api/auth/login`; // URL ของ API ที่คุณใช้

  constructor(private http: HttpClient, private router: Router) { }
  
  user = {
    email: '',
    password: ''
  }

  ngOnInit() {
    // ตรวจสอบว่ามีข้อมูลใน localStorage หรือไม่
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (storedEmail && storedPassword) {
      // ถ้ามีข้อมูลให้ทำการล็อกอินอัตโนมัติ
      this.user.email = storedEmail;
      this.user.password = storedPassword;
      this.onSubmit(); // เรียกฟังก์ชัน onSubmit() เพื่อล็อกอิน
    }
  }

  onSubmit() {
    // Ensure this.user is properly initialized
    if (!this.user || !this.user.email || !this.user.password) {
      this.loginError = 'Please enter both email and password.';
      return;
    }

    this.http.post(this.apiUrl, this.user).subscribe(
      (response: any) => {
        console.log('Login response:', response);
        // Check the success flag in the response
        if (response) {
          console.log('Login successful:', response);
          
          // เก็บ userId และข้อมูลการล็อกอินใน localStorage
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('email', this.user.email); 
          localStorage.setItem('password', this.user.password);
          
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
}
