import React, { useEffect, useState } from 'react'

export function FadeComponent ({ show, children }) {
  const [shouldRender, setRender] = useState(show)
  useEffect(() => {
    if (show) setRender(true)
  }, [show])

  const onAnimationEnd = () => {
    if (!show) setRender(false)
  }

  return (
    shouldRender && (
      <div
        className={show ? ' w-full fadeIn' : ' w-full fadeOut'}
        onAnimationEnd={onAnimationEnd}>
        {children}
      </div>
    )
  )
}
