import { Component } from '@angular/core';


@Component({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage {

  mapData: Array<{name: string, lat: number, lng: number, center?: boolean}> = [{
    'name': 'Confide',
    'lat': 52.0060583,
    'lng': 4.36026
  }, {
    'name': 'Hostel A Plus',
    'lat': 50.09014,
    'lng': 14.43717
  }, {
    'name': 'Diner U Fleku',
    'lat': 50.07891,
    'lng': 14.41693,
    'center': true
  }, {
    'name': 'Praagse Burcht',
    'lat': 50.090216,
    'lng': 14.399579
  }, {
    'name': 'Wijnproeverij kasteel Melnik',
    'lat': 50.35081,
    'lng': 14.47299
  }, {
    'name': 'Concentratiekamp Terezín',
    'lat': 50.51382,
    'lng': 14.16475
  }];

  constructor() {}

  ionViewLoaded() {
    let mapEle = document.getElementById('map');

    let map = new google.maps.Map(mapEle, {
      center: this.mapData.find(d => d.center),
      zoom: 11
    });

    this.mapData.forEach(markerData => {
      let infoWindow = new google.maps.InfoWindow({
        content: `<div class="poi-info-window gm-style"><div class="title">${markerData.name}</div></div>`
      });

      let latlng = new google.maps.LatLng(markerData.lat, markerData.lng);

      let marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: markerData.name
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    google.maps.event.addListenerOnce(map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }
}
