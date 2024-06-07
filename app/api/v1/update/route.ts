import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/libs/mongodb";
import Users from "@/models/Users";
const CryptoJS = require("crypto-js");

const secrect_key = process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY;

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await connect();
    let data = await request.json();
    const encrypted = CryptoJS.DES.encrypt(
      data?.openAPIKey,
      secrect_key
    ).toString();

    await Users.updateOne(
      { email: data?.email },
      { $set: { key: encrypted, model: data?.model } }
    );

    let user = await Users.findOne({ email: data?.email });

    const response = NextResponse.json({
      user: user,
      status: 200,
      headers: { "content-type": "application/json" },
    });

    return response;
  } catch (error) {
    return NextResponse.error();
  }
}
