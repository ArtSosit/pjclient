import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  token: any;

  jwtHelper = new JwtHelperService();

  ngOnInit() {
    this.token = localStorage.getItem('token');
    if (!this.token || this.jwtHelper.isTokenExpired(this.token)) {
      this.router.navigate(['/login']);
    } else {
      // ตรวจสอบได้ว่า token ยังใช้ได้หรือไม่
      this.router.navigate(['/main/menu']);
    }
  }
  checkUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      const type = this.jwtHelper.decodeToken(token).type;
      return type;  // 'store' or 'kitchen'
    }
    return null;
  }

  onSubmit() {
    if (!this.user.email || !this.user.password) {
      this.loginError = 'Please enter both email and password.';
      return;
    }

    this.http.post(this.apiUrl, this.user).subscribe(
      (response: any) => {
        console.log('Login response:', response.token);

        if (response && response.token) {
          console.log('✅ Login successful:', response);
          alert(response.message)
          // ✅ เก็บ Token แทนการเก็บ Password
          localStorage.setItem('token', response.token);


          // 🔀 Redirect ไปหน้าเมนูหลังล็อกอิน
          if (response && response.token) {
            alert(response.message)
            // ✅ เก็บ Token แทนการเก็บ Password
            localStorage.setItem('token', response.token);
            const userType = this.checkUserRole();
            if (userType === 'kitchen') {
              this.router.navigate(['/main/order-list']);
            } else {
              this.router.navigate(['/main/menu']);
            }
          }
        } else {
          alert("ไม่มีข้อมูลผู้ใช้นี้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
          this.loginError = 'Invalid credentials. Please try again.';
        }
      },
      (error) => {
        console.error('❌ Login error:', error);
        alert("ไม่มีข้อมูลผู้ใช้นี้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
        this.loginError = 'An error occurred during login. Please try again later.';
      }
    );
  }

}
