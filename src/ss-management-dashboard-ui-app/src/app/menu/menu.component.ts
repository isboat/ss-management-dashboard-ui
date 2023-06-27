import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItemModel, MenuModel } from 'app/models/menu-response.model';
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

  itemToAdd: MenuItemModel = null;

  constructor(private dataService: MenuService, private route: ActivatedRoute) { }

  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
   });

   this.resetItemToAdd();
  }

  resetItemToAdd(): void
  {
    this.itemToAdd  =
    {
      id: '',
      name: '',
      description: '',
      price: 0,
      title: ''
    }
  }

  addItemToList() {
    this.data.menuItems.push(this.itemToAdd);
    this.resetItemToAdd();
  }

  saveMenu(){
    this.dataService.saveMenu(this.data).subscribe({
      next: () => 
      {
      },
      error: (e) => {
        if(e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete') 
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData(){
    this.dataService.fetchMenuDetails(this.id).subscribe({
      next: (data) => 
      {
        this.data = data
        if(!data.menuItems)
        {
          data.menuItems = []
        }
      },
      error: (e) => {
        if(e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete') 
    });
 }

 submit(){}

}
