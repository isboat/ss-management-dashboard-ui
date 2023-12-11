import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LoginComponent } from '../../login/login.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { GuardPermissionsService } from 'app/services/can-activate-route.service';
import { AuthService } from 'app/services/auth.service';
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
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PlaylistsComponent } from 'app/playlists/playlists.component';
import { PlaylistComponent } from 'app/playlist-details/playlist-details.component';
import { MediaPreviewComponent } from 'app/media-preview/media-preview.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    CKEditorModule
  ],
  declarations: [
    DashboardComponent,
    LoginComponent,
    ScreenListComponent,
    ScreenDetailsComponent,
    ScreenCreateComponent,
    MenuCreateComponent,
    MenuListComponent,
    MenuDetailsComponent,
    MediaNewComponent,
    UserListComponent,
    UserCreateComponent,
    UserDetailsComponent,
    DeviceAuthComponent,
    DeviceListComponent,
    MediaListComponent,
    PlaylistsComponent,
    PlaylistComponent,
    MediaPreviewComponent
  ],
  providers: [AuthService, GuardPermissionsService]
})

export class AdminLayoutModule {}
