"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Building2, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  X, 
  Store, 
  Upload, 
  FileSpreadsheet, 
  Edit2, 
  Trash2, 
  Check,
  MapPin,
  Phone,
  Mail,
  Download,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ImageIcon,
  Settings,
  AlertTriangle,
  MessageCircle,
  Loader2,
  Copy,
  Link,
  ExternalLink
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"

// Guide step interface
interface GuideStep {
  id: number
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right"
}

// Guide steps for the store feature
const guideSteps: GuideStep[] = [
  {
    id: 1,
    title: "Welcome to Your Store",
    description: "This is where you can manage your pharmacy's online store. Let's walk through the key features to help you get started.",
    target: "welcome",
    position: "bottom"
  },
  {
    id: 2,
    title: "Create Your Store",
    description: "Click 'Create Store' to set up your pharmacy store. You'll need to provide your store name and category to get started.",
    target: "create-store",
    position: "bottom"
  },
  {
    id: 3,
    title: "Upload Inventory",
    description: "Once your store is created, you can upload your product inventory using an Excel or CSV file. Click 'Upload Inventory' to add products in bulk.",
    target: "upload-inventory",
    position: "left"
  },
  {
    id: 4,
    title: "Track Your Stats",
    description: "Monitor your store performance with real-time statistics including total products, stock levels, and inventory value.",
    target: "stats",
    position: "bottom"
  },
  {
    id: 5,
    title: "Manage Products",
    description: "View, edit, and delete products directly from the table. Click the edit icon to modify product details inline.",
    target: "products-table",
    position: "top"
  },
  {
    id: 6,
    title: "Search & Filter",
    description: "Use the search bar to quickly find products by name, SKU, or category. Apply filters to narrow down your view.",
    target: "search",
    position: "bottom"
  }
]

