import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Store } from '@ngrx/store';
import { NavController, IonicPage, Refresher } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../state';
import * as topics from '../../state/topics/topics.actions';
import { ForumTopic } from '../../state/topics/topics.model';

@IonicPage({
  segment: 'recent'
})
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'forum-recent-page',
  templateUrl: 'forum-recent.html'
})
export class ForumRecentPage implements OnInit {
  topics$: Observable<ForumTopic[]>;
  moreAvailable$: Observable<boolean>;

  constructor(
    private googleAnalytics: GoogleAnalytics,
    private navCtrl: NavController,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.topics$ = this.store.select(fromRoot.getAllTopics);
    this.moreAvailable$ = this.store.select(fromRoot.moreTopicsAvailable);
    this.load(true);
  }

  doInfinite(): Promise<any> {
    this.load(false);
    return this.topics$.skip(1).take(1).toPromise();
  }

  doRefresh(refresher: Refresher) {
    this.load(true);
    this.topics$.skip(1).take(1).subscribe(() => {
      refresher.complete();
    });
  }

  goToTopicDetail(topic: ForumTopic) {
    this.navCtrl.push('ForumTopicPage', { id: topic.draad_id });
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Forum Recent');
    }
  }

  private load(reset: boolean) {
    this.store.dispatch(new topics.LoadAction(reset));
  }

}
