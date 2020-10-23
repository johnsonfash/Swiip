
// import React, { Component } from 'react'
// import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, Label, InputGroupAddon, InputGroupText, Row, FormGroup } from 'reactstrap';

// var map, infoWindow, marker, markers;

// class CustomerMap extends React.PureComponent {
//   constructor(props) {
//     super(props)

//     this.state = {

//     }
//     this.googleMapRef = React.createRef()
//     this.initAutocomplete = this.initAutocomplete.bind(this)
//     // this.geoCode = this.geoCode.bind(this)
//   }


//   componentDidMount() {
//     let googleScript = document.createElement('script');
//     googleScript.src = "https://maps.googleapis.com/maps/api/js?key=xAIzaSyAgD3spwqPBOEayWe0qMEYbkXYg8glLlTY&libraries=places"
//     googleScript.async = true
//     window.document.body.appendChild(googleScript)
//     googleScript.addEventListener('load', this.initAutocomplete)
//   }

//   initAutocomplete() {
//     var myLatlng = { lat: 6.60954222424663, lng: 3.370920970651687 };
//     infoWindow = new google.maps.InfoWindow;
//     map = new google.maps.Map(this.googleMapRef.current, {
//       center: myLatlng,
//       zoom: 10,
//       mapTypeId: 'roadmap'
//     });

//     // infoWindow = new google.maps.InfoWindow(
//     //   { content: 'Is this your location? <br/> click to select exact', position: myLatlng });
//     // infoWindow.open(map);


//     map.addListener('click', function (mapsMouseEvent) {
//       // Close the current InfoWindow.
//       infoWindow.close();

//       // Create a new InfoWindow.
//       markers.forEach(function (marker) {
//         marker.setMap(null);
//       });

//       geoCode(mapsMouseEvent.latLng);
//       console.log(mapsMouseEvent.latLng.toString());
//     });

//     if (navigator.geolocation) {

//       navigator.geolocation.getCurrentPosition(function (position) {
//         var pos = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         };
//         // marker = new google.maps.Marker({
//         //   position: pos,
//         //   map: map,
//         //   title: 'Your Location!'
//         // });

//         // infoWindow.setPosition(pos);
//         // infoWindow.setContent('Is this your location? <br> click on map to change');
//         // infoWindow.open(map, marker);

//         markers.forEach(function (marker) {
//           marker.setMap(null);
//         });
//         markers = [];
//         geoCode (pos)
//         // markers.push(marker);
//         console.log(pos.toString());
//         console.log(pos.toString());
//         map.setCenter(pos);
//       }, function () {
//         handleLocationError(true, infoWindow, map.getCenter());
//       });

//     } else {
//       // Browser doesn't support Geolocation
//       handleLocationError(false, infoWindow, map.getCenter());
//     }
//     function   handleLocationError (browserHasGeolocation, infoWindow, pos) {
//       infoWindow.setPosition(pos);
//       infoWindow.setContent(browserHasGeolocation ?
//       'Error: The Geolocation service failed.' :
//       'Error: Your browser doesn\'t support geolocation.');
//       infoWindow.open(map);
//     }

//     // Create the search box and link it to the UI element.
//     var input = document.getElementById('pac-input');
//     var searchBox = new google.maps.places.SearchBox(input);
//     map.addListener('bounds_changed', function () {
//       searchBox.setBounds(map.getBounds());
//     });

//     markers = [];
//     // Listen for the event fired when the user selects a prediction and retrieve
//     // more details for that place.
//     searchBox.addListener('places_changed', function () {
//       var places = searchBox.getPlaces();

//       if (places.length == 0) {
//         return;
//       }

//       // Clear out the old markers.
//       markers.forEach(function (marker) {
//         marker.setMap(null);
//       });
//       markers = [];

//       // For each place, get the icon, name and location.
//       var bounds = new google.maps.LatLngBounds();
//       places.forEach(function (place) {
//         if (!place.geometry) {
//           console.log("Returned place contains no geometry");
//           return;
//         }

//         console.log(place.geometry.location.toString());
//         // Create a marker for each place.
//         markers.push(new google.maps.Marker({
//           map: map,
//           title: place.name,
//           position: place.geometry.location
//         }));

//         if (place.geometry.viewport) {
//           // Only geocodes have viewport.
//           bounds.union(place.geometry.viewport);
//         } else {
//           bounds.extend(place.geometry.location);
//         }
//         map.setCenter(place.geometry.location);
//       });
//       // map.fitBounds(bounds);
//       map.setZoom(16);
//     });

//     function geoCode (latitudeLogitude) {
//       var geocoder = new google.maps.Geocoder;
//       geocoder.geocode({ 'location': latitudeLogitude }, function (results, status) {
//         if (status === 'OK') {
//           if (results[0]) {
//             map.setZoom(16);
//             marker = new google.maps.Marker({
//               position: latitudeLogitude,
//               map: map,
//               title: results[0].formatted_address
//             });
//             markers.push(marker);
//             infoWindow.setPosition(latitudeLogitude);
//             infoWindow.setContent('Is this your location? <br> click on map to change');
//             infoWindow.open(map, marker);
//             console.log(results[0].formatted_address);
//           } else {
//             window.alert('No results found');
//           }
//         } else {
//           window.alert('Geocoder failed due to: ' + status);
//         }
//       });
//     }
//   }

//   // geoCode (latitudeLogitude) {
//   //   var geocoder = new google.maps.Geocoder;
//   //   geocoder.geocode({ 'location': latitudeLogitude }, function (results, status) {
//   //     if (status === 'OK') {
//   //       if (results[0]) {
//   //         map.setZoom(16);
//   //         marker = new google.maps.Marker({
//   //           position: latitudeLogitude,
//   //           map: map,
//   //           title: results[0].formatted_address
//   //         });
//   //         markers.push(marker);
//   //         infoWindow.setPosition(latitudeLogitude);
//   //         infoWindow.setContent('Is this your location? <br> click on map to change');
//   //         infoWindow.open(map, marker);
//   //         console.log(results[0].formatted_address);
//   //       } else {
//   //         window.alert('No results found');
//   //       }
//   //     } else {
//   //       window.alert('Geocoder failed due to: ' + status);
//   //     }
//   //   });
//   // }

//   render() {
//     return (
//       <React.Fragment>
//         <div id="map" ref={this.googleMapRef}></div>
//         <FormGroup>
//           <Input id="pac-input" className="controls" type="text" placeholder="Search Box" />
//         </FormGroup>
//       </React.Fragment>
//     )
//   }
// }
// export default CustomerMap