'use client'
import React from 'react'

import { Button, Input } from "@nextui-org/react";
import { Divider, RadioGroup, Radio, useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

export const CustomRadio = (props: any) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "data-[selected=true]:border-primary bg-white",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">{description}</span>
        )}
      </div>
    </Component>
  );
};

const settingPage = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const toggleVisibility = () => setIsVisible(!isVisible);
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  return (
    <>
      <div className='m-4 p-4 w-full flex flex-col justify-between border-1 rounded-2xl border-gray-400'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>Custom Setting</h1>
          <p className='text-sm text-gray-400'>
            Please input the openAPI Key and select the GPT model.
          </p>
          <div className='mt-8 flex flex-row w-full p-4 gap-4'>
            <Input
              variant="flat"
              placeholder="Input your OpenAI API Key"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <FaRegEye className="text-xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaRegEyeSlash className="text-xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="w-2/3"
            />
            <div className='flex flex-row gap-2'>
              <Button color="secondary">
                Edit
              </Button>
              <Button color="primary">
                Save
              </Button>
            </div>
          </div>

          <Divider orientation='horizontal' className='m-4 w-full' />

          <div className='w-full p-4'>
            <RadioGroup label="GPT Model" defaultValue="gpt35">
              <CustomRadio value="gpt35">
                GPT 3.5
              </CustomRadio>
              <CustomRadio value="gpt4">
                GPT 4.0
              </CustomRadio>
              <CustomRadio
                value="gpt4o"
              >
                GPT 4o
              </CustomRadio>
            </RadioGroup>
          </div>
        </div>

        <div className='flex flex-row w-full p-4 gap-4'>
          <p className='text-md text-gray-400'>
            ChatGPT 4.0 correctly identified the diagnosis in 47 out of 63 matched case report vignettes (74.6% accuracy) compared to 54 out of 63 in the corresponding standardized sample question vignettes on the same diseases (85.7% accuracy)
          </p>
        </div>
      </div>
    </>
  )
}

export default settingPage