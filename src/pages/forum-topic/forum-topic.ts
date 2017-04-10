import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Store } from '@ngrx/store';
import { Content, InfiniteScroll, IonicPage, Item, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../state';
import { ForumPost } from '../../state/posts/posts.model';
import * as post from '../../state/posts/posts.actions';
import { ForumTopic } from '../../state/topics/topics.model';
import * as topic from '../../state/topics/topics.actions';

@IonicPage({
  segment: 'draadje/:id'
})
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'forum-topic-page',
  templateUrl: 'forum-topic.html'
})
export class ForumTopicPage implements OnInit {
  @ViewChild(Content) content: Content;
  @ViewChildren(Item) items: QueryList<Item>;

  topic$: Observable<ForumTopic>;
  posts$: Observable<ForumPost[]>;
  moreAvailable$: Observable<boolean>;

  private topicId: number;

  constructor(
    private googleAnalytics: GoogleAnalytics,
    private navParams: NavParams,
    private store: Store<fromRoot.State>
  ) {
    this.topicId = this.navParams.get('id');
  }

  ngOnInit() {
    this.topic$ = this.store.select(fromRoot.getSelectedTopic);
    this.posts$ = this.store.select(fromRoot.getSelectedTopicPostsAll);
    this.moreAvailable$ = this.store.select(fromRoot.getSelectedTopicMorePostsAvailable);

    this.store.dispatch(new topic.SelectAction(this.topicId));

    this.posts$
      .take(1)
      .filter(posts => posts === undefined)
      .subscribe(() => this.load());
  }

  ionViewDidLoad() {
    const scrollDown = this.items.changes.subscribe(() => {
      this.content.scrollToBottom(0);
      scrollDown.unsubscribe();
    });
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Forum Topic');
    }
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    this.load();
    this.posts$.skip(1).take(1).subscribe(() => {
      infiniteScroll.complete();
    });
  }

  private load() {
    this.store.dispatch(new post.LoadAction(this.topicId));
  }

}
