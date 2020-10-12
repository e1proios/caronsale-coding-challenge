import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../svc/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[];
  loginForm: FormGroup;
  messages: string[] = [];

  constructor(
    private _authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this._subscriptions = [];

    this._subscriptions.push(
      this._authSvc.userNotAuthorized.subscribe(authFailed => {
        if (authFailed) {
          this.messages.push('User not authorized');
          this.loginForm.patchValue({
            password: ''
          });
        }
      })
    );
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });
  }
  ngOnDestroy(): void {
    this._subscriptions.forEach( (sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  onFormSubmit() {
    this._authSvc.login(this.loginForm.value);
    this.messages = [];
  }
  highlightInvalidInput(item: any) {
    return item.invalid && (item.dirty || item.touched);
  }
}
