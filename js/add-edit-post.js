import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

async function handleFormSubmit(formValues) {
  console.log('handleformsubmit', formValues)
  try {
    let savePost = formValues.id ? await postApi.update(formValues) : await postApi.add(formValues)
    toast.success('Success fully!!!')
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savePost.id}`)
    }, 2000)
  } catch (error) {
    console.log('failure to save post', error)
    toast.error('Failure!!!!')
  }
}
// main
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postID = searchParams.get('id')

    const defaultValue = postID
      ? await postApi.getById(postID)
      : {
          author: '',
          description: '',
          imageUrl: '',
          title: '',
        }

    initPostForm({
      formID: 'postForm',
      defaultValue,
      onSubmit: (formValue) => handleFormSubmit(formValue),
    })
  } catch (error) {
    console.log('failure fecth data', error)
  }
})()
