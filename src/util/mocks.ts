export const postsMock = [{
  post_id: 1,
  draad_id: 1,
  uid: 'x037',
  tekst: 'Example message content',
  datum_tijd: new Date('2017-05-02T10:59:03Z'),
  laatst_gewijzigd: new Date('2017-05-02T10:59:03Z'),
  uid_naam: 'Mr. User'
}];

export const topicsMock = [{
  draad_id: 1,
  forum_id: 1,
  gedeeld_met: null,
  uid: 'x037',
  titel: 'Example Topic',
  datum_tijd: new Date('2017-04-03 17:21:36'),
  laatst_gewijzigd: new Date('2017-05-13 00:38:03'),
  laatste_post_id: 1,
  laatste_wijziging_uid: 'x037',
  ongelezen: 0,
  laatste_post: postsMock[0],
  laatste_wijziging_naam: postsMock[0].uid_naam
}];

export const membersMock = [{
  id: 'x037',
  voornaam: 'Demo',
  tussenvoegsel: undefined,
  achternaam: 'User'
}];

export const memberDetailMock = {
  id: 'x037',
  naam: {
    voornaam: 'Demo',
    tussenvoegsel: undefined,
    achternaam: 'User',
    formeel: 'Mr. User'
  },
  pasfoto: 'pasfoto\/x037.vierkant.png',
  geboortedatum: new Date('2000-01-01'),
  email: 'noop@gmail.com',
  mobiel: '123456789',
  huis: {
    naam: 'Location Name',
    adres: 'Street Number',
    postcode: 'Postal Code',
    woonplaats: 'City',
    land: 'Country'
  },
  studie: {
    naam: 'Education',
    sinds: '2000'
  },
  lichting: '2011',
  verticale: 'Group'
};
