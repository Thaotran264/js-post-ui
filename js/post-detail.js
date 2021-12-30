import dayjs from 'dayjs'
import postApi from './api/postApi'
import { registerLightbox, setTextContent } from './utils'

function renderPostDetail(post) {
  /*
  goToEditPageLink
postHeroImage
postDetailTitle
postDetailAuthor
postDetailTimeSpan
postDetailDescription
  */
  if (!post) return
  const title = setTextContent(document, '#postDetailTitle', post.title)
  const author = setTextContent(document, '#postDetailAuthor', post.author)
  const description = setTextContent(document, '#postDetailDescription', post.description)
  const timespan = setTextContent(
    document,
    '#postDetailTimeSpan',
    `- ${dayjs(post.updatedAt).format('DD/MM/YY HH:mm')}`
  )

  const heroImage = document.getElementById('postHeroImage')
  if (heroImage) heroImage.style.backgroundImage = `url('${post.imageUrl}')`

  heroImage.addEventListener('error', () => {
    console.log('error')
    const imageUrl = 'https://via.placeholder.com/1768x400.png?text=thumbnail'
    heroImage.style.backgroundImage = `url("${imageUrl}")`
  })

  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`
  }
}

;(async () => {
  try {
    registerLightbox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lighboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    })
    registerLightbox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lighboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    })
    registerLightbox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lighboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    })

    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    if (!postId) return
    const post = await postApi.getById(postId)

    renderPostDetail(post)
  } catch (error) {
    console.log('error', error)
  }
})()
