import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { MediaService } from 'app/services/media.service';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css']
})
export class MediaUploadComponent implements OnInit {
  file: File = null;
  fileName = '';
  title = '';
  desc = '';

  constructor(private media : MediaService, private authService: AuthService) {
  }

  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }
  upload() {
    if(!this.title)
    {
      alert("Add title or a short description to this file")
      return;
    }
    if (this.file) {
      this.fileName = this.file.name;

      const formData = new FormData();

      formData.append("file", this.file);
      formData.append("title", this.title);
      formData.append("description", this.desc);

      const upload$ = this.media.upload(formData);

      upload$.subscribe(
        {
          next: () => 
          {
            // success
          },
          error: (e) => {
            if(e.status == 401) 
            {
              this.authService.redirectToLogin(true);
            }
            else
            {
              console.log(e)
            }
          },
          complete: () => console.info('complete')
        }
      )

    } 
    else {
      alert("Please select a file first")
    }
  }

  ngOnInit() {
  }
}
