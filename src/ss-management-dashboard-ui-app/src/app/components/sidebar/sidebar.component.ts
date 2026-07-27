import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
    { path: '/screens', title: 'Screens',  icon:'monitor', class: '' },
    { path: '/menus', title: 'Menus',  icon:'restaurant_menu', class: '' },
    { path: '/users', title: 'Team',  icon:'group', class: '' },
    { path: '/devices', title: 'Devices',  icon:'connected_tv', class: '' },
    { path: '/device/auth', title: 'Connect device',  icon:'add_to_queue', class: '' },
    { path: '/media-list', title: 'Media Assets',  icon:'play_circle', class: '' },
    { path: '/text-asset-list', title: 'Messages',  icon:'text_fields', class: '' },
    { path: '/playlists', title: 'Playlists',  icon:'playlist_play', class: '' },
    { path: '/settings', title: 'Settings',  icon:'tune', class: '' },
    { path: '/help-and-support', title: 'Help & support',  icon:'help_outline', class: '' },
    { path: '/login', title: 'Sign in',  icon:'login', class: '' },
];

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  readonly menuItems = signal<RouteInfo[]>([]);
  readonly showMenuLinks = signal(true);

  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router,
    private destroyRef: DestroyRef) { }

  ngOnInit() {

    this.updateMenu();
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateMenu();
   });
  }

  updateMenu()
  {
    const filtered = [];
      for (let index = 0; index < ROUTES.length; index++) {
        const element = ROUTES[index];
        if(element.path == '/login' && this.auth.isAuthenticated()) continue;
        if(element.path != '/users' || this.auth.isAdminUser()) filtered.push(element)
        
      }
      this.menuItems.set(filtered);
      const pathUrl = this.route['_routerState'].snapshot.url;
      const isRegOrLoginPage = pathUrl.indexOf("register") > -1 || pathUrl.indexOf("login") > -1
      this.showMenuLinks.set(!isRegOrLoginPage);
  }

  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
