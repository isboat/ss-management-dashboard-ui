import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    //{ path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/screens', title: 'Screen List',  icon:'content_paste', class: '' },
    { path: '/menus', title: 'Menu List',  icon:'restaurant_menu', class: '' },
    { path: '/users', title: 'User List',  icon:'person', class: '' },
    { path: '/devices', title: 'TV Devices',  icon:'queue_play_next', class: '' },
    { path: '/device/auth', title: 'New TV Device Setup',  icon:'video_label', class: '' },
    { path: '/media-list', title: 'Media Assets',  icon:'play_circle', class: '' },
    { path: '/text-asset-list', title: 'ADs / Information',  icon:'play_circle', class: '' },
    { path: '/playlists', title: 'Playlists',  icon:'playlist_add_check', class: '' },
    { path: '/help-and-support', title: 'Help and Support',  icon:'help', class: '' },
    { path: '/login', title: 'Login',  icon:'person', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  showMenuLinks = true;

  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.updateMenu();
    this.router.events.subscribe((event) => {
      this.updateMenu();
   });
  }

  updateMenu()
  {
    var filtered = [];
      for (let index = 0; index < ROUTES.length; index++) {
        const element = ROUTES[index];
        if(element.path == '/login' && this.auth.isAuthenticated()) continue;
        if(element.path != '/users' || this.auth.isAdminUser()) filtered.push(element)
        
      }
      this.menuItems = filtered;
      const pathUrl = this.route['_routerState'].snapshot.url;
      const isRegOrLoginPage = pathUrl.indexOf("register") > -1 || pathUrl.indexOf("login") > -1
      this.showMenuLinks = !(isRegOrLoginPage);
  }

  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
