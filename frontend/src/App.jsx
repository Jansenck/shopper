import './App.css'
import styled from 'styled-components';

import InputCSVFiles from './components/InputCSVFiles';

function App() {
  
  return (
    <Container>
      <InputCSVFiles/>
    </Container>
  )
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 90px 0;
  padding: 0 40px 128px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export default App
