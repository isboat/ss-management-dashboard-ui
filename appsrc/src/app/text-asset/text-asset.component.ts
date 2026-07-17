import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import { TextAssetService } from 'app/services/text-asset.service';
import { TextAssetModel } from 'app/models/text-asset-response.model';

@Component({
  selector: 'app-text-asset',
  templateUrl: './text-asset.component.html',
  styleUrls: ['./text-asset.component.css']
})
export class TextAssetComponent implements OnInit {
  id: string;
  private sub: any;
  data: TextAssetModel = null;
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
      this.id = params['id'];
      this.fetchData();
    });
  }

  fetchData() {
    if (!this.id) return;
    this.assetService.fetchTextAsset(this.id).subscribe(
      {
        next: (data) => this.data = data,
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        }
      });
  }

  save() {
    this.assetService.update(this.data).subscribe(
      {
        next: () => 
        {
          this.notificationService.showSuccess("updated");
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
      });
   }
}
