import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrl: './table-management.component.css'
})
export class TableManagementComponent implements OnInit {
  tables: any[] = [];
  newTable: any = {table_number:'',table_qr:''}
  userId: string | null = null;
  constructor(private https: HttpClient, private router: Router) { }
  ngOnInit(): void {
  this.userId = localStorage.getItem('userId');
    this.https.get < any[]>('http://localhost:3000/api/tables/'+this.userId).subscribe(data => {
      this.tables = data;
      console.log('Tables:', this.tables);
    });
  }
  addTable(): void {
    // Validate the new table data

    // if (this.newTable.table_number && this.newTable.table_qr) {
      this.https.post<any>('http://localhost:3000/api/tables/', {
        userId: this.userId,
        table_number: this.newTable.table_number,
      }).subscribe(
        (response) => {
          // Assuming response contains the created table details
          this.tables.push(response); // Add the new table to the list
          this.newTable = { table_number: '', table_qr: '' }; // Reset form
        },
        (error) => {
          console.error('Error adding table:', error);
        }
      );
    // } else {
    //   alert('Please provide both table number and QR code.');
    // }
  }
  removeTable(tableId: number) {
    if (confirm('ต้องการลบโต๊ะนี้ใช่มั้ย')) {
      console.log(tableId);
      this.https.delete('http://localhost:3000/api/tables/' + tableId).subscribe(() => {
        this.tables = this.tables.filter(table => table.id !== tableId);
        location.reload();
      });
    }
  }

downloadQRCode(id: number) {
  // URL ที่ต้องการให้ลูกค้าสแกนแล้วเปิด
  const targetUrl = `${window.location.origin}/customer/${this.userId}/${id}`;

  // ใช้ API สร้าง QR Code
  const qrUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(targetUrl)}&size=200x200`;

  // ดึงภาพจาก URL และแปลงเป็นไฟล์ Blob
  fetch(qrUrl)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qrcode.png`;
      document.body.appendChild(link);
      link.click(); 
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // ล้างหน่วยความจำ
    })
    .catch(error => console.error('เกิดข้อผิดพลาดในการดาวน์โหลด QR Code:', error));
}
  testqr(id: number) {
  const targetUrl = `${window.location.origin}/customer/${this.userId}/${id}`;
console.log("✅ Target URL:", targetUrl); 
  // ใช้ API สร้าง QR Code
  const qrUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(targetUrl)}&size=200x200`;

     window.open(targetUrl, '_blank');
  }


  
    
}