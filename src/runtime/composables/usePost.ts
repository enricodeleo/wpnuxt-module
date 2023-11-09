import { ref, computed, useNuxtData, useFetch, createError } from "#imports"

const _usePostByUri = async (uri: string) => {
    const post = ref()
    const cacheKey = computed(() => `post-${uri}`)
    const cachedPost = useNuxtData(cacheKey.value)

    if (cachedPost.data.value) {
        post.value = cachedPost.data.value
    } else {
        const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PostByUri/", {
            key: cacheKey.value,
            params: {
                uri: uri
            },
            transform (data) {
                return data.data.nodeByUri;
            }
        })
        if (error.value) {
            throw createError({ statusCode: 500, message: 'Error fetching PostByUri', fatal: true })
        }
        post.value = data.value
    }
    return {
        data: post.value
    }
}
const _usePostById = async (id: number, asPreview?: boolean) => {
  const post = ref()
  const cacheKey = computed(() => `post-${id}`)
  const cachedPost = useNuxtData(cacheKey.value)

  if (cachedPost.data.value) {
    post.value = cachedPost.data.value
  } else {
    const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PostById/", {
      key: cacheKey.value,
      params: {
        id: id,
        asPreview: asPreview ? true : false
      },
      transform (data) {
        return data.data.post;
      }
    })
    if (error.value) {
      throw createError({ statusCode: 500, message: 'Error fetching PostById', fatal: true })
    }
    post.value = data.value
  }
  return {
    data: post.value
  }
}

export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
