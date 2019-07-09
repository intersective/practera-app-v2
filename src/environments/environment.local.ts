export const environment = {
  production: false,
  appkey: 'b11e7c189b',
  pusherKey: 'c8f1e1cba0f717e24046',
  pusherCluster: 'ap1',
  env: 'develop',
  APIEndpoint: 'http://127.0.0.1:8080/',
  intercomAppId: '',
  filestack: {
    key: 'AO6F4C72uTPGRywaEijdLz',
    s3Config: {
      location: 's3',
      container: 'practera-aus',
      region: 'ap-southeast-2',
      paths: {
        any: '/appv2/local/uploads/',
        image: '/appv2/local/uploads/',
        video: '/appv2/local/uploads/'
      }
    }
  },
  intercom: false,
  goMobile: false,
};
