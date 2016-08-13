import { Component } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';
import { ActionSheetController, NavParams, Platform } from 'ionic-angular';
import { Contact, ContactName, ContactField, ContactAddress, Calendar, GoogleAnalytics } from 'ionic-native';
import * as moment from 'moment';
import 'moment/locale/nl';

import { MapsHrefDirective } from '../../directives/maps-href';
import { NotificationService } from '../../services/notification';
import { Member } from '../../models/member';


@Component({
  templateUrl: 'build/pages/member-detail/member-detail.html',
  directives: [MapsHrefDirective]
})
export class MemberDetailPage {
  member: Member;

  constructor(
    private sanitizer: DomSanitizationService,
    private notifier: NotificationService,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    navParams: NavParams
  ) {
    this.member = navParams.data;

    let date = new Date(this.member.geboortedatum);
    this.member.geboortedatumText = moment(date).format('LL');
    this.member.geboortedatum = date;
  }

  getSafeUrl(scheme: string, target: string): any {
    let url = scheme + ':' + encodeURIComponent(target);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  save() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Maak nieuw contact',
          icon: !this.platform.is('ios') ? 'person-add' : null,
          handler: () => this.saveNew()
        }, {
          text: 'Annuleer',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  saveNew() {
    let contact = new Contact();

    let name = new ContactName(null, this.member.naam.achternaam, this.member.naam.voornaam, this.member.naam.tussenvoegsel);
    let phone = new ContactField('mobiel', this.member.mobiel, false);
    let email = new ContactField('thuis', this.member.email, false);
    let address = new ContactAddress(false, this.member.huis.naam || 'adres', null, this.member.huis.adres, this.member.huis.woonplaats, null, this.member.huis.postcode, this.member.huis.land);

    contact.name = name;
    contact.phoneNumbers = [phone];
    contact.emails = [email];
    contact.addresses = [address];
    contact.birthday = this.member.geboortedatum;

    contact.save().then(
      () => {
        this.notifier.notify('Succesvol opgeslagen in contacten.');
        GoogleAnalytics.trackEvent('Members', 'Save', 'New');
      },
      (error: any) => this.notifier.notify('Opslaan in contacten mislukt.')
    );
  }

  openCalendar() {
    let currentYear = moment().year();
    let date = moment(this.member.geboortedatum).year(currentYear);
    if (date.isBefore()) {
      date.year(currentYear + 1);
    }

    Calendar.openCalendar(date.toDate());
  }

  ionViewDidEnter() {
    GoogleAnalytics.trackView('Member Detail');
  }
}
