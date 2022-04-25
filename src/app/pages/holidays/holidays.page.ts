import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/api/service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {

  countryCode: string;
  holidays: any;

  constructor( private router: Router, public service: ServiceService, private route: ActivatedRoute) {
    this.service.checkToken();
    if(!this.service.isLoggedIn){
      this.router.navigate(['login']);
    }
    this.countryCode = this.route.snapshot.params.data;
    this.loadHolidays(this.countryCode);
  }

  ngOnInit() {
  }

  loadHolidays(code: string) {
    this.service.showLoading();

    const payload = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      country_code: code,
      year: new Date().getFullYear()
    };

    this.service.getHolidays('holidays/List', payload).subscribe(
      res => {
        this.service.hideLoading();
        this.holidays = res;
      },
      err => {
        this.service.hideLoading();
        this.service.presentAlert(err.message);

        console.log(err);
        return err;
      });
  }

}
