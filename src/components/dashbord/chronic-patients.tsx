import { MessageCircle, Package, Clock } from "lucide-react"

export default function WhatsappOrders() {
  const orders: Array<{ customerName: string; items: number; total: string; status: string; time: string }> = []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-700 bg-yellow-100 border-yellow-200"
      case "confirmed":
        return "text-blue-700 bg-blue-100 border-blue-200"
      case "delivered":
        return "text-green-700 bg-green-100 border-green-200"
      case "cancelled":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  return (
    <div className="bg-white border-2 border-green-100 rounded-2xl p-6 dark:bg-transparent dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp Orders</h3>
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl border-2 border-green-200">
          <MessageCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-800">{orders.length} Orders</span>
        </div>
      </div>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No WhatsApp orders yet</p>
            <p className="text-xs text-gray-400 mt-1">Orders from WhatsApp will appear here</p>
          </div>
        ) : (
          orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-transparent dark:text-white rounded-xl border-2 border-transparent hover:border-green-200 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-200">
                <Package className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{order.customerName}</p>
                <p className="text-sm text-gray-600 dark:text-white">{order.items} items • GHS {order.total}</p>
                <p className="text-xs text-gray-500 mt-1 dark:text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {order.time}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border-2 capitalize ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  )
}
