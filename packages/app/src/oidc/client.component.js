import React, { useCallback, useState } from 'react'
import { ButtonComponent } from '../forms/button/button.component'
import { CheckboxesComponent } from '../forms/checkboxes/checkboxes.component'
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
      response_type: form.response_type
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
                                   actions = []
                                 }) {
  const { form, onChange, submit } = useForm({
    client_id,
    scopes: scopes
      .filter(scope => scope.required || scope.checked)
      .map((scope) => scope.value),
    response_type: response_types.length && response_types[0].value
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



