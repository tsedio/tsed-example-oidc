import React from 'react'

export function LogoComponent ({ className = '' }) {
  return <div className={`flex align-center justify-center ${className}`}>
    <img src="https://tsed.io/tsed-og.png"
         alt="Ts.ED"
         className={'rounded-full'}
         style={{ maxWidth: '150px' }}/>
  </div>
}