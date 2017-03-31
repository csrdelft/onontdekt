import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Calendar } from '@ionic-native/calendar';
import { Contacts, ContactAddress, ContactField, ContactName } from '@ionic-native/contacts';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ActionSheetController, NavParams, Platform } from 'ionic-angular';
import moment from 'moment';

import { NotificationService } from '../../services/notification';
import { Member } from '../../models/member';


@Component({
  templateUrl: 'member-detail.html'
})
export class MemberDetailPage {
  member: Member;

  constructor(
    private sanitizer: DomSanitizer,
    private notifier: NotificationService,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private calendar: Calendar,
    private contacts: Contacts,
    private googleAnalytics: GoogleAnalytics,
    private photoViewer: PhotoViewer,
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
    let contact = this.contacts.create();
    contact.name = new ContactName(null, this.member.naam.achternaam, this.member.naam.voornaam, this.member.naam.tussenvoegsel);
    contact.phoneNumbers = [new ContactField('mobiel', this.member.mobiel, false)];
    contact.emails = [new ContactField('thuis', this.member.email, false)];
    contact.addresses = [new ContactAddress(false, this.member.huis.naam || 'adres', null, this.member.huis.adres, this.member.huis.woonplaats, null, this.member.huis.postcode, this.member.huis.land)];
    contact.birthday = this.member.geboortedatum;

    contact.save()
      .then(() => {
        this.notifier.notify('Succesvol opgeslagen in contacten.');
        if ((GoogleAnalytics as any)['installed']()) {
          this.googleAnalytics.trackEvent('Members', 'Save', 'New');
        }
      }, () => {
        this.notifier.notify('Opslaan in contacten mislukt.');
      });
  }

  openCalendar() {
    let currentYear = moment().year();
    let date = moment(this.member.geboortedatum).year(currentYear);
    if (date.isBefore()) {
      date.year(currentYear + 1);
    }

    this.calendar.openCalendar(date.toDate());
  }

  openImage() {
    const url = 'https://csrdelft.nl/plaetjes/' + this.member.pasfoto.replace('.vierkant.png', '.jpg');

    if (this.platform.is('cordova')) {
      this.photoViewer.show(url, this.member.naam.formeel, { share: false });
    } else {
      window.open(url, '_blank');
    }
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Member Detail');
    }
  }
}
