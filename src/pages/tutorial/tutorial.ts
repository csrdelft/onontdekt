import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GoogleAnalytics, StatusBar } from 'ionic-native';

import { LoginPage } from '../login/login';


@Component({
  selector: 'csr-tutorial-page',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: any = [
    {
      title: 'Onontdekt',
      description: 'Het <b>XI<sup>e</sup> Lustrum</b> der <b>Civitas Studiosorum Reformatorum</b> is begonnen!',
      image: 'assets/images/tutorial-1.png'
    },
    {
      title: 'Activiteiten',
      description: 'Met deze app blijft u <b>op de hoogte</b> van alle <b>lustrumactiviteiten</b>.',
      image: 'assets/images/tutorial-2.jpg'
    },
    {
      title: 'Ledenlijst',
      description: 'Met de <b>ingebakken ledenlijst</b> kunt u snel iemand <b>bellen</b> of een <b>route plannen</b> naar Tanthof.',
      image: 'assets/images/tutorial-3.jpg'
    }
  ];
  showSkip: boolean = true;

  constructor(
    private navCtrl: NavController,
    private platform: Platform
  ) {}

  startApp() {
    this.navCtrl.push(LoginPage);
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  private ionViewDidEnter() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      GoogleAnalytics.trackView('Tutorial');
    });
  }

  private ionViewWillLeave() {
    this.platform.ready().then(() => {
      StatusBar.styleLightContent();
    });
  }

}
