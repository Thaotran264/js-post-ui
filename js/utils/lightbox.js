function showModal(modalElement) {
  console.log('show modal')
  const myModal = new window.bootstrap.Modal(modalElement)
  if (myModal) myModal.show()
}

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return
  if (Boolean(modalElement.dataset.registered)) return

  const imgElement = document.querySelector(imgSelector)
  const prevButton = document.querySelector(prevSelector)
  const nextButton = document.querySelector(nextSelector)

  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src
  }
  if (!imgElement || !prevButton || !nextButton) {
    return
  }

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)

    showImageAtIndex(currentIndex)
    showModal(modalElement)
  })

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })
  modalElement.dataset.registered = true
}
