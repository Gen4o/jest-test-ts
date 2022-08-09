import axios from 'axios';

var value = randomName()
var key = randomName()

const data = {
  "main_key": key,
  "value": value
}
const url = 'https://l761dniu80.execute-api.us-east-2.amazonaws.com/default/exercise_api'
const configPut = {
  method: 'put',
  url: url,
  headers: {
    'Content-Type': 'application/json'
  },
  data: data
}

describe('Client can', () => {
  test('GET list of all the values in the store', async () => {
    const response = await axios.get(url)
    expect(response.status).toBe(200)
  })
})


describe('Client can', () => {
  test('Put value in to the store', async () => {

    const sizeBefore = await axios.get(url)
      .then(response => response.data.length)


    const res = await axios(configPut)

    const sizeAfter = await axios.get(url)
      .then(response => response.data.length)

    expect(res.status).toBe(200)
    expect(res.data).toEqual(data)
    expect(sizeAfter).toBeGreaterThan(sizeBefore)
  })
})


describe('Client can', () => {
  test('Delete value from the store', async () => {
    const response = await axios.get(url)

    const sizeBefore = response.data.length

    const main_key = response.data[0].main_key

    const deleteData = { "main_key": main_key }

    const configDelete = {
      method: 'delete',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: deleteData
    }

    const res = await axios(configDelete)

    const sizeAfter = await axios.get(url)
      .then(response => { return response.data.length })


    expect(res.status).toBe(200)
    expect(res.data).toEqual(deleteData)
    expect(sizeAfter).toBeLessThan(sizeBefore)
  })
})

describe('Client can', () => {
  test('Update value for existed key in to the store with POST', async () => {

    const main_key = await axios.get(url).then(response => response.data[0].main_key)
    var value = randomName()

    const dataPost = {
      "main_key": main_key,
      "value": value
    }

    const configPost = {
      method: 'post',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataPost
    }


    const res = await axios(configPost)

    expect(res.status).toBe(200)
    expect(res.data).toEqual(dataPost)
  })
})

describe('Client can not', () => {
  test('Update key in to the store with POST action', async () => {

    const value = await axios.get(url).then(response => response.data[0].value)
    var main_key = randomName()

    const dataPost = {
      "main_key": main_key,
      "value": value
    }

    const configPost = {
      method: 'post',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataPost
    }

    const res = await axios(configPost).catch(error => error.response)

    expect(res.status).toBe(400)
    expect(res.data).toEqual('value dose not exist')
  })
})

describe('Client can not', () => {
  test('Put existed value to the store', async () => {

    const value = await axios.get(url).then(response => response.data[0].value)
    const main_key = await axios.get(url).then(response => response.data[0].main_key)

    const data = {
      "main_key": main_key,
      "value": value
    }

    const configPut = {
      method: 'put',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    const res = await axios(configPut).catch(error => error.response)

    expect(res.status).toBe(400)
    expect(res.data).toEqual('value already exist')
  })
})


function randomName() {
  return (Math.random() + 1).toString(36).substring(7)
}

