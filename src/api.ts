const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/api/v1";

const AUTH_ENDPOINT = `${API_BASE_URL}/auth`;
const USUARIOS_ENDPOINT = `${API_BASE_URL}/usuarios`;

export interface UsuarioResponse {
  id: number;
  name: string;
  email: string;
  profesion?: string;
  pais?: string;
  ciudad?: string;
  descripcion?: string;
  role: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
}

export interface RegistroPayload {
  name: string;
  email: string;
  password: string;
  profesion?: string;
  pais?: string;
  ciudad?: string;
  descripcion?: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UsuarioResponse;
}

interface ErrorResponse {
  message?: string;
  detail?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const payloadText = await response.text();
  let parsed: unknown;
  if (payloadText) {
    try {
      parsed = JSON.parse(payloadText);
    } catch {
      parsed = undefined;
    }
  }

  if (!response.ok) {
    const errorBody = parsed as ErrorResponse | undefined;
    const errorMessage =
      errorBody?.message ?? errorBody?.detail ?? "Error desconocido";
    throw new Error(errorMessage);
  }

  return (parsed ?? {}) as T;
}

export async function getUsuarios(): Promise<UsuarioResponse[]> {
  const response = await fetch(USUARIOS_ENDPOINT);
  return handleResponse(response);
}

export async function registrarUsuario(
  usuario: RegistroPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_ENDPOINT}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return handleResponse(response);
}

export async function iniciarSesion(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_ENDPOINT}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}
