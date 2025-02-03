import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-customer-menus',
  templateUrl: './customer-menus.component.html',
  styleUrl: './customer-menus.component.css'
})
export class CustomerMenusComponent implements OnInit {
  userId: string | null = null;
  categories: any[] = [];
  menus: any[] = [];
   test: any[] = [];
  // tables: any[] = [];
  storeId: string | null = null;
  tableId: string | null = null;
  table: any;
  constructor(private http: HttpClient,private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('store');
    this.tableId = this.route.snapshot.paramMap.get('table');

    console.log(`Store ID: ${this.storeId}, Table ID: ${this.tableId}`);
    this.fetchMenus();
  }
 

  fetchMenus(): void {
  // Retrieve the userId from localStorage
  this.userId = localStorage.getItem('userId');
  // Fetch categories
  this.http.get<any[]>('http://localhost:3000/api/categories/' + this.userId).subscribe(
    (data) => {
      this.categories = data;
      console.log( this.categories)
    },
    (error) => {
      console.error('Error loading categories:', error);
    }
  );

  // Fetch menus
    this.http.get<any[]>('http://localhost:3000/api/menus/' + this.userId).subscribe(
      (data) => {
        // Map over the fetched menus and update imageUrl dynamically
        console.log("data", data)
        this.test =data
        this.menus = data.map(menu => ({
          ...menu,  // Copy the properties of the menu
          imageUrl: `http://localhost:3000/uploads/${menu.item_image}`  // Prepend the server URL to imageUrl
        }));
      },
      (error) => {
        console.error('Error loading menu items:', error);
      }
    
    );
    console.log("test",this.test)
this.http.get<any[]>('http://localhost:3000/api/tables/' + this.userId).subscribe({
  next: (data) => {
    console.log('Fetched tables data:', data); // ตรวจสอบข้อมูลที่ได้รับจาก API

    // ค้นหาว่า table_id มีอยู่ในข้อมูลหรือไม่
    const foundTable = data.find(table => table.table_id == this.tableId);

    if (foundTable) {
      console.log('✅ Table ID matches:', this.tableId);
      
      // ใส่ข้อมูลโต๊ะที่เจอ ลงใน this.table
      this.table = foundTable;

    } else {
      console.warn('⚠️ Table ID not found:', this.tableId);
    }

    console.log('Updated Table:', this.table);
  },
  error: (error) => {
    console.error('❌ Error fetching tables:', error);
  }
});



}
}
