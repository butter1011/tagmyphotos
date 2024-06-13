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

    const verifyURL = `https://www.tagmyphotos.com/api/auth/reset?token=${token}`;

    const msg = {
      to: email,
      from: "help@tagmyphotos.com",
      subject: "Password Reset",
      html: `
        <!DOCTYPE html>
          <html lang="en">

          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" />

            <title>Password Reset</title>
            <style type="text/css">
              * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
              }

              body {
                font-family: "Poppins", sans-serif;
              }

              a {
                text-decoration: none;
              }

              .social-item {
                width: 32px;
                height: 32px;
                padding: 6px;
                border-radius: 54px;
                background-color: #7b7b7b;
                display: inline-block;
                cursor: pointer;
              }

              .center {
                margin: auto;
                width: max-content;
                text-align: center;
                padding: 2px;
              }

              .footer-address {
                color: #EBEBEB;
                font-size: 12px;
                width: 80%;
              }

              .phishing {
                padding: 20px 0;
              }

              .info-item {
                padding: 16px 0;
                border-bottom: 1px solid #313131;
              }

              .info-item:first-child {
                padding-top: 0;
              }

              .info-item:last-child {
                padding-bottom: 4px;
                border-bottom: none;
              }

              .info-title {
                font-size: 14px;
                font-weight: 400;
                color: #e9e9e9;
                display: inline-block;
              }

              .info-value {
                font-size: 18px;
                font-weight: 400;
                color: #f6f6f6;
                display: inline-block;
                float: right;
              }

              .btn-confirm {
                padding: 16px 48px;
                margin: auto;
                width: max-content;
                border-radius: 12px;
                background: linear-gradient(254deg, #078BB9 -56.92%, #52C8F1 148.25%);
              }

              a>.btn-confirm {
                color: #F6F6F6;
                font-size: 14px;
                font-weight: 500;
              }

              @media screen and (max-width: 480px) {
                .phishing {
                  display: none;
                }
              }
            </style>
          </head>

          <body>
            <div style="background-color: white;">
              <!-- <div class="content"> -->
              <div
                style="max-width: 600px; width: 100%; margin: 54px auto;border-radius: 12px; border: 2px solid #313131; background-color: #272729; box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.15);">
                <div
                  style="border-radius: 12px 12px 0 0; padding: 0 24px; background-color: #1f1f1f; height: 88px; background-image: url(https://s3.eu-central-1.amazonaws.com/assets.nefentus.com/map.png); background-repeat: no-repeat; background-size: 100% 100%;">

                  <div class="phishing">
                    <div
                      style="z-index: 100; padding: 0 12px; border-radius: 6px; background-color: #078bb9; display: inline-block; height: 48px;">
                      <div style="display: inline-block; height: 48px; padding: 12px 0;">
                        <img src="https://s3.eu-central-1.amazonaws.com/assets.nefentus.com/env.png" alt="env" />
                      </div>
                      <div style="padding: 12px 0 12px 4px;float: right;">
                        <span style="color: #ebebeb; font-size: 16px;">info@tagmyphotos.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style=" padding: 24px;">
                  <h1 class="center" style="font-size: 32px; color: #f6f6f6; font-weight: 400;">Password Reset</h1>
                  <a href="${verifyURL}">
                    <div class="btn-confirm" style="margin: 36px auto;">Confirm</div>
                  </a>
                  <div class="btn-confirm"
                    style="background: transparent; border: 2px solid #313131; font-size: 16px; color: #f6f6f6"
                    >
                    This link will be expired within 10 minutes.
                  </div>
                </div>
              </div>
            </div>
          </body>
          </html>
      `,
    };

    await sgMail.send(msg);

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
