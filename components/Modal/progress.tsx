'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, image } from "@nextui-org/react"
import { useAtom } from 'jotai'
import { GeneratingModalAtom, ImageData, ImageFiles } from '../Jotai/atoms'
import { Progress } from "@nextui-org/react";

interface ImgData {
    filename: string;
    title: string;
    tags: string[];
}

const GeneratingModal = (progress: any) => {
    const [isOpen, setOpen] = useAtom<any>(GeneratingModalAtom);
    const [files, setFiles] = useAtom<any>(ImageFiles);
    const [value, setValue] = useState<any>(0);

    useMemo(() => {
        if (files?.length !== 0) {
            setValue((progress.progress + 1) / (files?.length) * 100);
        }
    }, [progress]);

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