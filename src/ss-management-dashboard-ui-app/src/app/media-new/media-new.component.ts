import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { MediaService } from 'app/services/media.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-media-new',
  templateUrl: './media-new.component.html',
  styleUrls: ['./media-new.component.css']
})
export class MediaNewComponent implements OnInit {
  file: File = null;
  fileName = '';
  title = '';
  desc = '';
  aiFlag: boolean = false;

  constructor(private media: MediaService, private authService: AuthService, private router: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.aiFlag = !!params["ai"];
    });
  }

  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }
  postNew() {
    if (!this.title || !this.desc) {
      alert("Add title and a short description")
      return;
    }

    const formData = new FormData();

    if (this.file) {
      this.fileName = this.file.name;
      formData.append("file", this.file);
    }

    formData.append("title", this.title);
    formData.append("description", this.desc);
    formData.append("isAi", `${this.aiFlag}`);

    const upload$ = this.media.postNew(formData);

    upload$.subscribe(
      {
        next: () => {
          // success
        },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      }
    )
  }
}