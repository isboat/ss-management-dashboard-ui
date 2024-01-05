import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MediaAssetModel } from 'app/models/media-asset-response.model';
import { MenuModel } from 'app/models/menu-response.model';
import { ScreenModel } from 'app/models/screen-response.model';
import { SubtypeTemplate, TemplateModel, TemplateProperty } from 'app/models/template-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { DataService } from 'app/services/data.service';
import { MediaService } from 'app/services/media.service';
import { MenuService } from 'app/services/menu.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DeviceService } from 'app/services/device.service';
import { DeviceModel } from 'app/models/device-response.model';
import { PlaylistService } from 'app/services/playlist.service';
import { PlaylistModel } from 'app/models/playlist-response.model';
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
  devices: DeviceModel[] = [];
  playlists: PlaylistModel[] = [];

  selectedTemplate: TemplateModel = null;
  selectedSubTemplate: SubtypeTemplate = null;
  selectedDeviceId: string = null;

  public Editor = ClassicEditor;

  constructor(
    private dataService: DataService,
    private notification: NotificationsService,
    private menuService: MenuService,
    private mediaService: MediaService,
    private authService: AuthService,
    private deviceService: DeviceService,
    private playlistService: PlaylistService,
    private route: ActivatedRoute) { }

  goToPreviewSite() {
    this.saveScreenUpdates(true);
    window.open(`http://localhost:4401/?screenId=${this.data.id}&token=${this.authService.getAuthorizationToken()}`, "newwindow", 'width=1100,height=850');
  }

  onTemplateChange(evt: any) {
    const newTemplateKey = evt.target.value;
    this.updateSelectedTemplate(newTemplateKey, true)
  }
  updateSelectedTemplate(templateKey: string, updateVals: boolean) {
    this.templates.forEach((value, index) => {
      if (value.key == templateKey) {
        this.selectedTemplate = value;
        this.data.layout.templateKey = value.key;
        if(updateVals) this.data.layout.templateProperties = value.requiredProperties
        this.subtypeTemplates = value.subTypes
        if (!value.subTypes || value.subTypes.length == 0) this.data.layout.subType = "";
      }
    });
  }

  onTvScreenChange(evt: any) {
    this.selectedDeviceId = evt.target.value;
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

  onPlaylistChange(evt: any) {
    const newKey = evt.target.value;
    this.playlists.forEach((value, index) => {
      if (value.id == newKey) {
        this.data.playlistId = value.id;
      }
    });
  }

  ngOnInit() {

    this.fetchTemplates();
    this.fetchMenus();
    this.fetchMediaAssets();
    this.fetchDevices();
    this.fetchPlaylists();

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
    });
  }

  get SelectedTemplateHasMedia(): boolean
  {
    if(!this.data || !this.data.layout || !this.data.layout.templateKey) return false;
    
    const templateKey = this.data?.layout?.templateKey;
    // we not looking for MediaPlaylist
    if(templateKey.indexOf('MediaPlaylist') > -1) return false;

    // any template with media in it.
    return templateKey.indexOf('MenuOverlay') > -1 || templateKey.indexOf('Media') > -1;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.dataService.fetchScreenDetails(this.id).subscribe({
      next: (data) => {
        this.data = data
        if (this.data && this.data.layout && this.data.layout.templateKey) {
          this.updateSelectedTemplate(this.data.layout.templateKey, false)
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

  fetchDevices() {
    this.deviceService.fetchDevices().subscribe({
      next: (data) => {
        this.devices = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
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

  fetchPlaylists() {
    this.playlistService.fetchPlaylists().subscribe({
      next: (data) => {
        this.playlists = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }

  publishScreenUpdates() {
    this.saveScreenUpdates(true, () => {
      this.dataService.publishScreen(this.data.id).subscribe(
        {
          next: () => {
            this.notification.showSuccess("PUBLISHED..")
            this.linkToDevice();
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
        })
    });
  }

  linkToDevice() {
    if (!this.selectedDeviceId || this.selectedDeviceId == "none") return;

    if (this.selectedDeviceId == "all") {
      this.devices.forEach((device, index) => {
        this.linkToDevicePost(device.id, this.data.id)
      })
    }
    else {
      this.linkToDevicePost(this.selectedDeviceId, this.data.id);
    }
  }

  linkToDevicePost(deviceId: string, screenId: string) {
    if (!deviceId || !screenId) return;

    this.deviceService.updateScreen(deviceId, screenId).subscribe(
      {
        next: (data) => { },
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

  saveScreenUpdates(hidePostAction?: boolean, callbkFunc?: Function) {
    this.dataService.updateScreen(this.data).subscribe(
      {
        next: () => {
          if (!hidePostAction) {
            this.notification.showSuccess("SAVED..")
          }

          if (callbkFunc) callbkFunc();
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
      });
  }
}
