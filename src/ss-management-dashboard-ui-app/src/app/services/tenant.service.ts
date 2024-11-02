import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TenantModel } from 'app/models/tenant-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private http: HttpClient) { }

  fetchSettings(): Observable<TenantModel>  {
    return this.http.get<TenantModel>(
      environment.apiBaseUrl + '/v1/tenant/settings',
      { responseType: 'json' }
    );
  }

  updatePartnerPermission(permission: boolean): Observable<any>  {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/settings/allowpartner?allow=' + permission,
      { responseType: 'json', headers: headers }
    );
  }
}
