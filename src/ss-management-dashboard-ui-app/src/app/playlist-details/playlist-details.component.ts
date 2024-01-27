import { Component, OnInit } from '@angular/core';
import { PlaylistWithItemsModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { PlaylistService } from 'app/services/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from 'app/services/media.service';
import { AssetModel } from 'app/models/asset-response.model';
import { TextAssetModel } from 'app/models/text-asset-response.model';
import { TextAssetService } from 'app/services/text-asset.service';
import { NotificationsService } from 'app/notifications';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistComponent implements OnInit {
  id: string;
  private sub: any;
  data: PlaylistWithItemsModel = null
  mediaAssets: AssetModel[] = [];
  textAssets: TextAssetModel[] = [];

  hrPart = 0;
  minPart = 0;
  secPart = 0;

  constructor(
    private notificationService: NotificationsService,
    private textAssetService: TextAssetService,
    private playlistService: PlaylistService,
    private mediaService: MediaService,
    private authService: AuthService,
    private route: ActivatedRoute) {
    this.fetchMedias();
    this.fetchTextAssets();
  }

  ngOnInit() {
    this.fetchData();
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
    });
  }

  splitDataDurations() {
    if (!this.data || !this.data.itemDuration) return;
    const splits = this.data.itemDuration.split(':')
    if (splits.length !== 3) return;

    this.hrPart = parseInt(splits[0]);
    this.minPart = parseInt(splits[1]);
    this.secPart = parseInt(splits[2]);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  formatDurPart(part) {
    return part ? (part < 10 ? '0' + part : part) : '00';
  }
  saveChanges() {
    this.data.itemDuration = `${this.formatDurPart(this.hrPart)}:${this.formatDurPart(this.minPart)}:${this.formatDurPart(this.secPart)}`;

    this.playlistService.save(this.data).subscribe(
      {
        next: () => { this.notificationService.showSuccess("Saved!") },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            this.notificationService.showError("error occurred while saving!")
            console.log(e)
          }
        }
      });
  }

  onMediaSelect($event) {
    let id = $event.mediaId;
    if (!id) return;

    var exist = this.data?.itemIdAndTypePairs?.findIndex(x => x.id === id) > -1;
    if (!exist) {
      if (!this.data?.itemIdAndTypePairs) this.data.itemIdAndTypePairs = []
      this.data.itemIdAndTypePairs.push({ itemType: 0, id: id }); // 0 is media type

      var asset = this.mediaAssets.find(x => x.id == id);
      if (!this.data?.items) this.data.items = [];
      if (asset) this.data.items.push(asset);
    }
  }
  onTextAssetSelect($event) {
    let id = $event.target.value;
    if (!id) return;

    var exist = this.data?.itemIdAndTypePairs?.findIndex(x => x.id === id) > -1;
    if (!exist) {
      if (!this.data?.itemIdAndTypePairs) this.data.itemIdAndTypePairs = []
      this.data.itemIdAndTypePairs.push({ itemType: 1, id: id }); // 1 is Text type

      var asset = this.textAssets.find(x => x.id == id);
      if (!this.data?.items) this.data.items = [];
      if (asset) this.data.items.push(asset);
    }
  }

  removeMediaAsset(id: string) {
    if (!id) return;

    var index = this.data?.itemIdAndTypePairs?.findIndex(x => x.id == id);
    if (index < 0) return;

    this.data.itemIdAndTypePairs.splice(index, 1);

    var assetIndex = this.data.items.findIndex(x => x.id == id);

    if (assetIndex > -1) this.data.items.splice(assetIndex, 1)
  }

  fetchData() {
    if (this.id) {
      this.playlistService.fetchDetails(this.id).subscribe(
        {
          next: (data) => {
            this.data = data;
            this.splitDataDurations();
          },
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
  }

  fetchMedias() {
    this.mediaService.fetchMediaAssets().subscribe(
      {
        next: (data) => {
          this.mediaAssets = data;
        },
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

  fetchTextAssets() {
    this.textAssetService.fetchTextAssets().subscribe(
      {
        next: (data) => {
          this.textAssets = data;
        },
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
}
