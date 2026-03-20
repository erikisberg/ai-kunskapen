import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function JoinPage({ params }: Props) {
  const { token } = await params;
  redirect(`/api/join?token=${encodeURIComponent(token)}`);
}
