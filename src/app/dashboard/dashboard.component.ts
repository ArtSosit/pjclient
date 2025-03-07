import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private http: HttpClient, private route: ActivatedRoute) { this.fetchdata(); }
  totalSales: number = 0;
  ngOnInit(): void {

  }
  fetchdata() {
    this.storeId = localStorage.getItem('userId');

    if (!this.storeId) {
      console.error("Store ID is missing in localStorage.");
      this.errorMessage = 'Store ID is missing. Please log in again.';
      return;
    }

    // สร้าง URL สำหรับ API พร้อมส่ง startDate และ endDate (ถ้ามี)
    let url = `${environment.apiBaseUrl}/api/sales/${this.storeId}`;

    if (this.startDate && this.endDate) {
      url += `?startDate=${this.startDate}&endDate=${this.endDate}`;
    }

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.sales = data;
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





