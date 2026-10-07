import { useState } from "react";
import UserAvatar from "@/components/user-avatar";
import Alert from "@/components/alert";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/events/types";
import { profilePhoto } from "./profile-photo";
export default function ProfileForm({
  user,
  onSaved,
}: {
  user: User;
  onSaved: (user: User) => void;
}) {
  const [current, setCurrent] = useState(user),
    [name, setName] = useState(user.name),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: await profilePhoto(file),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setCurrent(result);
      onSaved(result);
      setNotice("Foto actualizada.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="profile-page">
      <p className="office-kicker">TU CUENTA</p>
      <h1>Un espacio muy tuyo.</h1>
      <p>Tu perfil acompaña todas tus bodas y celebraciones.</p>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      <div className="profile-panel">
        <div className="profile-photo">
          <UserAvatar user={current} />
          <div>
            <h2>Foto de perfil</h2>
            <p>
              {user.googlePhotoUrl
                ? "Usamos tu foto de Google. Puedes elegir otra si prefieres."
                : "Elige la foto que quieras ver en tu espacio."}
            </p>
            <label className="profile-upload">
              {busy ? "Guardando…" : "Elegir una foto"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={(e) => {
                  void upload(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <small>JPG, PNG o WebP · hasta 10 MB · recorte cuadrado</small>
          </div>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              const result = await api<User>("/api/backend/profile", "PATCH", {
                name,
              });
              setCurrent(result);
              onSaved(result);
              setNotice("Perfil guardado.");
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Tu nombre
            <input
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Correo
            <input readOnly value={user.email} />
          </label>
          <button className="office-button" disabled={busy}>
            Guardar perfil
          </button>
        </form>
      </div>
    </section>
  );
}
