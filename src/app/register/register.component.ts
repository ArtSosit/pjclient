import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isRegistered = false;
  user = {
    userID: '',
    username: '',
    email: '',
    password: '',
    storeImage: '',
    storeName: '',
    storeDetails: '',
    contactInfo: '',
    promptpay: '',
    promptpayimage: '',
    openTime: '',
    closeTime: ''
  };
  storeImage: File | null = null;
  promptpayImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) { }
  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.user.storeImage = file;

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imagePreview = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
  onRegister() {
    this.authService.register(this.user).subscribe(
      response => {
        console.log('Registration successful!', response);
        // this.user.userID = response.userID;
        this.isRegistered = true;
        localStorage.setItem('userId', response.userID);
        localStorage.setItem('email', this.user.email);
        localStorage.setItem('password', this.user.password);
      },
      error => {
        console.error('Error registering user', error);
      }
    );
    this.isRegistered = true;
  }
  onSubmitAdditionalInfo() {
  const formData = new FormData();
  console.log('User:', this.user);

  formData.append('userID', localStorage.getItem('userId') || '');
  formData.append('storeName', this.user.storeName);
  formData.append('storeDetails', this.user.storeDetails);
  formData.append('contactInfo', this.user.contactInfo);
  formData.append('promptpay', this.user.promptpay);
  formData.append('openTime', this.user.openTime);
  formData.append('closeTime', this.user.closeTime);

  if (this.storeImage) {
    formData.append('storeImage', this.storeImage, this.storeImage.name);
  } else {
    console.warn('No store image selected');
  }

  if (this.promptpayImage) {
    formData.append('promptpayimage', this.promptpayImage, this.promptpayImage.name);
  } else {
    console.warn('No promptpay image selected');
  }

formData.forEach((value, key) => {
  console.log(`${key}:`, value);
});

  this.http.put('http://localhost:3000/api/stores/additional-info', formData).subscribe(
    (response: any) => {
      console.log('Data added successfully:', response);
      this.router.navigate(['/main/menu']);
    },
    (error: any) => {
      console.error('Error adding data:', error);
    }
  );
}

  // Handler for file input change
  onFileChange(event: any, fileType: 'storeImage' | 'promptpayImage') {
    const file = event.target.files[0];
    console.log(fileType + " selected file:", file);  // ตรวจสอบไฟล์ที่เลือก

    if (fileType === 'storeImage') {
      this.storeImage = file;
    } else if (fileType === 'promptpayImage') {
      this.promptpayImage = file;
    }
  }
}
