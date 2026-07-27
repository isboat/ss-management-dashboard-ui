import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItemModel, MenuModel } from 'app/models/menu-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { MenuService } from 'app/services/menu.service';

@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuDetailsComponent implements OnInit, OnDestroy {
  readonly id = signal('');
  private sub: any;
  previewWidth: string = "50px";

  form: FormGroup;

  readonly data = signal<MenuModel | null>(null);
  readonly isLoading = signal(true);
  readonly loadError = signal('');

  currencies: string[] = ["£", "$", "GHS", "Euro"]

  readonly itemToAdd = signal<MenuItemModel>(this.newMenuItem());
  selectButtonText: string = "Choose ..."

  constructor(
    private dataService: MenuService, 
    private route: ActivatedRoute, 
    private notificationService: NotificationsService,
    private authService: AuthService) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id.set(params['id']);
      this.fetchData();
    });

    this.resetItemToAdd();
  }

  onMenuIconMediaChange(evt:any) {
    const selectedMedia = evt.selectedMedia;
    if (!selectedMedia) return;
    this.data.update(data => data ? { ...data, iconUrl: selectedMedia.assetUrl } : data);
  }

  onMenuItemIconMediaChange(evt:any, menuItem: MenuItemModel) {
    const selectedMedia = evt.selectedMedia;
    if (!selectedMedia) return;
    menuItem.iconUrl = selectedMedia.assetUrl;
  }

  onMenuCurrencyChange(evt: any) {
    const newCur = evt.target.value;
    this.currencies.forEach((value, index) => {
      if (value == newCur) {
        this.data.update(data => data ? { ...data, currency: value } : data);
      }
    });
  }

  private newMenuItem(): MenuItemModel {
    return {
      id: '',
      name: '',
      description: '',
      price: '0',
      discountPrice: '',
      iconUrl: ''
    };
  }

  resetItemToAdd(): void {
    this.itemToAdd.set(this.newMenuItem());
  }

  updateItemToAdd(field: keyof MenuItemModel, value: string): void {
    this.itemToAdd.update(item => ({ ...item, [field]: value }));
  }

  deleteMenuItem(menuItemId: string)
  {
    this.data.update(data => data ? { ...data, menuItems: data.menuItems.filter(x => x.id != menuItemId) } : data);
  }

  addItemToList() {
    const itemToAdd = this.itemToAdd();
    if(!itemToAdd.name || !itemToAdd.price)
    {
      this.notificationService.showWarning("Fill at least the name and price fields")
      return;
    }
    this.data.update(data => data ? { ...data, menuItems: [...data.menuItems, itemToAdd] } : data);
    this.resetItemToAdd();
  }

  saveMenu() {
    const data = this.data();
    if (!data) return;
    this.dataService.saveMenu(data).subscribe({
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
    this.isLoading.set(true);
    this.loadError.set('');
    this.dataService.fetchMenuDetails(this.id()).subscribe({
      next: (data) => {
        if (!data.menuItems) {
          data.menuItems = []
        }
        this.data.set(data);
      },
      error: (e) => {
        this.isLoading.set(false);
        if (e.status == 401) {
          this.authService.redirectToLogin(true);
          return;
        }
        this.loadError.set('We could not load this menu. Please try again.');
      },
      complete: () => {
        this.isLoading.set(false);
        console.info('complete');
      }
    });
  }
}
