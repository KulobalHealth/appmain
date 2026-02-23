"use client";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import  { useState } from "react";
import Image from "next/image";
import groupImg from "@/assets/images/groupImg.png";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import PasswordInput from "@/components/ui/password-input";
import { useUserStore } from "@/store/user-store"
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

export default function PharmacyInfo() {
  const router = useRouter();
  const {  updateUserData,isloading ,createUser} = useUserStore();
  const [PharmacyData, setPharmacyData] = useState({
    firstName: "",
    lastName: "",
    // pharmacyLicenseNumber: "",
    email: "",
    phoneNumber: "",
    password: "",


  })
  const [confirmedPassword, setConfirmedPassword] = useState("");


  const PasswordChecker = (password: string, confirmedPassword: string) => {
    if (password !== confirmedPassword) {
      alert("Passwords do not match");
      return
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return 
    }
  
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPharmacyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    PasswordChecker(PharmacyData.password, confirmedPassword);
    console.log("Updating user data with:", PharmacyData);
    updateUserData({
      businessName: PharmacyData.firstName,
      ownerName: PharmacyData.firstName,
      email: PharmacyData.email,
      telephone: PharmacyData.phoneNumber,
      password: PharmacyData.password,
    });
    createUser().then(() => {
      console.log("User created successfully");
      router.push(`/signup/verify-otp?email=${PharmacyData.email}`);
    }).catch((error) => {
      console.error("Error creating user:", error);
    });

  };
  return (
    <div className="flex flex-row  justify-between   overflow-hidden">
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 h-full bg-white  p-9">
        <Logo />

        <h1 className="text-3xl font-bold text-center mt-4">
          Create An Account{" "}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Provide your details below to continue
        </p>

        <form className="w-full max-w-sm mt-6 space-y-4">
          {/* Step indicator */}
          <div className="w-full max-w-sm text-emerald-600 font-bold mt-4 text-sm">
            Hospital Admin Info <span className="float-right">2/2</span>
          </div>
          <TextInput
            placeholder="Pharmacy Name"
            label="Enter your pharmacy name"
            name="firstName"
            value={PharmacyData.firstName}
            onChange={handleChange}
          />
          {/* <TextInput
            placeholder="Pharmacy License Number"
            label="Enter  pharmacy license number"
            name="pharmacyLicenseNumber"
            value={PharmacyData.pharmacyLicenseNumber}
            onChange={handleChange}
          /> */}
          <TextInput
            placeholder="Enter email"
            label="Email"
            name="email"
            value={PharmacyData.email}
            onChange={handleChange}
          />

          <TextInput
            placeholder="Phone Number"
            label="eg. 05534567890"
            name="phoneNumber"
            value={PharmacyData.phoneNumber}
            onChange={handleChange}
          />
         
          <PasswordInput
            placeholder="Create password"
            label="Create password"
            name="password"
            value={PharmacyData.password}
            onChange={handleChange}

          />
          <PasswordInput
            placeholder="Confirm password"
            label="Confirm your password"
            name="confirmedPassword"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />

          <div className="flex items-center gap-5 w-full">
            <Button variant="outline" className="w-1/2">
              <Link href="/login">Back</Link>
            </Button>
            <Button variant="default" className="w-1/2  " size={"lg"} onClick={handleSubmit}>
              <Link href="/signup/verify-otp" className="text-white">
               { isloading ? <Loader/> : "Confirm"}
              </Link>
            </Button>
          </div>
        </form>
      </div>

      <div className="index-0 fixed right-0">
        <Image
          src={groupImg}
          alt="login"
          width={800}
          className="hidden lg:block h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
