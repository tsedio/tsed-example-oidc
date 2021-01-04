import { useCallback, useEffect, useState } from 'react'
import { AppConfig } from '../app.config'
import { Issuer } from './oidc.client'

export function useOidc () {
  const [issuer, setIssuer] = useState(null)
  const [auth, setAuth] = useState(null)
  const [isActive, setIsActive] = useState(true)

  const onSubmit = useCallback(({ grant_type, ...options }) => {
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
      Issuer.get(AppConfig.issuer).discover().then((issuer) => {
        setIssuer(AppConfig.issuer)

        if (window.location.href.indexOf('#') >= 0) {
          return issuer.processSigninUrl()
        }

        if (window.location.href.indexOf('?') >= 0) {
          return issuer.processSignoutUrl()
        }

        if (issuer.hasAuth()) {
          setAuth(issuer.getAuth())
        }

        setIsActive(false)
      })
    }
  }, [issuer, setIsActive])

  return {
    isActive,
    auth,
    issuer,
    clients: AppConfig.clients,
    onSubmit,
    onLogout
  }
}