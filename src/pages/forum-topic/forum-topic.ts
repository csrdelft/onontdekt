import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Content, InfiniteScroll, IonicPage, Item, NavParams } from 'ionic-angular';

import { ApiData } from '../../providers/api-data';
import { IForumPost, IForumTopic } from '../../models/forum';

@IonicPage({
  segment: 'draadje'
})
@Component({
  selector: 'forum-topic-page',
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
    private googleAnalytics: GoogleAnalytics,
    private navParams: NavParams
  ) {
    this.topic = this.navParams.get('topic');
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
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Forum Topic');
    }
  }

}
