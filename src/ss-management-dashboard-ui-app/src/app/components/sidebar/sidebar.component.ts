import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/screens', title: 'Screen List',  icon:'content_paste', class: '' },
    { path: '/menus', title: 'Menu List',  icon:'content_paste', class: '' },
    { path: '/users', title: 'User List',  icon:'person', class: '' },
    { path: '/devices', title: 'TV Screen Apps',  icon:'person', class: '' },
    { path: '/device/auth', title: 'TV Client App Setup',  icon:'video_label', class: '' },
    { path: '/media-list', title: 'Media Assets',  icon:'content_paste', class: '' },
    { path: '/media-upload', title: 'Upload New Media',  icon:'content_paste', class: '' },
    { path: '/help-and-support', title: 'Help and Support',  icon:'content_paste', class: '' },
    { path: '/login', title: 'Login',  icon:'person', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private auth: AuthService) { }

  ngOnInit() {
    var filtered = [];
    for (let index = 0; index < ROUTES.length; index++) {
      const element = ROUTES[index];
      if(element.path == '/login' && this.auth.isAuthenticated()) continue;
      if(element.path != '/users' || this.auth.isAdminUser()) filtered.push(element)
      
    }
    this.menuItems = filtered;
  }

  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
