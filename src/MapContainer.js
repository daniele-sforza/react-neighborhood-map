import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {

  state = {
    selectedPlace: {},
    activeMarker: {},
    markers: [],
    showingInfoWindow: false
  }

  updateState = (place, marker, showInfo) => {
    this.setState({ 
      selectedPlace: place,
      activeMarker: marker,
      showingInfoWindow: showInfo});
    this.props.onSetSelected(marker.id);
  }

  resetState = () => {
    this.setState({
      selectedPlace: {},
      activeMarker: {},
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
        ref={React.createRef()}
      />
    ))
  })
  }

  componentDidUpdate(prevProps) {
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
    // this.resetState();
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
        thisRef.updateState(place, marker, true)
      }
    });
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
        zoom={13}
        className="map-cnt"
        style={style}
        containerStyle={containerStyle}
        bounds={bounds}
        onReady={this.onReady}
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
              <h2><a href={place.url} target='_blank'>{place.name}</a></h2>
              <ul className="details">
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