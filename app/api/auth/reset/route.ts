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
        <!doctype html>
          <html lang="pt-br">

          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
              <link href="https://getbootstrap.com/docs/5.3/assets/css/docs.css" rel="stylesheet">
              <title>CAFS</title>
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
              <link rel="stylesheet" href="./css/main.css" />
          </head>

          <body>
              <div class="row">
                  <div class="card indigo">
                      <img class="image1" src="https://www.tagmyphotos.com/images/favicon.png">
                      <hr>
                      <br>
                      <h2>Hello, We received a request to reset your password.</h2>
                      <br>
                      <img class="image" src="https://www.tagmyphotos.com/images/pc_email.png" alt="pc_email" />
                      <br>
                      <p>Forgot your password? No problem - it happens to everyone!</p>
                      <a href="${verifyURL}" class="btn btn-primary disabled" role="button" aria-disabled="true">Reset your password</a>
                      <br>
                      <li>If you ignore this message, your password will not be changed.</li>
                      <li>This link will be expired within 10 minutes.</li>
                      <hr>
                      <p>Tagmyphotos
                          <img class="image2" src="https://www.tagmyphotos.com/images/favicon.png" height="30" width="30">
                      </p>
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
