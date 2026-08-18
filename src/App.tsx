import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VotarPage } from "./pages/VotarPage";
import { ResultadosPage } from "./pages/ResultadosPage";
import { VotantesPage } from "./pages/VotantesPage";
import { ConfiguracionVotacionPage } from "./pages/ConfiguracionVotacionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing + nombre + voto viven todos dentro de VotarPage */}
        <Route path="/" element={<VotarPage />} />
        <Route path="/votar" element={<VotarPage />} />

        {/* Panel de organizadores, protegido por AdminGate con login
            usuario + contraseña (sin email real de por medio). */}
        <Route path="/resultados" element={<ResultadosPage />} />
        <Route path="/votantes" element={<VotantesPage />} />
        <Route path="/configuracion" element={<ConfiguracionVotacionPage />} />
      </Routes>
    </BrowserRouter>
  );
}