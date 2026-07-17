import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { appconstants } from 'app/helpers/constants';
import { AssetModel } from 'app/models/asset-response.model';
import { NotificationsService } from 'app/notifications';
import { MediaService } from 'app/services/media.service';

@Component({
  selector: 'media-dropdown',
  templateUrl: './media-dropdown.component.html',
  styleUrls: ['./media-dropdown.component.css']
})
export class MediaDropdownComponent implements OnInit, OnDestroy {

  @Output() clickEmitter = new EventEmitter();

  @Input() buttonText: string;
  @Input() assetType: string;

  listData: AssetModel[] = [];
  viewList: AssetModel[] = [];
  show: boolean = true;
  search: string = "";

  constructor(
    private dataService: MediaService, private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.fetchListData();
    if(!this.buttonText) this.buttonText = "Select media asset"
  }

  ngOnDestroy() {
  }

  searchText(evt) {
    this.viewList = this.listData;
    this.search = evt && evt.target ? evt.target.value: this.search;
    if (this.search) {
      this.viewList = this.listData.filter(x => x.name.indexOf(this.search) > -1)
    }
  }

  fetchListData() {
    this.dataService.fetchMediaAssets(this.listData.length, appconstants.fetchLimit).subscribe(
      {
        next: (data) => {
          if(this.assetType) data = data.filter(x => x.type.toString() === this.assetType)
          this.listData.push(...data)
          this.searchText(null)
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
    let media = this.listData.find(x => x.id === id);
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
