import type React from 'react'

declare global {
  namespace JSX {
    // Restore to the default React JSX.Element if needed
    interface Element extends React.ReactElement {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}
