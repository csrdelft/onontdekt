import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Refresher } from 'ionic-angular';

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
    private googleAnalytics: GoogleAnalytics,
    private http: Http
  ) {}

  ngOnInit() {
    this.load();
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Ranking');
    }
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
