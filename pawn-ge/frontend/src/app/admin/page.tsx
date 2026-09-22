export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400">Admin dashboard - Coming soon</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[
            { name: 'Dashboard', desc: 'Overview and analytics' },
            { name: 'Products', desc: 'Manage inventory' },
            { name: 'Orders', desc: 'View and process orders' },
            { name: 'Reservations', desc: 'Manage reservations' },
            { name: 'Customers', desc: 'Customer management' },
            { name: 'Settings', desc: 'Shop configuration' },
          ].map((item) => (
            <div 
              key={item.name}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
