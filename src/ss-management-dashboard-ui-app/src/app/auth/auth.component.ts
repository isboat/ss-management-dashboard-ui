import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {

  setupForm: FormGroup
  key = new FormControl('', Validators.required);
  code = new FormControl('', Validators.required);
  
  errorMsg: string = '';  

  constructor() {
    this.setupForm = new FormGroup({
      key: this.key,
      code: this.code
    })
  }

  ngOnInit() {
  }

  onSubmit (){

    alert("hello");
    let invalid = this.key.invalid || this.code.invalid;

    if (this.key.invalid) {
      this.key.markAsDirty({onlySelf: true})
    }
    if (this.code.invalid) {
      this.code.markAsDirty({onlySelf: true});
    }
    if (invalid) {
      return;
    }
  }
}
