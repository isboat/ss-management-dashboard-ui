import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuModel } from 'app/models/menu-response.model';
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

  allItems = [
    { description: "eat", done: true },
    { description: "sleep", done: false },
    { description: "play", done: false },
    { description: "laugh", done: false },
  ];

  constructor(private dataService: MenuService, private route: ActivatedRoute) { }

  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
   });
  }

  addItem(description: string) {
    this.allItems.unshift({
      description,
      done: false
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
