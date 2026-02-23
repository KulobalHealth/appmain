import Image from "next/image";

export default function Logo(){
    return(
        <div>
            <Image
                src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1766605935/logo_xkdsfz.webp"
                alt="Logo"
                width={200}
                height={100}
            
            />
        </div>
    )
}