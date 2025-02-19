import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-customer-menus',
  templateUrl: './customer-menus.component.html',
  styleUrl: './customer-menus.component.css'
})
export class CustomerMenusComponent implements OnInit {
  userId: string | null = null;
  store: any[] = [];
  storeId: string | null = null;
  tableId: string | null = null;
  table: any;
  constructor(private http: HttpClient,private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('store');
    this.tableId = this.route.snapshot.paramMap.get('table');
    if (this.storeId) {
      localStorage.setItem('storeId', this.storeId);
    }
    if (this.tableId) {
      localStorage.setItem('tableId', this.tableId);
    }
    console.log(`Store ID: ${this.storeId}, Table ID: ${this.tableId}`);
    this.fetchMenus();
  }
 

  fetchMenus(): void {

    this.http.get<any[]>(`${environment.apiBaseUrl}/api/stores/`+this.storeId).subscribe(
      (response) => {
        this.store = response; // เก็บข้อมูลใน main
        console.log('Menus :', this.store); // แสดงข้อมูลใน console
      },
      (error) => {
        console.error('Error fetching menus:', error); // แสดงข้อผิดพลาดใน console
      }
    );

    this.http.get<any[]>(`${environment.apiBaseUrl}/api/tables/` + this.storeId).subscribe({
    next: (data) => {
      console.log('Fetched tables data1:', data); // ตรวจสอบข้อมูลที่ได้รับจาก API

      const foundTable = data.find(table => table.table_id === parseInt(this.tableId!, 10));

      if (foundTable) {
        console.log('Table ID matches:', this.tableId);
        
        // ใส่ข้อมูลโต๊ะที่เจอ ลงใน this.table
        this.table = foundTable;  

      } else {
        console.warn('Table ID not found:', this.tableId);
      }

      console.log('Updated Table:', this.table);
    },
    error: (error) => {
      console.error('Error fetching tables:', error);
    }
  });



}
}
