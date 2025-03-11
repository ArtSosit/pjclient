import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrl: './table-management.component.css'
})
export class TableManagementComponent implements OnInit {
  tables: any[] = [];
  newTable: any = { table_number: '', table_qr: '' };
  userId: string | null = null;
  tableCount: number = 1; // จัดการจำนวนโต๊ะที่เพิ่มเข้ามา
  editingTable: any = null;
  constructor(private https: HttpClient, private router: Router) { }
  jwtHelper = new JwtHelperService();
  token: any;
  ngOnInit(): void {

    this.loadTables();
  }

  // โหลดโต๊ะจาก Backend
  loadTables() {
    this.token = localStorage.getItem('token');
    this.userId = this.jwtHelper.decodeToken(this.token).userId;
    if (this.userId) {
      this.https.get<any[]>(`${environment.apiBaseUrl}/api/tables/${this.userId}`).subscribe(
        (data) => {
          this.tables = data;
          console.log('Tables:', this.tables);
        },
        (error) => {
          console.error('Error loading tables:', error);
        }
      );
    }
  }

  // เพิ่มโต๊ะครั้งละหลายตัว
  addTable(): void {
    if (!this.newTable.table_number.trim() || this.tableCount < 1) {
      alert('กรุณาใส่ชื่อโต๊ะและจำนวนที่ถูกต้อง');
      return;
    }

    for (let i = 0; i < this.tableCount; i++) {
      const tableNumber = `${this.newTable.table_number}-${i + 1}`; // ตั้งชื่อแยกเช่น "โต๊ะ-1", "โต๊ะ-2"

      this.https.post<any>(`${environment.apiBaseUrl}/api/tables/`, {
        userId: this.userId,
        table_number: tableNumber,
      }).subscribe(
        (response) => {
          this.tables.push(response); // เพิ่มเข้า List
        },
        (error) => {
          console.error('Error adding table:', error);
        }
      );
    }

    this.newTable = { table_number: '', table_qr: '' };
    this.tableCount = 1;
  }

  // ลบโต๊ะ
  removeTable(tableId: number) {
    if (confirm('ต้องการลบโต๊ะนี้ใช่มั้ย')) {
      this.https.delete(`${environment.apiBaseUrl}/api/tables/${tableId}`).subscribe(() => {
        this.tables = this.tables.filter(table => table.id !== tableId);
      });
    }
  }

  // ดาวน์โหลด QR Code
  downloadQRCode(id: number) {
    const targetUrl = `${window.location.origin}/customer/${this.userId}/${id}/food`;
    const qrUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(targetUrl)}&size=200x200`;

    fetch(qrUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `qrcode_${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(error => console.error('เกิดข้อผิดพลาดในการดาวน์โหลด QR Code:', error));
  }

  // ทดสอบ QR Code (เปิดลิงก์)
  testqr(id: number) {
    const targetUrl = `${window.location.origin}/customer/${this.userId}/${id}/food`;
    console.log("Target URL:", targetUrl);
    window.open(targetUrl, '_blank');
  }

  editTable(table: any) {
    this.editingTable = { ...table }; // คัดลอกข้อมูลโต๊ะเพื่อแก้ไข

  }

  saveEdit(table: any) {
    console.log("edit", this.editingTable.table_number)
    this.https
      .put(`http://localhost:3000/api/tables/${this.editingTable.table_id}`, { table_number: this.editingTable.table_number })
      .subscribe((response) => {
        const index = this.tables.findIndex(t => t.id === table.id);
        this.tables[index] = response;
        this.editingTable = null;
        window.location.reload();
      }
      );
  }
}
