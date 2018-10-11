import React, { Component } from 'react';

export class List extends Component {
  render() {
    let points = this.props.points;

    return (
      <div className="list">
        <ul>
        {
          points.map((point, idx) => (
            <li key={idx} onClick={(e) => this.props.onSelect(point.placeId)}>{point.name}</li>
          ))
        }
        </ul>
      </div>
    )
  }
}

export default List