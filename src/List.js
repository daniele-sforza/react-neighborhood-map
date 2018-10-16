import React, { Component } from 'react';

export class List extends Component {
  selectItem = (point) => {
    this.props.onSelect(point.placeId); if (window.outerWidth < 700) this.props.toggleMenu()
  }

  render() {
    let points = this.props.points;

    return (
      <div className={"list " + (this.props.showMenu ? 'show' : 'hidden')} >
        <input type="search" className="filter" placeholder="Filter list" aria-label="filter list" onChange={(e) => this.props.onFilter(e.target.value)}></input>
        <ul>
        {
          points.map((point, idx) => (
            <li key={idx} role="button" tabIndex="0" 
              onKeyPress={(e) => {if (e.key === 'Enter') this.selectItem(point)}}
              onClick={() => this.selectItem(point)}>{point.name}</li>
          )) 
        }
        </ul>
      </div>
    )
  }
}

export default List