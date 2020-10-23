
import React from 'react'
import { Row, Col, Button } from 'reactstrap';
import { getAuthLatLng } from '../../services/Auth'
let map, panorama, infoWindow, google;
let changeRouteNow = false;
let directionsRenderer;
let directionsService;

class AgentMap extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      personOf: '',
      email: '',
      phone: '',
      pickupAddress: '',
      pickupStateCountry: '',
      defaultLatLng: '',
      route: '',
    }

    this.changeState = this.changeState.bind(this);
    this.googleMapRef = React.createRef();
    this.rightPanel = React.createRef();
    this.initMap = this.initMap.bind(this);
    this.addRoute = this.addRoute.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.processSVData = this.processSVData.bind(this);
    this.changeRoute = this.changeRoute.bind(this);
  }
  
  changeState(data) {
    this.setState(data)
  }

  changeRoute() {
    changeRouteNow = true;
    this.setState({
      defaultLatLng: JSON.parse(getAuthLatLng())
    })
    map = panorama = infoWindow = google = '';
    this.initMap();
  }

  componentDidMount() {
    if (this.props.location.data === undefined) {
      this.props.history.push('/pickups/new');
    } else {
      const { personOf, email, phone, pickupAddress, pickupStateCountry, defaultLatLng, route } = this.props.location.data;
      this.setState({
        personOf,
        email,
        phone,
        pickupAddress,
        pickupStateCountry,
        defaultLatLng,
        route
      });
      const script = document.getElementById('googleMapAgentScript');
      if (document.contains(script)) {
        this.initMap();
        return null;
      }
      let googleScript = document.createElement('script');
      // API key invalid, add yours or contact @johnerry on git or fashanutosin7@gmail.com
      googleScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBKHdFymwu91lTBTQBDgltrFaXPD6FxY2g';
      googleScript.async = true;
      googleScript.setAttribute('id', 'googleMapAgentScript');
      window.document.body.appendChild(googleScript);
      googleScript.addEventListener('load', this.initMap);
    }
  }

  initMap() {
    const { defaultLatLng } = this.state;
    google = window.google;
    if (directionsRenderer === undefined) {
      directionsRenderer = new google.maps.DirectionsRenderer();
      directionsService = new google.maps.DirectionsService();
    }
    const addRoute = this.addRoute;
    const changeState = this.changeState;
    const handleLocationError = this.handleLocationError;
    const processSVData = this.processSVData;
    const sv = new google.maps.StreetViewService();
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
    // Seting up the map.
    map = new google.maps.Map(this.googleMapRef.current, {
      center: defaultLatLng,
      zoom: 16,
      streetViewControl: false
    });

    infoWindow = new google.maps.InfoWindow();
    // Trying geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (changeRouteNow === false) {
         changeState({
           defaultLatLng: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
         });
        }

        if (defaultLatLng !== undefined) {
          addRoute();
        }
      }, () => {
        addRoute();
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      addRoute();
      // If browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
    // Set the initial Street View camera to the center of the map
    map.addListener('click', (event) => {
      sv.getPanorama({ location: event.latLng, radius: 50 }, processSVData);
    });

  }

  addRoute() {
    const { route, defaultLatLng } = this.state;
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(this.rightPanel.current);
    directionsService.route({
      origin: defaultLatLng,
      destination: route,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  processSVData(data, status) {
    let marker;
    if (status === 'OK') {
      if (data !== null) {
        marker = new google.maps.Marker({
          position: data.location.latLng,
          map: map,
          title: data.location.description
        });
      }

      panorama.setPano(data.location.pano);
      panorama.setPov({
        heading: 270,
        pitch: 0
      });
      panorama.setVisible(true);

      marker.addListener('click', () => {
        const markerPanoID = data.location.pano;
        // Set the Pano to use the passed panoID.
        panorama.setPano(markerPanoID);
        panorama.setPov({
          heading: 270,
          pitch: 0
        });
        panorama.setVisible(true);
      });
    } else {
      console.error('Street View data not found for this location.');
    }
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  render() {
    const { personOf, email, phone, pickupAddress, pickupStateCountry } = this.state;
    return (
      <Row>
        <Col xs="12" md="5" style={{ marginBottom: '2em' }}>
          <div className="agentDetailer name"><span role="img" aria-label="name">&#128100;</span>{personOf}</div>
          <div className="agentDetailer"><span role="img" aria-label="email">&#9993;</span> <a href={"mailto:"+email}>{email}</a></div>
          <div className="agentDetailer"><span role="img" aria-label="name">&#9742;</span> <a href={"tel:"+phone}>{phone}</a></div>
          <div className="agentDetailer name"><span role="img" aria-label="address">&#9873;</span>{pickupAddress}</div>
          <p>{pickupStateCountry}</p>
          <Button color="dark" className="px-3" onClick={this.changeRoute}>Default Location</Button>
        </Col>
        <Col xs="12" md="7">
          <div className="container_agent">
            <div className="map_container">
              <div id="map" ref={this.googleMapRef}></div>
            </div>
            {/* ROUTE PANEL */}
            <input type="checkbox" id="one" name="" value="" />
            <label htmlFor="one" className="one">
              <div type="button" className="route_button" name="button">Route</div>
            </label>
            <span className="horizontal_rule"></span>
            <div className="route">
              <div id="right-panel" ref={this.rightPanel}></div>
            </div>
            {/* ROUTE PANEL */}
            <input type="checkbox" id="two" name="" value="" />
            <label htmlFor="two" className="two">
              <div type="button" name="button" className="street_button" >Imagery</div>
            </label>
            <div className="street">
              <div id="pano"></div>
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
export default AgentMap;
