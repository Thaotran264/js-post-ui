import postApi from './api/postApi'
import { setTextContent, truncateText } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getPaginationElement } from './utils'
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return

  //   find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1768x400.png?text=thumbnail'
    })
  }

  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.createdAt).fromNow()}`)

  //   update title, author, descriptoion, thumbnail
  //   attach event

  return liElement
}

function renderPostLists(postList) {
  if (!Array.isArray(postList) || postList.length == 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  // clear current ul
  ulElement.textContent = ''

  postList.forEach((post, index) => {
    const liElement = createPostElement(post)

    ulElement.appendChild(liElement)
  })
}

function renderPagination(pagination) {
  const ulPagination = getPaginationElement()
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

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)
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

function handlePrevLink(e) {
  e.preventDefault()
  const ulPagination = getPaginationElement()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page)
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}

function handleNextLink(e) {
  e.preventDefault()

  const ulPagination = getPaginationElement()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = ulPagination.dataset.totalPages
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function initPagination() {
  const ulPagination = getPaginationElement()
  if (!ulPagination) return

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) prevLink.addEventListener('click', handlePrevLink)

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) nextLink.addEventListener('click', handleNextLink)
}

function initURL() {
  // update query params
  const url = new URL(window.location)

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

;(async () => {
  try {
    // attach click event for links
    initPagination()

    // set defaul pagination
    initURL()

    // render post list based URL params
    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostLists(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('error', error)
  }
})()
