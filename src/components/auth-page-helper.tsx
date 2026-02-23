import React from 'react'


interface HelperProps {
  icon: React.ReactNode;
}

export default function Helper({ icon }: HelperProps) {
  return (
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-300">
                {icon}
          </div>
      </div>
  )
}
