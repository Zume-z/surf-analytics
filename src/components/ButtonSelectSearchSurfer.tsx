import React from 'react'
import { Command } from 'cmdk'
import { useState } from 'react'
import Image from 'next/legacy/image'
import CardSurfer from './CardSurfer'
import { Surfer } from '@/utils/interfaces'
import { Cross2Icon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/outline'

export type ButtonSelectSearch = {
  className?: string
  placeHolder?: string
  searchPlaceHolder?: string
  options: { label: string; value: string; surfer: Surfer }[] | undefined
  value?: string | number
  setValue: (value: string | null) => void
  loading?: boolean
  loadingText?: string
}

export default function ButtonSelectSearchSurfer({ className, placeHolder, searchPlaceHolder, value, setValue, options, loading, loadingText }: ButtonSelectSearch) {
  const selectedItem = options ? options.find((option) => value == option.value) : undefined
  const [btnOpen, setBtnOpen] = useState(false)

  const handleSearch = (label: string) => {
    const selectedOption = options?.find((option) => option.label.toLowerCase() == label)
    if (selectedOption) setValue(selectedOption.value.toString())
  }

  return (
    <div>
      {!loading && options && (
        <div>
          {!value && (
            <div className={`my-1 cursor-pointer px-2 sm:px-4 ${className}`} onClick={() => setBtnOpen(true)}>
              <div className={btnOpen ? 'select-btn__open ' : 'select-btn__closed rounded-md border-gray-200 bg-white'}>
                <Popover.Root open={btnOpen} onOpenChange={setBtnOpen}>
                  <Popover.Trigger className="z-40 flex items-center outline-none">
                    {placeHolder}
                    <div className="ml-1 py-1">
                      {btnOpen ? (
                        <div className="rounded-full border border-gray-300 bg-blue-base p-0.5 text-white shadow">
                          <ChevronDownIcon className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="rounded-full border border-gray-300 bg-blue-base p-0.5 text-white shadow">
                          <PlusIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </Popover.Trigger>
                  <Popover.Content className="z-40 -ml-2 max-h-96 overflow-auto rounded-md  border border-gray-100 bg-white shadow-sm " sideOffset={8} align="start">
                    <Command>
                      <Command.Input autoFocus className=" border-b py-2 pl-4 text-gray-500 focus:outline-none" placeholder={searchPlaceHolder} />
                      <Command.List>
                        {options.map((option, i) => (
                          <Command.Item key={i} value={option.label.toString()} onSelect={handleSearch} className={option.value == value ? 'select-btn__item-active' : 'select-btn__item-inactive z-50'}>
                            {/* EXPORT */}
                            <div className="py-1 pr-4">
                              <div className="flex items-center whitespace-nowrap text-sm">
                                <div className={`transition-200 h-10 w-10 flex-shrink-0 rounded-full  bg-gray-100 hover-mod:group-hover:bg-white`}>
                                  <Image src={option.surfer.profileImage} className="rounded-full" width={100} height={99} />
                                </div>
                                <div className="ml-2">
                                  <div className="">{option.surfer.name}</div>
                                  <div className="flex items-center space-x-1">
                                    <Image src={option.surfer.country.flagLink} width={16} height={11} />
                                    <div className="text-gray-dark ">{option.surfer.country.name}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
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
            <div className={`my-1 rounded-md border border-gray-100 bg-white px-2 py-1 shadow-sm  sm:px-4 ${className}`}>
              <button className="z-40 flex items-center whitespace-nowrap outline-none" onClick={() => (setValue(null), setBtnOpen(false))}>
                {selectedItem && <CardSurfer surfer={selectedItem.surfer} />}
                <div className="relative -top-6 -right-6 rounded-full border bg-white p-0.5 text-gray-400 shadow">
                  <Cross2Icon />
                </div>
              </button>
            </div>
          )}
        </div>
      )}
      {(loading || !options) && (
        <div className={`my-1 px-2 sm:px-4 ${className}`}>
          <div className="flex animate-pulse items-center rounded border border-gray-200 bg-gray-md py-1 px-2 text-white ">
            <div>{placeHolder}</div>
            <div className="ml-1">
              <div className="rounded-full border border-gray-300 bg-gray-300 p-0.5 text-white shadow">
                <PlusIcon className="h-4" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
