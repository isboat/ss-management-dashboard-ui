import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import { TextAssetService } from 'app/services/text-asset.service';
import { TextAssetModel } from 'app/models/text-asset-response.model';

@Component({
  standalone: false,
  selector: 'app-text-asset',
  templateUrl: './text-asset.component.html',
  styleUrls: ['./text-asset.component.css']
})
export class TextAssetComponent implements OnInit {
  readonly id = signal('');
  private sub: any;
  readonly data = signal<TextAssetModel | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  public Editor = ClassicEditor;

  constructor(
    private assetService: TextAssetService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id.set(params['id']);
      this.fetchData();
    });
  }

  fetchData() {
    if (!this.id()) return;
    this.loading.set(true);
    this.assetService.fetchTextAsset(this.id()).subscribe(
      {
        next: (data) => this.data.set(data),
        error: (e) => {
          this.loading.set(false);
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        },
        complete: () => this.loading.set(false)
      });
  }

  save() {
    const data = this.data();
    if (!data) return;
    this.saving.set(true);
    this.assetService.update(data).subscribe(
      {
        next: () => 
        {
          this.notificationService.showSuccess("updated");
        },
        error: (e) => {
          this.saving.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.saving.set(false)
      });
   }
}
