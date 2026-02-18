import { redirect } from "next/navigation";

export default async function ModulePage({ params }: { params: { moduleId: string } }) {
  redirect(`/modules/${params.moduleId}/lesson`);
}
