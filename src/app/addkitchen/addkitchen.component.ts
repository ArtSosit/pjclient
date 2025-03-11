import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env/environment';

@Component({
  selector: 'app-addkitchen',
  templateUrl: './addkitchen.component.html',
  styleUrls: ['./addkitchen.component.css']
})
export class AddkitchenComponent implements OnInit {
  addUserForm: FormGroup;
  message: string = '';
  errorMessage: string = '';
  storeId: string | null = null;
  kitchen: any;
  userId: string | null = null;
  token: any; // ควรให้ตัวแปรเป็น string
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // ดึง token จาก localStorage
    this.token = localStorage.getItem('token');

    // Decode token และดึง userId จาก token
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.storeId = decodedToken?.userId; // หรือค่าอื่นๆ ที่คุณเก็บไว้ใน token
    console.log('User ID:', this.storeId);
    this.fetchkitchen();

  }

  fetchkitchen() {
    if (!this.storeId) {
      console.error('storeId is not available');
      return;
    }
    this.http.get(`${environment.apiBaseUrl}/api/stores/kitchen/` + this.storeId)
      .subscribe({
        next: (data) => {
          this.kitchen = data;
          console.log(this.kitchen);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  addUser() {
    if (this.addUserForm.invalid) {
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วน';
      return;
    }

    this.http.post(`${environment.apiBaseUrl}/api/stores/add-user/` + this.storeId, this.addUserForm.value)
      .subscribe({
        next: (res: any) => {
          this.message = res.message;
          this.errorMessage = '';
          this.addUserForm.reset();
          this.fetchkitchen();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้';
          console.error(error);
          this.message = '';
        }
      });
  }

  deleteUser(userId: number) {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
      this.http.delete(`${environment.apiBaseUrl}/api/stores/kitchen/${userId}`).subscribe({
        next: () => {
          this.message = 'ลบผู้ใช้สำเร็จ!';
          this.fetchkitchen();
        },
        error: (err) => {
          this.errorMessage = 'ไม่สามารถลบได้: ' + err.message;
        },
      });
    }
  }

  changePassword(kitchenId: number) {
    const newPassword = prompt('กรอกรหัสผ่านใหม่:');
    if (newPassword) {
      this.http.put(`${environment.apiBaseUrl}/api/stores/kitchen/password/${kitchenId}`, { password: newPassword }).subscribe({
        next: () => {
          this.message = 'อัปเดตรหัสผ่านสำเร็จ!';
        },
        error: (err) => {
          this.errorMessage = 'อัปเดตรหัสผ่านล้มเหลว: ' + err.message;
        },
      });
    }
  }
}
