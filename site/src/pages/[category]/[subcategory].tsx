import { trpc } from "@/lib/trpc"
import { useRouter } from "next/router"

export default function Subcategory() {
  const { query } = useRouter()

  const {} = trpc.useQuery(["get-products-by-subcategory", {
    slug: String(query.subcategory)!
  }])

  return (
    <div>
      <h1>hello world</h1>
    </div>
  )
}