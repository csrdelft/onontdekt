import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, Platform, Refresher } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';

import { MemberDetailPage } from '../member-detail/member-detail';
import { ApiData } from '../../services/api-data';

export interface Hunter {
  uid: number;
  name: string;
  alive: boolean;
}

@Component({
  selector: 'csr-gotcha-page',
  templateUrl: 'gotcha.html'
})
export class GotchaPage implements OnInit {
  public hunters: Hunter[];

  constructor(
    private apiData: ApiData,
    private navCtrl: NavController,
    private http: Http,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.load();

    this.platform.resume.subscribe(() => {
      this.load();
    });
  }

  ionViewDidEnter() {
    GoogleAnalytics.trackView('Gotcha');
  }

  goToMemberDetail(hunter: Hunter) {
    this.apiData.getMemberDetail(hunter.uid).then(memberDetail => {
      this.navCtrl.push(MemberDetailPage, memberDetail);
    });
  }

  doRefresh(refresher: Refresher) {
    this.load();
    setTimeout(() => refresher.complete(), 2000);
  }

  private load() {
    this.http.get('https://dl.dropboxusercontent.com/s/mri2lha0gdkt1zd/data.json')
      .map(res => res.json())
      .subscribe(data => {
        this.hunters = data;
      });
  }
}
