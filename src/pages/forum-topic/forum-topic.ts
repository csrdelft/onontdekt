import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { Content, Item, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

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
export class ForumTopicPage implements OnInit {
  @ViewChild(Content) content: Content;
  @ViewChildren(Item) items: QueryList<Item>;

  topic$: Observable<ForumTopic>;
  posts$: Observable<ForumPost[]>;
  moreAvailable$: Observable<boolean>;

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

  doInfinite(): Promise<any> {
    this.load();
    return this.posts$.skip(1).take(1).toPromise();
  }

  identify(index: number, post: ForumPost) {
    return post.UUID;
  }

  goToMemberDetail(id: string) {
    this.navCtrl.push(MemberDetailPage, { id });
  }

  viewExternal() {
    const url = `https://csrdelft.nl/forum/onderwerp/${this.topicId}#ongelezen`;
    this.urlService.open(url);
  }

  private load() {
    this.store.dispatch(new post.LoadAction(this.topicId));
  }

}
