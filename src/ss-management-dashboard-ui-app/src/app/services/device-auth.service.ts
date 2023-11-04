import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceAuthRequestModel } from 'app/models/device-auth-request.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceAuthService {

  constructor(private http: HttpClient) { }

  post(data: DeviceAuthRequestModel): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/device/auth',
      data,
      { responseType: 'json' }
    );
  }
}
