import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicPage, NavController, Platform } from 'ionic-angular';

export interface TutorialSlide {
  title: string;
  description: string;
  image: string;
}

@IonicPage({
  segment: 'tour'
})
@Component({
  selector: 'csr-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: TutorialSlide[] = [
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

  constructor(
    private googleAnalytics: GoogleAnalytics,
    private navCtrl: NavController,
    private platform: Platform,
    private statusBar: StatusBar
  ) {}

  ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.googleAnalytics.trackView('Tutorial');
      });
    }
  }

  ionViewWillLeave() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.statusBar.styleLightContent();
      });
    }
  }

  startApp() {
    this.navCtrl.push('LoginPage');
  }

  identify(index: number, slide: TutorialSlide) {
    return slide.title;
  }

}
