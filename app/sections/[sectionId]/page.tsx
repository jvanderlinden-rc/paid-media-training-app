import { redirect } from "next/navigation";

export default async function SectionPage({ params }: { params: { sectionId: string } }) {
  redirect(`/levels/${params.sectionId}`);
}
