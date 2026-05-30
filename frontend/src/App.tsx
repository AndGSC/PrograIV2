import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import EmpresaLayout from './layouts/EmpresaLayout';
import OferenteLayout from './layouts/OferenteLayout';

import HomePage from './paginas/publica/HomePage';
import PuestosPublicosPage from './paginas/publica/PuestosPublicosPage';
import BuscarPuestosPage from './paginas/publica/BuscarPuestosPage';
import DetallePuestoPage from './paginas/publica/DetallePuestoPage';
import LoginPage from './paginas/publica/LoginPage';
import RegistroEmpresaPage from './paginas/publica/RegistroEmpresaPage';
import RegistroOferentePage from './paginas/publica/RegistroOferentePage';

import DashboardAdminPage from './paginas/admin/DashboardAdminPage';
import EmpresasPendientesPage from './paginas/admin/EmpresasPendientesPage';
import OferentesPendientesPage from './paginas/admin/OferentesPendientesPage';
import CaracteristicasAdminPage from './paginas/admin/CaracteristicasAdminPage';
import AgregarCaracteristicaPage from './paginas/admin/AgregarCaracteristicaPage';
import ReportesAdminPage from './paginas/admin/ReportesAdminPage';

import DashboardEmpresaPage from './paginas/empresa/DashboardEmpresaPage';
import MisPuestosPage from './paginas/empresa/MisPuestosPage';
import PublicarPuestoPage from './paginas/empresa/PublicarPuestoPage';
import BuscarCandidatosPage from './paginas/empresa/BuscarCandidatosPage';
import DetalleCandidatoPage from './paginas/empresa/DetalleCandidatoPage';

import DashboardOferentePage from './paginas/oferente/DashboardOferentePage';
import MisHabilidadesPage from './paginas/oferente/MisHabilidadesPage';
import MiCvPage from './paginas/oferente/MiCvPage';

import NotFoundPage from './paginas/NotFoundPage';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/puestos-publicos" element={<PuestosPublicosPage />} />
            <Route path="/puestos" element={<BuscarPuestosPage />} />
            <Route path="/puestos/:id" element={<DetallePuestoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro-empresa" element={<RegistroEmpresaPage />} />
            <Route path="/registro-oferente" element={<RegistroOferentePage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardAdminPage />} />
            <Route path="empresas-pendientes" element={<EmpresasPendientesPage />} />
            <Route path="oferentes-pendientes" element={<OferentesPendientesPage />} />
            <Route path="caracteristicas" element={<CaracteristicasAdminPage />} />
            <Route path="caracteristicas/nueva" element={<AgregarCaracteristicaPage />} />
            <Route path="reportes" element={<ReportesAdminPage />} />
          </Route>

          <Route path="/empresa" element={<EmpresaLayout />}>
            <Route index element={<DashboardEmpresaPage />} />
            <Route path="puestos" element={<MisPuestosPage />} />
            <Route path="puestos/nuevo" element={<PublicarPuestoPage />} />
            <Route path="candidatos" element={<BuscarCandidatosPage />} />
            <Route path="candidatos/:id" element={<DetalleCandidatoPage />} />
          </Route>

          <Route path="/oferente" element={<OferenteLayout />}>
            <Route index element={<DashboardOferentePage />} />
            <Route path="habilidades" element={<MisHabilidadesPage />} />
            <Route path="cv" element={<MiCvPage />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;