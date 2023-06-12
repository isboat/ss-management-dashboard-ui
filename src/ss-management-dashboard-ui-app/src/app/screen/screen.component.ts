import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ScreenModel } from 'app/models/screen-response.model';
import { TemplateModel } from 'app/models/template-response.model';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenDetailsComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;

  form: FormGroup;

  data: ScreenModel = null;
  templates: TemplateModel[] = [];

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {
    
    this.form = new FormGroup({
      displayName: new FormControl(),
      menuEntityId: new FormControl(),
      mediaAssetEntityId: new FormControl(),
      templateKey: new FormControl(),
      templateProperties: new FormControl(),
      address:new FormGroup({
        city: new FormControl(),
        street: new FormControl(),
        pincode:new FormControl(),
        country: new FormControl(),
      })
    })

    this.fetchTemplates();

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
   });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData(){
    this.dataService.fetchScreenDetails(this.id).subscribe({
      next: (data) => 
      {
        this.data = data
        this.form.get("displayName").setValue(data.displayName)
      },
      error: (e) => {
        if(e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete') 
    });
 }

 fetchTemplates(){
   this.dataService.fetchTemplates().subscribe({
     next: (data) => 
     {
       this.templates = data
     },
     error: (e) => {
       if(e.status == 401) console.log("ERORR HERE:" + e)
     },
     complete: () => console.info('complete') 
   });
}

 submit(){}

}
