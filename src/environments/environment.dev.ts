export const environment = {
  production: true,
  appkey: 'b11e7c189b',
  pusherKey: 'c8f1e1cba0f717e24046',
  pusherCluster: 'ap1',
  env: 'sandbox',
  APIEndpoint: 'https://sandbox.practera.com/',
  intercomAppId: 'pef1lmo8',
  filestack: {
    key: 'AO6F4C72uTPGRywaEijdLz',
    s3Config: {
      location: 's3',
      container: 'practera-aus',
      region: 'ap-southeast-2',
      paths: {
        any: '/appv2/stage/uploads/',
        image: '/appv2/stage/uploads/',
        video: '/appv2/stage/video/upload/'
      }
    }
  },
  intercom: false,
  goMobile: false,
};
