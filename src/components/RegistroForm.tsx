import { useState } from "react";
import type { FormEvent } from "react";
import { registrarUsuario } from "../api";
import type { AuthResponse, RegistroPayload } from "../api";

type FormState = {
  name: string;
  email: string;
  password: string;
  profesion: string;
  pais: string;
  ciudad: string;
  descripcion: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  password: "",
  profesion: "",
  pais: "",
  ciudad: "",
  descripcion: "",
};

type AlertState = {
  type: "success" | "error";
  message: string;
} | null;

function RegistroForm() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [alert, setAlert] = useState<AlertState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAlert(null);

    try {
      const payload: RegistroPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "student",
        ...(formData.profesion.trim()
          ? { profesion: formData.profesion.trim() }
          : {}),
        ...(formData.pais.trim() ? { pais: formData.pais.trim() } : {}),
        ...(formData.ciudad.trim() ? { ciudad: formData.ciudad.trim() } : {}),
        ...(formData.descripcion.trim()
          ? { descripcion: formData.descripcion.trim() }
          : {}),
      };

      const response: AuthResponse = await registrarUsuario(payload);
      localStorage.setItem("token", response.token);
      localStorage.setItem("email", response.user.email);
      localStorage.setItem("role", response.user.role);
      setAlert({
        type: "success",
        message: response.message ?? "Usuario registrado correctamente",
      });
      setFormData(initialState);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setAlert({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro de Usuario</h2>
      {alert ? <p className={alert.type}>{alert.message}</p> : null}

      <input
        value={formData.name}
        onChange={(event) => handleChange("name", event.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        value={formData.email}
        onChange={(event) => handleChange("email", event.target.value)}
        placeholder="Correo"
        type="email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(event) => handleChange("password", event.target.value)}
        placeholder="Contraseña"
        minLength={6}
        required
      />
      <input
        value={formData.profesion}
        onChange={(event) => handleChange("profesion", event.target.value)}
        placeholder="Profesión (opcional)"
      />
      <input
        value={formData.pais}
        onChange={(event) => handleChange("pais", event.target.value)}
        placeholder="País (opcional)"
      />
      <input
        value={formData.ciudad}
        onChange={(event) => handleChange("ciudad", event.target.value)}
        placeholder="Ciudad (opcional)"
      />
      <textarea
        value={formData.descripcion}
        onChange={(event) => handleChange("descripcion", event.target.value)}
        placeholder="Descripción (opcional)"
        rows={3}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : "Registrar"}
      </button>
    </form>
  );
}

export default RegistroForm;
