import React from 'react'

export function InputComponent ({ name, type, required, label, value, className, onChange }) {
  return <div className={className}>
    <label htmlFor={name} className={'font-bold mb-1 block'}>{label}</label>
    <div className={"flex"}>
      <div className={"border-1 flex-1 p-1 relative rounded-sm transition-colors focus-within:border-blue border-gray-medium text-gray-darker focus-within:text-primary bg-white text-primary"}>
        <input
          className={"reset-input text-current w-full outline-none"}
          type={type}
          id={name}
          name={name}
          value={value}
          required={required}
          onChange={(evt) => onChange(name, evt.target.value)}/>
      </div>
    </div>
  </div>
}