import { atom } from "jotai";

export const ImageFiles = atom<any>([]);
export const ImageData = atom<any[]>([]);
export const isGenerateKey = atom<any>(false);
export const UserInfo = atom<any>({});
export const OpenAIModalAtom = atom<any>("gpt-4-vision-preview");
export const OpenAPIKeyAtom = atom<any>("");
export const DownloadModalAtom = atom<any>(false);
// export const isSpinner = atom<any>(false);

ImageData.debugLabel = "ImageData";
DownloadModalAtom.debugLabel = "DownloadModalAtom";
OpenAPIKeyAtom.debugLabel = "OpenAPIKeyAtom";
OpenAIModalAtom.debugLabel = "OpenAIModalAtom";
UserInfo.debugLabel = "UserInfo";
isGenerateKey.debugLabel = "isGenerateKey";
ImageFiles.debugLabel = "ImageFiles";
// isSpinner.debugLabel = "isSpinner";
