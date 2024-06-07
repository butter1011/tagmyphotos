import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/libs/mongodb";
import Users from "@/models/Users";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await connect();
    let { email } = await request.json();
    let user = await Users.findOne({ email: email });
    console.log(email);
    

    if (!user) {
      return NextResponse.json({
        status: 402,
        message: "User does not exist!",
      });
    }

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
