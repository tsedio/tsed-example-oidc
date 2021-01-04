import React from 'react'
import { ClientComponent } from './client.component'

export function ClientsComponent ({ clients, onSubmit }) {
  return <div>
    <h2>Clients</h2>
    <ul className={'reset-list'}>
      {
        clients.map((client) => {
          return (
            <li className={'bg-gray-lighter pb-4 p-5 mb-10 rounded-small'} key={client.client_id}>
              <ClientComponent {...client} onSubmit={onSubmit}/>
            </li>
          )
        })
      }
    </ul>
  </div>
}



