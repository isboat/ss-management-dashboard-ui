import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LoginComponent } from '../../login/login.component';
import { canActivateLoginRoute, canActivateRoute, canActivateUserRoute } from 'app/services/can-activate-route.service';
import { ScreenListComponent } from 'app/screen-list/screen-list.component';
import { ScreenDetailsComponent } from 'app/screen/screen.component';
import { ScreenCreateComponent } from 'app/screen-create/screen-create.component';
import { MenuListComponent } from 'app/menu-list/menu-list.component';
import { MenuCreateComponent } from 'app/menu-create/menu-create.component';
import { MenuDetailsComponent } from 'app/menu/menu.component';
import { MediaNewComponent } from 'app/media-new/media-new.component';
import { UserListComponent } from 'app/user-list/user-list.component';
import { UserCreateComponent } from 'app/user-create/user-create.component';
import { UserDetailsComponent } from 'app/user/user.component';
import { DeviceAuthComponent } from 'app/device-auth/device-auth.component';
import { DeviceListComponent } from 'app/device-list/device-list.component';
import { MediaListComponent } from 'app/media-list/media-list.component';
import { PlaylistsComponent } from 'app/playlists/playlists.component';
import { PlaylistComponent } from 'app/playlist-details/playlist-details.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate: [canActivateRoute] },
    { path: 'screens',     component: ScreenListComponent, canActivate: [canActivateRoute] },
    { path: 'screen-details/:id',     component: ScreenDetailsComponent, canActivate: [canActivateRoute] },
    { path: 'screen-create',     component: ScreenCreateComponent, canActivate: [canActivateRoute] },
    { path: 'menus',     component: MenuListComponent, canActivate: [canActivateRoute] },
    { path: 'menu-create',     component: MenuCreateComponent, canActivate: [canActivateRoute] },
    { path: 'menu-details/:id',     component: MenuDetailsComponent, canActivate: [canActivateRoute] },
    { path: 'media-new',     component: MediaNewComponent, canActivate: [canActivateRoute] },
    { path: 'media-list',     component: MediaListComponent, canActivate: [canActivateRoute] },
    { path: 'users',     component: UserListComponent, canActivate: [canActivateUserRoute] },
    { path: 'user-create',     component: UserCreateComponent, canActivate: [canActivateUserRoute] },
    { path: 'user-details/:id',     component: UserDetailsComponent, canActivate: [canActivateUserRoute] },
    { path: 'device/auth',     component: DeviceAuthComponent, canActivate: [canActivateUserRoute] },
    { path: 'devices',     component: DeviceListComponent, canActivate: [canActivateUserRoute] },
    { path: 'playlists',     component: PlaylistsComponent, canActivate: [canActivateUserRoute] },
    { path: 'playlists/:id',     component: PlaylistComponent, canActivate: [canActivateUserRoute] },
    { path: 'login',   component: LoginComponent, canActivate: [canActivateLoginRoute] },
];
