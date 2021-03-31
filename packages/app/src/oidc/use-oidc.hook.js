import { useCallback, useEffect, useState } from 'react'
import { AppConfig } from '../app.config'
import { Issuer } from './oidc.client'

export function useOidc () {
  const [issuer, setIssuer] = useState(null)
  const [auth, setAuth] = useState(null)
  const [extraParams, setExtraParams] = useState(null)
  const [isActive, setIsActive] = useState(true)

  const onSubmit = useCallback(({ grant_type, ...options }) => {
    console.log('[OIDC] Submit with grant_type:', grant_type)
    console.log('[OIDC] Submit with options:', JSON.stringify(options))

    return Issuer.get(issuer).grant(grant_type, {
      redirect_uri: AppConfig.redirect_uri,
      post_logout_redirect_uri: AppConfig.post_logout_redirect_uri,
      ...options
    })
  }, [issuer])

  const onLogout = useCallback(() => {
    return Issuer.get(issuer).signout()
  }, [issuer])

  useEffect(() => {
    if (issuer == null) {
      setIsActive(true)

      Issuer.get(AppConfig.issuer).discover().then(async (issuer) => {
        setIssuer(AppConfig.issuer)

        console.log('[OIDC] bootstrapping...')
        console.log('[OIDC] Url: ', window.location.href)

        if (window.location.href.indexOf('#') >= 0) {
          console.log('[OIDC] Type: fragment (implicit)')

          return issuer.processSigninUrl()
        }

        if (window.location.href.indexOf('?') >= 0) {
          console.log('[OIDC] Type: query')

          try {
            return await issuer.processSignoutUrl()
          } catch (er) {
            console.warn(er)
          }
        }

        if (issuer.hasAuth()) {
          setAuth(issuer.getAuth())
          setExtraParams(issuer.getExtraParams())
        }

        setIsActive(false)
      })
    }
  }, [issuer, setIsActive])

  return {
    isActive,
    auth,
    extraParams,
    issuer,
    clients: AppConfig.clients,
    onSubmit,
    onLogout
  }
}