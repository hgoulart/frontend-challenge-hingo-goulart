import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ICountries } from '../interfaces/ICountries.interface';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})

export class ServiceService {

  loading: any;
  isLoggedIn = false;
  authenticationState = new BehaviorSubject(false);
  apiUrl: string;
  // you can change to an env file
  apiKey = 'YTAxY2VhZDctYjk0ZC00OWZjLWJjNjQtNzU0N2IzODYzMjgw';
  headers = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json; charset=utf-8',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Authorization: 'Bearer YTAxY2VhZDctYjk0ZC00OWZjLWJjNjQtNzU0N2IzODYzMjgw'
  });

  constructor(public alertController: AlertController,
    private storage: Storage,
    private router: Router,
    public loadingCtrl: LoadingController,
    public http: HttpClient) {
      this.init();
    this.apiUrl = 'https://api.m3o.com/v1/holidays/';
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this.storage = storage;
  }

  getCountries(url: string, data: any): Observable<ICountries> {
    return this.http.post<ICountries>(this.apiUrl + url, data, { headers: this.headers });
  }

  getHolidays(url: string, data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + url, data, { headers: this.headers });
  }

  get(url) {
    return this.http.get(this.apiUrl + url, { headers: this.headers });
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      translucent: true,
      message: 'Carregando...',
      cssClass: 'custom-loading'
    });
    return await this.loading.present();
  }

  async hideLoading() {
    await this.loading.dismiss();
  }

  isAuthenticated() {
    if (this.authenticationState.value) {
      return this.authenticationState.value;
    } else {
      this.router.navigate(['/login']);
    }
  }

  logIn(){
    this.isLoggedIn = true;
  }
  logOut(){
    this.isLoggedIn = false;
  }

  async logout() {

    return await this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  async nextPage(token) {
    await this.storage.set(
      TOKEN_KEY,
      JSON.stringify(token)
    ).then(res => {
      this.authenticationState.next(true);
    });
  }
  async checkToken() {
    return await this.storage.get(TOKEN_KEY).then(res => {

      if (res) {
        this.authenticationState.next(true);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Notification',
      message: `Welcome ${message}`,
      buttons: ['OK']
    });

    await alert.present();
  }

}
