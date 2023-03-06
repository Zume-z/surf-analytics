import React from 'react'
import { Command } from 'cmdk'
import { useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { toString } from '@/utils/format/toString'
import type { ButtonSelectPropsX } from './ButtonSelectX'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { ChevronDownIcon, Cross2Icon, DashIcon } from '@radix-ui/react-icons'

export default function ButtonSelectSearch({ placeHolder, value, setValue, options, loading, loadingText }: ButtonSelectPropsX) {
  const selectedItem = options ? options.find((option) => value == option.value) : undefined
  const [btnOpen, setBtnOpen] = useState(false)
  return (
    <div className="px-2 sm:px-4">
      {!loading && options && (
        <div className={btnOpen ? 'select-btn__open' : 'select-btn__closed '}>
          {!value ? (
            <Select.Root value={toString(value)} onValueChange={setValue} open={btnOpen} onOpenChange={setBtnOpen}>
              {/* BUTTON */}
              <Select.Trigger className=" z-40 flex items-center  outline-none   ">
                {!!value ? <Select.Value /> : placeHolder}
                <Select.Icon className="ml-1">{btnOpen ? <DashIcon className="-mb-0.5" /> : <ChevronDownIcon />}</Select.Icon>
              </Select.Trigger>

              {/* DROPDOWN */}
              <Select.Content className="z-40 -ml-6 max-h-60 rounded-md  border border-gray-100 bg-white shadow " position="popper" sideOffset={15} align="start">
                {/* <Select.Viewport>
                  {options.map((option, i) => (
                    <Select.Item key={i} value={option.value.toString()} className={option.value == value ? 'select-btn__item-active' : 'select-btn__item-inactive'}>
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton className="flex cursor-pointer items-center justify-center border-t bg-gray-50 p-2 text-gray-700 outline-none ">
                  <ChevronDownIcon /> 
                </Select.ScrollDownButton> */}

                <Select.Viewport>
                  <Command>
                    <div cmdk-input-wrapper="" className="flex">
                      <MagnifyingGlassIcon aria-hidden width="20px" height="20px" />
                      <Command.Input className=" text-gray-500" placeholder="" autoFocus />
                    </div>
                    <Command.List>
                      {options.map((option, i) => (
                        <Command.Item key={i} value={option.value.toString()} onSelect={setValue} className={option.value == value ? 'select-btn__item-active' : 'select-btn__item-inactive z--5'}>
                          x
                        </Command.Item>
                      ))}
                    </Command.List>
                  </Command>
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
          ) : (
            <button className="z-40  flex items-center whitespace-nowrap outline-none  " onClick={() => setValue(null)}>
              {selectedItem?.label} <Cross2Icon className="ml-1" />
            </button>
          )}
        </div>
      )}
      {loading && (
        <div className="flex animate-pulse items-center rounded border border-gray-200 bg-gray-md py-0.5 px-2 text-white ">
          <div>{loadingText}</div>
          <div className="ml-1">
            <ChevronDownIcon />
          </div>
        </div>
      )}
    </div>
  )
}
