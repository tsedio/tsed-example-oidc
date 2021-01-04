import jwtDecode from 'jwt-decode'
import React from 'react'
import { ButtonComponent } from '../forms/button/button.component'

function DebugToken ({ token }) {
  return <div className={'bg-gray-lighter pb-4 p-5 mb-10 rounded-small flex'}>
    <div className={'w-1/2 flex flex-col pr-2'}>
      <h5 className={'px-0'}>Encoded</h5>
      <div className={'flex-1 flex'}>
        <textarea className={'h-full w-full p-2 text-sm'}>{token}</textarea>
      </div>
    </div>
    <div className={'w-1/2 flex flex-col pl-2'}>
      <h5 className={'px-0'}>Decoded</h5>
      <div className={'flex-1 flex'}>
            <pre
              className={'overflow-auto bg-white p-2 text-sm'}><code>{JSON.stringify(jwtDecode(token), null, 2)}</code></pre>
      </div>
    </div>
  </div>
}

export function UserInfo ({ id_token, access_token, profile, logout }) {
  return <div className={"pb-5"}>
    <div>
      <div className={'flex'}>
        <h3 className={'mx-0 flex-1'}>User info</h3>
        <div>
          <ButtonComponent onClick={logout}>
            Logout
          </ButtonComponent>
        </div>
      </div>

      <div className={'bg-gray-lighter pb-4 p-5 mb-10 rounded-small'}>
        <table>
          <tbody>
          {
            Object.entries(profile).map(([key, value]) => {
              return <tr key={key}>
                <th className={'text-left p-1'}>{key}</th>
                <td className={'p-1'}>{value}</td>
              </tr>
            })
          }

          </tbody>
        </table>
      </div>
    </div>

    {
      id_token && <div>
        <h3>Id token</h3>

        <DebugToken token={id_token}/>
      </div>
    }

    {
      access_token && <div>
        <h3>Access token</h3>

        <DebugToken token={access_token}/>
      </div>
    }
  </div>
}