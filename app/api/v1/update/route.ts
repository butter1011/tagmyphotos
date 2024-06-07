import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/libs/mongodb";
import Users from "@/models/Users";
const cryptoJS = require("crypto-js");

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await connect();
    let data = await request.json();
    let user = (await Users.findOne({ email: data?.email })) ?? false;

    if (!user) {
      return NextResponse.json({
        status: 402,
        message: "User does not exist!",
      });
    }

    // encrypt key
    const encrypted = cryptoJS.HmacSHA1(data?.openAIAPIKey, data?.email);

    user.key = encrypted;
    user.model = data?.model;
    const update_user = await user.save();

    const response = NextResponse.json({
        user: update_user,
      status: 200,
      headers: { "content-type": "application/json" },
    });

    return response;
  } catch (error) {
    return NextResponse.error();
  }
}
