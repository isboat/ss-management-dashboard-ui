import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ScreenModel } from 'app/models/screen-response.model';
import { TemplateModel } from 'app/models/template-response.model';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen-create.component.html',
  styleUrls: ['./screen-create.component.css']
})
export class ScreenCreateComponent implements OnInit {
  id: string;
  private sub: any;

  form: FormGroup;

  data: ScreenModel = null;
  templates: TemplateModel[] = [];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    
    this.form = new FormGroup({
      displayName: new FormControl()
    })
  }

 submit(){
  var data = {
    displayName: this.form.get("displayName").value
  }

  this.dataService.createNewScreen(data).subscribe({
    next: (data) => 
    {
      this.router.navigate(['/screens']);
    },
    error: (e) => {
      if(e.status == 401) console.log("ERORR HERE:" + e)
    },
    complete: () => console.info('complete') 
  });
 }

}
