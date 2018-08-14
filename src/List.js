import React, { Component } from 'react';

export class List extends Component {
  render() {
    let points = this.props.points;

    return (
      <div className='list'>
        <ul>
        {
          points.map((point, idx) => (
            <li key={idx}>{point.name}</li>    
          ))
        }
        </ul>
      </div>
    )
  }
}

export default List