<<<<<<< HEAD
import RegistroForm from "./components/RegistroForm";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Knoledge</h1>
      <RegistroForm />
    </div>
  );
}

export default App;
=======
import RegistroForm from "./components/RegistroForm";
import AssistantChat from "./components/AssistantChat";

function App() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="title-block">
          <div className="badge">Asistente IA incorporado</div>
          <h1>Knoledge</h1>
          <p>Registra usuarios, crea cursos y resuelve dudas dentro de la plataforma.</p>
        </div>
      </header>

      <div className="grid">
        <section className="card">
          <RegistroForm />
        </section>

        <section className="card info-card">
          <h2>¿Qué puede responder la IA?</h2>
          <p className="muted">
            El asistente entiende procesos básicos de la app y te guía paso a paso.
          </p>
          <ul>
            <li>Registro e inicio de sesión con token y roles</li>
            <li>Flujo de estudiantes: ver y retomar clases</li>
            <li>Flujo de profesores: crear cursos y clases</li>
            <li>Consejos de seguridad y soporte rápido</li>
          </ul>
          <p className="muted" style={{ marginTop: "12px" }}>
            Abre el botón “IA” (abajo a la derecha) y escribe tu duda o usa una sugerencia.
          </p>
        </section>
      </div>

      <AssistantChat />
    </div>
  );
}

export default App;
>>>>>>> dfff0bb (Estudiante ya puede tener mas clases)
