import { useState } from "react";
import api from "../api";

export default function TaskForm({ onCreated, showNotification }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    due_time: "",
    priority: "medium",
    important: false,
    user_id: 1,
    is_completed: false, // NUEVO: reemplaza progress
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function isPastDate(dateStr) {
    if (!dateStr) return false;
    const due = new Date(dateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }

  function parseApiError(err) {
    const data = err?.response?.data;
    if (!data) return err?.message || "Error desconocido";
    if (typeof data === "string") return data;
    if (data.detail) {
      if (Array.isArray(data.detail)) return data.detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
      if (typeof data.detail === "string") return data.detail;
      if (data.detail.msg) return data.detail.msg;
    }
    if (data.message) return data.message;
    return JSON.stringify(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.due_date && isPastDate(form.due_date)) {
      showNotification?.("Fecha no válida: la fecha ya pasó", "error");
      return;
    }

    if (!form.title || !form.title.trim()) {
      showNotification?.("El título es obligatorio", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/crearTarea", form);
      showNotification?.("Tarea creada correctamente", "success");
      onCreated?.(res.data);
      setForm({
        title: "",
        description: "",
        due_date: "",
        due_time: "",
        priority: "medium",
        important: false,
        user_id: 1,
        is_completed: false, // NUEVO: reemplaza progress
      });
    } catch (err) {
      const message = parseApiError(err);
      showNotification?.(message || "Error al crear la tarea", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>➕ Nueva Tarea</h3>

      <input
        type="text"
        name="title"
        placeholder="Título"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange}
        rows={3}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
        />
        <input
          type="time"
          name="due_time"
          value={form.due_time}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px", alignItems: "center" }}>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            name="important"
            checked={form.important}
            onChange={handleChange}
          />
          Importante
        </label>

        {/* NUEVO: Checkbox para tarea completada */}
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            name="is_completed"
            checked={form.is_completed}
            onChange={handleChange}
          />
          Tarea completada
        </label>
      </div>

      <button type="submit" className="btn-create" disabled={loading}>
        {loading ? "Guardando..." : "Crear"}
      </button>
    </form>
  );
}