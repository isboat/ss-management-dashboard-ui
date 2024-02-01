import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { appconstants } from 'app/helpers/constants';
import { AssetModel } from 'app/models/asset-response.model';
import { MenuItemModel, MenuModel } from 'app/models/menu-response.model';
import { NotificationsService } from 'app/notifications';
import { MediaService } from 'app/services/media.service';
import { MenuService } from 'app/services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuDetailsComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;

  form: FormGroup;

  data: MenuModel = null;

  currencies: string[] = ["£", "$"]
  mediaImageAssets: AssetModel[] = []

  itemToAdd: MenuItemModel = null;

  constructor(
    private dataService: MenuService, 
    private route: ActivatedRoute, 
    private mediaService: MediaService,
    private notificationService: NotificationsService) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
      this.fetchMediaAssets();
    });

    this.resetItemToAdd();
  }

  onMenuIconMediaChange(evt: any) {
    const newCur = evt.target.value;
    if(newCur == "none")
    {
      this.data.iconUrl = "";
      return;
    }

    this.mediaImageAssets.forEach((item, index) => {
      if (item.assetUrl == newCur) {
        this.data.iconUrl = item.assetUrl;
      }
    });
  }

  onMenuItemIconMediaChange(evt: any, menuItem: MenuItemModel) {
    const newCur = evt.target.value;
    if(newCur == "none")
    {
      menuItem.iconUrl = "";
      return;
    }

    this.mediaImageAssets.forEach((item, index) => {
      if (item.assetUrl == newCur) {
        menuItem.iconUrl = item.assetUrl;
      }
    });
  }

  onMenuCurrencyChange(evt: any) {
    const newCur = evt.target.value;
    this.currencies.forEach((value, index) => {
      if (value == newCur) {
        this.data.currency = value;
      }
    });
  }

  resetItemToAdd(): void {
    this.itemToAdd =
    {
      id: '',
      name: '',
      description: '',
      price: '0',
      discountPrice: '',
      iconUrl: ''
    }
  }

  deleteMenuItem(menuItemId: string)
  {
    this.data.menuItems = this.data.menuItems.filter(x => x.id != menuItemId);
  }

  addItemToList() {
    if(!this.itemToAdd.name || !this.itemToAdd.price)
    {
      this.notificationService.showWarning("Fill at least the name and price fields")
      return;
    }
    this.data.menuItems.push(this.itemToAdd);
    this.resetItemToAdd();
  }

  saveMenu() {
    this.dataService.saveMenu(this.data).subscribe({
      next: () => {
        this.notificationService.showSuccess("Changes saved successfully")
      },
      error: (e) => {
        if (e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete')
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.dataService.fetchMenuDetails(this.id).subscribe({
      next: (data) => {
        this.data = data
        if (!data.menuItems) {
          data.menuItems = []
        }
      },
      error: (e) => {
        if (e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete')
    });
  }

  fetchMediaAssets() {
    this.mediaService.fetchMediaAssets(this.mediaImageAssets.length, appconstants.fetchLimit, 1).subscribe({
      next: (data) => {
        if(data)
        {
          const images = data.filter(x => x.type == 1); // image is 1
          this.mediaImageAssets.push(...images)
        }
      },
      error: (e) => {
        if (e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete')
    });
  }
}
