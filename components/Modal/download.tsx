'use client'
import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react"
import { useAtom } from 'jotai'
import { DownloadModalAtom, ImageData } from '../Jotai/atoms'
import { MdOutlineEdit } from "react-icons/md";

interface ImgData {
    filename: string;
    title: string;
    tags: string[];
}

const AdobeStockCategory = [
    "None",
    "Animals",
    "Buildings and Architecture",
    "Business",
    "Drinks",
    "The Environment",
    "States of Mind",
    "Food",
    "Graphic Resources",
    "Hobbies and Leisure",
    "Industry",
    "Landscape",
    "Lifestyle",
    "People",
    "Plants and Flowers",
    "Culture and Religion",
    "Science",
    "Social Issues",
    "Sports",
    "Technology",
    "Transport",
    "Travel",
]

const ShutterStockCategory = [
    "None",
    "Miscellaneous",
    "Abstract",
    "Animals/Wildlife",
    "Nature",
    "Backgrounds/Textures",
    "Objects",
    "Beauty/Fashion",
    "Parks/Outdoor",
    "Buildings/Landmarks",
    "People",
    "Business/Finance",
    "Religion",
    "Celebrities",
    "Science",
    "Education",
    "Signs/Symbols",
    "Food and Drink",
    "Sports/Recreation",
    "Healthcare/Medical",
    "Technology",
    "Holidays",
    "The Arts",
    "Industrial",
    "Transportation",
    "Interiors",
    "Vintage",
]

const ShutterStockEditorial = [
    "No",
    "Yes"
]

const ShutterStockMatureContent = [
    "No",
    "Yes"
]

const ShutterStockIllustration = [
    "No",
    "Yes"
]

