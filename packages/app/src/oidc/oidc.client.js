import axios from 'axios'
import { UserManager } from 'oidc-client'

const issuers = new Map()

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
        return this.implicit(props, state)
      default:
        console.error('Unsupported grant type')
        break
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
      ...options
    }

    const client = new UserManager(settings)
    const request = await client.createSigninRequest({ state })

    sessionStorage.setItem('client_metadata', JSON.stringify(settings))

    window.location.replace(request.url)
  }

  async processSigninUrl () {
    const client = this.getClient()
    if (client) {
      const response = await client.processSigninResponse()
      console.log('[OIDC] Signin response', response)

      sessionStorage.setItem('auth', JSON.stringify(response))

      window.location = window.location.toString().split('#')[0]

      return response
    }
  }

  async processSignoutUrl () {
    const client = this.getClient()
    if (client) {
      const response = await client.processSignoutResponse()
      console.log('[OIDC] Signout response', response)

      sessionStorage.removeItem('client_metadata')
      sessionStorage.removeItem('auth')

      window.location = window.location.toString().split('?')[0]

      return response
    }
  }

  hasAuth () {
    return sessionStorage.getItem('auth')
  }

  getAuth () {
    return JSON.parse(sessionStorage.getItem('auth'))
  }

  getClient () {
    if (sessionStorage.getItem('client_metadata')) {
      const settings = JSON.parse(sessionStorage.getItem('client_metadata'))
      return new UserManager(settings)
    }
  }

  static get (issuer) {
    if (!issuers.has(issuer)) {
      issuers.set(issuer, new Issuer(issuer))
    }

    return issuers.get(issuer)
  }
}
