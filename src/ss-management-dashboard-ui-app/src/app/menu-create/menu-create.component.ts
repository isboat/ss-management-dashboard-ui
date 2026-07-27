import { Component, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuModel } from 'app/models/menu-response.model';
import { NotificationsService } from 'app/notifications';
import { MenuService } from 'app/services/menu.service';

@Component({
  standalone: false,
  selector: 'app-menu',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.css']
})
export class MenuCreateComponent {
  readonly submitting = signal(false);
  readonly form = new FormGroup({
    name: new FormControl(''),
    title: new FormControl(''),
    description: new FormControl('')
  });

  constructor(private dataService: MenuService, private router: Router, private notificationService: NotificationsService) { }

 submit(){
  const data: MenuModel = {
    name: this.form.get("name").value,
    title: this.form.get("title").value,
    description: this.form.get("description").value,
    id: '',
    tenantId:'',
    iconUrl:'',
    currency:'',
    menuItems:[]
  }

  if(!data.name || !data.title || !data.description)
  {
    this.notificationService.showWarning("Please complete the form")
    return;
  }

  this.submitting.set(true);
  this.dataService.createNewMenu(data).subscribe({
    next: (data) => 
    {
      this.router.navigate(['/menus']);
    },
    error: (e) => {
      this.submitting.set(false);
      if(e.status == 401) console.log("ERORR HERE:" + e)
    },
    complete: () => this.submitting.set(false)
  });
 }

}
