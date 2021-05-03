import axios from 'axios'
import { UserManager } from 'oidc-client'

const issuers = new Map()

function setData (key, obj) {
  console.log('[OIDC] Store key:', key, JSON.stringify(obj))
  sessionStorage.setItem(key, JSON.stringify(obj))
}

function getData (key) {
  console.log('[OIDC] Get stored key:', key)
  return JSON.parse(sessionStorage.getItem(key))
}

function hasData (key) {
  return !!sessionStorage.getItem(key)
}

function removeData (key) {
  console.log('[OIDC] Remove stored key:', key)
  sessionStorage.removeItem(key)
}

export class Issuer {
  constructor (issuer) {
    this.issuer = issuer
  }

  async discover () {
    const { data } = await axios.get(`${this.issuer}/.well-known/openid-configuration`)

    this.settings = data

    return this
  }

  grant (grantType, props, state = {}) {
    switch (grantType) {
      case 'implicit':
        console.log('[OIDC] Start implicit flow')
        return this.implicit(props, state)
      default:
        throw new Error('OIDC Unsupported grant type')
    }
  }

  async signout (state = {}) {
    const client = this.getClient()

    if (client) {
      const auth = this.getAuth()
      const req = await client.createSignoutRequest({
        id_token_hint: auth.id_token,
        state
      })

      window.location = req.url
    }
  }

  async implicit (options, state = {}) {
    const settings = {
      authority: this.issuer,
      extraQueryParams: options.query,
      ...options
    }

    const client = new UserManager(settings)
    const request = await client.createSigninRequest({ state })

    setData('client_metadata', settings)

    console.log('[OIDC] Redirect to:', request.url)
    window.location.replace(request.url)
  }

  async processSigninUrl () {
    const client = this.getClient()
    console.log('[OIDC] Client => ', client)

    if (client) {
      const params = this.parseExtraParams()
      console.log('[OIDC] Extra params', JSON.stringify(params))
      const response = await client.processSigninResponse()
      console.log('[OIDC] Signin response', JSON.stringify(response))

      setData('auth', response)
      setData('extra_params', params)

      window.location = window.location.toString().split('#')[0]

      return response
    } else {
      throw new Error('OIDC client not found in session')
    }
  }

  async processSignoutUrl () {
    const client = this.getClient()

    if (client) {
      const response = await client.processSignoutResponse()
      console.log('[OIDC] Signout response', JSON.stringify(response))

      removeData('client_metadata')
      removeData('auth')

      window.location = window.location.toString().split('?')[0]

      return response
    }
  }

  hasAuth () {
    return hasData('auth')
  }

  getAuth () {
    return getData('auth')
  }

  getExtraParams(){
    return getData('extra_params')
  }

  getClient () {
    if (hasData('client_metadata')) {
      return new UserManager(getData('client_metadata'))
    }
  }

  parseExtraParams(){
    return window.location.href.split('#')[1].split('&').reduce((params, chain) => {
      const [key, value] = chain.split('=')
      if (['access_token', 'id_token', 'state'].includes(key)){
        return params
      }
      return {
        ...params,
        [key]: value
      }
    }, {})
  }



  static get (issuer) {
    if (!issuers.has(issuer)) {
      issuers.set(issuer, new Issuer(issuer))
    }

    return issuers.get(issuer)
  }
}
