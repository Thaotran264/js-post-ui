import postApi from './api/postApi'
import { initPagination, renderPagination } from './utils/pagination'
import { renderPostLists } from './utils/post'
import { initSearch } from './utils/search'

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)
    history.pushState({}, '', url)

    // fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams)

    renderPostLists('postList', data)
    renderPagination('pagination', pagination)
    // re-render postlist
  } catch (error) {
    console.log('error', error)
  }
}

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
    renderPostLists('postList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('error', error)
  }
})()
