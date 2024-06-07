'use client'
import React, { useState, useContext } from 'react'

import { Button, Input } from "@nextui-org/react";
import { Divider, RadioGroup, Radio, useRadio, VisuallyHidden, cn } from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useAtom } from 'jotai';
import { Spinner } from "@nextui-org/react";
import { ToastContext } from "@/components/Contexts/ToastContext";
import { UserInfo, OpenAPIKeyAtom, OpenAIModalAtom } from '@/components/Jotai/atoms';

const CustomRadio = (props: any) => {
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
        "max-w-[400px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4 my-4 mr-8",
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
          <span className="text-small text-foreground opacity-70 py-2">{description}</span>
        )}
      </div>
    </Component>
  );
};

const settingPage = () => {
  const { toast } = useContext<any>(ToastContext);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));
  const [user, setUser] = useAtom<any>(UserInfo);
  const [openAPIKey, setOpenAPIKey] = useAtom<any>(OpenAPIKeyAtom);
  const [model, setModel] = useAtom<any>(OpenAIModalAtom);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );


  const SaveData = async () => {
    setLoading(true);
    if (openAPIKey === "") {
      toast.error("Please input the openAPI Key");
      setLoading(false);
      return;
    }

    const data = {
      email: user?.email,
      openAPIKey: openAPIKey,
      model: model,
    }

    try {
      const res = await axios.post("/api/v1/update", data);

      if (res?.status === 200) {
        toast.success("Successfully saved");
        console.log(res?.data?.user);

        setUser(res?.data?.user);
      } else {
        toast.error("Internal Server error");
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err)
    }
  }

  const handleRadioChange = (value: string) => {
    setModel(value);
  };

  return (
    <>
      <div className='m-4 p-4 w-full flex flex-col justify-between border-1 rounded-2xl border-gray-400'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold text-black'>Custom Setting</h1>
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
              value={openAPIKey}
              onChange={(e) => setOpenAPIKey(e.target.value)}
            />
            <Button color="secondary" onClick={() => SaveData()}>
              {loading ? (
                <Spinner color="white" size="sm" />
              ) : (
                "Save"
              )}
            </Button>
          </div>

          <Divider orientation='horizontal' className='m-4 w-full' />

          <div className='w-full p-4 justify-center'>
            <RadioGroup label="GPT Model" defaultValue="gpt-4-vision-preview" value={model} orientation='horizontal' className='w-full flex m-4'>
              <CustomRadio
                value="gpt-4-vision-preview"
                onChange={() => handleRadioChange('gpt-4-vision-preview')}
                description="GPT-4 model with the ability to understand images, in addition to all other GPT-4 Turbo capabilities. This is a preview model, we recommend developers to now use gpt-4-turbo which includes vision capabilities."
              >
                Gpt-4-vision-preview
              </CustomRadio>
              <CustomRadio
                value="gpt-4-1106-vision-preview"
                description="GPT-4 model with the ability to understand images, in addition to all other GPT-4 Turbo capabilities. This is a preview model, we recommend developers to now use gpt-4-turbo which includes vision capabilities."
                onChange={() => handleRadioChange('gpt-4-1106-vision-preview')}
              >
                Gpt-4-1106-vision-preview
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