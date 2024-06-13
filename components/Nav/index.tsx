"use client";

import React, { use } from "react";
import { useEffect, useState, useMemo, useContext } from "react";
import Cookies from "universal-cookie";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { items } from "./sidebar-items";
import { Avatar, Button, Card, CardBody, CardFooter, ScrollShadow, Spacer, image } from "@nextui-org/react";

import { verifyJwtToken } from "../../libs/auth";
import Sidebar from "./sidebar";

import { useAtom } from "jotai";
import { ImageFiles, isGenerateKey, ImageData, UserInfo, OpenAPIKeyAtom, OpenAIModalAtom, DownloadModalAtom, GeneratingModalAtom, OpenAPIKeyError } from "../Jotai/atoms";
import { Spinner } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { ToastContext } from "../Contexts/ToastContext";
import GeneratingModal from "../Modal/progress";

const CryptoJS = require("crypto-js");

const secrect_key = process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY;
const axios = require('axios');

const APIKEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
/**
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */
interface ImgData {
    filename: string;
    title: string;
    tags: string[];
}

export default function Navbar() {
    const { toast } = useContext<any>(ToastContext);
    const [files, setFiles] = useAtom<any>(ImageFiles);
    const [isloading, setLoading] = useState<any>(false);
    const [imgdata, setData] = useAtom<ImgData[]>(ImageData);
    const [isGenerate, setGenerate] = useAtom<any>(isGenerateKey);
    const pathname = usePathname();
    const currentPath = pathname.split("/")?.[1]
    const [user, setLoggedIn] = useAtom<any>(UserInfo);
    const [openAPIKey, setOpenAPIKey] = useAtom<any>(OpenAPIKeyAtom);
    const [model, setModel] = useAtom<any>(OpenAIModalAtom);
    const [warning, setWarning] = useState<any>(false);
    const [isDownloadOpen, setDwonloadOpen] = useAtom<any>(DownloadModalAtom);
    const [generatingModalOpen, setGeneratingModal] = useAtom<any>(GeneratingModalAtom);
    const [progress, setProgress] = useState<any>(0);
    const [isErrorKey, setErrorKey] = useAtom<any>(OpenAPIKeyError);
    const router = useRouter();

    const descryptKey = (key: any) => {
        var bytes = CryptoJS.DES.decrypt(user?.key, secrect_key);
        var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    }

    // init the User info value
    useMemo(() => {
        if (user?.key === undefined) {
            return;
        }

        const decrypted = descryptKey(user?.key);

        setModel(user?.model);
        setOpenAPIKey(decrypted);
    }, [user])

    // encode the image into Base64
    function encodeImage(image: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(image);
        });
    }

    // Generate Keywards
    const generateKey = async () => {
        if (openAPIKey === "" || openAPIKey === undefined) {
            setWarning(true);
            router.push("/setting");
            return;
        }

        if (files.length === 0) {
            toast.error("Please select the image");
            return;
        }

        let api_endpoint = "https://api.openai.com/v1/chat/completions";
        let headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + openAPIKey,
        };

        setGeneratingModal(true);

        let updateData: any = [];

        files.forEach(async (imageFile: File) => {
            // Resize the image to 510x510 pixels
            const base64_image = await encodeImage(imageFile);
            var image_data: any = {};
            image_data.filename = imageFile.name;

            let payload = {
                "model": model,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "I want 30-45 keywords to describe this image for Adobe Stock, targeted towards discoverability. The most important and relevant keywords should be listed first. Include keywords which specifically describe the image, scene, location, style, concept, theme and mood as well as synonyms and related keywords which can enhance SEO discoverability. Please output them comma separated. As the first entry please also output an editorialized and seo optimized title up to 25 words long and again loaded with the most important keywords towards the beginning of the title and including no punctuation. Only output the title and keywords and Format as follows: title, keyword, keyword, keyword etc",
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": base64_image
                                },
                            },
                        ],
                    }
                ],
                "max_tokens": 300,
            };

            // Make the API request
            await axios.post(api_endpoint, payload, { headers: headers })
                .then((response: any) => {
                    let result = response.data.choices[0].message.content;
                    let result_entries = result.split(", ");

                    image_data.title = result_entries[0];
                    image_data.tags = result_entries.slice(1);
                    updateData.push(image_data);
                    setProgress(updateData.length);

                    if (files.length == updateData.length) {
                        setGenerate(true);
                        setData(updateData);
                        setGeneratingModal(false);
                        return;
                    }
                })
                .catch(async (error: any) => {
                    // if (generatingModalOpen)
                    router.push("/setting")
                    setErrorKey(true);
                    setGeneratingModal(false);
                })
        }
        );
    }

    const handleSignOut = async () => {
        const cookies = new Cookies();
        cookies.remove('token', { path: '/' });
        localStorage.removeItem('user');
    }

    useEffect(() => {
        const getUserData = async (email: any) => {
            const res = await axios.post("/api/v2/user", { email: email });
            setLoggedIn(res?.data?.user);
        }

        const initLoginState = async () => {
            const cookies = new Cookies();
            const token = cookies.get("token");

            if (token) {
                const verifiedToken = await verifyJwtToken(token);
                if (verifiedToken) {
                    getUserData(verifiedToken?.email);
                }
            }

            return false;
        };

        initLoginState();
    }, [])

    return (
        <div className="h-dvh">
            <div className="relative flex h-full w-72 flex-1 flex-col border-r-small border-divider p-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="flex flex-col gap-2">
                        <span className="text-small font-bold text-black">Tag My Photos</span>
                        <span className="text-small text-gray-500">Free Microstock Keywording Tool</span>
                    </div>
                </div>
                <Spacer y={12} />
                <div className="flex items-center gap-3 px-4">
                    <div className="w-8">
                        <Avatar isBordered size="sm" src={user?.image} />
                    </div>
                    <p className="text-small font-medium text-default-600 overflow-hidden">{user?.name ? user?.name : user?.email}</p>
                </div>
                <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6 gap-6 flex flex-col">
                    <Sidebar defaultSelectedKey="home" items={items} selectedKeys={[currentPath]} />
                    <Card className="overflow-visible" shadow="sm">
                        <CardBody className="items-center py-5 text-center gap-6">
                            <Button className="px-10 shadow-md" color="primary" radius="full" variant="shadow" onClick={generateKey} isDisabled={isloading || isGenerate}>
                                Generate Keyword
                            </Button>
                            {
                                warning &&
                                <span className="text-red-600 text-[16px] underline">Please enter API Key first</span>
                            }
                            <Button className="px-10 shadow-md" color="secondary" radius="full" variant="shadow" onClick={() => setDwonloadOpen(true)} isDisabled={!isGenerate}>
                                🚀 Download CSV
                            </Button>
                        </CardBody>
                    </Card>
                </ScrollShadow>
                <div className="mt-auto flex flex-col">
                    <Link href="/help">
                        <Button
                            fullWidth
                            className="justify-start text-default-500 data-[hover=true]:text-foreground"
                            startContent={
                                <Icon className="text-default-500" icon="solar:info-circle-line-duotone" width={24} />
                            }
                            variant="light"
                        >
                            Help & Information
                        </Button>
                    </Link>
                    <Button
                        className="justify-start text-default-500 data-[hover=true]:text-foreground"
                        startContent={
                            <Icon
                                className="rotate-180 text-default-500"
                                icon="solar:minus-circle-line-duotone"
                                width={24}
                            />
                        }
                        variant="light"
                        onClick={() => handleSignOut()}
                    >
                        Log Out
                    </Button>
                </div>
            </div>
            <GeneratingModal progress={progress} />
        </div>
    );
}
