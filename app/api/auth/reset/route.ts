import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/libs/mongodb";
import Users from "@/models/Users";
import { SignJWT } from "jose";
import { getJwtSecretKey, verifyJwtToken } from "@/libs/auth";
const bcrypt = require("bcrypt");

import { Client } from "@sendgrid/client";
const sgMail = require("@sendgrid/mail");

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
    sgMail.setClient(new Client());
    sgMail.setApiKey(SENDGRID_KEY);

    const token = await new SignJWT({
      email: email,
      password: hashedPassword,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10m")
      .sign(getJwtSecretKey());

    const verifyURL = `http://localhost:3000/api/auth/reset?token=${token}`;

    const msg = {
      to: email,
      from: "help@tagmyphotos.com",
      subject: "Password Reset",
      html: `<table class="main" width="100%">
      <tbody>
        <tr>
          <td>
            <table width="100%">
              <tbody>
                <tr>
                  <td class="two-columns">
                    <table class="column">
                      <tbody>
                        <tr>
                          <td style="padding: 40px 20px 8px">
                            <a href="https://tagmyphotos.com">
                              <img src="./image/favicon.png" alt="" width="280" height="60">
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                </tr>
              </tbody>
            </table>
            <table width="100%">
              <tbody>
                <tr>
                  <td style="padding: 0px 40px 40px;text-align: center; ">
                    <p style=" font-size:24px; font-family: Causten-Semi-Bold">Reset Password</p>
                    <div class="styled-text">
                      <p style="margin: 0px 0px 0px;">Hello, The system noticed that you are requesting the reset the
                        password:</p>
                      <p>If you want to reset your password, click the below button.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table width="100%">
              <tbody>
                <tr>
                  <td style="padding: 0px 60px 60px;text-align: center;">
                    <a href="${verifyURL}" target="_blank" class="button-primary" id="dynamic-url">
                      Conform</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <table width="100%">
              <tbody>
                <tr>
                  <td style="padding: 0px 60px 60px;">
                    <div style="text-align: left;" class="styled-text">
                      <p>Reset Password Link will be destroyed within <span><b>10 minutes.</b></span>
                      </p>
                      <p>Regards,<br> Tagmyphotos Team</p>
                    </div>
                    <p id="copyright"
                      style="text-align: center; font-size: 14px; color: #000; font-family: Causten-Regular;">© 2024
                      Tagmyphotos Team, All rights reserved</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>`,
    };

    sgMail.send(msg);

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
