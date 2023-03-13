import * as Switch from '@radix-ui/react-switch'

interface SwitchProps {
  className?: string
  label: string
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  checkDisable?: boolean
}

export default function ButtonSwitch({ className, label, checked, onCheckedChange, checkDisable }: SwitchProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}  >
      <Switch.Root disabled={checkDisable} onCheckedChange={onCheckedChange} checked={checked} className="relative  h-[25px] w-[42px] cursor-default rounded-full bg-gray-200  outline-none  data-[state=checked]:bg-blue-base" id="headToHead">
        <Switch.Thumb className=" block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
      <label className="pr-[15px] text-[15px] text-gray-700 leading-none ">{label}</label>
    </div>
  )
}
