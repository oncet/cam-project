import React, { useState } from 'react';
import styled from 'styled-components/macro';

import VideoRenderer from './VideoRenderer/VideoRenderer';

const MainContainer = styled.div`
  width: 100%;
  max-width: 600px;
`;

const App = () => {
  const [filter, setFilter] = useState('myFirstFilter');

  return (
    <MainContainer>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="myFirstFilter">My First Filter</option>
        <option value="mySecondFilter">My Second Filter</option>
      </select>
      <VideoRenderer
        className="canvasContainer"
        filter={filter}
      />
    </MainContainer>
  );
};

export default App;
