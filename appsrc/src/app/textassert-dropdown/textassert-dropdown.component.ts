import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { appconstants } from 'app/helpers/constants';
import { TextAssetModel } from 'app/models/text-asset-response.model';
import { NotificationsService } from 'app/notifications';
import { TextAssetService } from 'app/services/text-asset.service';

@Component({
  selector: 'textassert-dropdown',
  templateUrl: './textassert-dropdown.component.html',
  styleUrls: ['./textassert-dropdown.component.css']
})
export class TextAssertDropdownComponent implements OnInit, OnDestroy {

  @Output() clickEmitter = new EventEmitter();

  @Input() buttonText: string;

  listData: TextAssetModel[] = [];
  viewList: TextAssetModel[] = [];
  show: boolean = true;
  search: string = "";

  constructor(
    private dataService: TextAssetService, private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.fetchListData();
    if(!this.buttonText) this.buttonText = "Select text AD"
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
    this.dataService.fetchTextAssets(this.listData.length, appconstants.fetchLimit).subscribe(
      {
        next: (data) => {
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

  onSelect(id: string) {
    let asset = this.listData.find(x => x.id === id);
    if(asset)
    {
      this.clickEmitter.emit({ selectedAsset: asset })
    }
    else
    {
      this.notificationService.showError("Asset not found in the list")
    }
  }
}
