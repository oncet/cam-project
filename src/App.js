import React, { useState } from 'react';
import './App.css';

import Filter from './Filter';

const App = () => {
  const [filter, setFilter] = useState('myFirstFilter');
  return (
    <div>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="myFirstFilter">My First Filter</option>
        <option value="mySecondFilter">My Second Filter</option>
      </select>
      <Filter
        filter={filter}
      />
    </div>
  );
};

export default App;
