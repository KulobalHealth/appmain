"use client"
import { Button } from '@/components/ui/button'
import TextInput from '@/components/ui/text-input'
import React, { useState } from 'react'
import Image from "next/image"
import groupImg from "@/assets/images/groupImg.png"
import Logo from '@/components/ui/logo'
import Link from 'next/link'
import PasswordInput from '@/components/ui/password-input'
import { useUserStore } from "@/store/user-store"
import Loader from '@/components/loader'
import { useRouter } from 'next/navigation'

export default function AdminInfo() {
  const router =  useRouter();

  const updateUserData = useUserStore((state) => state.updateUserData);
  const createUser = useUserStore((state) => state.createUser);
  const loading = useUserStore((state) => state.isloading);
  

  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    // pharmacyLicenseNumber: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setAdminData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePassword = () => {
    if (adminData.password !== confirmPassword) {
      console.log("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!handlePassword()) return;

    console.log("adminData", adminData);
    updateUserData({
      ownerName: `${adminData.firstName} ${adminData.lastName}`,
      email: adminData.email,
      telephone: adminData.phoneNumber,
      password: adminData.password,
    });
    router.push(`/signup/verify-otp?email=${adminData.email}`);
    createUser();
  };

  return (
    <div className="flex flex-row justify-between overflow-hidden">
      <div className='flex flex-col justify-center items-center w-full lg:w-1/2 h-full bg-white p-9'>
        <Logo />
        <h1 className='text-3xl font-bold text-center mt-4'>Create An Account </h1>
        <p className='text-sm text-gray-500 mt-1'>Provide your details below to continue</p>

        <form className='w-full max-w-sm mt-6 space-y-4' onSubmit={handleSubmit}>
          <div className='w-full max-w-sm text-emerald-600 font-bold mt-4 text-sm'>Pharmacy Info <span className='float-right'>2/2</span></div>

          <TextInput
            label="Enter your full name"
            placeholder='Admin Full Name'
            name="firstName"
            onChange={handleChange}
            value={adminData.firstName}
          />
          {/* <TextInput
            label="License Number"
            placeholder='Enter your license number'
            name="licenseNumber"
            onChange={handleChange}
            value={adminData.licenseNumber}
          /> */}
          <TextInput
            label="Email"
            placeholder='Enter email'
            name="email"
            onChange={handleChange}
            value={adminData.email}
          />
          <TextInput
            label="Phone Number"
            placeholder='eg. 05534567890'
            name="phoneNumber"
            onChange={handleChange}
            value={adminData.phoneNumber}
          />
          {/* <TextInput
            label="Pharmacy License Number"
            placeholder='Enter pharmacy license number'
            name="pharmacyLicenseNumber"
            onChange={handleChange}
            value={adminData.l}
          /> */}
          <PasswordInput
            label="Create password"
            placeholder='Create password'
            name="password"
            onChange={handleChange}
            value={adminData.password}
          />
          <PasswordInput
            label="Confirm your password"
            placeholder='Confirm password'
            name="confirmPassword"
            onChange={handleChange}
            value={confirmPassword}
          />

          <div className='flex items-center gap-5 w-full'>
            <Button variant="outline" className='w-1/2'>
              <Link href="/login">Back</Link>
            </Button>
            <Button variant="default" className='w-1/2' size="lg" type="submit" >
              {loading ? <Loader /> : "Confirm"}
            </Button>
          </div>
        </form>
      </div>

      <div className='index-0 fixed right-0 w-1/2 h-full'>
        <Image
          src={groupImg}
          alt="login"
          width={800}
          className="hidden lg:block h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
