import postApi from './api/postApi'
import { initPagination, renderPagination, initSearch, renderPostLists } from './utils'
import { handleFilterChange } from './utils/filter'
;(async () => {
  try {
    // update query params
    const url = new URL(window.location)

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    initPagination({
      elementID: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })
    initSearch({
      elementID: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostLists(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('error', error)
  }
})()
