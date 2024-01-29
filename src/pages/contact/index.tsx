import { useState } from 'react'
import Layout from '@/components/Layout'
import * as Tabs from '@radix-ui/react-tabs'

export default function Contact() {
  const FORM_ENDPOINT = ''
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = () => {
    setTimeout(() => {
      setSubmitted(true)
    }, 100)
  }

  const tabContents = [
    {
      title: 'General',
      value: 'tab1',
      subTitle: 'Get in touch.',
      subText: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe beatae suscipit maiores possimus accusamus nemo molestiae, odio quod nisi, a dolore deserunt sapiente, illo labore voluptatem. Labore natus accusantium iste.',
      inputs: [
        {
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your name',
          name: 'name',
          required: true,
        },
        {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
          name: 'email',
          required: true,
        },
      ],
    },
    {
      title: 'Media Inquiry',
      value: 'tab2',
      subTitle: 'Media inquiry.',
      subText: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe beatae suscipit maiores possimus accusamus nemo molestiae, odio quod nisi, a dolore deserunt sapiente, illo labore voluptatem. Labore natus accusantium iste.',
      inputs: [
        {
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your name',
          name: 'name',
          required: true,
        },
        {
          label: 'Company',
          type: 'text',
          placeholder: 'Enter your company',
          name: 'name',
          required: true,
        },
        {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
          name: 'email',
          required: true,
        },
      ],
    },

    {
      title: 'Feature Request',
      value: 'tab3',
      subTitle: 'Request a feature.',
      subText: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe beatae suscipit maiores possimus accusamus nemo molestiae, odio quod nisi, a dolore deserunt sapiente, illo labore voluptatem. Labore natus accusantium iste.',
      inputs: [
        {
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your name',
          name: 'name',
          required: true,
        },
        {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
          name: 'email',
          required: true,
        },
      ],
    },
  ]

  return (
    <Layout>
      <h1 className="py-8 text-center text-3xl font-bold">Contact</h1>
      <Tabs.Root className=" mb-8 flex flex-col rounded border bg-gray-50 " defaultValue="tab1">
        <Tabs.List className=" flex shrink-0  border-b bg-white " aria-label="Contact">
          {tabContents.map((tab) => (
            <Tabs.Trigger
              className="flex flex-1 cursor-default select-none items-center justify-center whitespace-nowrap border-navy  px-2 py-2  text-gray-dark outline-none  data-[state=active]:border-b-2 data-[state=active]:text-navy hover-mod:hover:text-navy   "
              value={tab.value}
            >
              {tab.title}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {submitted && (
          <div className="my-16 flex w-full justify-center">
            <div>
              <div className="text-2xl">Thank you</div>
              <div className="text-md">We'll be in touch soon.</div>
            </div>
          </div>
        )}

        {!submitted && (
          <div>
            {/* Tab Content */}
            {tabContents.map((tab) => (
              <Tabs.Content className="grow rounded-b-md p-5 outline-none " value={tab.value}>
                <div className="flex space-x-4">
                  {/* LEFT SIDE */}
                  <div className="w-full">
                    <div className="flex justify-center">
                      <div className="w-full  max-w-4xl rounded  p-4 ">
                        <h1 className="py-8 text-center text-2xl font-bold">{tab.subTitle}</h1>
                        {tab.subText}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="w-full">
                    <div className="flex justify-center">
                      <div className="w-full max-w-4xl rounded border bg-white p-4 shadow-sm">
                        <form className="space-y-8 " action={FORM_ENDPOINT} onSubmit={handleSubmit} method="POST">
                          {tab.inputs?.map((input) => (
                            <div className="mb-4">
                              <div className="mb-2">{input.label}</div>
                              <input
                                type={input.type}
                                placeholder={input.placeholder}
                                name={input.name}
                                className=" transition-200 w-full border-0 border-b border-gray-400   bg-white pb-1 text-gray-600 placeholder-gray-400 focus:border-b-2 focus:border-black focus:outline-none hover-mod:hover:border-b-2 hover-mod:hover:border-black"
                                required={input.required}
                              />
                            </div>
                          ))}
                          <div className="mb-4">
                            <div className="mb-2">Message</div>
                            <textarea
                              placeholder="Enter your message"
                              name="message"
                              className=" transition-200 h-40 w-full border-0 border-b  border-gray-400 bg-white pb-1 text-gray-600 placeholder-gray-400 focus:border-b-2 focus:border-black focus:outline-none hover-mod:hover:border-b-2 hover-mod:hover:border-black"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <button
                              className="mr-1 mb-1 rounded bg-navy px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear focus:outline-none active:bg-gray-300 hover-mod:hover:shadow-lg"
                              type="submit"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Content>
            ))}
          </div>
        )}
      </Tabs.Root>
    </Layout>
  )
}
