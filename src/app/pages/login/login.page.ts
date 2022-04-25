import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../../api/service.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { LocalStorageService } from '../../local-storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: any;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private service: ServiceService,
    private localStorage: LocalStorageService  ) {

    this.loginForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  ngOnInit() {

  }

  async login(form) {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {

      this.service.showLoading();

      setTimeout(() => {
        const user = {
          email: this.loginForm.value.email
        };
        this.service.nextPage(JSON.stringify(user)).then(res => {
          this.service.authenticationState.next(true);
          this.localStorage.set('user', JSON.stringify(user) );
          this.service.logIn();
          this.service.hideLoading();
          this.router.navigate(['/home']);
        });
        this.service.hideLoading();
      }, 1000);

    } else {
      this.service.hideLoading();
      this.service.presentAlert('No empty fields allowed!');
    }
  }
}
