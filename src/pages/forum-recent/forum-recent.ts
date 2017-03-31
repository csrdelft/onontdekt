import { Component } from '@angular/core';
import { NavController, InfiniteScroll, Refresher } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';

import { ForumTopicPage } from '../forum-topic/forum-topic';
import { ApiData } from '../../services/api-data';
import { IForumTopic } from '../../models/forum';

@Component({
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
    this.navCtrl.push(ForumTopicPage, { topic });
  }

  ionViewDidEnter() {
    if (GoogleAnalytics['installed']()) {
      GoogleAnalytics.trackView('Forum Recent');
    }
  }

}
