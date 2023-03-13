import React from 'react'
import { Command } from 'cmdk'
import { useState } from 'react'
import Image from 'next/legacy/image'
import { Surfer } from '@/utils/interfaces'
import { Cross2Icon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { shortSurferName } from '@/utils/format/shortSurferName'
import { shortCountryName } from '@/utils/format/shortCountryName'

type ButtonSelectSearchSurfer = {
  className?: string
  placeHolder?: string
  searchPlaceHolder?: string
  options: { label: string; value: string; surfer: Surfer }[] | undefined
  value?: string | number
  setValue: (value: string | null) => void
  loading?: boolean
  viewPortAlign?: 'start' | 'center' | 'end'
  selectedOptionSlug?: string | null
}

const Surfer = ({ surfer }: { surfer: Surfer }) => {
  return (
    <div className="min-w-[110px] items-center whitespace-nowrap px-2 py-1 text-sm sm:flex sm:py-0 sm:px-0">
      <div className="flex items-center justify-center">
        <div className={`transition-200 h-12 w-12 flex-shrink-0 rounded-full border border-gray-200 bg-gray-100 hover-mod:group-hover:bg-white`}>
          <Image src={surfer.profileImage} className="rounded-full" width={100} height={99} />
        </div>
      </div>
      <div className="sm:ml-2">
        <div className="flex w-full items-center justify-center sm:justify-start">
          <div className="hidden sm:block">{surfer.name}</div>
          <div className="block sm:hidden">{shortSurferName(surfer.name)}</div>
        </div>
        <div className="flex h-full w-full items-center justify-center space-x-1 sm:justify-start">
          <Image src={surfer.country.flagLink} width={16} height={11} />
          <div className="hidden text-gray-dark sm:block">{surfer.country.name}</div>
          <div className="block text-xs text-gray-dark sm:hidden">{shortCountryName(surfer.country.name)}</div>
        </div>
      </div>
    </div>
  )
}

export default function ButtonSelectSearchSurfer({ className, placeHolder, searchPlaceHolder, value, setValue, options, loading, viewPortAlign, selectedOptionSlug }: ButtonSelectSearchSurfer) {
  const selectedItem = options ? options.find((option) => value == option.value) : undefined
  const [btnOpen, setBtnOpen] = useState(false)
  const optionsFilter = !options ? undefined : options && selectedOptionSlug ? options.filter((option) => option.value != selectedOptionSlug) : options

  const handleSearch = (label: string) => {
    const selectedOption = options?.find((option) => option.label.toLowerCase() == label)
    if (selectedOption) setValue(selectedOption.value.toString())
  }

  return (
    <div>
      {!loading && optionsFilter && (
        <div>
          {!value && (
            <div className={`my-1 cursor-pointer  sm:px-4 ${className}`} onClick={() => setBtnOpen(true)}>
              <div className={btnOpen ? 'select-btn__open ' : 'select-btn__closed rounded-md border-gray-200 bg-white'}>
                <Popover.Root open={btnOpen} onOpenChange={setBtnOpen}>
                  <Popover.Trigger className="z-40 flex items-center py-1 outline-none ">
                    <div className="mr-1 flex items-center whitespace-nowrap text-sm sm:text-base ">{placeHolder}</div>
                    <div>
                      {btnOpen ? (
                        <div className="rounded-full border border-gray-300 bg-blue-base p-0.5 text-white shadow">
                          <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      ) : (
                        <div className=" rounded-full border border-gray-300 bg-blue-base  p-0.5  text-white shadow">
                          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      )}
                    </div>
                  </Popover.Trigger>
                  <Popover.Content
                    avoidCollisions={false}
                    className={`scrollbar-none  z-40 max-h-96 overflow-y-auto rounded-md border border-gray-100 bg-white shadow-sm ${viewPortAlign == 'start' ? '-ml-2' : viewPortAlign == 'end' && '-mr-2'}`}
                    sideOffset={8}
                    align={viewPortAlign}
                  >
                    <Command>
                      <Command.Input className="w-full border-b py-2 pl-4 text-gray-500 focus:outline-none" placeholder={searchPlaceHolder} />
                      <Command.List>
                        {optionsFilter.map((option, i) => (
                          <Command.Item key={i} value={option.label.toString()} onSelect={handleSearch} className={option.value == value ? 'select-btn__item-active' : 'select-btn__item-inactive group'}>
                            <div>
                              <div className="py-1 sm:pr-4 ">
                                <div className="flex items-center whitespace-nowrap text-sm">
                                  <div className={`transition-200 h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 hover-mod:group-hover:bg-white`}>
                                    <Image src={option.surfer.profileImage} className="rounded-full" width={100} height={99} />
                                  </div>
                                  <div className="ml-2">
                                    <div className="">{option.surfer.name}</div>
                                    <div className="flex items-center space-x-1">
                                      <Image src={option.surfer.country.flagLink} width={16} height={11} />
                                      <div className=" text-gray-400 hover-mod:group-hover:text-gray-dark ">{option.surfer.country.name}</div>
                                    </div>
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
            <div className={`group my-1 rounded-md border border-gray-100 bg-white py-1 shadow  sm:px-4 ${className}`}>
              <button className=" relative z-40 flex items-center whitespace-nowrap  outline-none" onClick={() => (setValue(null), setBtnOpen(false))}>
                {selectedItem && <Surfer surfer={selectedItem.surfer} />}
                <div className="transition-200 absolute -top-3 -right-2 rounded-full border bg-white p-0.5 text-gray-400 shadow sm:-right-6 hover-mod:group-hover:bg-blue-base hover-mod:group-hover:text-white">
                  <Cross2Icon className="h-4 w-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      )}
      {(loading || !options) && (
        <div className={`my-1  sm:px-4 ${className}`}>
          <div className="flex animate-pulse items-center rounded border border-gray-200 bg-gray-md py-1 px-2 text-white ">
            <div className="mr-1 flex items-center whitespace-nowrap text-sm sm:text-base ">{placeHolder}</div>
            <div>
              <div className="rounded-full border border-gray-300 bg-gray-300 p-0.5 text-white shadow">
                <PlusIcon className="h-3 sm:h-4" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
