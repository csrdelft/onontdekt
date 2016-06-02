import { DomSanitizationService } from '@angular/platform-browser';
import { ActionSheet, NavController, NavParams, Page, Platform } from 'ionic-angular';
import { Contacts, Calendar } from 'ionic-native';
import * as moment from 'moment';
import 'moment/locale/nl';

import { NotificationService } from '../../services/notification';
import { Member } from '../../models/member';


@Page({
  templateUrl: 'build/pages/member-detail/member-detail.html'
})
export class MemberDetailPage {
  member: Member;

  constructor(
    private sanitizer: DomSanitizationService,
    private notifier: NotificationService,
    private platform: Platform,
    private nav: NavController,
    navParams: NavParams
  ) {
    this.member = navParams.data;

    let date = new Date(this.member.geboortedatum);
    this.member.geboortedatumText = moment(date).format('LL');
    this.member.geboortedatum = date;
  }

  getLocationUrl(huis) {
    let q = encodeURIComponent(this.member.huis.adres + ', ' + this.member.huis.woonplaats);
    let url = this.platform.is('ios') ? 'maps://maps.apple.com/?q=' : 'geo:0,0?q=';
    return this.sanitizer.bypassSecurityTrustUrl(url + q);
  }

  getSafeUrl(scheme: string, target: string) {
    let url = scheme + ':' + encodeURIComponent(target);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  save() {
    let actionSheet = ActionSheet.create({
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
    this.nav.present(actionSheet);
  }

  saveNew() {
    let contact = {
      name: {
        familyName: this.member.naam.voornaam,
        middleName: this.member.naam.tussenvoegsel,
        givenName: this.member.naam.achternaam
      },
      phoneNumbers: [{
        type: 'mobiel',
        value: this.member.mobiel,
        pref: false
      }],
      emails: [{
        type: 'thuis',
        value: this.member.email,
        pref: false
      }],
      addresses: [{
        type: this.member.huis.naam || 'adres',
        streetAddress: this.member.huis.adres,
        locality: this.member.huis.woonplaats,
        postalCode: this.member.huis.postcode,
        country: this.member.huis.land
      }],
      birthday: this.member.geboortedatum
    };

    let createdContact = Contacts.create(contact);
    if (typeof createdContact === 'Contact') {
      createdContact.save(
        contact => {
          this.notifier.notify('Succesvol opgeslagen in contacten');
        },
        err => {
          console.log(err);
          this.notifier.notify('Opslaan in contacten mislukt');
        }
      );
    } else {
      this.notifier.notify('Opslaan in contacten mislukt');
    }
  }

  openCalendar() {
    let currentYear = moment().year();
    let date = moment(this.member.geboortedatum).year(currentYear);
    if (date.isBefore()) {
      date.year(currentYear + 1);
    }

    Calendar.openCalendar(date.toDate());
  }
}
