import { Separator } from "@/components/ui/separator";
import PageTitle from "../_components/PageTitle";
import Profile from "../_components/Profile";

export default function page() {
  return (
    <section>
      <PageTitle title="Profile" />
      <Separator className="my-4 border-b-[2px] border-sky-600" />
      <Profile />
    </section>
  )
}
