import PageTitle from "./_components/PageTitle"
import { Separator } from "@/components/ui/separator"

export default function page() {
  return (
    <section>
      <PageTitle title="Welcome to kvv shop Web Manager" className={""} />
      <Separator className="my-4 border-b-[1px] border-gray-300" />
      <div>
        Hello world
      </div>
    </section>
  )
}