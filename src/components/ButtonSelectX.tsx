import { useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { toString } from '@/utils/format/toString'
import { ChevronDownIcon, Cross2Icon, DashIcon } from '@radix-ui/react-icons'

export type ButtonSelectPropsX = {
  className?: string
  placeHolder?: string
  options: { label: string; value: string | number }[] | undefined
  value?: string | number
  setValue: (value: string | null) => void
  loading?: boolean
  loadingText?: string
}

const ButtonSelectX = ({ className, placeHolder, value, setValue, options, loading, loadingText }: ButtonSelectPropsX) => {
  const selectedItem = options ? options.find((option) => value == option.value) : undefined
  const [btnOpen, setBtnOpen] = useState(false)
  return (
    <div>
      {!loading && options && (
        <div>
          {!value ? (
            <div className={`group my-1 cursor-pointer px-2 sm:px-4 ${className}`} onClick={() => setBtnOpen(true)}>
              <div className={btnOpen ? 'select-btn__open' : 'select-btn__closed'}>
                <Select.Root value={toString(value)} onValueChange={setValue} open={btnOpen} onOpenChange={setBtnOpen}>
                  <Select.Trigger className=" z-40 flex items-center outline-none">
                    {!!value ? <Select.Value /> : placeHolder}
                    <Select.Icon className="ml-1">{btnOpen ? <DashIcon className="-mb-0.5" /> : <ChevronDownIcon />}</Select.Icon>
                  </Select.Trigger>
                  <Select.Content className="z-40 -ml-2 max-h-60 rounded-md  border border-gray-100 bg-white shadow " position="popper" sideOffset={8} align="start">
                    <Select.Viewport>
                      {options.map((option, i) => (
                        <Select.Item key={i} value={option.value.toString()} className={option.value == value ? 'select-btn__item-active' : 'select-btn__item-inactive'}>
                          <Select.ItemText>{option.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton onClick={() => setBtnOpen} className="flex cursor-pointer items-center justify-center border-t bg-gray-50 p-2 text-gray-700 outline-none ">
                      <ChevronDownIcon />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          ) : (
            <div className={`my-1 px-2 sm:px-4 ${className}`}>
              <div className="select-btn__closed ">
                <button className="z-40 flex items-center whitespace-nowrap outline-none" onClick={() => setValue(null)}>
                  {selectedItem?.label} <Cross2Icon className="ml-1" />
                </button>
              </div>
            </div>
          )}
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

export default ButtonSelectX
