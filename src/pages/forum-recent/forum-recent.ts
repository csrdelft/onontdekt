import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NavController, Refresher } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { skip, take } from 'rxjs/operators';

import * as fromRoot from '../../state';
import * as topics from '../../state/topics/topics.actions';
import { ForumTopic } from '../../state/topics/topics.model';
import { ForumTopicPage } from '../forum-topic/forum-topic';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-forum-recent',
  templateUrl: 'forum-recent.html'
})
export class ForumRecentPage implements OnInit {
  topics$: Observable<ForumTopic[]>;
  moreAvailable$: Observable<boolean>;

  constructor(
    private navCtrl: NavController,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.topics$ = this.store.pipe(select(fromRoot.getAllTopics));
    this.moreAvailable$ = this.store.pipe(select(fromRoot.moreTopicsAvailable));
    this.load(true);
  }

  doInfinite(): Promise<any> {
    this.load(false);
    return this.topics$.pipe(skip(1), take(1)).toPromise();
  }

  doRefresh(refresher: Refresher) {
    this.load(true);
    this.topics$.pipe(skip(1), take(1)).subscribe(() => {
      refresher.complete();
    });
  }

  goToTopicDetail(topic: ForumTopic) {
    this.navCtrl.push(ForumTopicPage, { id: topic.draad_id });
  }

  identify(index: number, topic: ForumTopic) {
    return topic.UUID;
  }

  private load(reset: boolean) {
    this.store.dispatch(new topics.LoadAction(reset));
  }

}
