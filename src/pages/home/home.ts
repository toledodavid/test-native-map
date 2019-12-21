import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapOptions, GoogleMapsEvent, MyLocation, MyLocationOptions } from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: GoogleMap;

  latitud: number = 19.265056;
  longitud: number = -103.710556;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController) {

  }

  ionViewDidEnter() {
    this.loadMap();
  }


  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.latitud,
          lng: this.longitud
        },
        zoom: 16,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            title: 'Magma',
            icon: 'red',
            animation: 'DROP',
            draggable: true,
            position: {
              lat: this.latitud,
              lng: this.longitud
            }
          }).then(marker => {
            /*marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                this.alerta();
            });*/

            marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe(data => {
              this.modificar_coordenadas(data[0].lat, data[0].lng);
            });

          });
      });
  }

  alerta(){
    this.alertCtrl.create({
          title: 'Magmalabs',
          subTitle: 'AV. Constitucion',
          buttons: ["Ok"]
    }).present();
    return;
  }

  modificar_coordenadas(lat:number, lng:number) {
    /*this.latitud = lat;
    this.longitud = lng;
    console.log(this.latitud, ' , ', this.longitud);*/
    console.log(lat, ' , ', lng);
  }


  my_location() {
    this.map.clear();

    // Get the location of you
    let options: MyLocationOptions = {
      enableHighAccuracy: true
    };


    this.map.getMyLocation(options)
      .then((location: MyLocation) => {
        console.log('location', location);

        // Move the map camera to the location with animation
        this.map.animateCamera({
          target: [
            location.latLng,
          ],
          tilt: 30,
          zoom: 16,
          duration: 2000
        });

        this.map.addMarker({
          title: 'Magma',
          icon: 'red',
          animation: 'DROP',
          draggable: true,
          position: {
            lat: location.latLng.lat,
            lng: location.latLng.lng
          }
        }).then(marker => {
          marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe(data => {
            this.modificar_coordenadas(data[0].lat, data[0].lng);
          });

        });

      }, error => this.alertUbication() );
  }

  alertUbication(){
    this.toastCtrl.create({
      message: 'Al parecer no has activado tu ubicación. Por favor verifica que tengas activada la ubicación de tu dispositivo móvil.',
      position: 'middle',
      showCloseButton: true,
      closeButtonText: 'Ok'
    }).present();
  }

}
