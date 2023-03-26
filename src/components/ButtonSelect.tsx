import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, DashIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { toString } from '@/utils/format/toString'

export type ButtonSelectProps = {
  className?: string
  placeHolder?: string
  options: { label: string; value: string | number }[] | undefined
  value?: string | number
  setValue: (value: string) => void
  loading?: boolean
  loadingText?: string
}

export default function ButtonSelect({ className, placeHolder, value, setValue, options, loading, loadingText }: ButtonSelectProps) {
  const [btnOpen, setBtnOpen] = useState(false)
  return (
    <div>
      {!loading && options && (
        <div className={`group my-1 cursor-pointer px-2 sm:px-4 ${className}`} onClick={() => setBtnOpen(true)}>
          <div className={btnOpen ? 'select-btn__open  ' : 'select-btn__closed'}>
            <Select.Root value={toString(value)} onValueChange={setValue} open={btnOpen} onOpenChange={setBtnOpen}>
              <Select.Trigger className=" z-40 flex items-center outline-none">
                {value != '' ? <Select.Value /> : placeHolder}
                <Select.Icon className="ml-1">{btnOpen ? <DashIcon className="-mb-0.5" /> : <ChevronDownIcon />}</Select.Icon>
              </Select.Trigger>
              <Select.Content className="z-40 -ml-2 max-h-60 rounded-md border border-gray-100 bg-white shadow" position="popper" sideOffset={8} align="start">
                <Select.Viewport>
                  {options.map((f, i) => (
                    <Select.Item key={i} value={f.value.toString()} className={f.value == value ? 'select-btn__item-active ' : 'select-btn__item-inactive'}>
                      <Select.ItemText className="">{f.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex cursor-pointer items-center justify-center border-t bg-gray-50 p-2 text-gray-700 outline-none ">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      )}
      {loading && (
        <div className={`my-1 px-2 sm:px-4 ${className}`}>
          <div className="flex animate-pulse items-center rounded border border-gray-200 bg-gray-md py-0.5 px-2 text-white ">
            <div>{loadingText}</div>
            <div className="ml-1">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
