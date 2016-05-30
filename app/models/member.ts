export class Member {
  id: number;
  naam: {
    voornaam: string;
    tussenvoegsel: string;
    achternaam: string;
  };
  geboortedatum: any;
  geboortedatumText: string;
  huis: {
    naam: string;
    adres: string;
    woonplaats: string;
    postcode: string;
    land: string;
  };
  email: string;
  mobiel: string;
}
