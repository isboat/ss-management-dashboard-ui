import { Component, OnInit, signal } from '@angular/core';
import { PlaylistWithItemsModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { PlaylistService } from 'app/services/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  standalone: false,
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistComponent implements OnInit {
  readonly id = signal('');
  private sub: any;
  readonly data = signal<PlaylistWithItemsModel | null>(null);

  readonly hrPart = signal(0);
  readonly minPart = signal(0);
  readonly secPart = signal(0);
  readonly saving = signal(false);

  constructor(
    private notificationService: NotificationsService,
    private playlistService: PlaylistService,
    private authService: AuthService,
    private route: ActivatedRoute) {
  }


  drop(event: CdkDragDrop<string[]>) {
    const data = this.data();
    if (!data) return;
    moveItemInArray(data.items, event.previousIndex, event.currentIndex);
    data.itemIdAndTypePairs = data.items.map(x => ({ itemType: x.playlistType, id: x.id }));
    this.data.set({ ...data });
  }

  ngOnInit() {
    this.fetchData();
    this.sub = this.route.params.subscribe(params => {
      this.id.set(params['id']);
      this.fetchData();
    });
  }

  splitDataDurations() {
    const data = this.data();
    if (!data?.itemDuration) return;
    const splits = data.itemDuration.split(':')
    if (splits.length !== 3) return;

    this.hrPart.set(parseInt(splits[0]));
    this.minPart.set(parseInt(splits[1]));
    this.secPart.set(parseInt(splits[2]));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  formatDurPart(part) {
    return part ? (part < 10 ? '0' + part : part) : '00';
  }
  saveChanges() {
    const data = this.data();
    if (!data) return;
    data.itemDuration = `${this.formatDurPart(this.hrPart())}:${this.formatDurPart(this.minPart())}:${this.formatDurPart(this.secPart())}`;

    this.saving.set(true);
    this.playlistService.save(data).subscribe(
      {
        next: () => {
          this.notificationService.showSuccess("Saved!")
          this.saving.set(false);
        },
        error: (e) => {
          this.saving.set(false);
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
  publishRelatedScreens() {
    const data = this.data();
    if (!data) return;
    this.playlistService.save(data).subscribe(
      {
        next: () => {
          this.playlistService.publishRelatedScreens(data.id).subscribe(
            {
              next: () => { this.notificationService.showSuccess("Related Screens published!") },
              error: (e) => {
                if (e.status == 401) {
                  this.authService.redirectToLogin(true);
                }
                else {
                  this.notificationService.showError("error occurred while publishing related screens!")
                  console.log(e)
                }
              }
            });
        },
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
    const selectedMedia = $event.selectedMedia;
    if (!selectedMedia) return;

    const data = this.data();
    if (!data) return;
    const exist = data.itemIdAndTypePairs?.findIndex(x => x.id === selectedMedia.id) > -1;
    if (!exist) {
      if (!data.itemIdAndTypePairs) data.itemIdAndTypePairs = []
      data.itemIdAndTypePairs.push({ itemType: 0, id: selectedMedia.id }); // 0 is media type

      if (!data.items) data.items = [];
      data.items.push(selectedMedia);
      this.data.set({ ...data });
    }
  }
  onTextAssetSelect($event) {
    const selectedAsset = $event.selectedAsset;
    if (!selectedAsset) return;

    const data = this.data();
    if (!data) return;
    const exist = data.itemIdAndTypePairs?.findIndex(x => x.id === selectedAsset.id) > -1;
    if (!exist) {
      if (!data.itemIdAndTypePairs) data.itemIdAndTypePairs = []
      data.itemIdAndTypePairs.push({ itemType: 1, id: selectedAsset.id }); // 1 is Text type

      if (!data.items) data.items = [];
      data.items.push(selectedAsset);
      this.data.set({ ...data });
    }
  }

  removeMediaAsset(id: string) {
    if (!id) return;

    const data = this.data();
    if (!data) return;
    const index = data.itemIdAndTypePairs?.findIndex(x => x.id == id);
    if (index < 0) return;

    data.itemIdAndTypePairs.splice(index, 1);

    const assetIndex = data.items.findIndex(x => x.id == id);

    if (assetIndex > -1) data.items.splice(assetIndex, 1)
    this.data.set({ ...data });
  }

  fetchData() {
    if (this.id()) {
      this.playlistService.fetchDetails(this.id()).subscribe(
        {
          next: (data) => {
            this.data.set(data);
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
