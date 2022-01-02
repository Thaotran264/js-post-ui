export function setTextContent(parentElement, selector, text) {
  if (!parentElement) return
  const element = parentElement.querySelector(selector)
  element.textContent = text
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}...`
}
export function setFieldValue(form, selector, value) {
  if (!form) return

  const field = form.querySelector(selector)
  if (field) field.value = value
}

export function setBackgroundImage(parent, selector, imageURL) {
  const element = parent.querySelector(selector)

  if (element) element.style.backgroundImage = `url("${imageURL}")`
}
