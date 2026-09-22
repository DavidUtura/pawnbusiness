import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              Pawn.ge
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Products
              </Link>
              <Link href="/lombards" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Lombards
              </Link>
              <Link href="/account" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Account
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Georgia's Premier<br />
            <span className="text-blue-600">Electronics Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Discover quality second-hand electronics from trusted pawn shops across Georgia. 
            Compare prices, check conditions, and find the best deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Browse Products
            </Link>
            <Link 
              href="/lombards" 
              className="px-8 py-4 text-lg font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-600 dark:hover:border-blue-400 transition-all"
            >
              Find Lombards
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Smartphones', icon: '📱', count: 156 },
              { name: 'Laptops', icon: '💻', count: 89 },
              { name: 'Tablets', icon: '📟', count: 45 },
              { name: 'Accessories', icon: '🎧', count: 234 },
            ].map((category) => (
              <Link 
                key={category.name}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {category.count} products
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products Preview */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <Link 
              href="/products" 
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-6xl">📱</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    iPhone 15 Pro {256 * i}GB
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
                    Excellent condition • Space Black
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      {(1390 + i * 50).toLocaleString()} GEL
                    </span>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Choose Pawn.ge?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Verified Sellers',
                description: 'All lombards are verified and trusted partners with physical locations.',
                icon: '✓'
              },
              {
                title: 'Quality Guaranteed',
                description: 'Every product is inspected and comes with detailed condition reports.',
                icon: '★'
              },
              {
                title: 'Best Prices',
                description: 'Compare offers from multiple sellers to find the best deal.',
                icon: '₾'
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA for Lombards */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Own a Pawn Shop?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join Pawn.ge to reach thousands of customers, manage your inventory online, 
            and grow your business with our powerful admin panel.
          </p>
          <Link 
            href="/admin" 
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Pawn.ge</h3>
              <p className="text-sm">
                Georgia's leading marketplace for second-hand electronics from trusted pawn shops.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/lombards" className="hover:text-white transition-colors">Lombards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link href="/account/orders" className="hover:text-white transition-colors">Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Business</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2024 Pawn.ge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
