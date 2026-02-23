export interface PaystackConfig {
  key: string
  email: string
  amount: number // in pesewas (multiply by 100)
  ref: string
  onSuccess: (reference: any) => void | Promise<void>
  onClose: () => void
  metadata?: Record<string, any>
  currency?: string
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void
      }
    }
  }
}

export const initializePaystack = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Paystack can only be initialized in the browser'))
      return
    }

    // Check if Paystack is already loaded
    if (window.PaystackPop) {
      resolve()
      return
    }

    // Load Paystack inline script
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack script'))
    document.body.appendChild(script)
  })
}

export const payWithPaystack = async (config: PaystackConfig): Promise<void> => {
  try {
    await initializePaystack()

    if (!window.PaystackPop) {
      throw new Error('Paystack script failed to load')
    }

    // Convert amount to pesewas (GHS to pesewas: multiply by 100)
    // Ensure it's an integer to avoid Paystack validation errors
    const amountInPesewas = Math.round(config.amount * 100)
    
    if (!Number.isInteger(amountInPesewas) || amountInPesewas <= 0) {
      throw new Error(`Invalid amount: ${config.amount}. Amount must be a positive number.`)
    }

    const handler = window.PaystackPop.setup({
      key: config.key,
      email: config.email,
      amount: amountInPesewas, // Amount in pesewas (integer)
      ref: config.ref,
      callback: (response: any) => {
        // This is called when payment is successful
        console.log('[Paystack] Payment successful, reference:', response.reference)
        config.onSuccess(response)
      },
      onClose: () => {
        console.log('[Paystack] Payment modal closed')
        config.onClose()
      },
      metadata: config.metadata,
      currency: config.currency || 'GHS',
    })

    handler.openIframe()
  } catch (error) {
    console.error('Paystack initialization error:', error)
    throw error
  }
}


