'use client'

import {
  useFieldProps,
  useField,
  useForm,
  useFormFields,
  TextInput,
  FieldLabel,
} from '@payloadcms/ui'
import { FormState, SelectFieldClientProps } from 'payload'
import { useEffect } from 'react'

function getPosition(state: FormState, path: string) {
  const layoutTemplate = state['template'].value
  if (layoutTemplate === 'standard') {
    const pathSections = path.split('.')
    const [blocksFieldName, index] = pathSections
    const template = state[`${blocksFieldName}.${index}.template`]?.value
    if (template === 'SidebarTrio') {
      return 'sidebar'
    } else if (template === 'WKND') {
      return 'sidebar'
    } else if (template === 'Opinion') {
      return 'sidebar'
    } else if (template === 'Magazine') {
      return 'fullBottom'
    }
  }
  return 'main'
}

export const AutomaticPositionComponent: React.FC<SelectFieldClientProps> = ({ field }) => {
  const { label, options } = field
  const { path } = useFieldProps()
  const { value, setValue } = useField<string>({ path })

  const targetFieldValue = useFormFields(([fields]) => {
    return getPosition(fields, path)
  })

  useEffect(() => {
    if (targetFieldValue) {
      if (value !== targetFieldValue) setValue(targetFieldValue)
    } else {
      if (value !== '') setValue('')
    }
  }, [targetFieldValue, setValue, field, value])

  return (
    <div className="field-type">
      <FieldLabel field={field} htmlFor={`field-${path}`} label={label} />
      <TextInput
        // @ts-expect-error
        value={options.find((option) => option.value === value)?.label}
        path={path}
        readOnly
      />
    </div>
  )
}
