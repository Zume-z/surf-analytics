//rfce

import { SearchIcon } from '@heroicons/react/outline/index'

function SearchBar() {
  return (
    <div className="flex items-center px-6 ">
      <div className="trnasform flex h-full w-full items-center rounded-full transition duration-200 ease-in-out hover-mod:hover:shadow-md md:border-2 md:shadow-sm">
        <button className="h-full flex-grow py-2 ">
          <div className="flex-grow">Anywhere</div>
        </button>
        <div className="h-8 border-l pt-2 "></div>
        <button className="h-full flex-grow  py-2  ">
          <div className="">Any Time</div>
        </button>
        <div className="h-8 border-l pt-2 "></div>
        <button className="h-full flex-grow  py-2  ">
          <div className=" text-gray-500">Add guests</div>
        </button>
        <SearchIcon
          // onClick={searchClick}
          className="hidden h-8 cursor-pointer rounded-full bg-teal-600 p-2 text-white md:mx-2 md:inline-flex"
        />
      </div>
      {/* <div className="flex items-center rounded-full py-2 md:border-2 md:shadow-sm">
        <input
          // Map Input to SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-grow bg-transparent pl-5 text-sm text-gray-600 placeholder-gray-400 outline-none"
          placeholder={placeholder || 'Start your search'}
        />
        <SearchIcon
          onClick={searchClick}
          className="hidden h-8 cursor-pointer rounded-full bg-teal-600 p-2 text-white md:mx-2 md:inline-flex"
        />
      </div> */}
    </div>
  )
}

export default SearchBar
