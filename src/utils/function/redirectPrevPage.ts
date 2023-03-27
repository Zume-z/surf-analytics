import { NextRouter } from "next/router"
import { UrlObject } from "url"

export const redirectPrevPage = (router: NextRouter, routerPath: string | UrlObject) => {
  router.beforePopState(({ as }) => {
    if (as !== router.asPath) {
      router.push(routerPath)
      return false
    }
    return true
  })
  return () => {
    router.beforePopState(() => true)
  }
}

