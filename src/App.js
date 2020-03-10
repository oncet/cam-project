import React, { useState } from 'react';

import VideoRenderer from './VideoRenderer';

const App = () => {
  const [filter, setFilter] = useState('myFirstFilter');

  return (
    <>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="myFirstFilter">My First Filter</option>
        <option value="mySecondFilter">My Second Filter</option>
      </select>
      <VideoRenderer
        filter={filter}
      />
    </>
  );
};

export default App;
