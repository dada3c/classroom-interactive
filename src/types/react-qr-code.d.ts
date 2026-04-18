declare module 'react-qr-code' {
  import { SVGProps } from 'react'
  export interface QRCodeProps extends SVGProps<SVGSVGElement> {
    value: string
    size?: number
    bgColor?: string
    fgColor?: string
    level?: 'L' | 'M' | 'Q' | 'H'
    title?: string
  }
  export function QRCode(props: QRCodeProps): JSX.Element
  export default QRCode
}
