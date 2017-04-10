import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { IonicPage, Refresher } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface Ranked {
  name: string;
  score: number;
  latest: number;
}

@IonicPage({
  segment: 'stand'
})
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ranking-page',
  templateUrl: 'ranking.html'
})
export class RankingPage implements OnInit {
  ranking$: BehaviorSubject<Ranked[]> = new BehaviorSubject(null);

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
    this.ranking$.skip(1).take(1).subscribe(() => {
      refresher.complete();
    });
  }

  identify(index: number, item: Ranked) {
    return item.name;
  }

  private load() {
    this.http.get('https://dl.dropboxusercontent.com/s/lm4fvoih6m8tpx1/ranking.json')
      .map(res => res.json())
      .subscribe((data: Ranked[]) => {
        const sorted = data.sort(this.sort);
        this.ranking$.next(sorted);
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
