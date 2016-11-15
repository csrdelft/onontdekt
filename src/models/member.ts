export class Member {
  id: number;
  naam: {
    voornaam: string;
    tussenvoegsel: string;
    achternaam: string;
    formeel: string;
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
  pasfoto: string;
  lichting: string;
  verticale: string;
  studie: {
    naam: string;
    sinds: string;
  };
}

export interface IMemberShort {
  id: number;
  voornaam: string;
  tussenvoegsel: string;
  achternaam: string;
  hide: boolean;
};

export interface IMemberGroup {
  char: string;
  members: IMemberShort[];
  hide: boolean;
};
