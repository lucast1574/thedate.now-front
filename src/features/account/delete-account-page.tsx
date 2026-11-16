"use client";
import { useTranslator } from "@/lib/i18n/react";

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
  const i18n = useTranslator();

  const product = wedding ? "Save the Date" : "The Date";
  const completed = status === "deleted" || status === "deleting";
  return (
    <>
      <section className="account-deletion-intro">
        <Brand wedding={wedding} />
        <h1>
          {status === "deleted"
            ? i18n("Tu cuenta se ha eliminado.")
            : status === "deleting"
              ? i18n("Estamos eliminando tu cuenta.")
              : i18n("Eliminar tu cuenta de {v0}", { v0: product })}
        </h1>
        <p role={completed ? "status" : undefined}>
          {status === "deleted"
            ? i18n(
                "Tu sesión se ha cerrado y los datos de tu cuenta en este producto se han eliminado.",
              )
            : status === "deleting"
              ? i18n(
                  "Tu cuenta ya no tiene acceso. La eliminación continuará automáticamente hasta completarse; puedes cerrar esta página.",
                )
              : i18n(
                  "Inicia sesión con la cuenta que quieres eliminar y confirma el borrado. Puedes hacerlo desde esta web sin instalar la aplicación.",
                )}
        </p>
        {!completed && (
          <p>
            {i18n(
              "El borrado es permanente e incluye perfil, eventos propios, invitados y archivos. También puedes acceder desde Mi perfil → Eliminar cuenta en el panel.",
            )}
          </p>
        )}
        {completed && <Link href="/">{i18n("Volver al inicio")}</Link>}
        {!completed && (
          <p>
            {i18n(
              "Tu acceso se revoca al confirmar. El borrado comienza de inmediato y continúa automáticamente si un servicio no responde. Las copias de seguridad siguen su ciclo de rotación y los registros del proveedor de pagos, sus obligaciones de conservación. Consulta la",
            )}{" "}
            <a
              href={
                wedding
                  ? "https://save.thedate.now/privacidad"
                  : "https://thedate.now/privacidad"
              }
            >
              {i18n("política de privacidad")}
            </a>
            .
          </p>
        )}
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
              <p>
                {i18n("Cuenta:")} {user.email}
              </p>
              <AccountDeletion />
            </div>
          )}
        </AccountShell>
      )}
    </>
  );
}
