"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn, ShoppingCart } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-4">
            <LogIn className="w-8 h-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Login Required
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            You need to be logged in to add items to your cart. Please log in to continue shopping.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Link href="/login" className="w-full" onClick={onLogin}>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Continue Browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

