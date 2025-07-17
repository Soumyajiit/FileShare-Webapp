import { Component } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html'
})
export class UploadComponent {
  selectedFile: File | null = null;
  sessionLink: string = '';

  constructor(private api: ApiService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.api.uploadFile(formData).subscribe({
      next: (res: any) => {
        this.sessionLink = res.link;
      },
      error: (err) => {
        alert('Upload failed!');
        console.error(err);
      }
    });
  }
}
