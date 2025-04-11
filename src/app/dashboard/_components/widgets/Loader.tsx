import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export function LoadingAnimation() {
  return (
    <Image src="/Ellipsis@1x-1.0s-200px-200px.gif" alt='Ellipsis Loader' height={20} width={20} />
  )
}

export function GPTLoader() {
  return (
    <Image src="/Disk@1x-1.0s-200px-200px.svg" alt='Ellipsis Loader' height={20} width={20} />
  )
}

export function LoadingButton({ btnText, btnClass, btnVariant }) {
  return (
    <Button className={cn('cursor-none w-fit', btnClass)} variant={btnVariant}>
        {btnText} &nbsp; <LoadingAnimation />
    </Button>
  )
}

