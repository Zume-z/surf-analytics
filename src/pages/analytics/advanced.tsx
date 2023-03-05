import { useState } from 'react'
import Layout from '@/components/Layout'
import TableAnalytics from '@/components/TableAnalytics'

export default function Analytics() {
  const [surfer, setSurfer] = useState('')

  // const tableData = [
  //   { name: 'Name', id: 'name', content: (item: any) => <div>{<CardSurfer surfer={item.surfer} place={item.surferRank} />}</div> },
  //   { name: 'Points', id: 'points', content: (item: any) => <div className="table-item">{item.surferPoints.toLocaleString('en-US')}</div> },
  //   { name: '', id: 'link', width: 'w-px', content: () => <div className="text-blue-base">View Surfer</div> },
  // ]

  //// MOCK DATA //////////
  const kellySlater = {
    name: 'Kelly Slater',
    events: '10',
    avgHeatTotal: '6.80',
  }
  const gabrielMedina = {
    name: 'Gabriel Medina',
    events: '7',
    avgHeatTotal: '8.80',
  }
  const filipeToledo = {
    name: 'Filipe Toledo',
    events: '10',
    avgHeatTotal: '6.8',
  }
  const jackRobinson = {
    name: 'Jack Robinson',
    events: '10',
    avgHeatTotal: '6.8',
  }

  /////////////////////////

  const [counter, setCounter] = useState(2)
  const [items, setItems]: any = useState([{ title: 1, id: 1 }])
  // const items = [kellySlater, gabrielMedina, filipeToledo]

  const tableData = [
    {
      name: 'Header 1',
      id: '1',
      content: (item: any) => (
        <div className=" flex items-center space-x-2">
          <div>{item.title} </div>
          <div onClick={() => handleRemove(item.id)} className="rounded-full border  px-1 hover:bg-gray-200">
            {' '}
            -{' '}
          </div>
        </div>
      ),
    }, // ITEMS TO BE COMPARED eg. Surfer, Event
    { name: 'Header 2', id: '2', content: (item: any) => <div>item 2</div> },
    { name: 'Header 3', id: '3', content: (item: any) => <div>item 3</div> },
    { name: 'Header 4', id: '4', content: (item: any) => <div>item 4</div> },
  ]

  const handleSetItems = () => {
    setItems((items: any) => [...items, { title: counter, id: counter }])
    setCounter(counter + 1)
  }

  const handleRemoveItem = () => {
    setItems(items.filter((items: { id: number }) => items.id !== counter - 1))
    setCounter(counter - 1)
  }

  const handleRemove = (itemId: any) => {
    setItems(items.filter((items: { id: number }) => items.id !== itemId))
  }

  return (
    <Layout>
      <div className="flex space-x-2">
        <div>Analyze</div>
        <div>Compare Surfers</div>
        <div>Custom</div>
      </div>
      <h1 className="py-8 text-center text-3xl font-bold">Analytics</h1>
      <div className="flex items-center justify-center space-x-6">
        <button onClick={() => handleSetItems()} className="rounded-full border p-2 hover:bg-gray-100">
          Add Item +
        </button>
        <button onClick={() => handleRemoveItem()} className="rounded-full border p-2 hover:bg-gray-100">
          Remove Item -
        </button>
        {/* <button className="rounded-full border p-2 hover:bg-gray-100">Add Stat + </button> */}
      </div>

      <TableAnalytics tableData={tableData} items={items} itemKey={'id'} handleAddItem={handleSetItems} />
    </Layout>
  )
}
