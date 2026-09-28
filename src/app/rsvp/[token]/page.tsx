import RSVPForm from "./rsvp-form";
export default async function Page({ params }: { params: Promise<{ token: string }> }) { const { token } = await params; return <RSVPForm token={token} />; }
