export class Event {
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
    start: any;
    end: any;
    formattedListDate: string;
    category: string;
    present?: boolean;
  };
}
