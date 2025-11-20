import { useMemo, useState, type FormEvent } from "react";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  createdAt: number;
};

type KnowledgeItem = {
  topic: string;
  cues: string[];
  answer: string;
};

const quickPrompts = [
  "¿Cómo me registro como estudiante?",
  "¿Puedo crear cursos siendo profesor?",
  "¿Qué hago si olvidé mi contraseña?",
  "¿Cómo veo mis clases nuevas?",
];

const knowledgeBase: KnowledgeItem[] = [
  {
    topic: "registro",
    cues: ["registr", "crear cuenta", "nuevo usuario", "sign up"],
    answer:
      "Para registrarte ve a la pantalla de registro, completa tu nombre, correo y contraseña (mínimo 6 caracteres) y pulsa “Registrar”. El rol por defecto es estudiante pero puedes indicar tu profesión, país y ciudad para personalizar tu perfil.",
  },
  {
    topic: "login",
    cues: ["ingresar", "login", "iniciar sesion", "entrar", "inicio de sesion"],
    answer:
      "Ingresa con tu correo y contraseña en la pantalla de acceso. Si los datos son correctos se genera un token y se guarda junto con tu email y rol. Usa ese token para acceder a las áreas protegidas.",
  },
  {
    topic: "rol profesor",
    cues: ["profesor", "docente", "teacher", "crear clase", "crear curso"],
    answer:
      "Si tienes rol de profesor podrás crear cursos y clases. Completa título, descripción y materiales desde el panel de profesor (páginas de /teacher), y publica para que tus estudiantes lo vean.",
  },
  {
    topic: "rol estudiante",
    cues: ["estudiante", "student", "ver clases", "clases nuevas", "mis cursos"],
    answer:
      "Con rol estudiante puedes inscribirte y ver las clases disponibles. Revisa la sección de estudiante para avanzar, dejar feedback y retomar el progreso que guardamos por ti.",
  },
  {
    topic: "seguridad",
    cues: ["token", "seguridad", "auth", "autenticacion", "sesion"],
    answer:
      "El backend entrega un token JWT al iniciar sesión o al registrarte. Lo almacenamos localmente junto a tu correo y rol para autenticarte en las posteriores peticiones sin volver a escribir tus credenciales.",
  },
  {
    topic: "soporte",
    cues: ["soporte", "ayuda", "contacto", "problema", "bug", "olvidé"],
    answer:
      "Si tienes problemas (por ejemplo, olvidaste contraseña) valida tu correo y restablece desde la opción de recuperación. Envía detalles del error y qué estabas haciendo para ayudarte más rápido.",
  },
];

const fallbackResponses = [
  "Puedo ayudarte con registro, inicio de sesión, roles de estudiante/profesor y cómo funcionan las clases. Escríbeme lo que necesitas.",
  "Estoy listo para resolver dudas rápidas de la plataforma: crear cursos, ver clases, problemas de acceso o configuración de perfil.",
  "Cuéntame qué quieres hacer: registrarte, iniciar sesión, publicar un curso o saber cómo gestionamos tu sesión.",
];

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function buildAnswer(question: string): string {
  const normalized = normalize(question);
  const match = knowledgeBase.find((item) =>
    item.cues.some((cue) => normalized.includes(cue)),
  );
  if (match) {
    return match.answer;
  }

  if (/(hola|buenas|hey)/.test(normalized)) {
    return "¡Hola! Soy el asistente IA de Knowledge. Puedo guiarte en registro, inicio de sesión, creación de cursos y cómo ver tus clases.";
  }

  const fallback =
    fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  const suggestion = quickPrompts[Math.floor(Math.random() * quickPrompts.length)];
  return `${fallback}\n\nEjemplo: ${suggestion}`;
}

function AssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: makeId(),
      role: "assistant",
      text: "Hola, soy tu asistente IA. Pregunta sobre registro, inicio de sesión, roles y cómo usar Knowledge.",
      createdAt: Date.now(),
    },
  ]);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.createdAt - b.createdAt),
    [messages],
  );

  const sendMessage = (prompt: string) => {
    const text = prompt.trim();
    if (!text || isThinking) return;

    const userMessage: Message = {
      id: makeId(),
      role: "user",
      text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    const delay = 320 + Math.random() * 420;
    setTimeout(() => {
      const reply: Message = {
        id: makeId(),
        role: "assistant",
        text: buildAnswer(text),
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsThinking(false);
    }, delay);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="assistant-widget">
      {isOpen ? (
        <div className="assistant-panel">
          <div className="assistant-header">
            <div>
              <div className="badge">Asistente IA</div>
              <h3 style={{ margin: "6px 0 2px" }}>Soporte Knoledge</h3>
              <p className="muted" style={{ margin: 0 }}>
                Resuelve dudas rápidas sobre cómo usar la plataforma.
              </p>
            </div>
            <button
              type="button"
              className="assistant-close"
              aria-label="Cerrar chat"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="assistant-body">
            {sortedMessages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.role}`}
                aria-label={message.role === "assistant" ? "Respuesta" : "Mensaje"}
              >
                {message.text}
              </div>
            ))}
            {isThinking ? (
              <div className="message assistant">Pensando...</div>
            ) : null}
          </div>

          <div className="assistant-input">
            <div className="chips" aria-label="Sugerencias rápidas">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="chip"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escribe tu pregunta..."
                aria-label="Mensaje para el asistente"
              />
              <button className="btn-primary" type="submit" disabled={!input.trim()}>
                Enviar
              </button>
            </form>
            <div className="assistant-footer">
              Conoce sobre: registro, login, roles, creación de cursos y soporte rápido.
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="assistant-toggle"
        aria-label="Abrir chat con asistente"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        IA
      </button>
    </div>
  );
}

export default AssistantChat;
