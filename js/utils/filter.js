import { renderPagination, renderPostLists } from '.'
import postApi from '../api/postApi'

export async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)
    history.pushState({}, '', url)

    // fetch API
    const { data, pagination } = await postApi.getAll(url.searchParams)

    renderPostLists(data)
    renderPagination(pagination)
    // re-render postlist
  } catch (error) {
    console.log('error', error)
  }
}
