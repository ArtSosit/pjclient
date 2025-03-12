import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { SocketService } from '../socket.service';

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

  constructor(private http: HttpClient, private route: ActivatedRoute, private socketService: SocketService) { }

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
    this.listenForOrderCancellation();
    this.listenForConfirmPayment();
    this.listenForcancel();

  }

  listenForcancel() {
    this.socketService.listenEvent("orderCancelled", (data: any) => {
      console.log("cancel")
      const OrderId = localStorage.getItem('orderId');
      if (OrderId === data.orderId) {
        alert(`ยกเลิกออเดอร์แล้ว`);
        localStorage.removeItem('orderId');

      }

    }
    );
  };

  listenForConfirmPayment() {
    this.socketService.listenEvent("confirmPayment", (data: any) => {
      const OrderId = localStorage.getItem('orderId');
      console.log("form socket", data);
      if (OrderId === data.orderId) {
        localStorage.removeItem('orderId');
        alert(`ยืนยันการชำระเงินแล้ว`);
      }
    });
  }

  listenForOrderCancellation() {
    this.socketService.listenEvent("orderCancelled", (data: any) => {
      console.log("cancell")
      const storedOrderId = localStorage.getItem('orderId');
      if (storedOrderId === data.orderId) {
        localStorage.removeItem('orderId');
        alert(`❌ ออเดอร์หมายเลข ${data.orderId} ถูกยกเลิกแล้ว`);
        window.location.reload();
      }
    });
  }


  fetchMenus(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/stores/` + this.storeId).subscribe(
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
