import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isDarkMode = true,
}) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md border-l shadow-2xl flex flex-col justify-between transition-transform animate-in slide-in-from-right duration-300 ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Drawer Header */}
          <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold">Your Cart</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${isDarkMode ? 'bg-indigo-950 text-indigo-300 border border-indigo-800/60' : 'bg-indigo-100 text-indigo-700'}`}>
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold">Your cart is empty</h3>
                <p className={`text-xs max-w-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Explore our tech products catalog and click "Add to Cart" to add items to your cart.
                </p>
              </div>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                    isDarkMode
                      ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800/40"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm font-bold truncate">{product.name}</h4>
                    <div className="text-xs text-indigo-400 font-mono font-semibold">
                      ${product.price}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className={`p-1 rounded-lg border transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                            : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className={`p-1 rounded-lg border transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                            : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className={`p-6 border-t space-y-4 ${isDarkMode ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'}`}>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-xs opacity-75">
                  <span>Subtotal</span>
                  <span className="font-mono">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs opacity-75">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-indigo-400 font-mono">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => alert('Order placed successfully! Thank you for testing.')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onClearCart}
                  className={`w-full py-2 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'}`}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
