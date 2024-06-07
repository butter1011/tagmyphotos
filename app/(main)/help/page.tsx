"use client"
import React from 'react'
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import faqs from "./faqs";

const HelpPage = () => {
  return (
    <div className='flex flex-col w-full'>
      <div className="px-2 text-3xl">
        <span className="inline-block lg:hidden">FAQs</span>
        <h2 className="hidden bg-gradient-to-br from-foreground-800 to-foreground-500 bg-clip-text pt-4 text-[20px] font-semibold tracking-tight text-transparent dark:to-foreground-200 lg:inline-block p-4">
          Frequently asked questions
        </h2>
      </div>
      <section className="w-full py-20 flex justify-center">
        <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-12">
          <Accordion
            fullWidth
            keepContentMounted
            className="gap-3"
            itemClasses={{
              base: "px-0 sm:px-6",
              title: "font-medium",
              trigger: "py-6 flex-row-reverse",
              content: "pt-0 pb-6 text-base text-default-500",
            }}
            items={faqs}
            selectionMode="multiple"
          >
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                indicator={<Icon icon="lucide:plus" width={24} />}
                title={item.title}
              >
                {item.content}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}

export default HelpPage