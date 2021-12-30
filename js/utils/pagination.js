export function renderPagination(elementID, pagination) {
  const ulPagination = document.getElementById(elementID)
  if (!pagination || !ulPagination) return

  // calc totalPage
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  // save to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if enable/disable prev/next link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

export function initPagination({ elementID, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementID)
  console.log(ulPagination)
  if (!ulPagination) return

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink)
    prevLink.addEventListener('click', (e) => {
      console.log('prev click')
      e.preventDefault()
      const page = Number.parseInt(ulPagination.dataset.page)
      if (page > 1) onChange?.(page - 1)
    })

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink)
    nextLink.addEventListener('click', (e) => {
      console.log('next click')

      e.preventDefault()
      const page = Number.parseInt(ulPagination.dataset.page) || 1
      const totalPages = ulPagination.dataset.totalPages
      if (page < totalPages) onChange?.(page + 1)
    })
}
