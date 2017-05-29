import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { Content, Item, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../../app/app.config';
import { UrlService } from '../../services/url/url';
import * as fromRoot from '../../state';
import * as post from '../../state/posts/posts.actions';
import { ForumPost } from '../../state/posts/posts.model';
import * as topic from '../../state/topics/topics.actions';
import { ForumTopic } from '../../state/topics/topics.model';
import { MemberDetailPage } from '../member-detail/member-detail';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-forum-topic',
  templateUrl: 'forum-topic.html'
})
export class ForumTopicPage implements AfterViewInit, OnInit {
  @ViewChild(Content) content: Content;
  @ViewChildren(Item) items: QueryList<Item>;

  topic$: Observable<ForumTopic>;
  posts$: Observable<ForumPost[]>;
  moreAvailable$: Observable<boolean>;

  imageUrl = AppConfig.SITE_URL + '/plaetjes/pasfoto/';
  unread: number;

  private topicId: number;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private store: Store<fromRoot.State>,
    private urlService: UrlService
  ) {
    this.topicId = this.navParams.get('id');
  }

  ngOnInit() {
    this.topic$ = this.store.select(fromRoot.getSelectedTopic);
    this.posts$ = this.store.select(fromRoot.getSelectedTopicPostsAll);
    this.moreAvailable$ = this.store.select(fromRoot.getSelectedTopicMorePostsAvailable);

    this.topic$
      .skipWhile(t => t == null)
      .take(1)
      .subscribe(topic => this.unread = topic.ongelezen);

    this.store.dispatch(new topic.SelectAction(this.topicId));
  }

  ngAfterViewInit() {
    this.scrollToUnread();
  }

  ionViewDidLoad() {
    const scrollDown = this.items.changes.subscribe(() => {
      if (this.unread === 0) {
        this.content.scrollToBottom(0);
      } else if (this.unread === this.items.length) {
        this.content.scrollToTop(0);
      } else {
        this.scrollToUnread();
      }
      scrollDown.unsubscribe();
    });
  }

  doInfinite(): Promise<any> {
    this.store.dispatch(new post.LoadAction({
      topicId: this.topicId,
      reset: false
    }));

    return this.posts$.skip(1).take(1).toPromise();
  }

  identify(index: number, post: ForumPost) {
    return post.UUID;
  }

  goToMemberDetail(id: string) {
    this.navCtrl.push(MemberDetailPage, { id });
  }

  viewExternal() {
    const url = AppConfig.SITE_URL + `/forum/onderwerp/${this.topicId}#ongelezen`;
    this.urlService.open(url);
  }

  private scrollToUnread() {
    const scroll = this.content.getScrollElement();
    const unreadEl = scroll.getElementsByClassName('js-unread-post');

    if (unreadEl.length === 0) {
      return;
    }

    this.content.scrollDownOnLoad = false;
    const rect = unreadEl[0].getBoundingClientRect();
    scroll.scrollTop = rect.top - 100;
  }
}
