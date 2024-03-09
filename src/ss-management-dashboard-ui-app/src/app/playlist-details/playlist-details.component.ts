import { Component, OnInit } from '@angular/core';
import { PlaylistWithItemsModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { PlaylistService } from 'app/services/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistComponent implements OnInit {
  id: string;
  private sub: any;
  data: PlaylistWithItemsModel = null

  hrPart = 0;
  minPart = 0;
  secPart = 0;

  constructor(
    private notificationService: NotificationsService,
    private playlistService: PlaylistService,
    private authService: AuthService,
    private route: ActivatedRoute) {
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data.items, event.previousIndex, event.currentIndex);
    this.data.itemIdAndTypePairs = [];
    this.data.items.forEach(x => {
      this.data.itemIdAndTypePairs.push({ itemType: x.playlistType, id: x.id }); // 0 is media type
    })
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
    let selectedMedia = $event.selectedMedia;
    if (!selectedMedia) return;

    var exist = this.data?.itemIdAndTypePairs?.findIndex(x => x.id === selectedMedia.id) > -1;
    if (!exist) {
      if (!this.data?.itemIdAndTypePairs) this.data.itemIdAndTypePairs = []
      this.data.itemIdAndTypePairs.push({ itemType: 0, id: selectedMedia.id }); // 0 is media type

      if (!this.data?.items) this.data.items = [];
      this.data.items.push(selectedMedia);
    }
  }
  onTextAssetSelect($event) {
    let selectedAsset = $event.selectedAsset;
    if (!selectedAsset) return;

    var exist = this.data?.itemIdAndTypePairs?.findIndex(x => x.id === selectedAsset.id) > -1;
    if (!exist) {
      if (!this.data?.itemIdAndTypePairs) this.data.itemIdAndTypePairs = []
      this.data.itemIdAndTypePairs.push({ itemType: 1, id: selectedAsset.id }); // 1 is Text type

      if (!this.data?.items) this.data.items = [];
      this.data.items.push(selectedAsset);
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
}
