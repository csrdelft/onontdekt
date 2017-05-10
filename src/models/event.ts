// tslint:disable:variable-name

export class Event {
  UUID: string;
  id: number;
  maaltijd_id: number;
  titel: string;
  naam: string;
  soort: string;
  datum: string;
  tijd: string;
  locatie: string;
  samenvatting: string;
  omschrijving: string;
  beschrijving: string;
  gesloten: string;
  prijs: string;
  begin_moment: Date;
  eind_moment: Date;
  aanmelden_vanaf: Date;
  aanmelden_tot: Date;
  afmelden_tot: Date;
  _meta: {
    start: Date;
    end: Date;
    formattedListDate: string;
    category: 'maaltijd' | 'activiteit' | 'agenda';
    present?: boolean;
  };
}