const DownloadModal = () => {
    const [isOpen, setOpen] = useAtom<any>(DownloadModalAtom);
    const [setting, setSetting] = useState<any>("Default");
    const [adobeStockCategory, setAdobeStockCategory] = useState<any>("None");
    const [shutterStockCategory, setShutterStockCategory] = useState<any>("None");
    const [shutterStockEditorial, setShutterStockEditorial] = useState<any>("None");
    const [shutterStockMatureContent, setShutterStockMatureContent] = useState<any>("None");
    const [shutterStockIllustration, setShutterStockIllustration] = useState<any>("None");
    const [imgdata, setData] = useAtom<ImgData[]>(ImageData);

    const onSetSetting = (value: any) => {
        setSetting(value);
    }

    // Download the CSV file
    const generateCSV = () => {
        let csvContent = 'data:text/csv;charset=utf-8,';

        // Add column headers
        if (setting === "Default") {
            csvContent += "FileName,Title,Tag\n";
            // iterate over the arrays to form the csv content
            for (let i = 0; i < imgdata.length; i++) {
                csvContent += `${imgdata[i]["filename"]},${imgdata[i]["title"]},${imgdata[i]["tags"]}\n`;
            }
        }

        if (setting === "ShutterStock") {
            csvContent += "FileName,Title,Tag,Category,Editorial,Mature Content,Illustration\n";
            // iterate over the arrays to form the csv content
            for (let i = 0; i < imgdata.length; i++) {
                csvContent += `${imgdata[i]["filename"]},${imgdata[i]["title"]},${imgdata[i]["tags"]},${shutterStockCategory},${shutterStockEditorial},${shutterStockMatureContent},${shutterStockIllustration}\n`;
            }
        }

        if (setting === "AdobeStock") {
            csvContent += "FileName,Title,Tag,Category\n";
            // iterate over the arrays to form the csv content
            for (let i = 0; i < imgdata.length; i++) {
                csvContent += `${imgdata[i]["filename"]},${imgdata[i]["title"]},${imgdata[i]["tags"]},${adobeStockCategory}\n`;
            }
        }

        let encodedUri = encodeURI(csvContent);

        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link);

        link.click();
    }

    return (
        <div className="flex flex-col gap-2">
            <Modal
                isOpen={isOpen}
                placement="center"
                onClose={() => setOpen(false)}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Download the CSV</ModalHeader>
                            <ModalBody className='flex flex-col gap-4'>
                                <h2 className='text-gray-500 font-bold'>Settings</h2>
                                <div className='flex flex-row gap-4 justify-between items-center text-black bg-gray-100 p-4 rounded-full mt'>
                                    <span className='text-black text-sm'>CSV export format</span>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                variant="bordered"
                                                color='secondary'
                                            >
                                                {setting}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Settings">
                                            <DropdownItem key="new" onClick={() => onSetSetting("Default")}>Default</DropdownItem>
                                            <DropdownItem key="copy" onClick={() => onSetSetting("ShutterStock")}>ShutterStock</DropdownItem>
                                            <DropdownItem key="edit" onClick={() => onSetSetting("AdobeStock")}>AdobeStock</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                {
                                    setting === "AdobeStock" && (
                                        <div className='flex flex-row gap-4 justify-between items-center text-black bg-gray-100 p-4 rounded-full mt'>
                                            <span className='text-black text-sm'>Categories</span>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button
                                                        variant="bordered"
                                                        color='secondary'
                                                    >
                                                        {adobeStockCategory}
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="AdobeStockCategory" className='max-h-[600px] overflow-y-scroll -mt-[100px] absolute bg-white rounded-xl'>
                                                    {
                                                        AdobeStockCategory.map((category:any, index:any) => (
                                                            <DropdownItem key={index} onClick={() => setAdobeStockCategory(category)}>{category}</DropdownItem>
                                                        ))
                                                    }
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    )
                                }
                                {
                                    setting === "ShutterStock" && (
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex flex-row gap-4 justify-between items-center text-black bg-gray-100 p-4 rounded-full mt'>
                                                <span className='text-black text-sm'>Categories</span>
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button
                                                            variant="bordered"
                                                            color='secondary'
                                                        >
                                                            {shutterStockCategory}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="ShutterStockCategory" className='max-h-[600px] overflow-y-scroll -mt-[100px] absolute bg-white rounded-xl'>
                                                        {
                                                            ShutterStockCategory.map((category, index) => (
                                                                <DropdownItem key={index} onClick={() => setShutterStockCategory(category)}>{category}</DropdownItem>
                                                            ))
                                                        }
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                            <div className='flex flex-row gap-4 justify-between items-center text-black bg-gray-100 p-4 rounded-full mt'>
                                                <span className='text-black text-sm'>Editorial</span>
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button
                                                            variant="bordered"
                                                            color='secondary'
                                                        >
                                                            {shutterStockEditorial}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="ShutterStockEditorial" className='max-h-[900px]'>
                                                        {
                                                            ShutterStockEditorial.map((category, index) => (
                                                                <DropdownItem key={index} onClick={() => setShutterStockEditorial(category)}>{category}</DropdownItem>
                                                            ))
                                                        }
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                            <div className='flex flex-row gap-4 justify-between items-center text-black bg-gray-100 p-4 rounded-full mt'>
                                                <span className='text-black text-sm'>Mature Content</span>
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button
                                                            variant="bordered"
                                                            color='secondary'
                                                        >
                                                            {shutterStockMatureContent}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="ShutterStockMatureContent" className='max-h-[900px]'>
                                                        {
                                                            ShutterStockMatureContent.map((category, index) => (
                                                                <DropdownItem key={index} onClick={() => setShutterStockMatureContent(category)}>{category}</DropdownItem>
                                                            ))
                                                        }
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                            <div className='flex flex-row gap-4 justify-between items-center text-black bg-gray-100 p-4 rounded-full mt'>
                                                <span className='text-black text-sm'>Illustration</span>
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button
                                                            variant="bordered"
                                                            color='secondary'
                                                        >
                                                            {shutterStockIllustration}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu aria-label="ShutterStockIllustration" className='max-h-[900px]'>
                                                        {
                                                            ShutterStockIllustration.map((category, index) => (
                                                                <DropdownItem key={index} onClick={() => setShutterStockIllustration(category)}>{category}</DropdownItem>
                                                            ))
                                                        }
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    )
                                }
                                <p className='text-gray-500 text-[16px] mt-4'>
                                    Please open the generated CSV to customize extra fields, like categories.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="secondary" onPress={() => generateCSV()}>
                                    Download
                                </Button>
                            </ModalFooter>
                        </>
                    )}

                </ModalContent>
            </Modal>
        </div>
    )
}

export default DownloadModal