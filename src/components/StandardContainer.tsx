import { PropsWithChildren } from 'react'

export function StandardContainer({ children }: PropsWithChildren<{}>) {
  return (
    <div className="md:px-6 lg:px-10 xl:px-16 max-w-7xl mx-auto w-full flex flex-col gap-5 overflow-hidden">
      {children}
    </div>
  )
}
