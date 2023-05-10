import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AuthPermissionsService {
  isAdmin(isAdmin: boolean) {
    return isAdmin;
  }
}
