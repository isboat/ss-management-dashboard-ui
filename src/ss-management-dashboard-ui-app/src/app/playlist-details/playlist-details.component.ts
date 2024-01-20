import { Component, OnInit } from '@angular/core';
import { PlaylistWithItemsModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { PlaylistService } from 'app/services/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from 'app/services/media.service';
import { AssetModel } from 'app/models/asset-response.model';

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

  hrPart = 0;
  minPart = 0;
  secPart = 0;

  constructor(private playlistService: PlaylistService, private mediaService: MediaService, private authService: AuthService,
    private route: ActivatedRoute) {
    this.fetchMedias();
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
        next: () => { },
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

  onMediaSelect($event) {
    let id = $event.mediaId;
    if (!id) return;

    var exist = this.data?.assetIds?.indexOf(id) > -1;
    if (!exist) {
      if (!this.data?.assetIds) this.data.assetIds = []
      this.data.assetIds.push(id);
      var asset = this.mediaAssets.find(x => x.id == id);
      if (!this.data?.assetItems) this.data.assetItems = [];
      if (asset) this.data.assetItems.push(asset);
    }
  }

  removeMediaAsset(id: string) {
    if (!id) return;

    var index = this.data?.assetIds?.indexOf(id);
    if (index < 0) return;
    this.data.assetIds.splice(index, 1);
    var assetIndex = this.data.assetItems.findIndex(x => x.id == id);

    if (assetIndex > -1) this.data.assetItems.splice(assetIndex, 1)
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
}
