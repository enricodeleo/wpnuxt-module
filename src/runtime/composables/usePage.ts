import { useFetch, createError } from "#imports"
import { useTokens } from "./useTokens";
import { useWPNuxtLogger } from "./useWPNuxtlogger";

const _usePageById = async (id: number, asPreview?: boolean) => {
  const logger = useWPNuxtLogger()
  const tokens = useTokens()

  const { data, error } = await useFetch("/api/graphql_middleware/query/PageById/", {
    params: {
      id: id,
      asPreview: asPreview
    },
    headers: {
      Authorization: tokens.authorizationHeader
    },
    transform (data: any) {
      return data?.data?.page;
    }
  })
  if (error.value) {
    logger.error('usePageById, error: ', error.value)
    throw createError({ statusCode: error.value.status, message: error.value.message, fatal: true })
  }

  return {
    data: data.value
  }
}

export const usePageById = _usePageById
