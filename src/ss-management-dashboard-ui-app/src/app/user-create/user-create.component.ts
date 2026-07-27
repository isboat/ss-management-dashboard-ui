import { Component, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'app/models/user-response.model';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  standalone: false,
  selector: 'app-user',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent {
  readonly submitting = signal(false);
  readonly form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    role: new FormControl('0')
  });

  constructor(
    private dataService: UserService,
    private authService: AuthService, 
    private router: Router) { }

 submit(){
  const data: UserModel = {
    name: this.form.get("name").value,
    email: this.form.get("email").value,
    role: this.form.get("role").value == "1" ? 1 : 0,
    id: null,
    created: null,
    modifiedDate: null,
    tenantId: null,
    password: null
  }

  this.submitting.set(true);
  this.dataService.createNewUser(data).subscribe({
    next: (data) => 
    {
      this.router.navigate(['/users']);
    },
    error: (e) => {
      this.submitting.set(false);
      if(e.status == 401) this.authService.redirectToLogin(true);
    },
    complete: () => this.submitting.set(false)
  });
 }

}
