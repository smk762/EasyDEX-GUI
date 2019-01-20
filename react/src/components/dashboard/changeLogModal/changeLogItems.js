import React from 'react';
import changeLogData from './changeLogData';

class changeLogItems extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  renderItems() {
    let _items = [];
    
    for (let i = 0; i < changeLogData.length; i++) {
      let _itemsChanges = [];
  
      for (let j = 0; j < changeLogData[i].changes.length; j++) {
        _itemsChanges.push(
          <li>{ changeLogData[i].changes[j] }</li>
        );
      }
  
      _items.push(
        <div className="item">
          <h4>v{ changeLogData[i].version }</h4>
          <ul>{ _itemsChanges }</ul>
        </div>
      );
    }
  
    return _items;
  }

  render() {
    return (
      <div>{ this.renderItems() }</div>
    );
  }
}

export default changeLogItems;