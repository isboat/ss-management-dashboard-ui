import { Component, computed, signal } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { MediaService } from 'app/services/media.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';

@Component({
  standalone: false,
  selector: 'app-media-new',
  templateUrl: './media-new.component.html',
  styleUrls: ['./media-new.component.css']
})
export class MediaNewComponent {
  readonly file = signal<File | null>(null);
  readonly title = signal('');
  readonly desc = signal('');
  readonly aiFlag = signal(false);
  readonly submitted = signal(false);
  readonly buttonText = computed(() => {
    if (this.submitted()) return this.aiFlag() ? 'Generating...' : 'Uploading...';
    return this.aiFlag() ? 'Generate' : 'Upload';
  });

  constructor(
    private media: MediaService, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.aiFlag.set(!!params["ai"]);
    });
  }

  onFilechange(event: any) {
    this.file.set(event.target.files[0] ?? null);
  }
  postNew() {
    if (!this.title()) {
      this.notificationService.showWarning("Give the media a title")
      return;
    }

    this.submitted.set(true);

    const formData = new FormData();

    const file = this.file();
    if (file) {
      formData.append("file", file);
    }

    formData.append("title", this.title());
    formData.append("description", this.desc());
    formData.append("isAi", `${this.aiFlag()}`);

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
          this.submitted.set(false);
        },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            this.notificationService.showError("Error occurred while uploading/generating media.")
            console.log(e)
          }
          this.submitted.set(false);
        },
        complete: () => {
          this.submitted.set(false);
        }
      }
    )
  }
}
