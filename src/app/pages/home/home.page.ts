import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../api/service.service';
import { Router } from '@angular/router';
import { ICountries, Country } from '../../interfaces/ICountries.interface';
import { NavController } from '@ionic/angular';
import { LocalStorageService } from '../../local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  countries: ICountries;

  constructor( private localStorage: LocalStorageService,
    private router: Router,
    public service: ServiceService,
    private navCtrl: NavController) {
    this.service.checkToken();
    if(!this.service.isLoggedIn){
      this.router.navigate(['login']);
    }
  }

  async ngOnInit() {
    this.getCountries();
    const user = JSON.parse(await this.localStorage.get('user'));
    this.service.presentAlert(user.email);
  }

  logout(){
    this.service.logout();
    this.router.navigateByUrl('/login');
  }

  getCountries(): void{
    this.service.showLoading();

    this.service.getCountries('Countries', {}).subscribe(
      res => {
        this.service.hideLoading();
        this.countries = res;
      },
      err => {
        this.service.hideLoading();
        this.service.presentAlert(err.message);

        console.log(err);
        return err;
      });
  }

  showHolidays(country: Country ): void{
    this.navCtrl.navigateForward(['holidays',{ data: country.code}]);
  }

}

