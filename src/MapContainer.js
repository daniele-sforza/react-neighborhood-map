import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.resetState = this.resetState.bind(this);
  }

  state = {
    selectedPlace: {},
    activeMarker: {},
    showingInfoWindow: false
  }

  onReady(mapProps, map) {
    map.fitBounds(this.bounds);
  }

  onMarkerClick = (props, marker, e) => {
    this.resetState();
    this.getPlacesDetails(marker);
  }

  getPlacesDetails(marker) {
    let thisRef = this;
    let google = this.props.google;
    var service = new google.maps.places.PlacesService(marker.map);
    service.getDetails({
      placeId: marker.id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        thisRef.setState({ 
          selectedPlace: place,
          activeMarker: marker,
          showingInfoWindow: true});
      }
    });
  }

  resetState() {
    this.setState({
      selectedPlace: {},
      activeMarker: {},
      showingInfoWindow: false
    })
  }

  render() {
    let style = {
      width: '100%',
      height: '100%'
    }

    let points = this.props.points;
    let bounds = new this.props.google.maps.LatLngBounds();
    for (let i = 0; i < points.length; i++) {
      bounds.extend(points[i].location);
    }

    let place = this.state.selectedPlace;

    return (
      <Map 
        google={this.props.google} 
        zoom={13}
        style={style}
        bounds={bounds}
        onReady={this.onReady}
      >

        {
          points.map((point, idx) => (
            <Marker
              key={idx}
              onClick={this.onMarkerClick}
              name={'Current location'}
              position={point.location}
              id={point.placeId}
            />
          ))
        }

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.resetState}>
            <div className='info-window'>
              <h2><a href={place.url} target='_blank'>{place.name}</a></h2>
              <ul className='details'>
                <li><strong>Address:</strong> {place.vicinity}</li>
                <li><strong>Phone No.:</strong> {place.international_phone_number}</li>
                <li><strong>Website: </strong><a href={place.website} target='_blank'>{place.website}</a></li>
              </ul>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAWTp0vIgXvqJNoVk26NxLTzVPQRED2-ZQ'
})(MapContainer)