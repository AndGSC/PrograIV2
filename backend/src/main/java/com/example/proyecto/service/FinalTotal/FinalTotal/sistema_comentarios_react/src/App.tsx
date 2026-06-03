import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from "./pages/Login";
import Home from "./pages/Home";
import PuestosPublicos from "./pages/PuestoPublicos"
import ProtectedRoute from "./Componentes/ProtectedRoute";

function App() {
    // instalar
    // npm install react-router-dom
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/publicos" element={<PuestosPublicos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;