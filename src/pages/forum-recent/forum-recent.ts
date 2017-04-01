import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NavController, InfiniteScroll, IonicPage, Refresher } from 'ionic-angular';

import { ApiData } from '../../providers/api-data';
import { IForumTopic } from '../../models/forum';

@IonicPage({
  segment: 'recent'
})
@Component({
  selector: 'forum-recent-page',
  templateUrl: 'forum-recent.html'
})
export class ForumRecentPage {
  topics: IForumTopic[] = [];

  moreAvailable: boolean = true;
  failedToLoad: boolean = false;

  offset: number;
  limit: number;

  constructor(
    private apiData: ApiData,
    private googleAnalytics: GoogleAnalytics,
    private navCtrl: NavController
  ) {
    this.initializeParameters();
  }

  ionViewDidLoad() {
    this.updateList(this.offset, this.limit);
  }

  initializeParameters() {
    this.offset = 0;
    this.limit = 10;
  }

  updateList(offset: number, limit: number, reset: boolean = false): Promise<boolean> {
    return this.apiData.getForumRecent(offset, limit)
      .then(topics => {

        if (topics.length === 0) {
          return false;
        }

        if (reset) {
          this.topics = topics;
        } else {
          this.topics.push(...topics);
        }

        return true;
      }, () => {
        this.failedToLoad = true;
      });
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    this.offset += this.limit;

    this.updateList(this.offset, this.limit).then(hasTopics => {
      if (hasTopics === true) {
        infiniteScroll.complete();
      } else {
        infiniteScroll.enable(false);
        this.moreAvailable = false;
      }
    });
  }

  doRefresh(refresher: Refresher) {
    this.initializeParameters();
    this.updateList(this.offset, this.limit, true).then((hasTopics) => {
      refresher.complete();
    });
  }

  doRetryLoad() {
    this.failedToLoad = false;
    this.updateList(this.offset, this.limit, true);
  }

  goToTopicDetail(topic: IForumTopic) {
    this.navCtrl.push('ForumTopicPage', { topic });
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Forum Recent');
    }
  }

}
