import React, { useCallback, useState } from 'react'

export function RadioComponent ({ name, label, className, choices, value = [], onChange }) {
  const [localValue, setValue] = useState(value)
  const onLocalChange = useCallback((evt) => {
    const { value } = evt.currentTarget

    setValue(value)
    onChange(name, value)
  }, [name, setValue, onChange])

  return <div className={className}>
    <div className={'font-bold'}>{label}</div>

    <ul className={'reset-list flex -mx-3'}>
      {
        choices.map(({ label, required, disabled, value }) => {
          return <li key={value} className={'flex px-3 py-1'}>
            <label><input type="radio"
                          className={'mr-2'}
                          name={name}
                          required={required}
                          disabled={disabled}
                          checked={localValue === value}
                          value={value}
                          onChange={onLocalChange}/>{label || value}</label>
          </li>
        })
      }
    </ul>
  </div>
}