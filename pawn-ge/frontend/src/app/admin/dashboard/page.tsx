'use client';

import React, { useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader';
import KpiCard from '../../../components/admin/KpiCard';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data - will be fetched from backend API
  const kpis = {
    todaysSales: '1,245 GEL',
    orders: 12,
    activeProducts: 87,
    reservations: 5,
  };

  const needsAttention = [
    { type: 'Orders awaiting confirmation', count: 3, priority: 'high' },
    { type: 'Reservations expiring today', count: 2, priority: 'medium' },
    { type: 'Products missing photos', count: 5, priority: 'low' },
    { type: 'Failed payments', count: 1, priority: 'high' },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Giorgi B.', product: 'iPhone 15 Pro', amount: '1,390 GEL', status: 'Pending' },
    { id: '#ORD-002', customer: 'Nino K.', product: 'MacBook Air M2', amount: '2,150 GEL', status: 'Confirmed' },
    { id: '#ORD-003', customer: 'Levan M.', product: 'Samsung S24 Ultra', amount: '1,890 GEL', status: 'Preparing' },
    { id: '#ORD-004', customer: 'Mariam D.', product: 'PlayStation 5', amount: '950 GEL', status: 'Completed' },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro 256GB', views: 342, reservations: 28, sales: 12 },
    { name: 'MacBook Air M2', views: 287, reservations: 21, sales: 9 },
    { name: 'Samsung S24 Ultra', views: 245, reservations: 19, sales: 8 },
    { name: 'PlayStation 5', views: 198, reservations: 15, sales: 7 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Today's Sales"
              value={kpis.todaysSales}
              change="+12.5% from yesterday"
              changeType="positive"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <KpiCard
              title="Orders"
              value={kpis.orders}
              change="+3 new today"
              changeType="positive"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
            />
            <KpiCard
              title="Active Products"
              value={kpis.activeProducts}
              change="87 available"
              changeType="neutral"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />
            <KpiCard
              title="Reservations"
              value={kpis.reservations}
              change="2 expiring today"
              changeType="negative"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Needs Attention */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Needs Attention</h2>
              <div className="space-y-3">
                {needsAttention.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.priority === 'high'
                            ? 'bg-red-500'
                            : item.priority === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}
                      />
                      <span className="text-gray-700 font-medium">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-gray-900">87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reserved</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sold (This Month)</span>
                  <span className="font-semibold text-gray-900">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-semibold text-gray-900">125,000 GEL</span>
                </div>
                <hr className="my-2" />
                <a
                  href="/admin/inventory"
                  className="block text-center w-full py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  View Full Inventory
                </a>
              </div>
            </div>
          </div>

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <a href="/admin/orders" className="text-sm font-medium text-green-600 hover:text-green-700">
                  View All
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="text-sm">
                        <td className="py-3 font-medium text-gray-900">{order.id}</td>
                        <td className="py-3 text-gray-600">{order.customer}</td>
                        <td className="py-3 text-gray-900">{order.amount}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                <a href="/admin/products" className="text-sm font-medium text-green-600 hover:text-green-700">
                  View All
                </a>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.views} views · {product.reservations} reserved · {product.sales} sold
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-gray-300">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
