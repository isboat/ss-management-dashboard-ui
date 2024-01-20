import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import { TextAssetService } from 'app/services/text-asset.service';

@Component({
  selector: 'app-text-asset-new',
  templateUrl: './text-asset-new.component.html',
  styleUrls: ['./text-asset-new.component.css']
})
export class TextAssetNewComponent implements OnInit {
  title = '';
  desc = '';
  backgroundColor = '';
  textColor = '';

  public Editor = ClassicEditor;

  constructor(
    private assetService: TextAssetService, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
    });
  }

  postNew() {
    if (!this.title || !this.desc) {
      this.notificationService.showWarning("Add title and description")
      return;
    }

    const data = {
      title: this.title,
      description: this.desc,
      backgroundColor: this.backgroundColor,
      textColor: this.textColor
    }

    const upload$ = this.assetService.postNew(data);

    upload$.subscribe(
      {
        next: () => {
            this.router.navigate(['/text-asset-list']);
        },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            this.notificationService.showError("Error occurred while saving text.")
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      }
    )
  }
}
