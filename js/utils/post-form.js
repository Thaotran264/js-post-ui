import * as yup from 'yup'
import { ValidationError } from 'yup'
import { setTextContent, setFieldValue, setBackgroundImage } from './common'

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
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))

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

export function initPostForm({ formID, defaultValue, onSubmit }) {
  const form = document.getElementById(formID)
  if (!form) return

  setFormValue(form, defaultValue)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formValues = getFormValues(form)
    formValues.id = defaultValue.id

    const isValid = await validatePostForm(form, formValues)
    if (!isValid) return

    onSubmit?.(formValues)
  })
}
