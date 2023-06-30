import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MediaAssetModel } from 'app/models/media-asset-response.model';
import { MenuModel } from 'app/models/menu-response.model';
import { ScreenModel } from 'app/models/screen-response.model';
import { TemplateModel } from 'app/models/template-response.model';
import { DataService } from 'app/services/data.service';
import { MediaService } from 'app/services/media.service';
import { MenuService } from 'app/services/menu.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenDetailsComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;

  data: ScreenModel = null;
  templates: TemplateModel[] = [];
  menus: MenuModel[] = [];
  mediaAssets: MediaAssetModel[] = [];

  selectedTemplate: TemplateModel = null;
  selectedTemplateKey: string = null;

  constructor(
    private dataService: DataService, 
    private menuService: MenuService,
    private mediaService: MediaService,
    private route: ActivatedRoute) { }

  onTemplateChange(newTemplateKey: string) {
    this.templates.forEach((value, index) => {
      if (value.key == newTemplateKey) {
        this.selectedTemplate = value;
        this.data.templateKey = value.key;
        this.data.templateProperties = value.requiredProperties
      }
    });
  }
  onMenuChange(newMenuKey: string) {
    this.menus.forEach((value, index) => {
      if (value.id == newMenuKey) {
        this.data.menuEntityId = value.id;
      }
    });
  }
  ngOnInit() {

    this.fetchTemplates();
    this.fetchMenus();
    this.fetchMediaAssets();

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.dataService.fetchScreenDetails(this.id).subscribe({
      next: (data) => {
        this.data = data
      },
      error: (e) => {
        if (e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete')
    });
  }

  fetchTemplates() {
    this.dataService.fetchTemplates().subscribe({
      next: (data) => {
        this.templates = data
      },
      error: (e) => {
        if (e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete')
    });
  }

  fetchMenus() {
    this.menuService.fetchMenus().subscribe({
      next: (data) => {
        this.menus = data
      },
      error: (e) => {
        if (e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete')
    });
  }

  fetchMediaAssets() {
    this.mediaService.fetchMenus().subscribe({
      next: (data) => {
        this.mediaAssets = data
      },
      error: (e) => {
        if (e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete')
    });
  }

  saveScreenUpdates() { }

}
