import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProductsProvider } from "./contexts/productsContext";
import HomePage from "./components/HomePage";
import './App.css'

function App() {
  
  return (
    <ProductsProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage/>} />
        </Routes>
      </BrowserRouter>
    </ProductsProvider>
  )
}

export default App
