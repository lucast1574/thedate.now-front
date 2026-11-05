const stages: Record<string, { percent: number; label: string }> = {
  pending: { percent: 10, label: "Tu invitación está en preparación" },
  configured: { percent: 35, label: "Tu diseño está listo para publicarse" },
  deploying: { percent: 70, label: "Estamos dando vida a tu invitación" },
  verifying: {
    percent: 90,
    label: "Comprobamos que todo esté listo para tus invitados",
  },
  ready: { percent: 100, label: "Tu invitación está lista" },
};
export function preparationProgress(phase?: string) {
  return (
    stages[phase || ""] || {
      percent: 0,
      label: "Estamos preparando tu invitación",
    }
  );
}
