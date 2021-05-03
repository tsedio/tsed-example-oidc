const issuer = 'http://0.0.0.0:8083'
const redirect_uri = 'http://0.0.0.0:3000'
const post_logout_redirect_uri = 'http://0.0.0.0:3000'

export const AppConfig = {
  issuer,
  redirect_uri,
  post_logout_redirect_uri,
  clients: [
    {
      'client_name': 'Authority',
      'client_id': 'client_id',
      'response_types': [
        {
          'value': 'id_token'
        }
      ],
      'scopes': [
        {
          'label': 'openid',
          'value': 'openid',
          'required': true
        },
        {
          'label': 'email',
          'value': 'email',
          'checked': true
        }
      ],
      'actions': [
        {
          'label': 'Login',
          'value': {
            'grant_type': 'implicit',
            'prompt': 'login',
            'nonce': 'foobar'
          }
        }
      ],
      'query': [
        {
          label: 'Google tag (ga)',
          name: 'ga',
          value: '12437'
        },
        {
          label: 'Google UTM source (utm_source)',
          name: 'utm_source',
          value: 'utm_source_value'
        },
        {
          label: 'Google UTM medium (utm_medium)',
          name: 'utm_medium',
          value: 'utm_medium_value'
        },
        {
          label: 'Google UTM Campaign (utm_campaign)',
          name: 'utm_campaign',
          value: 'utm_campaign_value'
        }
      ]
    }
  ]
}