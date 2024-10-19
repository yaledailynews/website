'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { FormBlock as FormBlockProps } from '@/payload-types'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export const FormBlock: React.FC<FormBlockProps> = (props) => {
  const { enableIntro, form: formFromProps, introContent } = props

  if (typeof formFromProps === 'number') {
    // TODO: fetch form from server
    throw new Error('FormBlock: form fetching not implemented')
  }

  const {
    confirmationMessage,
    confirmationType,
    id: formID,
    redirect,
    submitButtonLabel,
  } = formFromProps

  if (!formFromProps.fields) {
    throw new Error('FormBlock: form fields are required')
  }

  const formMethods = useForm({
    // @ts-expect-error
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <div className="container lg:max-w-[48rem] bg-gray-100 pt-6 pb-10 px-8 font-sans border border-gray-200">
      <FormProvider {...formMethods}>
        {enableIntro && introContent && !hasSubmitted && (
          <RichText className="mb-6 mt-1" content={introContent} font="sans" size="lg" />
        )}
        {!isLoading && hasSubmitted && confirmationMessage && confirmationType === 'message' && (
          <RichText content={confirmationMessage} font="sans" size="lg" />
        )}
        {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
        {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        {!hasSubmitted && (
          <form id={formID.toString()} onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            {formFromProps &&
              formFromProps.fields &&
              formFromProps.fields?.map((field, index) => {
                const Field: React.FC<any> = fields?.[field.blockType]
                if (Field) {
                  return (
                    <div key={index}>
                      <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        control={control}
                        errors={errors}
                        register={register}
                      />
                    </div>
                  )
                }
                return null
              })}

            <button
              form={formID.toString()}
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 text-base mt-4"
            >
              {submitButtonLabel}
            </button>
          </form>
        )}
      </FormProvider>
    </div>
  )
}
