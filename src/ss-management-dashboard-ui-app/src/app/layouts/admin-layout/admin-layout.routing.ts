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
import { MediaUploadComponent } from 'app/media-upload/media-upload.component';
import { UserListComponent } from 'app/user-list/user-list.component';
import { UserCreateComponent } from 'app/user-create/user-create.component';
import { UserDetailsComponent } from 'app/user/user.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent, canActivate: [canActivateRoute] },
    { path: 'screens',     component: ScreenListComponent, canActivate: [canActivateRoute] },
    { path: 'screen-details/:id',     component: ScreenDetailsComponent, canActivate: [canActivateRoute] },
    { path: 'screen-create',     component: ScreenCreateComponent, canActivate: [canActivateRoute] },
    { path: 'menus',     component: MenuListComponent, canActivate: [canActivateRoute] },
    { path: 'menu-create',     component: MenuCreateComponent, canActivate: [canActivateRoute] },
    { path: 'menu-details/:id',     component: MenuDetailsComponent, canActivate: [canActivateRoute] },
    { path: 'media-upload',     component: MediaUploadComponent, canActivate: [canActivateRoute] },
    { path: 'users',     component: UserListComponent, canActivate: [canActivateUserRoute] },
    { path: 'user-create',     component: UserCreateComponent, canActivate: [canActivateUserRoute] },
    { path: 'user-details/:id',     component: UserDetailsComponent, canActivate: [canActivateUserRoute] },
    { path: 'login',   component: LoginComponent, canActivate: [canActivateLoginRoute] },
];
