import React from 'react'

export function withOptionalIf (Component) {
  return ({ if: show = true, ...props }) => {
    if (!show) {
      return null
    }

    return <Component {...props}/>
  }
}

export function withIf (Component) {
  return ({ if: show, ...props }) => {
    if (!show) {
      return null
    }

    return <Component {...props}/>
  }
}
