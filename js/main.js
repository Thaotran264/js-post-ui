import axiosClient from './api/axiosClient'
import postApi from './api/postApi'

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const response = await postApi.getAll(queryParams)
    console.log('response', response)
  } catch (error) {
    console.log('error', err)
  }
}

main()
