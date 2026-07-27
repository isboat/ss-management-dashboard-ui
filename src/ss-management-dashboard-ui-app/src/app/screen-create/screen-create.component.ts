import { Component, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ScreenModel } from 'app/models/screen-response.model';
import { TemplateModel } from 'app/models/template-response.model';
import { DataService } from 'app/services/data.service';

@Component({
  standalone: false,
  selector: 'app-screen',
  templateUrl: './screen-create.component.html',
  styleUrls: ['./screen-create.component.css']
})
export class ScreenCreateComponent {
  readonly submitting = signal(false);
  readonly form = new FormGroup({
    displayName: new FormControl('')
  });

  constructor(private dataService: DataService, private router: Router) { }

 submit(){
  const data = {
    displayName: this.form.get("displayName").value
  }

  this.submitting.set(true);
  this.dataService.createNewScreen(data).subscribe({
    next: (data) => 
    {
      this.router.navigate(['/screens']);
    },
    error: (e) => {
      this.submitting.set(false);
      if(e.status == 401) console.log("ERORR HERE:" + e)
    },
    complete: () => this.submitting.set(false)
  });
 }

}
