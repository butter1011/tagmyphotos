import { atom } from "jotai";
import { verifyJwtToken } from "@/libs/auth";
import Cookies from "universal-cookie";

export const ImageFiles = atom<any>([]);
export const ImageData = atom<any[]>([]);
export const isGenerateKey = atom<any>(false);
export const openAIAPIKey = atom<any>("");
export const UserInfo = atom<any>("");
// export const isSpinner = atom<any>(false);

ImageData.debugLabel = "ImageData";
UserInfo.debugLabel = "UserInfo";
isGenerateKey.debugLabel = "isGenerateKey";
ImageFiles.debugLabel = "ImageFiles";
openAIAPIKey.debugLabel = "openAIAPIKey";
// isSpinner.debugLabel = "isSpinner";
