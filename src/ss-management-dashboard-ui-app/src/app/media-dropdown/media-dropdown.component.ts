import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { appconstants } from 'app/helpers/constants';
import { AssetModel } from 'app/models/asset-response.model';
import { NotificationsService } from 'app/notifications';
import { MediaService } from 'app/services/media.service';

@Component({
  standalone: false,
  selector: 'media-dropdown',
  templateUrl: './media-dropdown.component.html',
  styleUrls: ['./media-dropdown.component.css']
})
export class MediaDropdownComponent implements OnInit {

  readonly clickEmitter = output<{ selectedMedia: AssetModel }>();
  readonly buttonText = input('Select media asset');
  readonly assetType = input<string>();

  readonly listData = signal<AssetModel[]>([]);
  readonly search = signal('');
  readonly viewList = computed(() => {
    const search = this.search();
    return search ? this.listData().filter(asset => asset.name.includes(search)) : this.listData();
  });

  constructor(
    private dataService: MediaService, private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.fetchListData();
  }

  searchText(evt) {
    this.search.set(evt?.target?.value ?? '');
  }

  fetchListData() {
    const assetType = this.assetType();
    this.dataService.fetchMediaAssets(
      this.listData().length,
      appconstants.fetchLimit,
      assetType ? Number(assetType) : undefined
    ).subscribe(
      {
        next: (data) => {
          this.listData.update(items => [...items, ...data]);
        },
        error: (e) => {

          console.log(e)
          this.notificationService.showError("Error occurred. See console")
        },
        complete: () => console.info('complete')
      });
  }

  isVideoMedia(mediaType: number): boolean {
    return mediaType === 2; //1 for image, 2 for video
  }

  onMediaSelect(id: string) {
    const media = this.listData().find(x => x.id === id);
    if(media)
    {
      this.clickEmitter.emit({ selectedMedia: media })
    }
    else
    {
      this.notificationService.showError("Media Asset not found in the list")
    }
  }
}
