// Simple script to clear cart from localStorage
// Run this in browser console to clear the cart

console.log('Current cart in localStorage:', localStorage.getItem('xmas_tree_shop_cart'));

// Clear the cart
localStorage.removeItem('xmas_tree_shop_cart');

console.log('Cart cleared from localStorage');
console.log('New cart value:', localStorage.getItem('xmas_tree_shop_cart'));

// Also clear any other potential cart-related keys
localStorage.removeItem('cart');
localStorage.removeItem('shopping_cart');
localStorage.removeItem('xmas_cart');

console.log('All cart-related localStorage cleared');
