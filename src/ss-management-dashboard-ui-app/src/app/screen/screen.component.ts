import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetModel } from 'app/models/asset-response.model';
import { MenuModel } from 'app/models/menu-response.model';
import { ScreenModel } from 'app/models/screen-response.model';
import { SubtypeTemplate, TemplateModel, TemplateProperty } from 'app/models/template-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { DataService } from 'app/services/data.service';
import { MediaService } from 'app/services/media.service';
import { MenuService } from 'app/services/menu.service';
import { DeviceService } from 'app/services/device.service';
import { DeviceModel } from 'app/models/device-response.model';
import { PlaylistService } from 'app/services/playlist.service';
import { PlaylistModel } from 'app/models/playlist-response.model';
import { TextAssetService } from 'app/services/text-asset.service';
import { TextAssetModel } from 'app/models/text-asset-response.model';
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
  dataMediaAsset: AssetModel = null;
  dataTextAsset: TextAssetModel = null;
  devices: DeviceModel[] = [];
  playlists: PlaylistModel[] = [];

  selectedTemplate: TemplateModel = null;
  selectedSubTemplate: SubtypeTemplate = null;
  selectedDeviceId: string = null;

  isAdminUser = false;

  previewWidth: string = "200px";

  constructor(
    private auth: AuthService,
    private textAssetService: TextAssetService,
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
    this.updateSelectedTemplate(newTemplateKey)
  }

  updateSelectedTemplate(templateKey: string) {
    this.templates.forEach((value, index) => {
      if (value.key == templateKey) {
        this.selectedTemplate = value;
        this.data.layout.templateKey = value.key;
        value.requiredProperties.forEach(rt => {
          let existingTp = this.data?.layout?.templateProperties?.find(tt=> tt.key == rt.key)
          if(!existingTp) {
            this.data.layout.templateProperties.push(rt)
          }
        });

        //remove from data props if it's not in templates required
        if(this.data?.layout?.templateProperties) {
          var notRequiredDataProps = [];
          this.data.layout.templateProperties.forEach(ttp => {
            const existing = value.requiredProperties.find(vrp => vrp.key == ttp.key)
            if(!existing) {
              notRequiredDataProps.push(ttp)
            }
          }); 

          notRequiredDataProps.forEach(ntr => {
            this.data.layout.templateProperties = this.data.layout.templateProperties.filter(fil => fil.key != ntr.key)
          });
        }

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
    if(!newMenuKey)
    {
      this.data.menuEntityId = null;
      return;
    }
    this.menus.forEach((value, index) => {
      if (value.id == newMenuKey) {
        this.data.menuEntityId = value.id;
      }
    });
  }
  onMediaSelect(evt: any) {
    const selectedMedia = evt.selectedMedia;
    if (!selectedMedia) return;
    this.data.mediaAssetEntityId = selectedMedia.id
    this.dataMediaAsset = selectedMedia;
  }

  isRange(prop: TemplateProperty) {
    const fields = ["textFont","backgroundOpacity"]
    return fields.indexOf(prop.key) > -1 
  }

  onTextAssetSelect(evt: any) {
    const selectedAsset = evt.selectedAsset;
    if (!selectedAsset) return;
    this.data.textAssetEntityId = selectedAsset.id;
    this.dataTextAsset = selectedAsset;
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

    this.isAdminUser = this.auth.isAdminUser();

    this.fetchTemplates();
    this.fetchMenus();
    this.fetchDevices();
    this.fetchPlaylists();

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
    });
  }

  get SelectedTemplateHasMedia(): boolean {
    if (!this.data || !this.data.layout || !this.data.layout.templateKey) return false;

    const templateKey = this.data?.layout?.templateKey;
    // we not looking for MediaPlaylist
    if (templateKey.indexOf('MediaPlaylist') > -1) return false;

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
        if(!this.data.layout) {
          this.data.layout = { id: "", subType: "", templateKey: "", templateProperties: []}
        }
        if(!this.data.layout.templateProperties) {
          this.data.layout.templateProperties = []
        }

        if (this.data && this.data.layout && this.data.layout.templateKey) {
          this.updateSelectedTemplate(this.data.layout.templateKey)
        }
        if(this.data && this.data.mediaAssetEntityId)
        {
          this.fetchMediaAsset(this.data.mediaAssetEntityId)
        }
        if(this.data && this.data.textAssetEntityId)
        {
          this.fetchTextAsset(this.data.textAssetEntityId)
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

  fetchMediaAsset(id: string) {
    this.mediaService.fetchMediaAsset(id).subscribe({
      next: (data) => {
        this.dataMediaAsset = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
    });
  }

  fetchTextAsset(id: string) {
    this.textAssetService.fetchTextAsset(id).subscribe({
      next: (data) => {
        this.dataTextAsset = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
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

            // if user has selected, default to the preselected device
            if(!this.selectedDeviceId) {
              this.devices.forEach(x => {
                if(x.screenId == this.data.id) this.selectedDeviceId = x.id;
              });
            }
            this.deviceService.linkToDevice(this.selectedDeviceId, this.data.id, this.devices);
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

  saveScreenUpdates(hidePostAction?: boolean, callbkFunc?: Function) {
    if(this.data?.layout?.templateProperties) {
      this.data.layout.templateProperties.forEach(t => {
        t.value = "" + t.value
      });
    }
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
