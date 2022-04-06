import request from '@/utils/request'

export function testApi(data) {
  return request({
    url: '/abc',
    method: 'get',
  })
}