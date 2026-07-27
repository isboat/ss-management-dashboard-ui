import { Component, signal } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import { TextAssetService } from 'app/services/text-asset.service';

@Component({
  standalone: false,
  selector: 'app-text-asset-new',
  templateUrl: './text-asset-new.component.html',
  styleUrls: ['./text-asset-new.component.css']
})
export class TextAssetNewComponent {
  readonly title = signal('');
  readonly desc = signal('');
  readonly backgroundColor = signal('');
  readonly textColor = signal('');
  readonly submitting = signal(false);

  public Editor = ClassicEditor;

  constructor(
    private assetService: TextAssetService, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService) {
  }

  postNew() {
    if (!this.title() || !this.desc()) {
      this.notificationService.showWarning("Add title and description")
      return;
    }

    const data = {
      title: this.title(),
      description: this.desc(),
      backgroundColor: this.backgroundColor(),
      textColor: this.textColor()
    }

    this.submitting.set(true);
    const upload$ = this.assetService.postNew(data);

    upload$.subscribe(
      {
        next: () => {
            this.router.navigate(['/text-asset-list']);
        },
        error: (e) => {
          this.submitting.set(false);
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            this.notificationService.showError("Error occurred while saving text.")
            console.log(e)
          }
        },
        complete: () => this.submitting.set(false)
      }
    )
  }
}
