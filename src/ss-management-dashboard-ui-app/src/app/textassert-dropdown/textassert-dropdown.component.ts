import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { appconstants } from 'app/helpers/constants';
import { TextAssetModel } from 'app/models/text-asset-response.model';
import { NotificationsService } from 'app/notifications';
import { TextAssetService } from 'app/services/text-asset.service';

@Component({
  standalone: false,
  selector: 'textassert-dropdown',
  templateUrl: './textassert-dropdown.component.html',
  styleUrls: ['./textassert-dropdown.component.css']
})
export class TextAssertDropdownComponent implements OnInit {

  readonly clickEmitter = output<{ selectedAsset: TextAssetModel }>();
  readonly buttonText = input('Select text AD');

  readonly listData = signal<TextAssetModel[]>([]);
  readonly search = signal('');
  readonly viewList = computed(() => {
    const search = this.search();
    return search ? this.listData().filter(asset => asset.name.includes(search)) : this.listData();
  });

  constructor(
    private dataService: TextAssetService, private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.fetchListData();
  }

  searchText(evt) {
    this.search.set(evt?.target?.value ?? '');
  }

  fetchListData() {
    this.dataService.fetchTextAssets(this.listData().length, appconstants.fetchLimit).subscribe(
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

  onSelect(id: string) {
    const asset = this.listData().find(x => x.id === id);
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
