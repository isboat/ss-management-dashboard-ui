import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'app/models/user-response.model';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  id: string;
  form: FormGroup;

  constructor(
    private dataService: UserService,
    private authService: AuthService, 
    private router: Router) { }

  ngOnInit() {
    
    this.form = new FormGroup({
      name: new FormControl(),      
      email: new FormControl(),
      role: new FormControl()
    })
  }

 submit(){
  var data: UserModel = {
    name: this.form.get("name").value,
    email: this.form.get("email").value,
    role: this.form.get("role").value == "1" ? 1 : 0,
    id: null,
    created: null,
    modifiedDate: null,
    tenantId: null,
    password: null
  }

  this.dataService.createNewUser(data).subscribe({
    next: (data) => 
    {
      this.router.navigate(['/users']);
    },
    error: (e) => {
      if(e.status == 401) this.authService.redirectToLogin(true);
    },
    complete: () => console.info('complete') 
  });
 }

}
