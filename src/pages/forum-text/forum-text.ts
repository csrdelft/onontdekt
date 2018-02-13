import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-forum-text',
  templateUrl: 'forum-text.html'
})
export class ForumTextPage implements OnInit {
  text: string;

  constructor(private navParams: NavParams) {}

  ngOnInit() {
    this.text = this.navParams.get('text');
  }
}
