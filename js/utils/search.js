import debounce from 'lodash.debounce'
import { handleFilterChange } from './filter'

export function initSearch() {
  const searchInput = document.getElementById('searchInput')
  if (!searchInput) return

  const queryParams = new URLSearchParams(window.location.search)
  if (queryParams.get('title_like')) searchInput.value = queryParams.get('title_like')

  const debounceSearch = debounce(
    (event) => handleFilterChange('title_like', event.target.value),
    500
  )
  searchInput.addEventListener('input', debounceSearch)
}
