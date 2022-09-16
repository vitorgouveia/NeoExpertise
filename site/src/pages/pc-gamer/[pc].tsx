import { NextRouter, useRouter } from 'next/router'

type TypeSafeRouter<QueryParams> = NextRouter & {
  query: QueryParams
}

export function useTypeSafeRouterParams<RouteQuery = {}>(
  router: NextRouter
): TypeSafeRouter<RouteQuery> {
  return router as TypeSafeRouter<RouteQuery>
}

export default function PC() {
  const { pc } = useTypeSafeRouterParams<{ pc: string }>(useRouter()).query

  return (
    <div>
      <h1>viewing pc {pc}</h1>
    </div>
  )
}
