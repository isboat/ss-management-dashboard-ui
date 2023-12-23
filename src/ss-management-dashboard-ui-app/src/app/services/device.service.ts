import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceAuthRequestModel } from 'app/models/device-auth-request.model';
import { DeviceModel } from 'app/models/device-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  fetchDevices(): Observable<DeviceModel[]>  {
    return this.http.get<DeviceModel[]>(
      environment.apiBaseUrl + '/v1/tenant/devices',
      { responseType: 'json' }
    );
  }

  updateName(id: string, name: string): Observable<any>  {
    var data = { deviceName: name, id: id}
    return this.http.patch<any>(
      environment.apiBaseUrl + `/v1/tenant/devices/${id}/name`,
      data,
      { responseType: 'json' }
    );
  }

  updateScreen(deviceId: string, screenId: string): Observable<any>  {
    var data = { id: deviceId, screenId: screenId}
    return this.http.patch<any>(
      environment.apiBaseUrl + `/v1/tenant/devices/${deviceId}/screen`,
      data,
      { responseType: 'json' }
    );
  }

  deleteScreen(deviceId: string): Observable<any>  {
    return this.http.delete<any>(
      environment.apiBaseUrl + `/v1/tenant/devices/${deviceId}`,
      { responseType: 'json' }
    );
  }

  post(data: DeviceAuthRequestModel): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/device/auth',
      data,
      { responseType: 'json' }
    );
  }
}
