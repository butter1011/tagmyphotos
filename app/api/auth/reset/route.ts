import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/libs/mongodb";
import Users from "@/models/Users";
import sendgrid from "@sendgrid/mail";
import { SignJWT } from "jose";
import { getJwtSecretKey, verifyJwtToken } from "@/libs/auth";
const bcrypt = require("bcrypt");

const SENDGRID_KEY = process.env.NEXT_PUBLIC_SENDGRID_API_KEY;

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    await connect();
    let { email, password } = await request.json();
    let user = (await Users.findOne({ email: email })) ?? false;

    if (!user) {
      return NextResponse.json({
        status: 402,
        message: "User does not exist!",
      });
    }

    let hashedPassword = await bcrypt.hash(password, 6);

    sendgrid.setApiKey(SENDGRID_KEY || "");

    const token = await new SignJWT({
      email: email,
      password: hashedPassword,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(getJwtSecretKey());

    const verifyURL = `http://localhost:3000/api/auth/reset?token=${token}`;

    const msg = {
      to: email,
      from: "tagmyphotos.com",
      subject: "Password Reset",
      text: `Hello This is the reset link. Please click this and update your password. Have a nice day.\n${verifyURL}`,
    };

    console.log(msg);
    await sendgrid.send(msg);

    return NextResponse.json({
      status: 200,
      message: "Message Sent. Please check your mailbox!",
    });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    await connect();
    // get token
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const data: any = await verifyJwtToken(token);
    const password = data.password;
    const email = data.email;

    // find user
    if (email && password) {
      const user = Users.findOne({ email: email });
      await user.updateOne({ password: password });

      return NextResponse.redirect(
        new URL(
          `/login?status=200&message=Password%20Reset%20Successfully!`,
          request.url
        )
      );
    }

    return NextResponse.redirect(
      new URL(
        `/reset?status=402&message=Something%20went%20wrong!`,
        request.url
      )
    );
  } catch (error) {
    return NextResponse.error();
  }
}
