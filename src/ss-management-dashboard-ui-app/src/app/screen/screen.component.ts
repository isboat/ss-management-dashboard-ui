import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
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
  standalone: false,
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenDetailsComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;

  readonly data = signal<ScreenModel | null>(null);
  readonly isLoading = signal(true);
  readonly loadError = signal('');
  readonly templates = signal<TemplateModel[]>([]);
  readonly subtypeTemplates = signal<SubtypeTemplate[]>([]);
  readonly menus = signal<MenuModel[]>([]);
  readonly dataMediaAsset = signal<AssetModel | null>(null);
  readonly dataTextAsset = signal<TextAssetModel | null>(null);
  readonly devices = signal<DeviceModel[]>([]);
  readonly playlists = signal<PlaylistModel[]>([]);

  readonly selectedTemplate = signal<TemplateModel | null>(null);
  readonly selectedSubTemplate = signal<SubtypeTemplate | null>(null);
  readonly selectedDeviceId = signal<string | null>(null);

  readonly isAdminUser = this.authService.adminUser;

  readonly previewWidth = "200px";
  readonly selectedTemplateHasMedia = computed(() => {
    const templateKey = this.selectedTemplate()?.key ?? '';
    return !templateKey.includes('MediaPlaylist') &&
      (templateKey.includes('MenuOverlay') || templateKey.includes('Media'));
  });
  readonly deviceIdForPublish = computed(() => {
    const selectedDeviceId = this.selectedDeviceId();
    if (selectedDeviceId) return selectedDeviceId;

    const screenId = this.data()?.id;
    return this.devices().find(device => device.screenId === screenId)?.id ?? null;
  });

  constructor(
    private authService: AuthService,
    private textAssetService: TextAssetService,
    private dataService: DataService,
    private notification: NotificationsService,
    private menuService: MenuService,
    private mediaService: MediaService,
    private deviceService: DeviceService,
    private playlistService: PlaylistService,
    private route: ActivatedRoute) { }

  goToPreviewSite() {
    this.saveScreenUpdates(true);
    window.open(`http://localhost:4401/?screenId=${this.data()?.id}&token=${this.authService.getAuthorizationToken()}`, "newwindow", 'width=1100,height=850');
  }

  onTemplateChange(evt: any) {
    const newTemplateKey = evt.target.value;
    this.updateSelectedTemplate(newTemplateKey)
  }

  updateSelectedTemplate(templateKey: string) {
    const screen = this.data();
    const template = this.templates().find(value => value.key === templateKey);
    if (!screen || !template) return;

    this.selectedTemplate.set(template);
    const existingProperties = screen.layout.templateProperties ?? [];
    screen.layout.templateKey = template.key;
    screen.layout.templateProperties = template.requiredProperties.map(required =>
      existingProperties.find(property => property.key === required.key) ?? { ...required }
    );
    this.subtypeTemplates.set(template.subTypes ?? []);
    if (!template.subTypes?.length) screen.layout.subType = '';
    this.data.set({ ...screen, layout: { ...screen.layout } });
  }

  onTvScreenChange(evt: any) {
    this.selectedDeviceId.set(evt.target.value);
  }
  onsubTemplateChange(evt: any) {
    const newTemplateKey = evt.target.value;
    const screen = this.data();
    const subTemplate = this.subtypeTemplates().find(value => value.key === newTemplateKey);
    if (!screen || !subTemplate) return;

    this.selectedSubTemplate.set(subTemplate);
    screen.layout.subType = subTemplate.key;
    this.data.set({ ...screen, layout: { ...screen.layout } });
  }
  onMenuChange(evt: any) {
    const newMenuKey = evt.target.value;
    if(!newMenuKey)
    {
      this.updateScreenData(screen => ({ ...screen, menuEntityId: null }));
      return;
    }
    if (this.menus().some(value => value.id === newMenuKey)) {
      this.updateScreenData(screen => ({ ...screen, menuEntityId: newMenuKey }));
    }
  }
  onMediaSelect(evt: any) {
    const selectedMedia = evt.selectedMedia;
    if (!selectedMedia) return;
    this.updateScreenData(screen => ({ ...screen, mediaAssetEntityId: selectedMedia.id }));
    this.dataMediaAsset.set(selectedMedia);
  }

  isRange(prop: TemplateProperty) {
    const fields = ["textFont","backgroundOpacity"]
    return fields.indexOf(prop.key) > -1 
  }

  onTextAssetSelect(evt: any) {
    const selectedAsset = evt.selectedAsset;
    if (!selectedAsset) return;
    this.updateScreenData(screen => ({ ...screen, textAssetEntityId: selectedAsset.id }));
    this.dataTextAsset.set(selectedAsset);
  }

  onPlaylistChange(evt: any) {
    const newKey = evt.target.value;
    if (this.playlists().some(value => value.id === newKey)) {
      this.updateScreenData(screen => ({ ...screen, playlistId: newKey }));
    }
  }

  ngOnInit() {
    this.fetchTemplates();
    this.fetchMenus();
    this.fetchDevices();
    this.fetchPlaylists();

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.isLoading.set(true);
    this.loadError.set('');
    this.dataService.fetchScreenDetails(this.id).subscribe({
      next: (data) => {
        const layout = data.layout ?? { id: '', subType: '', templateKey: '', templateProperties: [] };
        const screen = {
          ...data,
          layout: { ...layout, templateProperties: layout.templateProperties ?? [] }
        };
        this.data.set(screen);

        if (screen.layout.templateKey) {
          this.updateSelectedTemplate(screen.layout.templateKey)
        }
        if(screen.mediaAssetEntityId)
        {
          this.fetchMediaAsset(screen.mediaAssetEntityId)
        }
        if(screen.textAssetEntityId)
        {
          this.fetchTextAsset(screen.textAssetEntityId)
        }
      },
      error: (e) => {
        this.isLoading.set(false);
        if (e.status == 401) {
          this.authService.redirectToLogin(true);
          return;
        }
        this.loadError.set('We could not load this screen. Please try again.');
      },
      complete: () => {
        this.isLoading.set(false);
        console.info('complete');
      }
    });
  }

  fetchTemplates() {
    this.dataService.fetchTemplates().subscribe({
      next: (data) => {
        this.templates.set(data);
        const templateKey = this.data()?.layout?.templateKey;
        if (templateKey) this.updateSelectedTemplate(templateKey);
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
        this.menus.set(data);
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
        this.devices.set(data);
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
    });
  }

  fetchMediaAsset(id: string) {
    this.mediaService.fetchMediaAsset(id).subscribe({
      next: (data) => {
        this.dataMediaAsset.set(data);
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
    });
  }

  fetchTextAsset(id: string) {
    this.textAssetService.fetchTextAsset(id).subscribe({
      next: (data) => {
        this.dataTextAsset.set(data);
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
    });
  }

  fetchPlaylists() {
    this.playlistService.fetchPlaylists().subscribe({
      next: (data) => {
        this.playlists.set(data);
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }

  publishScreenUpdates() {
    const screen = this.data();
    if (!screen) return;

    this.saveScreenUpdates(true, () => {
      this.dataService.publishScreen(screen.id).subscribe(
        {
          next: () => {
            this.notification.showSuccess("PUBLISHED..")

            this.deviceService.linkToDevice(this.deviceIdForPublish(), screen.id, this.devices());
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

  saveScreenUpdates(hidePostAction?: boolean, callback?: () => void) {
    const screen = this.data();
    if (!screen) return;

    if(screen.layout?.templateProperties) {
      screen.layout.templateProperties.forEach(t => {
        t.value = "" + t.value
      });
    }
    this.dataService.updateScreen(screen).subscribe(
      {
        next: () => {
          if (!hidePostAction) {
            this.notification.showSuccess("SAVED..")
          }

          callback?.();
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

  private updateScreenData(update: (screen: ScreenModel) => ScreenModel): void {
    const screen = this.data();
    if (screen) this.data.set(update(screen));
  }
}
