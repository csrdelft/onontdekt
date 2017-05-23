export interface Member extends MemberName {
  id: string;
}

export interface MemberDetail {
  id: string;
  naam: MemberName & {
    formeel: string;
  };
  geboortedatum: Date;
  huis: {
    naam: null | string;
    adres: string;
    woonplaats: string;
    postcode: string;
    land: string;
  };
  email: string;
  mobiel: string;
  pasfoto: string;
  lichting: number;
  verticale: string;
  studie: {
    naam: string;
    sinds: number;
  };
}

export interface MemberName {
  voornaam: string;
  tussenvoegsel: null | string;
  achternaam: string;
}
