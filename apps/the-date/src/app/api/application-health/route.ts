export function GET() {
  return Response.json({
    status: "ok",
    product: "general",
    application: "the-date",
  });
}
