"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useMarketplaceStore } from "@/store/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface ShippingInfo {
  pharmacyName: string;
  phone: string;
  email: string;
  location: string;
  streetAddress: string;
  gpsAddress: string;
}

interface PaymentInfo {
  method: "mobile-money" | "card";
  network?: string;
  accountNumber?: string;
  accountName?: string;
  savePayment: boolean;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  savedCards?: {
    id: string;
    last4: string;
    expiryDate: string;
    type: string;
  }[];
  selectedCard?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems } = useCartStore();
  const { products } = useMarketplaceStore();
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    pharmacyName: "",
    phone: "",
    email: "",
    location: "",
    streetAddress: "",
    gpsAddress: "",
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: "mobile-money",
    network: "mtn",
    accountNumber: "",
    accountName: "",
    savePayment: false,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    savedCards: [
      {
        id: "1",
        last4: "4242",
        expiryDate: "12/24",
        type: "Visa",
      },
    ],
  });
  const [paymentType, setPaymentType] = useState<"full" | "half" | "credit">(
    "full"
  );
  const [errors, setErrors] = useState<Partial<ShippingInfo & PaymentInfo>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const deliveryFee = 10;
  const tax = subtotal * 0.03;
  const total = subtotal + tax + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ShippingInfo]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ShippingInfo & PaymentInfo> = {};

    // Validate shipping info
    if (!shippingInfo.pharmacyName)
      newErrors.pharmacyName = "Pharmacy name is required";
    if (!shippingInfo.phone) newErrors.phone = "Phone number is required";
    if (!shippingInfo.email) newErrors.email = "Email is required";
    if (!shippingInfo.location) newErrors.location = "Location is required";
    if (!shippingInfo.streetAddress)
      newErrors.streetAddress = "Street address is required";

    // Validate payment info
    if (paymentInfo.method === "mobile-money") {
      if (!paymentInfo.accountNumber)
        newErrors.accountNumber = "Account number is required";
      if (!paymentInfo.accountName)
        newErrors.accountName = "Account name is required";
    } else if (paymentInfo.method === "card" && !paymentInfo.selectedCard) {
      if (!paymentInfo.cardNumber)
        newErrors.cardNumber = "Card number is required";
      if (!paymentInfo.expiryDate)
        newErrors.expiryDate = "Expiry date is required";
      if (!paymentInfo.cvv) newErrors.cvv = "CVV is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleTrackOrder = () => {
    setShowConfirmation(false);
    router.push("/marketplace/orders");
  };

  const handleContinueShopping = () => {
    setShowConfirmation(false);
    router.push("/marketplace");
  };

  return (
    <>
      <div className=" mx-auto px-4 py-8 mt-24">
        <div className="mb-6">
          <Link
            href="/marketplace/cart"
            className="inline-flex items-center text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden bg-white dark:bg-background mb-8">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold">Shipping & Delivery Address</h2>
                <button className="text-emerald-500 text-sm font-medium">
                  Edit
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="pharmacy-name" className="text-sm">
                      Pharmacy Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pharmacy-name"
                      name="pharmacyName"
                      value={shippingInfo.pharmacyName}
                      onChange={handleInputChange}
                      placeholder="Enter pharmacy name"
                      className={`mt-1 ${
                        errors.pharmacyName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.pharmacyName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.pharmacyName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm">
                        Phone Number<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className={`mt-1 ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        className={`mt-1 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pharmacy-location" className="text-sm">
                      Pharmacy Location<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pharmacy-location"
                      name="location"
                      value={shippingInfo.location}
                      onChange={handleInputChange}
                      placeholder="Enter pharmacy location"
                      className={`mt-1 ${
                        errors.location ? "border-red-500" : ""
                      }`}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="street-address" className="text-sm">
                        Street Address Line
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="street-address"
                        name="streetAddress"
                        value={shippingInfo.streetAddress}
                        onChange={handleInputChange}
                        placeholder="Enter street address"
                        className={`mt-1 ${
                          errors.streetAddress ? "border-red-500" : ""
                        }`}
                      />
                      {errors.streetAddress && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.streetAddress}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="gps" className="text-sm">
                        GPS Address (Optional)
                      </Label>
                      <Input
                        id="gps"
                        name="gpsAddress"
                        value={shippingInfo.gpsAddress}
                        onChange={handleInputChange}
                        placeholder="e.g. GH-0732-8739"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white dark:bg-background">
              <div className="p-4 border-b">
                <h2 className="font-bold">Payment Method</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select the type of payment method you want to proceed.
                </p>
              </div>

              <div className="p-4">
                <RadioGroup
                  defaultValue="mobile-money"
                  value={paymentInfo.method}
                  onValueChange={(value) =>
                    setPaymentInfo((prev) => ({
                      ...prev,
                      method: value as "mobile-money" | "card",
                    }))
                  }
                  className="space-y-4"
                >
                  <div className="border rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile-money" id="mobile-money" />
                      <Label htmlFor="mobile-money" className="font-medium">
                        Mobile Money (MTN, Telecel, AT)
                      </Label>
                    </div>

                    <div className="mt-4 pl-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="network" className="text-sm">
                            Select Network
                          </Label>
                          <Select defaultValue="mtn">
                            <SelectTrigger id="network" className="mt-1">
                              <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mtn">MTN</SelectItem>
                              <SelectItem value="telecel">Telecel</SelectItem>
                              <SelectItem value="at">AT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="account-number" className="text-sm">
                            Account Number
                          </Label>
                          <Input
                            id="account-number"
                            name="accountNumber"
                            value={paymentInfo.accountNumber}
                            onChange={(e) =>
                              setPaymentInfo((prev) => ({
                                ...prev,
                                accountNumber: e.target.value,
                              }))
                            }
                            placeholder="Enter account number"
                            className={`mt-1 ${
                              errors.accountNumber ? "border-red-500" : ""
                            }`}
                          />
                          {errors.accountNumber && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.accountNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="account-name" className="text-sm">
                          Account Name
                        </Label>
                        <Input
                          id="account-name"
                          name="accountName"
                          value={paymentInfo.accountName}
                          onChange={(e) =>
                            setPaymentInfo((prev) => ({
                              ...prev,
                              accountName: e.target.value,
                            }))
                          }
                          placeholder="Enter account name"
                          className={`mt-1 ${
                            errors.accountName ? "border-red-500" : ""
                          }`}
                        />
                        {errors.accountName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.accountName}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end space-x-2">
                        <Label
                          htmlFor="save-payment"
                          className="text-sm cursor-pointer"
                        >
                          Save payment method
                        </Label>
                        <button
                          type="button"
                          onClick={() =>
                            setPaymentInfo((prev) => ({
                              ...prev,
                              savePayment: !prev.savePayment,
                            }))
                          }
                          className={`h-5 w-10 rounded-full p-1 duration-300 ease-in-out ${
                            paymentInfo.savePayment
                              ? "bg-emerald-500"
                              : "bg-gray-200"
                          }`}
                        >
                          <div
                            className={`bg-white dark:bg-background w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${
                              paymentInfo.savePayment ? "translate-x-5" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="font-medium">
                        Payment Card (Visa, Mastercard)
                      </Label>
                    </div>

                    {paymentInfo.method === "card" && (
                      <div className="mt-4 pl-6 space-y-4">
                        {paymentInfo.savedCards &&
                          paymentInfo.savedCards.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Saved Cards
                              </Label>
                              <RadioGroup
                                value={paymentInfo.selectedCard}
                                onValueChange={(value) =>
                                  setPaymentInfo((prev) => ({
                                    ...prev,
                                    selectedCard: value,
                                  }))
                                }
                                className="space-y-2"
                              >
                                {paymentInfo.savedCards.map((card) => (
                                  <div
                                    key={card.id}
                                    className="flex items-center space-x-2 border rounded p-2"
                                  >
                                    <RadioGroupItem
                                      value={card.id}
                                      id={`card-${card.id}`}
                                    />
                                    <Label htmlFor={`card-${card.id}`}>
                                      {card.type} ending in {card.last4}{" "}
                                      (expires {card.expiryDate})
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                              <div className="mt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="text-sm"
                                  onClick={() =>
                                    setPaymentInfo((prev) => ({
                                      ...prev,
                                      selectedCard: undefined,
                                    }))
                                  }
                                >
                                  Use a different card
                                </Button>
                              </div>
                            </div>
                          )}

                        {(!paymentInfo.savedCards?.length ||
                          !paymentInfo.selectedCard) && (
                          <>
                            <div>
                              <Label htmlFor="card-number" className="text-sm">
                                Card Number
                              </Label>
                              <Input
                                id="card-number"
                                value={paymentInfo.cardNumber}
                                onChange={(e) =>
                                  setPaymentInfo((prev) => ({
                                    ...prev,
                                    cardNumber: e.target.value,
                                  }))
                                }
                                placeholder="1234 5678 9012 3456"
                                className={`mt-1 ${
                                  errors.cardNumber ? "border-red-500" : ""
                                }`}
                              />
                              {errors.cardNumber && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.cardNumber}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiry" className="text-sm">
                                  Expiry Date
                                </Label>
                                <Input
                                  id="expiry"
                                  value={paymentInfo.expiryDate}
                                  onChange={(e) =>
                                    setPaymentInfo((prev) => ({
                                      ...prev,
                                      expiryDate: e.target.value,
                                    }))
                                  }
                                  placeholder="MM/YY"
                                  className={`mt-1 ${
                                    errors.expiryDate ? "border-red-500" : ""
                                  }`}
                                />
                                {errors.expiryDate && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.expiryDate}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="cvv" className="text-sm">
                                  CVV
                                </Label>
                                <Input
                                  id="cvv"
                                  value={paymentInfo.cvv}
                                  onChange={(e) =>
                                    setPaymentInfo((prev) => ({
                                      ...prev,
                                      cvv: e.target.value,
                                    }))
                                  }
                                  placeholder="123"
                                  className={`mt-1 ${
                                    errors.cvv ? "border-red-500" : ""
                                  }`}
                                />
                                {errors.cvv && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.cvv}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-end space-x-2">
                              <Label
                                htmlFor="save-payment"
                                className="text-sm cursor-pointer"
                              >
                                Save payment method
                              </Label>
                              <button
                                type="button"
                                onClick={() =>
                                  setPaymentInfo((prev) => ({
                                    ...prev,
                                    savePayment: !prev.savePayment,
                                  }))
                                }
                                className={`h-5 w-10 rounded-full p-1 duration-300 ease-in-out ${
                                  paymentInfo.savePayment
                                    ? "bg-emerald-500"
                                    : "bg-gray-200"
                                }`}
                              >
                                <div
                                  className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${
                                    paymentInfo.savePayment
                                      ? "translate-x-5"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg overflow-hidden bg-white dark:bg-background sticky top-4">
              <div className="p-4 border-b">
                <h2 className="font-bold">Cart Summary</h2>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span>Items</span>
                <span className="font-bold">{cartItems.length}</span>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span>Delivery fee</span>
                <span className="font-bold">GH₵ {deliveryFee.toFixed(2)}</span>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-bold">GH₵ {subtotal.toFixed(2)}</span>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span>Tax</span>
                <span className="font-bold">GH₵ {tax.toFixed(2)}</span>
              </div>

              <div className="p-4 border-b flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="font-bold text-xl">
                  GH₵ {total.toFixed(2)}
                </span>
              </div>

              <div className="p-4 border-b">
                <h3 className="mb-2 font-medium">Payment Type</h3>
                <RadioGroup
                  value={paymentType}
                  onValueChange={(value) =>
                    setPaymentType(value as "full" | "half" | "credit")
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full">Full payment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="half" id="half" />
                    <Label htmlFor="half">Half payment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit">Credit</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-4">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Placed Successfully!</DialogTitle>
            <DialogDescription className="py-4">
              Your order has been placed and will be processed shortly. You can
              track your order status or continue shopping.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={handleContinueShopping}>
              Continue Shopping
            </Button>
            <Button
              onClick={handleTrackOrder}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Track Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
