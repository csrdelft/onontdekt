import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, Refresher } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';

export interface Ranked {
  name: string;
  score: number;
  latest: number;
}

@Component({
  selector: 'ranking-page',
  templateUrl: 'ranking.html'
})
export class RankingPage implements OnInit {
  public ranking: Ranked[];

  private refresher: Refresher;

  constructor(
    private http: Http,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.load();
  }

  ionViewDidEnter() {
    GoogleAnalytics.trackView('Ranking');
  }

  doRefresh(refresher: Refresher) {
    this.load();
    this.refresher = refresher;
  }

  private load() {
    this.http.get('https://dl.dropboxusercontent.com/s/lm4fvoih6m8tpx1/ranking.json')
      .map(res => res.json())
      .subscribe((data: Ranked[]) => {
        this.ranking = data.sort(this.sort);
        if (this.refresher) {
          this.refresher.complete();
        }
      });
  }

  private sort(a: Ranked, b: Ranked) {
    if (a.score < b.score)
      return 1;
    if (a.score > b.score)
      return -1;
    return 0;
  }
}
