import 'server-only';

export default async function AdminQuizFormPage({
  params,
}: {
  params: { id?: string };
}) {
  return <div>Form {params.id}</div>;
}
