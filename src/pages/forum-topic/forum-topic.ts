import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Alert, Content, InfiniteScroll, Item, Modal, NavController, NavParams, Refresher } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';

import { ApiData } from '../../services/api-data';
import { IForumPost, IForumTopic } from '../../models/forum';

@Component({
  templateUrl: 'forum-topic.html'
})
export class ForumTopicPage {
  @ViewChild(Content) content: Content;

  @ViewChildren(Item)
  public items: QueryList<Item>;

  topic: IForumTopic;
  posts: IForumPost[] = [];

  moreAvailable: boolean = true;
  failedToLoad: boolean = false;

  offset: number;
  limit: number;

  constructor(
    private apiData: ApiData,
    private navParams: NavParams
  ) {
    this.topic = navParams.get('topic');
    this.topic.laatste_post.uid_naam = this.topic.laatste_wijziging_naam;

    this.posts = [this.topic.laatste_post];
    this.initializeParameters();
  }

  ionViewDidLoad() {
    const scrollDown = this.items.changes.subscribe(() => {
      this.content.scrollToBottom(0);
      scrollDown.unsubscribe();
    });
    this.updateList(this.offset, this.limit);
  }

  initializeParameters() {
    this.offset = 1;
    this.limit = 10;
  }

  updateList(offset: number, limit: number, reset: boolean = false): Promise<boolean> {
    return this.apiData.getForumTopic(this.topic.draad_id, offset, limit)
      .then(posts => {
        if (posts.length < limit) {
          this.moreAvailable = false;
        }

        if (posts.length === 0) {
          return false;
        }

        if (reset) {
          this.posts = posts;
        } else {
          this.posts.unshift(...posts);
        }
        return true;
      }, () => {
        this.failedToLoad = true;
      });
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    this.offset += this.limit;

    this.updateList(this.offset, this.limit).then(hasPosts => {
      if (hasPosts === true) {
        infiniteScroll.complete();
      } else {
        infiniteScroll.complete();
      }
    });
  }

  doRetryLoad() {
    this.failedToLoad = false;
    this.updateList(this.offset, this.limit, true);
  }

  ionViewDidEnter() {
    if (GoogleAnalytics['installed']()) {
      GoogleAnalytics.trackView('Forum Topic');
    }
  }

}
