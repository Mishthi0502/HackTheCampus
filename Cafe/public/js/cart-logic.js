const CART_KEY = 'jiitCafeCart';
const API_URL = 'http://localhost:5001'; 
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge(); 
}
function addToCart(item) {
  const cart = getCart();
  const existingItem = cart.find(i => i.id === item.item_id); 
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: item.item_id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      quantity: 1
    });
  }
  saveCart(cart);
  showToast(`${item.name} added to cart!`); // Show feedback
}
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
  if (totalItems > 0) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}
let toastTimer;
function showToast(message) {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('bottom-8');
  toastEl.classList.remove('bottom-[-100px]');
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('bottom-8');
    toastEl.classList.add('bottom-[-100px]');
  }, 3000);
}