import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // นำเข้า HttpClient
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiBaseUrl}/api/auth/register`;
  private jwtHelper = new JwtHelperService();  // สร้างตัวแปร jwtHelper

  constructor(private http: HttpClient) { }

  // ฟังก์ชันการสมัครสมาชิก
  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  // ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้จาก JWT token
  getUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      return this.jwtHelper.decodeToken(token);  // ใช้ decodeToken เพื่อดึงข้อมูลจาก token
    }
    return null;
  }

  // ฟังก์ชันเช็คสถานะการล็อกอิน
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;  // เช็คว่า token หมดอายุหรือไม่
  }

  // ฟังก์ชันเพื่อออกจากระบบ
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }
}
