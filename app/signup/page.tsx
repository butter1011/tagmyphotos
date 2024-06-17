"use client";

import React from "react";
import { useContext, useState } from "react";
import { ToastContext } from "@/components/Contexts/ToastContext";

import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { Spinner } from "@nextui-org/react";

import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [isemail, setIsEmail] = React.useState(false);
  const [isAgainPassword, setisAgainPassword] = React.useState(false);
  const [isPassword, setIsPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = useState<any>("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
  const { toast } = useContext<any>(ToastContext);
  const [loading, setLoading] = useState<any>(false);

  const initValue = () => {
    setEmail("");
    setConfirmPassword("");
    setPassword("");
  }

  const onSignUp = async () => {
    const isPasswordValid = password === confirmPassword;
    const isEmailValid = /^\S+@\S+$/.test(email);

    if (email == "") {
      setIsEmail(true);
    }

    if (password == "") {
      setIsPassword(true);
    }

    if (confirmPassword == "") {
      setisAgainPassword(true);
    }

    if (!isEmailValid && email !== "") {
      toast.error("Please input the email like: example@domain.com");

      return;
    }

    if (!isPasswordValid) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8 && password !== "") {
      toast.error("Password is too weak");
      return;
    }

    setLoading(true);
    await axios.post('/api/auth/register', {
      email,
      password
    }).then((res) => {

      if (res.data.status === 402) {
        toast.error(res.data.message);
        setLoading(false);
      }

      if (res.data.status === 200) {
        toast.success(res.data.message);
        initValue();
      }
    }).catch((err) => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      toast.error("Some was went wrong!");
    })
  }

  return (
    <div
      className="flex h-screen w-screen items-center justify-end overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
      style={{
        backgroundImage:
          "url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/black-background-texture.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Brand Logo */}
      <div className="absolute left-10 top-10">
        <div className="flex items-center gap-4">
          <img src="./images/favicon.png" width={40} height={40} alt="" />
          <p className="font-medium text-white">Keyworder</p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <p className="max-w-xl text-white/60">
          Keyworder is a free keywording tool for microstock photographers.
        </p>
      </div>

      {/* Sign Up Form */}
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Sign Up</p>
        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
          <Input
            isRequired
            className="text-black"
            disabled={loading}
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            isInvalid={isemail}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSignUp();
              }
            }}
          />
          <Input
            className="text-black"
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name="password"
            disabled={loading}
            isInvalid={isPassword}
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSignUp();
              }
            }}
          />
          <Input
            className="dark:text-white text-black"
            isRequired
            disabled={loading}
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                {isConfirmVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            type={isConfirmVisible ? "text" : "password"}
            isInvalid={isAgainPassword}
            variant="bordered"
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSignUp();
              }
            }}
          />
          <Checkbox isRequired className="py-4" size="sm" disabled={loading}>
            I agree with the&nbsp;
            <Link href="#" size="sm">
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox>
          <Button color="primary" disabled={loading} onClick={onSignUp}>
            {
              loading ? <Spinner size="sm" color="white" /> : "Sign Up"
            }
          </Button>
        </form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <p className="text-center text-small">
          Already have an account?&nbsp;
          <Link href="/login" size="sm">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
