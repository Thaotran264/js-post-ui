import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, truncateText } from './common'
dayjs.extend(relativeTime)

export function createPostElement(post) {
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
      thumbnailElement.src = 'https://via.placeholder.com/1368x400.png?text=thumbnail'
    })
  }

  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.createdAt).fromNow()}`)
  // go to post detail
  const divElement = liElement.firstElementChild
  if (divElement) {
    divElement.addEventListener('click', (e) => {
      // s2:
      const menu = liElement.querySelector('[data-id="menu"]')
      if (menu && menu.contains(e.target)) return
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  const editButton = liElement.querySelector('[data-id="edit"]')
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      //
      // s1: e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }
  return liElement
}

export function renderPostLists(elementID, postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById(elementID)
  if (!ulElement) return

  // clear current ul
  ulElement.textContent = ''

  postList.forEach((post, index) => {
    const liElement = createPostElement(post)

    ulElement.appendChild(liElement)
  })
}
