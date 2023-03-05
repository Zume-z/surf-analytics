import React from 'react'
import * as Select from '@radix-ui/react-select'
import { Command } from 'cmdk'
import { useState } from 'react'
import { ButtonSelectProps } from './ButtonSelect'
import { ChevronDownIcon, ChevronUpIcon, Cross2Icon, DashIcon } from '@radix-ui/react-icons'
import { toString } from '@/utils/format/toString'
import { ChevronRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'

// ButtonSelectProps
// export default function ButtonSelectSearch({ options }: any) {
//   const [open, setOpen] = React.useState(false)

//   const onSelect = () => {
//     setOpen(false)
//   }

//   const [value, setValue] = React.useState('apple')

//   return (
//     <div className="transition-200 z-50 flex items-center text-gray-dark hover:text-black ">
//      {options && ( <Select.Root open={open} onOpenChange={setOpen}>
//         <Select.Trigger>MENU TEST</Select.Trigger>
//         <Select.Content data-side="top">
//           <Select.Viewport className="absolute  -bottom-10 rounded-lg bg-gray-900 p-2 text-gray-100 shadow-lg  ">
//             <Command>
//               <div cmdk-input-wrapper="" className="flex">
//                 <MagnifyingGlassIcon aria-hidden width="20px" height="20px" />
//                 <Command.Input className="bg-gray-900 text-gray-100" placeholder="Set priority..." autoFocus />
//               </div>

//               {/* {options.map((option, i) => (
//                     <Select.Item key={i} value={option.value.toString()} className={option.value == value ? 'select-btn__item-active' : 'select-btn__item-inactive'}>
//                       <Select.ItemText>{option.label}</Select.ItemText>
//                     </Select.Item>
//                   ))} */}
//               <Command.List>
//                 {options.map((option: any, i: number) => (
//                     <Command.Item key={i} onSelect={onSelect} value={option.value.toString()} >
//                       {option.label}
//                     </Command.Item>
//                   ))}
//                 {/* <Command.Item onSelect={onSelect}>None</Command.Item>
//                 <Command.Item onSelect={onSelect}>High</Command.Item>
//                 <Command.Item onSelect={onSelect}>Medium</Command.Item>
//                 <Command.Item onSelect={onSelect}>Low</Command.Item> */}
//               </Command.List>
//             </Command>
//           </Select.Viewport>
//         </Select.Content>
//       </Select.Root>
//      )}
//     </div>
//   )
// }

export default function ButtonSelectSearch({ placeHolder, value, setValue, options, loading, loadingText }: ButtonSelectProps) {
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
                <Select.Icon className="ml-1">{btnOpen ?  <DashIcon className='-mb-0.5' />  : <ChevronDownIcon />}</Select.Icon>
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
                      {options.map((option: any, i: number) => (
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
