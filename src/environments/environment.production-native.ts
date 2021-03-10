export const environment = {
  production: true,
  appkey: 'b11e7c189b',
  pusher: {
    key: '255f010d210933ca7675',
    beamsDefaultInterest: ['general']
  },
  env: 'live',
  APIEndpoint: 'https://api.practera.com/',
  graphQL: 'https://dl3tyzguge.execute-api.ap-southeast-2.amazonaws.com/prd/',
  intercomAppId: 'pef1lmo8',
  filestack: {
    key: 'AO6F4C72uTPGRywaEijdLz',
    s3Config: {
      location: 's3',
      container: 'practera-aus',
      containerChina: 'practera-seoul-1',
      region: 'ap-southeast-2',
      regionChina: 'ap-northeast-2',
      paths: {
        any: '/appv2/live/uploads/',
        image: '/appv2/live/uploads/',
        video: '/media/fpvideo/upload/'
      },
      workflows: [
        '3c38ef53-a9d0-4aa4-9234-617d9f03c0de',
      ],
    },
    policy: 'eyJleHBpcnkiOjE3MzU2NTAwMDB9',
    signature: '30323e4c80bb68e30afef26b32aa4dae401b0581b8e8ba9da93f3a01701be267',
    workflows: {
      virusDetection: '3c38ef53-a9d0-4aa4-9234-617d9f03c0de',
    },
  },
  defaultCountryModel: 'AUS',
  intercom: false,
  goMobile: false,
  lambdaServices: {
    pusherBeamsAuth: 'https://pusher-api.sandbox.p2.practera.com/',
    preferences: 'https://preferences-api.sandbox.p2.practera.com/'
  },
};
