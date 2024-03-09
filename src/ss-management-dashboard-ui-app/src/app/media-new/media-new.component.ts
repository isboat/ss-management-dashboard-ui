import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { MediaService } from 'app/services/media.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';

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

  submitted: boolean = false;
  buttonTxtInit: string = 'Upload';
  buttonTxt: string = '';

  constructor(
    private media: MediaService, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.aiFlag = !!params["ai"];
      if(this.aiFlag) this.buttonTxtInit = 'Generate'
      this.buttonTxt = this.buttonTxtInit;
    });
  }

  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }
  postNew() {
    if (!this.title) {
      this.notificationService.showWarning("Give the media a title")
      return;
    }

    this.submitted = true;
    this.buttonTxt = this.aiFlag ? 'Generating...' : 'Uploading...'

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
        next: (data) => {
          if(data) {
            this.router.navigate(['/media-details', data.id]);
          }
          else{
            this.notificationService.showError("Error occurred while uploading/generating media.")
          }
          this.submitted = false;
          this.buttonTxt = this.buttonTxtInit;
        },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            this.notificationService.showError("Error occurred while uploading/generating media.")
            console.log(e)
          }
          this.submitted = false;
          this.buttonTxt = this.buttonTxtInit;
        },
        complete: () => {
          this.submitted = false;
          this.buttonTxt = this.buttonTxtInit;
        }
      }
    )
  }
}
