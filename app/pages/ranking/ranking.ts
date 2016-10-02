import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';


@Component({
  templateUrl: 'build/pages/ranking/ranking.html'
})
export class RankingPage implements OnInit {

  public ranking: { name: string, score: number }[] = [{
    name: 'Archibald',
    score: 83
  }, {
    name: 'Faculteit',
    score: 97
  }, {
    name: 'Billy',
    score: 77
  }, {
    name: 'Diagonaal',
    score: 78
  }, {
    name: 'Vrøgd',
    score: 0
  }, {
    name: 'Lekker',
    score: 74
  }, {
    name: 'Securis',
    score: 74
  }, {
    name: 'Primitus',
    score: 101
  }, {
    name: 'X',
    score: 91
  }];

  constructor(
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.ranking.sort(this.sort);
  }

  ionViewDidEnter() {
    GoogleAnalytics.trackView('Ranking');
  }

  private sort(a, b) {
    if (a.score < b.score)
      return 1;
    if (a.score > b.score)
      return -1;
    return 0;
  }

}
