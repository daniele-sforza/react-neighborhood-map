import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import FourSquareLogo from './powered-by-foursquare-grey.png'

export class MapContainer extends Component {

  constructor(props) {
    super(props)

    this.mapRef = React.createRef();
  }

  state = {
    selectedPlace: {},
    activeMarker: null,
    markers: [],
    showingInfoWindow: false
  }

  updateState = (place, marker, showInfo) => {
    this.setState({ 
      selectedPlace: place,
      activeMarker: marker,
      showingInfoWindow: showInfo});
    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
  }

  resetState = () => {
    if (this.state.activeMarker) this.state.activeMarker.setAnimation(null);
    this.setState({
      selectedPlace: {},
      activeMarker: null,
      showingInfoWindow: false
    })
    this.props.onSetSelected('');
  }

  componentDidMount() {
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

    if (this.props.selected !== prevProps.selected) {
      let marker = this.state.markers.filter((mrk) => 
        mrk.props.id === this.props.selected
      )
      if (marker.length > 0) this.getPlacesDetails(marker[0].ref.current.marker);
    }
  }

  onReady(mapProps, map) {
    map.fitBounds(this.bounds);
  }

  onMarkerClick = (props, marker, e) => {
    this.props.onSetSelected(marker.id);
  }

  getPlacesDetails(marker) {
    let thisRef = this;
    if (thisRef.state.activeMarker) thisRef.state.activeMarker.setAnimation(null);
    
    let place = {};
    fetch('https://api.foursquare.com/v2/venues/'+ marker.fsId +'?client_id=SIZPDDRGTG1KVY0QGXDKNYJA2M5PV4QSPRGQQAPN3PB3JBZ2&client_secret=0L2Z0DJE3FHF2IPWLIHI25EIZJJO3VHRVGCPKZVGMEGJRJPN&v=20180323')
        // Code for handling API response
        .then(response => response.json())
        .then(data => {
          let venue = data.response.venue;
          
          place.name = venue.name;
          place.url = venue.shortUrl;
          place.bestPhoto = venue.bestPhoto.prefix + 'height200' + venue.bestPhoto.suffix;;
          place.rating = venue.rating;
          place.likes = venue.likes.count;
          place.coordinates = venue.location.lat + ',' + venue.location.lng + '&query_place_id=' + marker.id;
          place.address = venue.location.address + ', ' + venue.location.city + ', ' + venue.location.country;
          place.phone = venue.contact.phone;
          place.website = venue.url;
          place.error = false;

          thisRef.updateState(place, marker, true)
        })
        // Code for handling errors
        .catch(e => place.error = true);
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
            {place.error ?

            <div className="info-window"> 
              <h2>Error loading info</h2>
            </div> :

            <div className="info-window">
              <h2><a href={place.url} target='_blank'>{place.name}</a></h2>
              <img src={place.bestPhoto} alt={place.name + ' best photo'} ></img>
              <ul className="details">
                <li><strong>Rating:</strong> {place.rating}</li>
                <li><strong>Likes:</strong> {place.likes}</li>
                <li><strong>Address: </strong><a href={'https://www.google.com/maps/search/?api=1&query=' + place.coordinates} target='_blank'>{place.address}</a></li>
                <li><strong>Phone No.:</strong> {place.phone}</li>
                <li><strong>Website: </strong><a href={place.website} target='_blank'>{place.website}</a></li>
              </ul>
              <img src={FourSquareLogo} alt="Powered by Foursquare"></img>
            </div>
            }
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAWTp0vIgXvqJNoVk26NxLTzVPQRED2-ZQ'
})(MapContainer)