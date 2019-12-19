import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import FourSquareLogo from './powered-by-foursquare-grey.png'

export class MapContainer extends Component {

  constructor(props) {
    super(props)

    this.mapRef = React.createRef();    // create map component ref
  }

  state = {
    selectedPlace: {},        // place info to fill via Foursquare API
    activeMarker: null,       // active marker to pass to the InfoWindow component
    markers: [],              // list of marker components
    showingInfoWindow: false  // toggle visibility of the InfoWindow component
  }

  // save current POI data, active marker and animate the marker  
  updateState = (place, marker, showInfo) => {
    this.setState({ 
      selectedPlace: place,
      activeMarker: marker,
      showingInfoWindow: showInfo});
    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
  }

  // reset state when no POI selected
  resetState = () => {
    if (this.state.activeMarker) this.state.activeMarker.setAnimation(null);
    this.setState({
      selectedPlace: {},
      activeMarker: null,
      showingInfoWindow: false
    })
    this.props.onSetSelected('');
  }

  // create markers and populate markers list on state
  componentDidMount() {
    window.gm_authFailure = this.gm_authFailure;
    
    this.setState({markers: this.props.points.map((point, idx) => (
      <Marker
        key={idx}
        onClick={this.onMarkerClick}
        name={point.name}
        position={point.location}
        id={point.placeId}
        fsId={point.fsId}
        ref={React.createRef()}
      />
    ))
  })
  }

  componentDidUpdate(prevProps) {
    // on filter change, show/hide markers based on updated filtered list
    if (this.props.points !== prevProps.points) {
      this.state.markers.forEach(mrk => {
        let hide = true;
        for (let poi of this.props.points) {
          if (mrk.props.id === poi.placeId) {
            hide = false;
            break;
          }
        }
        hide ? mrk.ref.current.marker.setMap(null) : mrk.ref.current.marker.setMap(this.mapRef.current.map)
      });
    }

    // on selection change, update marker and get POI details
    if (this.props.selected !== prevProps.selected) {
      let marker = this.state.markers.filter((mrk) => 
        mrk.props.id === this.props.selected
      )
      if (marker.length > 0) this.getPlacesDetails(marker[0].ref.current.marker);
    }
  }

  gm_authFailure(){
    document.querySelector('.gm-err-title').innerText = "There was an error loading Google Maps!"
    document.querySelector('.gm-err-message').innerHTML = "<a href='javascript:window.location.reload(true)'>Try again</a>"
  }

  onReady(mapProps, map) {
    map.fitBounds(this.bounds);
  }

  // set selected id on marker click
  onMarkerClick = (props, marker, e) => {
    this.props.onSetSelected(marker.id);
  }

  getPlacesDetails(marker) {
    let thisRef = this;
    if (thisRef.state.activeMarker) thisRef.state.activeMarker.setAnimation(null);    // disable animation on current marker
    
    // fetch data from Foursquare
    let place = {};
    fetch('https://api.foursquare.com/v2/venues/'+ marker.fsId +'?client_id=SIZPDDRGTG1KVY0QGXDKNYJA2M5PV4QSPRGQQAPN3PB3JBZ2&client_secret=0L2Z0DJE3FHF2IPWLIHI25EIZJJO3VHRVGCPKZVGMEGJRJPN&v=20180323')
        // handling API response
        .then(response => response.json())
        .then(data => {
          let venue = data.response.venue;
          
          // populate place info
          place.name = venue.name;
          place.url = venue.shortUrl;
          place.bestPhoto = venue.bestPhoto.prefix + 'height100' + venue.bestPhoto.suffix;;
          place.rating = venue.rating;
          place.likes = venue.likes.count;
          place.coordinates = venue.location.lat + ',' + venue.location.lng + '&query_place_id=' + marker.id;
          place.address = venue.location.address + ', ' + venue.location.city + ', ' + venue.location.country;
          place.phone = venue.contact.phone;
          place.website = venue.url;

          // update state
          thisRef.updateState(place, marker, true)
        })
        // handling errors
        .catch(e => alert("Can't load data from FourSquare. Check your connection"));
  }

  render() {
    let style = {
      width: '100%',
      height: '100%'
    }

    let containerStyle = {
      height: '80%'
    }

    let points = this.props.points;
    let bounds = new this.props.google.maps.LatLngBounds();
    for (let i = 0; i < points.length; i++) {
      bounds.extend(points[i].location);
    }

    let place = this.state.selectedPlace;
    let markers = this.state.markers;

    return (
      <Map 
        google={this.props.google} 
        zoom={15}
        className="map-cnt"
        style={style}
        containerStyle={containerStyle}
        bounds={bounds}
        onReady={this.onReady}
        ref={this.mapRef}
      >

        {
          markers.map((marker) => (
            marker
          ))
        }

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.resetState}>
            <div className="info-window">
              <h2><a href={place.url} target='_blank' rel='noopener noreferrer'>{place.name}</a></h2>
              <img src={place.bestPhoto} alt={place.name + ' best photo'} ></img>
              <ul className="details">
                <li><strong>Rating:</strong> {place.rating}</li>
                <li><strong>Likes:</strong> {place.likes}</li>
                <li><strong>Address: </strong><a href={'https://www.google.com/maps/search/?api=1&query=' + place.coordinates} target='_blank' rel='noopener noreferrer'>{place.address}</a></li>
                <li><strong>Phone No.:</strong> {place.phone}</li>
                <li><strong>Website: </strong><a href={place.website} target='_blank' rel='noopener noreferrer'>{place.website}</a></li>
              </ul>
              <img src={FourSquareLogo} alt="Powered by Foursquare"></img>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

const LoadingContainer = (props) => (
  <div className="loading">Loading... If it's taking too long check your connection.</div>
)

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAWTp0vIgXvqJNoVk26NxLTzVPQRED2-ZQ',
  LoadingContainer: LoadingContainer
})(MapContainer)