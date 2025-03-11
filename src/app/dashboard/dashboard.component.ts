import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  storeId: string | null = null;
  sales: any[] = [];
  errorMessage: string = '';
  startDate: string = '';
  endDate: string = '';
  token: string | null = null;
  userId: string | null = null;
  private jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { this.fetchdata(); }
  totalSales: number = 0;
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (!this.token || this.jwtHelper.isTokenExpired(this.token)) {
      this.router.navigate(['/login']);
    } else {
      // ตรวจสอบได้ว่า token ยังใช้ได้หรือไม่
      this.userId = this.jwtHelper.decodeToken(this.token).userId;
      console.log('User ID:', this.userId);
      this.fetchdata();
    }
  }
  // test() {
  //   console.log('startDate:', this.startDate);
  // }
  fetchdata() {
    // สร้าง URL สำหรับ API พร้อมส่ง startDate และ endDate (ถ้ามี)
    let url = `${environment.apiBaseUrl}/api/sales/${this.userId}`;

    if (this.startDate && this.endDate) {
      url += `?startDate=${this.startDate}&endDate=${this.endDate}`;
      console.log('URL:', url);
    }

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.sales = data;
        console.log('Sales data:', this.sales);
        this.totalSales = data.reduce((sum, item) => sum + parseFloat(item.total_sales), 0);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = error.status === 404
          ? 'No sales data found for this store.'
          : 'An error occurred while loading the data. Please try again later.';
      }
    });
  }



}





