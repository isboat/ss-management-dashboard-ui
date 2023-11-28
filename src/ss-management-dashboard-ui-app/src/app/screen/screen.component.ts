import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MediaAssetModel } from 'app/models/media-asset-response.model';
import { MenuModel } from 'app/models/menu-response.model';
import { ScreenModel } from 'app/models/screen-response.model';
import { SubtypeTemplate, TemplateModel } from 'app/models/template-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { DataService } from 'app/services/data.service';
import { MediaService } from 'app/services/media.service';
import { MenuService } from 'app/services/menu.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenDetailsComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;

  data: ScreenModel = null;
  templates: TemplateModel[] = [];
  subtypeTemplates: SubtypeTemplate[] = [];
  menus: MenuModel[] = [];
  mediaAssets: MediaAssetModel[] = [];

  selectedTemplate: TemplateModel = null;
  selectedSubTemplate: SubtypeTemplate = null;

  public Editor = ClassicEditor;

  constructor(
    private dataService: DataService, 
    private notification: NotificationsService,
    private menuService: MenuService,
    private mediaService: MediaService,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  goToPreviewSite() {
    this.saveScreenUpdates(true);
    window.open(`http://localhost:4401/?screenId=${this.data.id}&token=${this.authService.getAuthorizationToken()}`, "newwindow", 'width=1100,height=850');
  } 

  onTemplateChange(evt: any) {
    const newTemplateKey = evt.target.value;
    this.updateSelectedTemplate(newTemplateKey)
  }
  updateSelectedTemplate(templateKey: string) {
    this.templates.forEach((value, index) => {
      if (value.key == templateKey) {
        this.selectedTemplate = value;
        this.data.layout.templateKey = value.key;
        this.data.layout.templateProperties = value.requiredProperties
        this.subtypeTemplates = value.subTypes
        if(!value.subTypes || value.subTypes.length == 0) this.data.layout.subType = "";
      }
    });
  }
  onsubTemplateChange(evt: any) {
    const newTemplateKey = evt.target.value;
    this.subtypeTemplates.forEach((value, index) => {
      if (value.key == newTemplateKey) {
        this.selectedSubTemplate = value;
        this.data.layout.subType = value.key;
      }
    });
  }
  onMenuChange(evt: any) {
    const newMenuKey = evt.target.value;
    this.menus.forEach((value, index) => {
      if (value.id == newMenuKey) {
        this.data.menuEntityId = value.id;
      }
    });
  }
  onMediaChange(evt: any) {
    const newMenuKey = evt.target.value;
    this.mediaAssets.forEach((value, index) => {
      if (value.id == newMenuKey) {
        this.data.mediaAssetEntityId = value.id;
      }
    });
  }
  ngOnInit() {

    this.fetchTemplates();
    this.fetchMenus();
    this.fetchMediaAssets();

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.dataService.fetchScreenDetails(this.id).subscribe({
      next: (data) => {
        this.data = data
        if(this.data && this.data.layout && this.data.layout.templateKey)
        {
          this.updateSelectedTemplate(this.data.layout.templateKey)
        }
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }

  fetchTemplates() {
    this.dataService.fetchTemplates().subscribe({
      next: (data) => {
        this.templates = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }

  fetchMenus() {
    this.menuService.fetchMenus().subscribe({
      next: (data) => {
        this.menus = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }

  fetchMediaAssets() {
    this.mediaService.fetchMediaAssets().subscribe({
      next: (data) => {
        this.mediaAssets = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }
  
  publishScreenUpdates() { 
    this.saveScreenUpdates(true);
    this.dataService.publishScreen(this.data.id).subscribe(
      {
        next: () => 
        {
          this.notification.showSuccess("PUBLISHED..")
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
      });
  }
  saveScreenUpdates(hidePostAction?: boolean) {
    this.dataService.updateScreen(this.data).subscribe(
      {
        next: () => 
        {
          if(!hidePostAction)
          {
          this.notification.showSuccess("SAVED..")
          }
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
      });
  }

}
