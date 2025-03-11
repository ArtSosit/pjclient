import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // นำเข้า Router เพื่อทำการรีไดเรกต์
import { environment } from '@env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SocketService } from '../socket.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  store: any = {};
  userType: string | null = null; // เพิ่มตัวแปรสำหรับเก็บ userType
  private jwtHelper = new JwtHelperService();

  token: any; // เพิ่มตัวแปรสำหรับเก็บ userId
  private apiUrl = `${environment.apiBaseUrl}/api/stores/`; // URL ของ API สำหรับดึงข้อมูลร้านค้า
  imageUrl: string | null = null;
  userId: string | null = null; // เพิ่มตัวแปรสำหรับเก็บ userId
  constructor(private http: HttpClient, private router: Router, private socketService: SocketService) { }

  ngOnInit() {

    this.setUserType();
    this.token = localStorage.getItem('token');
    if (!this.token || this.jwtHelper.isTokenExpired(this.token)) {
      this.router.navigate(['/login']);
    } else {
      // ตรวจสอบได้ว่า token ยังใช้ได้หรือไม่
      this.userId = this.jwtHelper.decodeToken(this.token).userId;
      console.log('User ID:', this.userId);
      this.fetchMenus();
      this.listenForRecivedproof();
      this.listenforOrder();
    }

  }
  listenforOrder() {
    const userId = this.jwtHelper.decodeToken(this.token).userId;
    this.socketService.listenEvent("ordering", (data: any) => {
      if (userId == data.storeId) {
        alert(`มีออเดอร์เข้ามา`);
      }
    });
  }

  listenForRecivedproof() {
    const userId = this.jwtHelper.decodeToken(this.token).userId;

    this.socketService.listenEvent("sendproof", (data: any) => {
      if (userId == data.storeId)
        alert(`มีการชำระเงินเข้ามา`);
    });
  }

  logout() {

    localStorage.removeItem('token');// ลบ localStorage
    this.router.navigate(['/login']);
  }

  fetchMenus() {
    const apiUrlWithUserId = `${this.apiUrl}${this.userId}`; // สร้าง URL พร้อมส่ง userId
    console.log('User ID:', this.userId); // แสดง userId ใน console
    this.http.get<any[]>(apiUrlWithUserId).subscribe(
      (response) => {
        this.store = response; // เก็บข้อมูลใน main
        this.imageUrl = `${environment.apiBaseUrl}/uploads/${this.store.store_image}`;
        this.setUserType();
      },
      (error) => {
        console.error('Error fetching menus:', error); // แสดงข้อผิดพลาดใน console
      }
    );

  }


  setUserType() {
    const token = localStorage.getItem('token');
    if (token) {
      const type = this.jwtHelper.decodeToken(token).type;
      this.userType = type;  // Assuming 'userType' is stored in the token payload

    }
  }

}
