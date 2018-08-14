import React, { Component } from 'react';
import Logo from './logo.svg'
import List from './List.js';
import MapContainer from './MapContainer.js';
import './App.css';

class App extends Component {
  render() {
    let points = [
      { name: 'Ma Che Siete Venuti A Fà', placeId: 'ChIJNfxaD0dgLxMRtGBMWLVSbBI' , location: { lat: 41.8917463, lng: 12.4669847 } },
      { name: 'Open Baladin Roma', placeId: 'ChIJ2ZqDxUhgLxMR1L9c5ZoryBg' , location: { lat: 41.893488, lng: 12.4724373 } },
      { name: 'Stavio', placeId: 'ChIJuzIfvSdgLxMRZCtEdHt7n3E' , location: { lat: 41.8720929, lng: 12.4683256 } },
      { name: 'Birrificio Marconi', placeId: 'ChIJ9TugWpuKJRMRWdRFbAD47m8' , location: { lat: 41.8648677, lng: 12.4695709 } },
      { name: 'Birrifugio Trastevere', placeId: 'ChIJoWOjmyNgLxMRvhKq04qWm4I' , location: { lat: 41.8776079, lng: 12.4637572 } }
    ];

    return (
      <div className="App">
        {/* <List
          points={points}
        /> */}

        <header className="App-header">
          <img src={Logo} className="App-logo" alt="logo" />
          <h1 className="App-title">NeighBEERhood Map</h1>
        </header>

        <MapContainer
          points={points}
        />
      </div>
    );
  }
}

export default App;
