import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthPermissionsService } from './guards/auth-permission.guard';

//export const canActivate = (isAdmin: boolean, permissionService = inject(PermissionsService)) => permissionService.isAdmin(isAdmin);

export const canActivate = (isAdmin: boolean, permissionService = inject(AuthPermissionsService)) => permissionService.isAdmin(isAdmin);

const routes: Routes = [
  { 
    path: 'auth',
    component: AuthComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
