import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Calendar } from '@ionic-native/calendar';
import { Contact, ContactAddress, ContactField, ContactName, Contacts } from '@ionic-native/contacts';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Store } from '@ngrx/store';
import isPast from 'date-fns/is_past';
import { ActionSheetController, NavParams, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../../app/app.config';
import * as fromRoot from '../../state';
import * as members from '../../state/members/members.actions';
import { Member, MemberDetail } from '../../state/members/members.model';

import { NotificationService } from '../../services/notification/notification';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-member-detail',
  templateUrl: 'member-detail.html'
})
export class MemberDetailPage implements OnInit {
  member$: Observable<Member | null>;
  memberDetail$: Observable<MemberDetail | null>;
  imageUrl = AppConfig.SITE_URL + '/plaetjes/';

  constructor(
    private sanitizer: DomSanitizer,
    private notifier: NotificationService,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private calendar: Calendar,
    private contacts: Contacts,
    private photoViewer: PhotoViewer,
    private navParams: NavParams,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.member$ = this.store.select(fromRoot.getSelectedMember);
    this.memberDetail$ = this.store.select(fromRoot.getSelectedMemberDetail);
    this.load();
  }

  load() {
    const id = this.navParams.get('id') as string;
    this.store.dispatch(new members.SelectAction(id));
  }

  getSafeUrl(scheme: string, target: string): any {
    const url = scheme + ':' + encodeURIComponent(target);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  save(member: MemberDetail) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Opslaan in...',
      buttons: [{
        text: 'Nieuw contact',
        icon: !this.platform.is('ios') ? 'person-add' : undefined,
        handler: () => this.saveNew(member)
      }, {
        text: 'Bestaand contact',
        icon: !this.platform.is('ios') ? 'edit' : undefined,
        handler: () => this.addToExisting(member)
      }, {
        text: 'Annuleer',
        icon: !this.platform.is('ios') ? 'close' : undefined,
        role: 'cancel'
      }]
    });
    actionSheet.present();
  }

  saveNew(member: MemberDetail) {
    const contact = this.contacts.create();
    this.saveContact(contact, member);
  }

  addToExisting(member: MemberDetail) {
    this.contacts.pickContact().then(contact => {
      if (!contact) {
        return;
      }
      this.saveContact(contact, member);
    });
  }

  saveContact(contact: Contact, member: MemberDetail) {
    contact.name = getNameField(member);
    contact.birthday = member.geboortedatum;
    contact.phoneNumbers = [...(contact.phoneNumbers || []), getPhoneField(member)];
    contact.emails = [...(contact.emails || []), getEmailField(member)];
    contact.addresses = [...(contact.addresses || []), getAddressField(member)];

    contact.save().then(
      () => this.notifier.notify('Succesvol opgeslagen in contacten.'),
      () => this.notifier.notify('Opslaan in contacten mislukt.')
    );
  }

  openCalendar(member: MemberDetail) {
    const currentYear = new Date().getFullYear();
    const date = new Date(member.geboortedatum);

    date.setFullYear(currentYear);
    if (isPast(date)) {
      date.setFullYear(currentYear + 1);
    }

    this.calendar.openCalendar(date);
  }

  openImage(member: MemberDetail) {
    const url = this.imageUrl + member.pasfoto.replace('.vierkant.png', '.jpg');

    if (this.platform.is('cordova')) {
      this.photoViewer.show(url, member.naam.formeel, { share: false });
    } else {
      window.open(url, '_blank');
    }
  }
}

function getNameField(member: MemberDetail) {
  return new ContactName(undefined, member.naam.achternaam, member.naam.voornaam, member.naam.tussenvoegsel || undefined);
}

function getPhoneField(member: MemberDetail) {
  return new ContactField('mobiel', member.mobiel, false);
}

function getEmailField(member: MemberDetail) {
  return new ContactField('thuis', member.email, false);
}

function getAddressField(member: MemberDetail) {
  return new ContactAddress(
    false,
    member.huis.naam || 'adres',
    undefined,
    member.huis.adres,
    member.huis.woonplaats,
    undefined,
    member.huis.postcode,
    member.huis.land
  );
}
