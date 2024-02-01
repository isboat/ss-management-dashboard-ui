import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScreenModel } from 'app/models/screen-response.model';
import { TemplateModel } from 'app/models/template-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  fetchScreens(skip?: number, limit?: number): Observable<ScreenModel[]>  {
    let url = environment.apiBaseUrl + '/v1/tenant/screens?';
    if(skip) url += `skip=${skip}&`;
    if(limit) url += `limit=${limit}`;

    return this.http.get<ScreenModel[]>(
      url,
      { responseType: 'json' }
    );
  }

  fetchScreenDetails(id: string): Observable<ScreenModel>  {
    return this.http.get<ScreenModel>(
      environment.apiBaseUrl + '/v1/tenant/screens/' + id,
      { responseType: 'json' }
    );
  }

  createNewScreen(data: any): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/screens/',
      data,
      { responseType: 'json' }
    );
  }

  updateScreen(data: any): Observable<any>  {
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/screens/',
      data,
      { responseType: 'json' }
    );
  }

  publishScreen(screenId: string): Observable<any>  {
    var data:any = {}
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/publish/screens/' + screenId,
      data,
      { responseType: 'json' }
    );
  }

  deleteScreen(id: string): Observable<any>  {
    return this.http.delete<any>(
      environment.apiBaseUrl + '/v1/tenant/screens/' + id,
      { responseType: 'json' }
    );
  }

  fetchTemplates(): Observable<TemplateModel[]>  {
    return this.http.get<TemplateModel[]>(
      environment.apiBaseUrl + '/v1/templates',
      { responseType: 'json' }
    );
  }
}
