import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';

import { LoginPage } from '../login/login';


@Component({
  templateUrl: 'build/pages/tutorial/tutorial.html'
})
export class TutorialPage {
  slides = [
    {
      title: 'Onontdekt',
      description: 'Het <b>XI<sup>e</sup> Lustrum</b> der <b>Civitas Studiosorum Reformatorum</b> is begonnen!',
      image: 'images/tutorial-1.png'
    },
    {
      title: 'Activiteiten',
      description: 'Met deze app blijft u <b>op de hoogte</b> van alle <b>lustrumactiviteiten</b>.',
      image: 'images/tutorial-2.jpg'
    },
    {
      title: 'Ledenlijst',
      description: 'Met de <b>ingebakken ledenlijst</b> kunt u snel iemand <b>bellen</b> of een <b>route plannen</b> naar Tanthof.',
      image: 'images/tutorial-3.jpg'
    }
  ];
  showSkip: boolean = true;

  constructor(
    private nav: NavController,
    private platform: Platform
  ) {
    platform.ready().then(() => {
      setTimeout(() => {
        Splashscreen.hide();
      }, 500);
    });
  }

  startApp() {
    this.nav.push(LoginPage);
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
    });
  }

  ionViewWillLeave() {
    this.platform.ready().then(() => {
      StatusBar.styleLightContent();
    });
  }

}
