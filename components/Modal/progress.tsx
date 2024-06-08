'use client'
import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, image } from "@nextui-org/react"
import { useAtom } from 'jotai'
import { GeneratingModalAtom, ImageData, ImageFiles } from '../Jotai/atoms'
import { Progress } from "@nextui-org/react";

interface ImgData {
    filename: string;
    title: string;
    tags: string[];
}

const GeneratingModal = () => {
    const [isOpen, setOpen] = useAtom<any>(GeneratingModalAtom);
    const [imgdata, setData] = useAtom<ImgData[]>(ImageData);
    const [files, setFiles] = useAtom<any>(ImageFiles);
    const [value, setValue] = useState<any>(0);

    useEffect(() => {
        console.log(imgdata);
        
        if (files?.length !== 0) {
            setValue(imgdata?.length / files?.length * 100);
        }
    }, [imgdata]);

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
                            <ModalHeader className="flex flex-col gap-1">Generating the keywords...</ModalHeader>
                            <ModalBody className='flex flex-col gap-4'>
                                <Progress
                                    aria-label="Downloading..."
                                    size="md"
                                    value={value}
                                    color="success"
                                    showValueLabel={true}
                                    className="max-w-md"
                                />
                            </ModalBody>
                        </>
                    )}

                </ModalContent>
            </Modal>
        </div>
    )
}

export default GeneratingModal