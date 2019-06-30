import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'
import { isObject } from '../../src/helpers/util';

axios({
  url: '/transform/post',
  method: 'post',
  data: {
    a: 1
  },
  transformRequest: [function(data) {
    return qs.stringify(data)
  }, ...(axios.defaults.transformRequest as AxiosTransformer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
    if (isObject(data)) {
      data.b = 2
    }
    return data
  }]
}).then(res => {
  console.log(res.data)
})