import { Issuer } from './oidc.client'

describe('OidClient', () => {
  it('should create an oidc client', () => {
    new Issuer('https://localhost:8081')
  })
})