"use client";
import Link from "next/link";
import Brand from "@/components/brand";
import AccountShell from "./account-shell";
import AccountDeletion from "./account-deletion";

export default function DeleteAccountPage({
  wedding,
  googleEnabled,
  status,
}: {
  wedding: boolean;
  googleEnabled: boolean;
  status: string;
}) {
  const product = wedding ? "Save the Date" : "The Date";
  const completed = status === "deleted" || status === "deleting";
  return (
    <>
      <section className="account-deletion-intro">
        <Brand wedding={wedding} />
        <h1>
          {status === "deleted"
            ? "Tu cuenta se ha eliminado."
            : status === "deleting"
              ? "Estamos eliminando tu cuenta."
              : `Eliminar tu cuenta de ${product}`}
        </h1>
        <p role={completed ? "status" : undefined}>
          {status === "deleted"
            ? "Tu sesión se ha cerrado y los datos de tu cuenta en este producto se han eliminado."
            : status === "deleting"
              ? "Tu cuenta ya no tiene acceso. La eliminación continuará automáticamente hasta completarse; puedes cerrar esta página."
              : "Inicia sesión con la cuenta que quieres eliminar y confirma el borrado. Puedes hacerlo desde esta web sin instalar la aplicación."}
        </p>
        {!completed && (
          <p>
            El borrado es permanente e incluye perfil, eventos propios,
            invitados y archivos. También puedes acceder desde Mi perfil →
            Eliminar cuenta en el panel.
          </p>
        )}
        {completed && <Link href="/">Volver al inicio</Link>}
      </section>
      {!completed && (
        <AccountShell
          wedding={wedding}
          googleEnabled={googleEnabled}
          active="profile"
          next="/delete-account"
        >
          {(user) => (
            <div className="profile-page">
              <p>Cuenta: {user.email}</p>
              <AccountDeletion />
            </div>
          )}
        </AccountShell>
      )}
    </>
  );
}
