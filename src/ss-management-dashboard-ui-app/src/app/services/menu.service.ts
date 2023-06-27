import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuModel } from 'app/models/menu-response.model';
import { TemplateModel } from 'app/models/template-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  fetchMenus(): Observable<MenuModel[]>  {
    return this.http.get<MenuModel[]>(
      environment.apiBaseUrl + '/v1/tenant/menus',
      { responseType: 'json' }
    );
  }

  fetchMenuDetails(id: string): Observable<MenuModel>  {
    return this.http.get<MenuModel>(
      environment.apiBaseUrl + '/v1/tenant/menus/' + id,
      { responseType: 'json' }
    );
  }

  createNewMenu(data: MenuModel): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/menus/',
      data,
      { responseType: 'json' }
    );
  }

  saveMenu(data: MenuModel): Observable<any>  {
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/menus/',
      JSON.stringify(data),
      { responseType: 'json' }
    );
  }

  deleteMenu(id: string): Observable<any>  {
    return this.http.delete<any>(
      environment.apiBaseUrl + '/v1/tenant/menus/' + id,
      { responseType: 'json' }
    );
  }
}
