import React from 'react'
import { FadeComponent } from './fade.component'

export default function LoaderComponent ({ isActive }) {
  return (
    <div className="opacity-85 z-20 relative">
      <FadeComponent show={isActive}>
        <div
          className="flex items-center justify-center p-5 fixed top-0 right-0 left-0 bottom-0 bg-white">
          <i className="fas fa-spinner text-5xl rotateInfinite"/>
        </div>
      </FadeComponent>
    </div>
  )
}
