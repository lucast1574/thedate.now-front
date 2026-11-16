import { useTranslator } from "@/lib/i18n/react";
import { useState } from "react";
import UserAvatar from "@/components/user-avatar";
import Alert from "@/components/alert";
import { api } from "@/lib/api/client";
import type { User } from "@/lib/events/types";
import { profilePhoto } from "./profile-photo";
import AccountDeletion from "./account-deletion";
export default function ProfileForm({
  user,
  onSaved,
  onSignOut,
}: {
  user: User;
  onSaved: (user: User) => void;
  onSignOut: () => Promise<void>;
}) {
  const i18n = useTranslator();

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
        body: await profilePhoto(file, i18n),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setCurrent(result);
      onSaved(result);
      setNotice(i18n("Foto actualizada."));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="profile-layout">
      <section className="profile-page">
        <p className="office-kicker">{i18n("TU CUENTA")}</p>
        <h1>{i18n("Un espacio muy tuyo.")}</h1>
        <p>{i18n("Tu perfil acompaña todas tus bodas y celebraciones.")}</p>
        <Alert>{error}</Alert>
        <Alert variant="success">{notice}</Alert>
        <div className="profile-panel">
          <div className="profile-photo">
            <UserAvatar user={current} />
            <div>
              <h2>{i18n("Foto de perfil")}</h2>
              <p>
                {user.googlePhotoUrl
                  ? i18n(
                      "Usamos tu foto de Google. Puedes elegir otra si prefieres.",
                    )
                  : i18n("Elige la foto que quieras ver en tu espacio.")}
              </p>
              <label className="profile-upload">
                {busy ? i18n("Guardando…") : i18n("Elegir una foto")}
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
              <small>
                {i18n("JPG, PNG o WebP · hasta 10 MB · recorte cuadrado")}
              </small>
            </div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                const result = await api<User>(
                  "/api/backend/profile",
                  "PATCH",
                  {
                    name,
                  },
                  i18n,
                );
                setCurrent(result);
                onSaved(result);
                setNotice(i18n("Perfil guardado."));
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <label>
              {i18n("Tu nombre")}{" "}
              <input
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              {i18n("Correo")} <input readOnly value={user.email} />
            </label>
            <button className="office-button" disabled={busy}>
              {i18n("Guardar perfil")}
            </button>
          </form>
        </div>
        <div className="profile-session">
          <button
            type="button"
            className="profile-signout"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await onSignOut();
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {i18n("Cerrar sesión")}
          </button>
        </div>
      </section>
      <AccountDeletion disabled={busy} compact />
    </div>
  );
}
