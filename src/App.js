import React, { Component } from 'react';
import Logo from './logo.svg'
import List from './List.js';
import MapContainer from './MapContainer.js';
import './App.css';

class App extends Component {
  
  state = {
    points: [
      { name: 'Ma Che Siete Venuti A Fà', placeId: 'ChIJNfxaD0dgLxMRtGBMWLVSbBI' , location: { lat: 41.8917463, lng: 12.4669847 }, fsId: '4b157a56f964a52071ad23e3' },
      { name: 'Open Baladin Roma', placeId: 'ChIJ2ZqDxUhgLxMR1L9c5ZoryBg' , location: { lat: 41.893488, lng: 12.4724373 }, fsId: '4b815a15f964a520ffa030e3' },
      { name: 'Stavio', placeId: 'ChIJuzIfvSdgLxMRZCtEdHt7n3E' , location: { lat: 41.8720929, lng: 12.4683256 }, fsId: '5411cfd6498e0bce59a3f197' },
      { name: 'Birrificio Marconi', placeId: 'ChIJ9TugWpuKJRMRWdRFbAD47m8' , location: { lat: 41.8648677, lng: 12.4695709 }, fsId: '578bd740498e33f23f11a823' },
      { name: 'Birrifugio Trastevere', placeId: 'ChIJoWOjmyNgLxMRvhKq04qWm4I' , location: { lat: 41.8776079, lng: 12.4637572 }, fsId: '4b7456a0f964a5202fd62de3' }
    ],
    filteredList: [],
    selected: '',
    showMenu: true
  }

  checkDimensions = () => {
    this.setState({ showMenu: !(window.outerWidth < 700) })
  }

  componentDidMount() {
    window.addEventListener("resize", this.checkDimensions);
    this.setState({filteredList: this.state.points})
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkDimensions)
  }

  setSelected = (id) => {
    this.setState({selected: id})
  }

  setFilter = (query) => {
    query = query.trim();
    let filteredList = this.state.points;
    if (query !== '') {
      filteredList = this.state.points.filter((poi) => poi.name.toLowerCase().includes(query.toLowerCase()))
    }

    this.setState({filteredList: filteredList})
  }

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu })
  }

  render() {
    return (
      <div className="App">
        <List
          points={this.state.filteredList}
          onSelect={this.setSelected}
          onFilter={this.setFilter}
          toggleMenu={this.toggleMenu}
          showMenu={this.state.showMenu}
        />

        <div className="main">

          <div className="header">
            <header className="App-header">
              <div className="menu" onClick={this.toggleMenu}>{ (this.state.showMenu ? "X" : "☰") }</div>
              <img src={Logo} className="App-logo" alt="logo" />
              <h1 className="App-title">NeighBEERhood Map</h1>
            </header>
          </div>

          <MapContainer
            points={this.state.filteredList}
            selected={this.state.selected}
            onSetSelected={this.setSelected}
          />

        </div>

      </div>
    );
  }
}

export default App;
