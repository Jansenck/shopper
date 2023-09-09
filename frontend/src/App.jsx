import './App.css'
import styled from 'styled-components';
import { useState } from 'react';

import InputCSVFiles from './components/InputCSVFiles';

function App() {
  
  return (
    <Container>
      <InputCSVFiles/>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  margin: 90px 0;
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export default App
