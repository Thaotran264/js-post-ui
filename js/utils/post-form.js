import * as yup from 'yup'
import { ValidationError } from 'yup'
import { setTextContent, setFieldValue, setBackgroundImage, randomNumber } from './common'

function setFormValue(form, formValues) {
  setFieldValue(form, '[name=title]', formValues?.title)
  setFieldValue(form, '[name=author]', formValues?.author)
  setFieldValue(form, '[name=description]', formValues?.description)
  setFieldValue(form, '[name=imageUrl]', formValues?.imageUrl)

  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-2-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup.string().required('Please select an image').url('Please enter a valid url'),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  try {
    ;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))

    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const ValidationError of error.inner) {
        const name = ValidationError.path

        // form.querySelector('').textContent = ValidationError.message
        if (errorLog[name]) continue
        setFieldError(form, name, ValidationError.message)

        errorLog[name] = true
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity()

  if (!isValid) form.classList.add('was-validated')

  return isValid
}

function getFormValues(form) {
  const formValues = {}

  // s1:
  // ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (field) formValues[name] = field.value
  // })

  // s2: use form-data
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')

  if (button) {
    console.log('true')
    button.disabled = true
    button.textContent = 'Saving!!!'
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save!!!'
  }
}

let submitting = false

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  console.log(radioList)

  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value))
  })
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/367/267`

    setFieldValue(form, '[name=imageUrl]', imageUrl)
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]')
  if (!uploadImage) return

  uploadImage.addEventListener('change', (event) => {
    console.log('selected file', event.target.files[0])
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      console.log(imageUrl)
      setBackgroundImage(document, '#postHeroImage', imageUrl)
    }
  })
}

export function initPostForm({ formID, defaultValue, onSubmit }) {
  const form = document.getElementById(formID)
  if (!form) return

  setFormValue(form, defaultValue)
  initRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (submitting) {
      console.log('submit ')
      return
    }
    showLoading(form)
    submitting = true

    const formValues = getFormValues(form)
    formValues.id = defaultValue.id

    const isValid = await validatePostForm(form, formValues)
    if (isValid) {
      await onSubmit?.(formValues)
    }

    hideLoading(form)
    submitting = false
  })
}
