import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginApiResponse } from '../api-response';
import { HttpService } from '../http.service';
import { MessageWSService } from '../message-ws.service';
import { User } from '../user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = {} as FormGroup;
  // saving informations, that thedata has been sent to the serwer and we are waiting for data
  loading = false;
  // saving infomrations, that a user clicked the form submit button
  submitted = false;
  // error list received from server
  serverErrors: String[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private messageWsService: MessageWSService
  ) {
    if (httpService.isLogin) {
      this.router.navigate(['/']);
      messageWsService.open();
    }
  }

  // Function called after component initialisation
  ngOnInit() {
    // Form field group creation
    this.loginForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      user_password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // Form field getter
  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.serverErrors = [];

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Creating a user object from form data and send them to the server
    this.httpService.login(new User(0, this.loginForm.controls["user_name"].value, this.loginForm.controls["user_password"].value))
      // Subscribe the http response data to data stream 
      .subscribe({
        next: (data) => {
          if (data.hasOwnProperty("loggedin")) {
            let responseData = data as LoginApiResponse;
            if (responseData.loggedin === true) {
              // sava user data if login 
              this.httpService.isLogin = true;
              this.httpService.user = new User(responseData.user_id, responseData.user_name, "");
              this.router.navigate(['/']);
              this.messageWsService.open();
            } else {
              this.loading = false;
              // add errors to the list if user could not be logged in
              this.serverErrors.push(JSON.stringify(data));
              console.log("LoginComponent, onSubmit:", data);
            }
          } else {
            this.loading = false;
            // add errors to the list if user could not be registered
            this.serverErrors.push(JSON.stringify(data));
            console.log("LoginComponent, onSubmit:", data);
          }

        },
        error: (error) => {
          this.loading = false;
        }
      });

  }

}
