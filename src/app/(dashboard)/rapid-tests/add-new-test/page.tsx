"use client";
import { Card,CardContent, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {  ArrowLeftIcon, } from "lucide-react"
import { Input } from "@/components/ui/input"
import SelectComponent from "@/components/dashbord/select-component";
import DateSelectorComponent from "@/components/dashbord/date-selector";


export default function NewRapidTests(){
    return(
        <>
            <div className="mt-6 flex items-center gap-2 cursor-pointer" onClick={() => window.history.back()}>
                <ArrowLeftIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
                <span className="text-lg font-semibold text-gray-700">Back</span>
            </div>
            <h1 className="font-bold">New Presscription</h1>
            <Card className="w-full h-fit mt-7 p-2" >

                <CardHeader>
                    <CardTitle>Create a new prescription for patient</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 ">
                    <SelectComponent placeholder="Patient's Name" />
                    <SelectComponent placeholder="Medification" />
                    <label htmlFor="" className="text-sm">
                        Dosage
                        <Input placeholder="10mg" />
                    </label>
                    <SelectComponent placeholder="Frequency" />
                    <DateSelectorComponent />
                    <DateSelectorComponent />
                </CardContent>
                <CardContent>
                    <label htmlFor="" className=" text-sm">
                        Additional information
                        <Textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded-md"
                            placeholder="Write prescription details here..."
                        />
                    </label>
                </CardContent>
                <CardFooter className="flex flex-row gap-1 justify-end border-t-2 mt-4 p-6">
                    <Button className=" bg-gray-300" variant="outline" >Cancel </Button>
                    <Button variant="outline" className="hover:bg-emerald-600 hover:text-white">Save prescriptions</Button>
                </CardFooter>
            </Card>

        </>
        
        
    )
}