// In-app Guide Component
function StoreGuide({ 
  isOpen, 
  onClose, 
  currentStep, 
  onNext, 
  onPrev,
  onSkip
}: { 
  isOpen: boolean
  onClose: () => void
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}) {
  if (!isOpen) return null

  const step = guideSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === guideSteps.length - 1

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={onSkip} />
      
      {/* Guide Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
            />
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-500">
                  Step {currentStep + 1} of {guideSteps.length}
                </span>
              </div>
              <button 
                onClick={onSkip}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Skip tour
              </button>
            </div>

            {/* Title and description */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

            {/* Visual indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-1.5">
                {guideSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? "w-6 bg-emerald-500" 
                        : index < currentStep 
                          ? "bg-emerald-300" 
                          : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {!isFirstStep && (
                <button
                  onClick={onPrev}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
              <button
                onClick={isLastStep ? onClose : onNext}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                {isLastStep ? "Get Started" : "Next"}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface Product {
  id: string
  uuid?: string
  brand_name: string
  drug_name: string
  generic_name: string
  drug_id: string
  batch_number: string | null
  category: string
  quantity: number
  quantity_available: number
  unit_measure: string
  minimum_stock_level: number
  re_order_quantity: number
  cost_price: number
  selling_price: number
  expiry_date: string | null
  profit: number
  status: "in-stock" | "low-stock" | "out-of-stock"
}

interface StoreInfo {
  id: string
  name: string
  description: string
  category: string
  address: string
  phone?: string
  email?: string
  logo?: string
  createdAt: string
}

export default function StorePage() {
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isEditStoreOpen, setIsEditStoreOpen] = useState(false)
  const [isStoreSettingsOpen, setIsStoreSettingsOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Get user from auth store
  const { user } = useAuthStore()
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Edit store form state
  const [editStoreData, setEditStoreData] = useState({
    StoreName: "",
    whatSapp: "",
  })
  
  // Store link copied state
  const [storeLinkCopied, setStoreLinkCopied] = useState(false)
  
  // Guide state
  const [showGuide, setShowGuide] = useState(false)
  const [guideStep, setGuideStep] = useState(0)
  
  // Check if first time visiting store page
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("store-guide-completed")
    if (!hasSeenGuide) {
      setShowGuide(true)
    }
  }, [])

  const handleCloseGuide = () => {
    setShowGuide(false)
    setGuideStep(0)
    localStorage.setItem("store-guide-completed", "true")
  }

  const handleNextStep = () => {
    if (guideStep < guideSteps.length - 1) {
      setGuideStep(guideStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (guideStep > 0) {
      setGuideStep(guideStep - 1)
    }
  }

  const handleSkipGuide = () => {
    handleCloseGuide()
  }

  const handleRestartGuide = () => {
    setGuideStep(0)
    setShowGuide(true)
  }
  
  // Store state - null means no store created yet
  const [store, setStore] = useState<StoreInfo | null>(null)
  
  // Products state
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingInventory, setIsLoadingInventory] = useState(false)
  const [isUploadingInventory, setIsUploadingInventory] = useState(false)
  
  // Form states
  const [storeData, setStoreData] = useState({
    storeName: "",
    storeDescription: "",
    storeCategory: "",
    storeAddress: "",
    storePhone: "",
    storeEmail: "",
    whatsapp: "",
  })
  const [storeLogo, setStoreLogo] = useState<File | null>(null)
  const [storeLogoPreview, setStoreLogoPreview] = useState<string | null>(null)

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Low stock / Out of stock section state
  const [activeTab, setActiveTab] = useState<'all' | 'low-stock'>('all')
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [isLoadingLowStock, setIsLoadingLowStock] = useState(false)

  // Fetch store data and inventory on mount
  useEffect(() => {
    fetchStoreInfo()
    fetchInventory()
    fetchLowStockInventory()
  }, [])

  // Fetch inventory from API
  const fetchInventory = async () => {
    try {
      setIsLoadingInventory(true)
      const response = await fetch('/api/inventory', {
        method: 'GET',
        credentials: 'include',
      })
      
      const data = await response.json()
      console.log('[Inventory] Fetched data:', data)
      
      if (response.ok && data.data) {
        // Map API response to Product interface
        const inventoryItems = Array.isArray(data.data) ? data.data : []
        const mappedProducts: Product[] = inventoryItems.map((item: any) => ({
          id: String(item.id || item.uuid),
          uuid: item.uuid,
          brand_name: item.brand_name || '',
          drug_name: item.drug_name || '',
          generic_name: item.generic_name || '',
          drug_id: item.drug_id || '',
          batch_number: item.batch_number,
          category: item.category || '',
          quantity: item.quantity || 0,
          quantity_available: item.quantity_available || 0,
          unit_measure: item.unit_measure || '',
          minimum_stock_level: item.minimum_stock_level || 0,
          re_order_quantity: item.re_order_quantity || 0,
          cost_price: item.cost_price || 0,
          selling_price: item.selling_price || 0,
          expiry_date: item.expiry_date,
          profit: item.profit || (item.selling_price - item.cost_price) || 0,
          status: item.quantity_available === 0 ? 'out-of-stock' : 
                  item.quantity_available <= (item.minimum_stock_level || 10) ? 'low-stock' : 'in-stock'
        }))
        setProducts(mappedProducts)
      }
    } catch (err: any) {
      console.error('Failed to fetch inventory:', err)
    } finally {
      setIsLoadingInventory(false)
    }
  }

  // Fetch low-stock inventory from API
  const fetchLowStockInventory = async () => {
    try {
      setIsLoadingLowStock(true)
      const response = await fetch('/api/inventory/low-stock', {
        method: 'GET',
        credentials: 'include',
      })
      
      const data = await response.json()
      console.log('[Inventory] Fetched low-stock data:', data)
      
      if (response.ok && data.data) {
        // Map API response to Product interface
        const inventoryItems = Array.isArray(data.data) ? data.data : []
        const mappedProducts: Product[] = inventoryItems.map((item: any) => ({
          id: String(item.id || item.uuid),
          uuid: item.uuid,
          brand_name: item.brand_name || '',
          drug_name: item.drug_name || '',
          generic_name: item.generic_name || '',
          drug_id: item.drug_id || '',
          batch_number: item.batch_number,
          category: item.category || '',
          quantity: item.quantity || 0,
          quantity_available: item.quantity_available || 0,
          unit_measure: item.unit_measure || '',
          minimum_stock_level: item.minimum_stock_level || 0,
          re_order_quantity: item.re_order_quantity || 0,
          cost_price: item.cost_price || 0,
          selling_price: item.selling_price || 0,
          expiry_date: item.expiry_date,
          profit: item.profit || (item.selling_price - item.cost_price) || 0,
          status: item.quantity_available === 0 ? 'out-of-stock' : 'low-stock'
        }))
        setLowStockProducts(mappedProducts)
      }
    } catch (err: any) {
      console.error('Failed to fetch low-stock inventory:', err)
    } finally {
      setIsLoadingLowStock(false)
    }
  }

  const fetchStoreInfo = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/store', {
        method: 'GET',
        credentials: 'include',
      })
      
      const data = await response.json()
      console.log('[Store] Fetched store data:', data)
      
      if (response.ok && data.status === 'success' && data.data) {
        // Map backend response to StoreInfo (handle different field name cases)
        const storeData = data.data
        console.log('[Store] Raw backend data:', JSON.stringify(storeData, null, 2))
        const storeInfo: StoreInfo = {
          id: storeData.id || storeData._id || storeData.storeId || '',
          name: storeData.StoreName || storeData.storeName || storeData.name || '',
          description: storeData.description || storeData.storeDescription || '',
          category: storeData.category || storeData.storeCategory || '',
          address: storeData.address || storeData.storeAddress || '',
          phone: storeData.phone || storeData.storePhone || storeData.whatSapp || '',
          email: storeData.email || storeData.storeEmail || '',
          logo: storeData.logo || storeData.storeLogo || storeData.photo || storeData.image || storeData.setting?.logoUrl || '',
          createdAt: storeData.createdAt || storeData.dateCreated || new Date().toISOString(),
        }
        console.log('[Store] Mapped store info:', storeInfo)
        setStore(storeInfo)
        if (storeInfo.logo) {
          setStoreLogoPreview(storeInfo.logo)
        }
      } else if (response.status === 404) {
        // No store exists yet, that's okay
        setStore(null)
      } else {
        console.log('[Store] Response not ok or missing data:', response.status, data)
      }
    } catch (err: any) {
      console.error('Failed to fetch store:', err)
      // Don't show error for missing store
    } finally {
      setIsLoading(false)
    }
  }
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setStoreLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setStoreLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setStoreLogo(null)
    setStoreLogoPreview(null)
    if (logoInputRef.current) {
      logoInputRef.current.value = ""
    }
  }

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Get pharmacyId and userName from user
      const pharmacyId = user?.pharmacyId || (typeof user?.pharmacy === 'object' ? user.pharmacy.pharmacyId : '')
      const userName = user ? `${user.firstName} ${user.lastName}` : ''
      
      if (!pharmacyId) {
        setError('Pharmacy ID not found. Please log in again.')
        setIsSubmitting(false)
        return
      }
      
      if (!userName) {
        setError('User name not found. Please log in again.')
        setIsSubmitting(false)
        return
      }
      
      if (!storeData.storeName.trim()) {
        setError('Store name is required.')
        setIsSubmitting(false)
        return
      }
      
      if (!storeData.whatsapp.trim()) {
        setError('WhatsApp number is required.')
        setIsSubmitting(false)
        return
      }
      
      // Use JSON format for the request
      const requestBody = {
        pharmacyId: pharmacyId,
        StoreName: storeData.storeName.trim(),
        userName: userName,
        whatSapp: storeData.whatsapp.trim(),
      }
      
      console.log('[Store] Creating store with:', requestBody)
      
      const response = await fetch('/api/store', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      
      const data = await response.json()
      console.log('[Store] Response:', data)
      
      if (response.ok && (data.status === 'success' || data.data)) {
        // Refresh store info
        await fetchStoreInfo()
        setIsCreateStoreOpen(false)
        // Reset form
        setStoreData({
          storeName: "",
          storeDescription: "",
          storeCategory: "",
          storeAddress: "",
          storePhone: "",
          storeEmail: "",
          whatsapp: "",
        })
        setStoreLogo(null)
        setStoreLogoPreview(null)
      } else {
        setError(data.message || 'Failed to create store')
      }
    } catch (err: any) {
      console.error('Failed to create store:', err)
      setError(err.message || 'Failed to create store')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open edit store modal with current values
  const openEditStore = () => {
    if (store) {
      setEditStoreData({
        StoreName: store.name || '',
        whatSapp: store.phone || '',
      })
      setIsEditStoreOpen(true)
      setError(null)
    }
  }

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const requestBody = {
        StoreName: editStoreData.StoreName.trim(),
        whatSapp: editStoreData.whatSapp.trim(),
      }
      
      console.log('[Store] Updating store with:', requestBody)
      
      const response = await fetch('/api/store', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      
      const data = await response.json()
      console.log('[Store] Update response:', data)
      
      if (response.ok && (data.status === 'success' || data.data)) {
        await fetchStoreInfo()
        setIsEditStoreOpen(false)
      } else {
        setError(data.message || 'Failed to update store')
      }
    } catch (err: any) {
      console.error('Failed to update store:', err)
      setError(err.message || 'Failed to update store')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStore = async () => {
    if (!confirm('Are you sure you want to delete your store? This action cannot be undone.')) {
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/store', {
        method: 'DELETE',
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStore(null)
        setStoreLogoPreview(null)
      } else {
        setError(data.message || 'Failed to delete store')
      }
    } catch (err: any) {
      console.error('Failed to delete store:', err)
      setError(err.message || 'Failed to delete store')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's a CSV file
    if (!file.name.match(/\.csv$/i)) {
      alert("Please upload a CSV file (.csv)")
      return
    }

    try {
      setIsUploadingInventory(true)
      setError(null)
      
      // Create form data with the file
      const formData = new FormData()
      formData.append('file', file)
      
      console.log('[Inventory] Uploading file:', file.name, file.type, file.size)
      
      const response = await fetch('/api/inventory', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('[Inventory] Non-JSON response:', text.slice(0, 200))
        throw new Error('Server returned an invalid response. Please try again.')
      }
      
      const data = await response.json()
      console.log('[Inventory] Upload response:', data)
      
      if (response.ok && (data.status === 'success' || data.data)) {
        // Refresh inventory after successful upload
        await fetchInventory()
        setIsUploadOpen(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        alert('Inventory uploaded successfully!')
      } else {
        const errorMsg = data.message || 'Failed to upload inventory'
        setError(errorMsg)
        alert(errorMsg)
      }
    } catch (err: any) {
      console.error('Failed to upload inventory:', err)
      const errorMsg = err.message || 'Failed to upload inventory'
      setError(errorMsg)
      alert(errorMsg)
    } finally {
      setIsUploadingInventory(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id)
    setEditingProduct({ ...product })
  }

  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false)

  const handleSaveProduct = async () => {
    if (!editingProduct) return
    
    try {
      setIsUpdatingProduct(true)
      
      // Update local state only (backend /inventory/update returns 500)
      // TODO: Re-enable API call when backend is fixed
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
      setEditingProductId(null)
      setEditingProduct(null)
      
      /* Backend /inventory/update endpoint returns 500 error - disabled until fixed
      const response = await fetch('/api/inventory', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingProduct.id,
          uuid: editingProduct.uuid,
          brand_name: editingProduct.brand_name,
          drug_name: editingProduct.drug_name,
          generic_name: editingProduct.generic_name,
          category: editingProduct.category,
          quantity: editingProduct.quantity,
          quantity_available: editingProduct.quantity_available,
          unit_measure: editingProduct.unit_measure,
          cost_price: editingProduct.cost_price,
          selling_price: editingProduct.selling_price,
        }),
      })
      
      const data = await response.json()
      console.log('[Inventory] Update response:', data)
      
      if (response.ok && (data.status === 'success' || data.data)) {
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
        setEditingProductId(null)
        setEditingProduct(null)
      } else {
        alert(data.message || 'Failed to update product')
      }
      */
    } catch (err: any) {
      console.error('Failed to update product:', err)
      alert(err.message || 'Failed to update product')
    } finally {
      setIsUpdatingProduct(false)
    }
  }

  const handleIncreaseQuantity = async (product: Product, amount: number = 1) => {
    const newQuantity = product.quantity + amount
    const newQuantityAvailable = product.quantity_available + amount
    
    // Update local state (backend /inventory/update endpoint returns 500)
    setProducts(products.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          quantity: newQuantity,
          quantity_available: newQuantityAvailable,
          status: newQuantityAvailable === 0 ? 'out-of-stock' as const : 
                  newQuantityAvailable <= (p.minimum_stock_level || 10) ? 'low-stock' as const : 'in-stock' as const
        }
      }
      return p
    }))
    
    // Note: Backend /inventory/update endpoint returns 500 error
    // Uncomment below when backend is fixed:
    /*
    try {
      const response = await fetch('/api/inventory', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          uuid: product.uuid,
          quantity: newQuantity,
          quantity_available: newQuantityAvailable,
        }),
      })
      if (!response.ok) {
        await fetchInventory() // Revert on failure
      }
    } catch (err) {
      await fetchInventory()
    }
    */
  }

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/inventory/${productToDelete.uuid || productToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (response.ok) {
        // Remove from local state
        setProducts(products.filter(p => p.id !== productToDelete.id))
        setIsDeleteModalOpen(false)
        setProductToDelete(null)
      } else {
        const data = await response.json()
        alert(data.message || 'Failed to delete product')
      }
    } catch (err: any) {
      console.error('Failed to delete product:', err)
      alert(err.message || 'Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownloadTemplate = () => {
    // Create a CSV template matching the API structure
    const csvHeaders = "brand_name,drug_name,generic_name,drug_id,batch_number,category,quantity,quantity_available,unit_measure,minimum_stock_level,re_order_quantity,cost_price,selling_price,expiry_date"
    const exampleRow = "Pokupharma,paracetamol,paracetamol,paracetamol,,Pain Killer,300,300,tablet,0,0,8,12,"
    const csvContent = csvHeaders + "\n" + exampleRow
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "inventory_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter products by search
  const filteredProducts = products.filter(p => 
    p.drug_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.batch_number && p.batch_number.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate stats
  const totalProducts = products.length
  const inStockCount = products.filter(p => p.status === "in-stock").length
  const lowStockCount = products.filter(p => p.status === "low-stock").length
  const totalValue = products.reduce((acc, p) => acc + (p.selling_price * p.quantity_available), 0)

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">In Stock</span>
      case "low-stock":
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">Low Stock</span>
      case "out-of-stock":
        return <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">Out of Stock</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* In-App Guide */}
      <StoreGuide
        isOpen={showGuide}
        onClose={handleCloseGuide}
        currentStep={guideStep}
        onNext={handleNextStep}
        onPrev={handlePrevStep}
        onSkip={handleSkipGuide}
      />

      {/* Help Button - Fixed position */}
      <button
        onClick={handleRestartGuide}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
        title="Show Store Guide"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="hidden group-hover:inline text-sm font-medium">Help</span>
      </button>

      {/* Create Store Modal */}
      {isCreateStoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCreateStoreOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Store className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Create Your Store</h2>
              </div>
              <button 
                onClick={() => setIsCreateStoreOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* Store Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Store Logo
                </label>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-emerald-400 transition-colors"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {storeLogoPreview ? (
                      <img 
                        src={storeLogoPreview} 
                        alt="Store logo preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      {storeLogoPreview ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    {storeLogoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="ml-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                    <p className="mt-1.5 text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={storeData.storeName}
                  onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                  placeholder="Enter your store name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={storeData.whatsapp}
                  onChange={(e) => setStoreData({ ...storeData, whatsapp: e.target.value })}
                  placeholder="Enter WhatsApp number"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateStoreOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Inventory Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isUploadingInventory && setIsUploadOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Upload Inventory</h2>
              </div>
              <button 
                onClick={() => !isUploadingInventory && setIsUploadOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                disabled={isUploadingInventory}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {isUploadingInventory ? (
                <div className="border-2 border-dashed border-emerald-400 rounded-xl p-8 text-center bg-emerald-50">
                  <Loader2 className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-spin" />
                  <p className="text-emerald-700 font-medium mb-1">Uploading inventory...</p>
                  <p className="text-emerald-600 text-sm">Please wait while we process your file</p>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-sm">CSV files only (.csv)</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">File Format Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Required columns: brand_name, drug_name, generic_name, drug_id, category</li>
                  <li>• Quantity columns: quantity, quantity_available, unit_measure</li>
                  <li>• Pricing columns: cost_price, selling_price (decimal format, e.g., 8.00)</li>
                  <li>• Optional: batch_number, minimum_stock_level, re_order_quantity, expiry_date</li>
                </ul>
              </div>

              <button
                onClick={handleDownloadTemplate}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors disabled:opacity-50"
                disabled={isUploadingInventory}
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Store Modal */}
      {isEditStoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditStoreOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Edit Store Details</h2>
              </div>
              <button 
                onClick={() => setIsEditStoreOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateStore} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={editStoreData.StoreName}
                  onChange={(e) => setEditStoreData({ ...editStoreData, StoreName: e.target.value })}
                  placeholder="Enter your store name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  WhatsApp Number *
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={editStoreData.whatSapp}
                    onChange={(e) => setEditStoreData({ ...editStoreData, whatSapp: e.target.value })}
                    placeholder="Enter WhatsApp number"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Store Link Section */}
              {store && (
                <div className="pt-4 mt-2 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Link className="w-4 h-4" />
                      Your Store Link
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Share this unique link with customers to access your store directly
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 font-mono truncate">
                      {typeof window !== 'undefined' ? `${window.location.origin}/pharmacy/${store.id}` : `/pharmacy/${store.id}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const storeLink = `${window.location.origin}/pharmacy/${store.id}`
                        navigator.clipboard.writeText(storeLink)
                        setStoreLinkCopied(true)
                        setTimeout(() => setStoreLinkCopied(false), 2000)
                      }}
                      className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-1.5 ${
                        storeLinkCopied 
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                      title="Copy store link"
                    >
                      {storeLinkCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <a 
                    href={`/pharmacy/${store.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 mt-2 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Preview your store
                  </a>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditStoreOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {/* Delete Store Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Danger Zone
                  </h4>
                  <p className="text-sm text-red-600 mb-3">
                    Deleting your store will remove all your store data. This action cannot be undone.
                  </p>
                  <button
                    type="button"
                    onClick={handleDeleteStore}
                    className="w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Delete Store
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading store...</p>
        </div>
      ) : !store ? (
        /* No Store Created State */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <Store className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Store Created Yet</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Create your pharmacy store to start managing your inventory and selling products on the marketplace.
          </p>
          <button 
            onClick={() => setIsCreateStoreOpen(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Store
          </button>
        </div>
      ) : (
        <>
          {/* Store Info Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-none px-6 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {store.logo ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                    <img 
                      src={store.logo} 
                      alt={store.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold">{store.name}</h2>
                  {store.phone && (
                    <p className="text-sm text-white/80 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {store.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={openEditStore}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  title="Manage Store"
                >
                  <Settings className="w-4 h-4" />
                  Manage Store
                </button>
                <button 
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Inventory
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-xl font-bold text-gray-900">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Stock</p>
                  <p className="text-xl font-bold text-gray-900">{inStockCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Low Stock</p>
                  <p className="text-xl font-bold text-gray-900">{lowStockCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-xl font-bold text-gray-900">GH₵ {totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-1.5 px-3 rounded-lg font-medium text-xs transition-colors ${
                  activeTab === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('low-stock')}
                className={`py-1.5 px-3 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'low-stock'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Low Stock / Out of Stock ({lowStockProducts.length})
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button 
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Inventory
              </button>
            </div>
          </div>

          {/* Low Stock / Out of Stock Section */}
          {activeTab === 'low-stock' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Low Stock & Out of Stock Items</h3>
                    <p className="text-sm text-gray-600">Products that need to be restocked</p>
                  </div>
                  <button
                    onClick={fetchLowStockInventory}
                    disabled={isLoadingLowStock}
                    className="ml-auto px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoadingLowStock ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Drug Name</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Brand</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Category</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Qty Available</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Min. Stock</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoadingLowStock ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                            <p className="text-gray-500">Loading low stock items...</p>
                          </div>
                        </td>
                      </tr>
                    ) : lowStockProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-gray-500 font-medium">All products are well-stocked!</p>
                            <p className="text-sm text-gray-400">No low stock or out of stock items found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      lowStockProducts
                        .filter(product => 
                          product.drug_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="font-medium text-gray-900">{product.drug_name}</div>
                              <div className="text-xs text-gray-500">{product.generic_name}</div>
                            </td>
                            <td className="py-4 px-4 text-gray-700">{product.brand_name}</td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`font-semibold ${product.quantity_available === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                                {product.quantity_available}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{product.minimum_stock_level || 10}</td>
                            <td className="py-4 px-4">
                              {product.quantity_available === 0 ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  Out of Stock
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                  Low Stock
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleIncreaseQuantity(product, 10)}
                                  className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors"
                                  title="Add 10 units"
                                >
                                  +10
                                </button>
                                <button
                                  onClick={() => handleIncreaseQuantity(product, 50)}
                                  className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors"
                                  title="Add 50 units"
                                >
                                  +50
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products Table - Only show when All Products tab is active */}
          {activeTab === 'all' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Drug Name</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Brand</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Qty</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Unit</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Cost</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Price</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Profit</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingInventory ? (
                    <tr>
                      <td colSpan={10} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                          </div>
                          <p className="text-gray-500 text-sm">Loading inventory...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-gray-900 font-semibold">No products yet</p>
                            <p className="text-gray-500 text-sm mt-1">Upload your inventory to get started</p>
                          </div>
                          <button 
                            onClick={() => setIsUploadOpen(true)}
                            className="mt-2 inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Inventory
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        {editingProductId === product.id && editingProduct ? (
                          <>
                            <td className="py-4 px-6">
                              <input
                                type="text"
                                value={editingProduct.drug_name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, drug_name: e.target.value })}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-gray-900 bg-white"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="text"
                                value={editingProduct.brand_name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, brand_name: e.target.value })}
                                className="w-28 px-3 py-1.5 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-gray-900 bg-white"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="text"
                                value={editingProduct.category}
                                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                className="w-28 px-3 py-1.5 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-gray-900 bg-white"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="number"
                                value={editingProduct.quantity_available}
                                onChange={(e) => setEditingProduct({ ...editingProduct, quantity_available: parseInt(e.target.value) || 0 })}
                                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-gray-900 bg-white"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="text"
                                value={editingProduct.unit_measure}
                                onChange={(e) => setEditingProduct({ ...editingProduct, unit_measure: e.target.value })}
                                className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-gray-900 bg-white"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="number"
                                step="0.01"
                                value={editingProduct.cost_price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, cost_price: parseFloat(e.target.value) || 0 })}
                                className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-gray-900 bg-white"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <input
                                type="number"
                                step="0.01"
                                value={editingProduct.selling_price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, selling_price: parseFloat(e.target.value) || 0 })}
                                className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-gray-900 bg-white"
                              />
                            </td>
                            <td className="py-4 px-4 text-emerald-600 font-medium text-sm">
                              GH₵ {(editingProduct.selling_price - editingProduct.cost_price).toFixed(2)}
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={editingProduct.status}
                                onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as Product["status"] })}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-gray-900 bg-white"
                              >
                                <option value="in-stock">In Stock</option>
                                <option value="low-stock">Low Stock</option>
                                <option value="out-of-stock">Out of Stock</option>
                              </select>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={handleSaveProduct}
                                  className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                                  title="Save"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => { setEditingProductId(null); setEditingProduct(null) }}
                                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-6">
                              <div>
                                <span className="font-semibold text-gray-900">{product.drug_name}</span>
                                <p className="text-sm text-gray-500 mt-0.5">{product.generic_name}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">{product.brand_name}</td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 font-medium">{product.quantity_available}</td>
                            <td className="py-4 px-4 text-sm text-gray-500">{product.unit_measure}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">GH₵ {product.cost_price.toFixed(2)}</td>
                            <td className="py-4 px-4 text-sm text-gray-900 font-semibold">GH₵ {product.selling_price.toFixed(2)}</td>
                            <td className="py-4 px-4 text-sm text-emerald-600 font-semibold">GH₵ {product.profit.toFixed(2)}</td>
                            <td className="py-4 px-4">{getStatusBadge(product.status)}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleIncreaseQuantity(product, 1)}
                                  className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                                  title="Increase Quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product)}
                                  className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex flex-col items-center text-center">
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Product
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this product?
              </p>
              <p className="text-sm font-medium text-gray-900 mb-6">
                {productToDelete.drug_name || productToDelete.brand_name}
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
