import React, { useCallback, useState } from 'react'

export function CheckboxesComponent ({ name, label, value, choices = [], className, onChange }) {
  const [localValue, setValue] = useState(value)
  const onLocalChange = useCallback((evt) => {
    const { checked, value } = evt.currentTarget

    if (checked) {
      const values = localValue.concat(value)
      setValue(values)
      onChange(name, values)
    } else {
      const values = localValue.filter(item => item !== value)
      setValue(values)
      onChange(name, values)
    }
  }, [setValue, onChange, localValue, name])

  return <div className={className}>
    <div className={'font-bold'}>{label}</div>

    <ul className={'reset-list flex -mx-3'}>
      {
        choices.map(({ label, required, disabled, value }) => {
          return <li key={value} className={'flex px-3 py-1'}>
            <label>
              <input
                type="checkbox"
                className={'mr-1'}
                name={name}
                value={value}
                disabled={disabled ? true : required}
                required={required}
                checked={localValue.includes(value)}
                onChange={onLocalChange}/>{label || value}
            </label>
          </li>
        })
      }
    </ul>
  </div>
}