import React, { useCallback, useState } from 'react'
import { ButtonComponent } from '../forms/button/button.component'
import { CheckboxesComponent } from '../forms/checkboxes/checkboxes.component'
import { InputComponent } from '../forms/input/input.component'
import { RadioComponent } from '../forms/radio/radio.component'

const noop = () => {
}

function useForm (initialState, onSubmit) {
  const [form, setForm] = useState(initialState)
  const submit = useCallback((action) => {
    onSubmit({
      client_id: form.client_id,
      ...action.value,
      scope: form.scopes.join(' '),
      response_type: form.response_type,
      query: form.query
    })
  }, [onSubmit, form])

  const onChange = useCallback((name, value) => {
    const newForm = {
      ...form,
      [name]: value
    }

    setForm(newForm)
  }, [form])

  return {
    form,
    submit,
    onChange
  }
}

export function ClientComponent ({
                                   client_name,
                                   client_id,
                                   scopes = [],
                                   response_types = [],
                                   onSubmit = noop,
                                   actions = [],
                                   query= false
                                 }) {
  const { form, onChange, submit } = useForm({
    client_id,
    scopes: scopes
      .filter(scope => scope.required || scope.checked)
      .map((scope) => scope.value),
    response_type: response_types.length && response_types[0].value,
    query: query
      .reduce((hash, query) => {
        return {
          ...hash,
          [query.name]: query.value
        }
      }, {})
  }, onSubmit)

  return <div>
    <div className={'flex'}>
      <div>
        <strong className={'block'}>{client_name}</strong>
        <small><i className="fas fa-key text-xxs mr-1"/> {client_id}</small>
      </div>
    </div>

    <form className={'pt-5'} onSubmit={(event) => event.preventDefault()}>
      {
        scopes.length &&
        <CheckboxesComponent
          label={'Scopes'}
          name={'scopes'}
          className={'pb-4'}
          choices={scopes}
          value={form.scopes}
          onChange={onChange}/>
      }

      {
        response_types && <RadioComponent
          className={'pb-4'}
          label={'Response types'}
          choices={response_types}
          value={form.response_type}
          onChange={onChange}/>
      }

      {
        query && <div>
          <div className={"font-bold mb-5 pb-2 border-b-1 border-gray-light"}>Query params</div>
          {
            query.map((item) => {
              return <InputComponent
                {...item}
                value={form.query[item.name]}
                className="mb-5"
                key={item.name}
                onChange={(name, value) =>{
                  onChange(name, {
                    ...query,
                    [name]: value
                  })
                }}>{item.label}</InputComponent>
            })
          }
        </div>
      }

      {
        actions.length && <div className={'flex'}>
          {
            actions.map((action) => {
              return <ButtonComponent
                key={action.label}
                onClick={() => submit(action)}>{action.label}</ButtonComponent>
            })
          }
        </div>
      }
    </form>
  </div>
}



