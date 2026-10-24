import ModulePage from '@/components/app/module-page'

export default async function ModuleRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  return <ModulePage slug={slug} />
}
