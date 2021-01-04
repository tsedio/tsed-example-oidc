import React from 'react'
import LoaderComponent from './forms/loader/loader.component'
import { LogoComponent } from './logo/logo.component'
import { ClientsComponent } from './oidc/clients.component'
import { useOidc } from './oidc/use-oidc.hook'
import { UserInfo } from './oidc/user-info.component'
import { withIf } from './utils/IfDirective'

const IfClientsComponents = withIf(ClientsComponent)
const IfUserInfo = withIf(UserInfo)

function App () {
  const { isActive, clients, onSubmit, auth, onLogout } = useOidc()

  return (
    <div className="App">
      <main className="container content__default">
        <LogoComponent className={'mb-5'}/>
        <LoaderComponent isActive={isActive}/>
        <IfClientsComponents if={!isActive && !auth} clients={clients} onSubmit={onSubmit}/>
        <IfUserInfo if={!isActive && auth} {...auth} logout={onLogout} />
      </main>
    </div>
  )
}

export default App
