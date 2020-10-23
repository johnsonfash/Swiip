import React from 'react'
import { AppSwitch } from '@coreui/react'
import { Input, Row, FormGroup, Form } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { sendFetchAccountData } from '../../store/actions/user';
import { htmlspecialchars_decode, stringRepAll } from '../../utils/utilityFunction'
import { setAuthToken, getAuthUserAll, setAuthLatLng, signOut } from '../../services/Auth';

class CustomerMap extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      defaultAddressBox: '',
      defaultLatLng: { lat: 6.60954222424663, lng: 3.370920970651687 },
      searchBox: '',
      addressBox: '',
      phone: '',
      newLatLng: '',
      pickupStateCountry: '',
      setAsDefault: false,
      notification: '',
      notifDisplay: 'none',
    };
    this.googleMapRef = React.createRef();
    this.initAutocomplete = this.initAutocomplete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMapChange = this.handleMapChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({
      notifDisplay: 'none'
    });
  }

  handleMapChange(value) {
    this.setState(value);
  }

  handleChange(e) {
    switch (e.target.id) {
      case 'pac-input':
        this.setState({
          searchBox: e.target.value
        });
        break;
      case 'customer_address':
        this.setState({
          addressBox: e.target.value
        });
        break;
      case 'phone':
        this.setState({
          phone: e.target.value
        });
        break;
      case 'address_switch':
        this.setState({
          setAsDefault: e.target.checked
        });
        break;
      default:
        break;
    };
  }

  initAutocomplete() {
    const { defaultLatLng } = this.state;
    let map, infoWindow, marker, markers, geoCodeValue;
    const google = window.google;
    const mapToState = this.handleMapChange;
    let myLatlng = defaultLatLng;
    infoWindow = new window.google.maps.InfoWindow();
    map = new google.maps.Map(this.googleMapRef.current, {
      center: myLatlng,
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    map.addListener('click', (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();
      // Create a new InfoWindow.
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      geoCode(mapsMouseEvent.latLng);
      console.log(mapsMouseEvent.latLng.toString());
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];
        // markers.push(marker);
        if (pos.length !== undefined) {
          geoCode(pos);
          console.log('navigation working');
        } else {
          handleLocationError(true, infoWindow, map.getCenter());
        }
        map.setCenter(pos);
      }, () => {
        handleLocationError(true, infoWindow, map.getCenter());
      });

    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(map);
    }

    // Create the search box and link it to the UI element.
    const input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', () => {
      let places = searchBox.getPlaces();
      let pickupStateCountry = '';
      if (places.length === 0) {
        return;
      }
      // console.log(object)
      // mapToState({ addressBox: places[0].formatted_address });
      pickupStateCountry = places[0].address_components[places[0].address_components.length - 2].long_name + ', ' +
        places[0].address_components[places[0].address_components.length - 1].long_name;

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      let bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        mapToState({ addressBox: places[0].name + ', ' + places[0].vicinity, newLatLng: place.geometry.location.toString(), pickupStateCountry });
        // console.log(place.geometry.location + places[0].formatted_address);
        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
        map.setCenter(place.geometry.location);
      });
      map.fitBounds(bounds);
      map.setZoom(17);
    });

    function geoCode(latitudeLogitude) {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'location': latitudeLogitude }, (results, status) => {
        let notification = 'No address results found. Please fill it in';
        let notifDisplay = 'block';
        let pickupStateCountry = '';
        geoCodeValue = '';
        if (status === 'OK') {
          if (results[0]) {
            map.setZoom(17);
            marker = new google.maps.Marker({
              position: latitudeLogitude,
              map: map,
              title: results[0].formatted_address
            });
            markers.push(marker);
            infoWindow.setPosition(latitudeLogitude);
            infoWindow.setContent('Is this your location? <br/> click on map to change');
            infoWindow.open(map, marker);
            geoCodeValue = results[0].formatted_address;
            if (geoCodeValue === undefined) {
              geoCodeValue = '';
            } else {
              notification = '';
              notifDisplay = 'none';
            }
            // console.log(results[0].address_components[results[0].address_components.length - 2].long_name + 
            //   results[0].address_components[results[0].address_components.length - 1].long_name);
            pickupStateCountry = results[0].address_components[results[0].address_components.length - 2].long_name + ', ' +
              results[0].address_components[results[0].address_components.length - 1].long_name;
            // console.log(results)
          }
        } else {
          notification = 'Geocoder failed due to: ' + status + '. Please fill in the address field';
          // window.alert('Geocoder failed due to: ' + status);
        }
        mapToState({ addressBox: geoCodeValue, newLatLng: latitudeLogitude, notifDisplay, notification, pickupStateCountry })
      });
    }

  }

  handleSubmit(e) {
    e.preventDefault();
    const { defaultAddressBox, addressBox, newLatLng, setAsDefault, pickupStateCountry, phone } = this.state;
    const pickupLatLng = stringRepAll({ "(": '{"lat": ', ")": '}', " ": ' "lng": ' }, newLatLng);
    const { id, user_type, findBy, token } = getAuthUserAll();
    if ((defaultAddressBox === addressBox && setAsDefault === false) || (newLatLng === '' && setAsDefault === false) ||
      (addressBox === '' && setAsDefault === false)) {
      this.setState({ notifDisplay: 'block', notification: 'Please type in the address box, or zoom into the map to select a marker!' });
    } else {
      if (pickupLatLng === '' || pickupStateCountry === '') {
        this.setState({
          notifDisplay: 'block',
          notification: 'Please use the search box or point on the map'
        })
      } else {
        const { sendFetchData } = this.props
        const pickupAddress = addressBox;
        const data = JSON.stringify({ id, findBy, token, setAsDefault, pickupAddress, pickupLatLng, pickupStateCountry, phone });
        if (setAsDefault === true) {
          setAuthLatLng(pickupLatLng);
        }
        let formData = new FormData();
        formData.append('request', 'change_pickupAddress');
        formData.append('user_type', user_type);
        formData.append('data', encodeURIComponent(data));
        sendFetchData(formData);
        // console.log(data)
      }
    }
  }

  componentDidMount() {
    if (this.props.location.data !== undefined) {
      const { address, latLng, phone, turnOn } = this.props.location.data;
      const defaultAddressBox = htmlspecialchars_decode(address);
      const defaultLatLng = JSON.parse(htmlspecialchars_decode(latLng));
      this.setState({ defaultAddressBox, defaultLatLng, addressBox: defaultAddressBox, phone, setAsDefault: turnOn });
    }
    const script = document.getElementById('googleMapScript');
    if (document.contains(script)) {
      this.initAutocomplete()
      return null;
    }
    let googleScript = document.createElement('script');
    // due to theft and billing, use your google map api key or contact @johnerry on git or fashanutosin7@gmail.com for 1 day test key
    googleScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBKHdFymwu91lTBTQBDgltrFaXPD6FxY2g&libraries=places';
    googleScript.async = true;
    googleScript.setAttribute('id', 'googleMapScript');
    window.document.body.appendChild(googleScript);
    googleScript.addEventListener('load', this.initAutocomplete);
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      const { userloading, userData } = this.props.userData;
      if (userData.length !== 0) {
        if (userData.error === 'false' && userloading === 'done') {
          setAuthToken(userData.data[0].token);
          this.props.history.goBack();
        } else {
          if (userData.logoutUser === 'true') {
            signOut();
          }
          this.setState({
            notifDisplay: 'block',
            notification: userData.errorMessage
          });
        }
      };
    };
  };



  render() {
    const { searchBox, addressBox, notifDisplay, notification, phone, setAsDefault } = this.state
    let buttonText = '';
    const { userloading } = this.props.userData;
    userloading === 'done' ? (buttonText = 'SAVE') :
      (userloading === 'true' ? (buttonText = <div id="loader"></div>) : (buttonText = 'SAVE'));
    return (
      <Row>
        <div className="container_map">
          <div id="map" ref={this.googleMapRef}></div>
          <Form onSubmit={this.handleSubmit} method="post">
            <FormGroup>
              <Input id="pac-input" value={searchBox} onChange={this.handleChange} className="controls" type="text" placeholder="Search" />
              <span id="switch" title="Set as default address"><AppSwitch onChange={this.handleChange} id="address_switch" className={'mx-1'} variant={'3d'} color={'primary'} size={'sm'} checked={setAsDefault} /></span>
            </FormGroup>
            <FormGroup>
              <Input id="phone" value={phone} style={{ maxWidth: '18em', border: '0.13em solid lightgrey', color: 'black', fontSize: '1.2em' }} type="number" onChange={this.handleChange} placeholder="Phone" required />
            </FormGroup>
            <FormGroup>
              <Input className="account_address" id="customer_address" value={addressBox} onChange={this.handleChange} type="textarea" placeholder="Adress  ( use google map, then type in additional information here )" required />
            </FormGroup>
            <button type="submit" className="btn_save btn">{buttonText}</button>
          </Form>
        </div>
        <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
      </Row>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendFetchData: (data) => dispatch(sendFetchAccountData(data))
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(CustomerMap);
