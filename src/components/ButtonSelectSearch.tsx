import React from 'react'
import { Command } from 'cmdk'
import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { ChevronDownIcon, Cross2Icon, DashIcon } from '@radix-ui/react-icons'

type ButtonSelectSearch = {
  className?: string
  placeHolder?: string
  searchPlaceHolder?: string
  options: { label: string; value: string | number }[] | undefined
  value?: string | number
  setValue: (value: string | null) => void
  loading?: boolean
  loadingText?: string
}

export default function ButtonSelectSearch({ className, placeHolder, searchPlaceHolder, value, setValue, options, loading, loadingText }: ButtonSelectSearch) {
  const [btnOpen, setBtnOpen] = useState(false)
  const selectedItem = options ? options.find((option) => value == option.value) : undefined

  const handleSearch = (label: string) => {
    const selectedOption = options?.find((option) => option.label.toLowerCase() == label)
    if (selectedOption) setValue(selectedOption.value.toString())
  }
  return (
    <div>
      {!loading && options && (
        <div>
          {!value && (
            <div className={`group my-1 cursor-pointer px-2 sm:px-4 ${className}`} onClick={() => setBtnOpen(true)}>
              <div className={btnOpen ? 'select-btn__open' : 'select-btn__closed'}>
                <Popover.Root open={btnOpen} onOpenChange={setBtnOpen}>
                  <Popover.Trigger className="z-40 flex items-center outline-none">
                    <div>{placeHolder}</div>
                    <div className="ml-1">{btnOpen ? <DashIcon className="-mb-0.5" /> : <ChevronDownIcon />}</div>
                  </Popover.Trigger>
                  <Popover.Content avoidCollisions={false} className="scrollbar-none z-40 -ml-2 max-h-60  overflow-auto rounded-md border border-gray-100 bg-white shadow " sideOffset={8} align="start">
                    <Command>
                      <Command.Input className=" border-b py-2 pl-4 text-gray-500 focus:outline-none" placeholder={searchPlaceHolder} />
                      <Command.List>
                        {options!.map((option, i) => (
                          <Command.Item key={i} value={option.label.toString()} onSelect={handleSearch} className={option.value == value ? 'select-btn__item-active' : 'select-btn__item-inactive z-50'}>
                            {option.label}
                          </Command.Item>
                        ))}
                      </Command.List>
                    </Command>
                  </Popover.Content>
                </Popover.Root>
              </div>
            </div>
          )}
          {value && (
            <div className={`my-1 px-2 sm:px-4 ${className}`}>
              <div className="select-btn__closed ">
                <button className="z-40 flex items-center whitespace-nowrap outline-none" onClick={() => (setValue(null), setBtnOpen(false))}>
                  <div>{selectedItem?.label}</div>
                  <Cross2Icon className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {(loading || !options) && (
        <div className={`my-1 px-2 sm:px-4 ${className}`}>
          <div className="flex animate-pulse items-center rounded border border-gray-200 bg-gray-md py-0.5 px-2 text-white ">
            <div>{loadingText}</div>
            <ChevronDownIcon className="ml-1" />
          </div>
        </div>
      )}
    </div>
  )
}
