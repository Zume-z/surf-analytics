import { Command } from 'cmdk'
import Image from 'next/legacy/image'
import { Event, Surfer } from '@/utils/interfaces'
import { Key, useEffect, useRef, useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

interface FilterSearchBarProps {
  placeHolder: string
  showSearch: boolean
  setShowSearch: any
  searchOptions: { label: string; value: string; surfer?: Surfer | undefined; event?: Event | undefined }[] | undefined
  handleSearch: (value: string) => void
  loading?: boolean
  popularBySlug?: string[]
  searchType: 'SURFER' | 'EVENT' | 'COUNTRY'
}

export default function FilterSearchBar({ placeHolder, showSearch, setShowSearch, searchOptions, handleSearch, loading, popularBySlug, searchType }: FilterSearchBarProps) {
  const searchBar = useRef(null as any)
  const [searchInput, setSearchInput] = useState('')
  const popularOptions = popularBySlug && searchOptions?.filter((surfer: { value: string }) => popularBySlug.includes(surfer.value))
  const sortedPopularOptions = popularBySlug && popularOptions?.sort((a: { value: string }, b: { value: string }) => popularBySlug.indexOf(a.value) - popularBySlug.indexOf(b.value))

  const onSearch = (label: string) => {
    const selectedOption = searchOptions?.find((option: { label: string }) => option.label.toLowerCase() == label)
    if (selectedOption) handleSearch(selectedOption.value)
  }

  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      if (searchBar.current && !searchBar.current.contains(event.target)) setShowSearch(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchBar])

  // SURFER ITEM
  const surferItem = (option: any) => {
    return (
      <div className="flex min-w-[220px] justify-between ">
        <div className="flex items-center whitespace-nowrap text-sm">
          <div className={`transition-200 h-8 w-8 flex-shrink-0 rounded-full bg-gray-100  hover-mod:group-hover:bg-white`}>
            <Image src={option.surfer.profileImage} className="rounded-full" width={50} height={49} />
          </div>
          <div className="ml-2">
            <div className="">{option.surfer.name}</div>
            <div className="flex items-center space-x-1">
              <Image src={option.surfer.country.flagLink} width={16} height={11} />
              <div className=" text-xs text-gray-400 hover-mod:group-hover:text-gray-dark ">{option.surfer.country.name}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // EVENT ITEM
  const eventItem = (option: any) => {
    return (
      <div className="flex min-w-[220px] justify-between ">
        <div className="flex items-center whitespace-nowrap text-sm">
          <div>{option.label}</div>
        </div>
      </div>
    )
  }

  // COUNTRY ITEM
  const countryItem = (option: any) => {
    return (
      <div className="flex min-w-[220px]">
        <div className="flex items-center whitespace-nowrap ">
          <div className="flex h-2 w-6 flex-shrink-0 items-center">
            <Image src={option.country.flagLink} width={40} height={24} alt="" />
          </div>
          <div className="ml-2">{option.label}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      {showSearch && !loading && (
        <div ref={searchBar} className="absolute left-0 z-40 w-full rounded border bg-gray-50 py-2 ">
          <Command
            filter={(value, search) => {
              if (value.includes(search.toLowerCase())) return 1
              return 0
            }}
            className="relative w-full"
          >
            <div className="flex">
              <Command.Input autoFocus={true} value={searchInput} onValueChange={setSearchInput} className=" ml-4  w-full bg-gray-50 text-gray-500 focus:outline-none" placeholder={placeHolder} />
              <div className="mx-1 flex cursor-pointer items-center bg-gray-50 px-3 active:scale-[0.95]" onClick={() => setShowSearch(false)}>
                <MagnifyingGlassIcon className="cursor-pointer text-gray-500 hover-mod:hover:text-navy " height={20} width={20} />
              </div>
            </div>

            {/* Search List */}
            {searchInput && searchOptions && (
              <Command.List className="absolute z-50 mt-4 max-h-80 w-full overflow-auto  rounded border bg-white shadow-sm">
                {searchOptions?.map((option: any, i: Key | null | undefined) => (
                  <Command.Item key={i} value={option.label.toString()} onSelect={onSearch} className={'select-btn__item-inactive group aria-selected:bg-gray-100  '}>
                    {searchType == 'SURFER' && surferItem(option)}
                    {searchType == 'EVENT' && eventItem(option)}
                    {searchType == 'COUNTRY' && countryItem(option)}
                  </Command.Item>
                ))}
              </Command.List>
            )}

            {/* Popular List */}
            {!searchInput && popularBySlug && (
              <Command.List className="absolute z-50 mt-4 max-h-80 w-full overflow-auto  rounded border bg-white shadow-sm">
                <div className="border-b px-4 pt-2 pb-1 text-xs text-gray-500">Most Searched</div>
                {sortedPopularOptions?.map((option: any, i: Key | null | undefined) => (
                  <Command.Item key={i} value={option.label.toString()} onSelect={onSearch} className={'select-btn__item-inactive group aria-selected:bg-gray-100  '}>
                    {searchType == 'SURFER' && surferItem(option)}
                    {searchType == 'EVENT' && eventItem(option)}
                    {searchType == 'COUNTRY' && countryItem(option)}
                  </Command.Item>
                ))}
              </Command.List>
            )}
          </Command>
        </div>
      )}

      {!loading && (
        <div className="flex cursor-pointer items-center  px-4 text-gray-500  active:scale-[0.95] hover-mod:hover:text-navy" onClick={() => setShowSearch(true)}>
          <MagnifyingGlassIcon height={20} width={20} />
        </div>
      )}

      {loading && (
        <div className="mx-2 flex animate-pulse items-center rounded border border-gray-200 bg-gray-md py-1 px-2 text-white ">
          <MagnifyingGlassIcon height={20} width={20} />
        </div>
      )}
    </div>
  )
}
