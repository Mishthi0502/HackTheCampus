document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSummary = document.getElementById('cart-summary');
  const emptyCartMsg = document.getElementById('empty-cart-msg');
  const totalPriceEl = document.getElementById('total-price');
  const placeOrderBtn = document.getElementById('place-order-btn');
  const orderMessage = document.getElementById('order-message');
  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    if (cart.length === 0) {
      emptyCartMsg.classList.remove('hidden');
      cartSummary.classList.add('hidden');
      placeOrderBtn.disabled = true;
    } else {
      emptyCartMsg.classList.add('hidden');
      cartSummary.classList.remove('hidden');
      placeOrderBtn.disabled = false;
      cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex items-center justify-between bg-white p-4 rounded-lg shadow';
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        itemEl.innerHTML = `
          <div class="flex items-center gap-4">
              <img src="${item.image_url}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
              <div>
                  <h3 class="text-lg font-semibold">${item.name}</h3>
                  <p class="text-gray-600">₹${item.price}</p>
              </div>
          </div>
          <div class="flex items-center gap-3">
              <!-- Quantity buttons -->
              <div class="flex items-center border border-gray-300 rounded-md">
                  <button class="quantity-btn p-2 text-gray-700 hover:bg-gray-100" data-id="${item.id}" data-change="-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                  </button>
                  <span class="px-3 font-medium">${item.quantity}</span>
                  <button class="quantity-btn p-2 text-gray-700 hover:bg-gray-100" data-id="${item.id}" data-change="1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
              </div>
              <!-- Remove button -->
              <button class="remove-btn p-2 text-red-500 hover:bg-red-100 rounded-full" data-id="${item.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });
      totalPriceEl.textContent = `₹${totalPrice}`;
    }
  }
  function updateQuantity(itemId, change) {
    let cart = getCart();
    const itemInCart = cart.find(i => i.id === itemId);
    if (!itemInCart) return;
    itemInCart.quantity += change;
    if (itemInCart.quantity <= 0) {
      cart = cart.filter(i => i.id !== itemId);
    }
    saveCart(cart);
    renderCart(); 
  }
  async function handlePlaceOrder() {
    const cart = getCart();
    if (cart.length === 0) return;
    placeOrderBtn.disabled = true;
    orderMessage.textContent = 'Placing order...';

    try {
      const response = await fetch(`${API_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart }), 
      });
      if (!response.ok) {
        throw new Error('Failed to place order.');
      }
      const result = await response.json();
      clearCart();
      window.location.href = `order.html?id=${result.orderId}`;
    } catch (error) {
      orderMessage.textContent = error.message;
      orderMessage.classList.add('text-red-500');
      placeOrderBtn.disabled = false;
    }
  }
  cartItemsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.quantity-btn, .remove-btn');
    if (!btn) return; 
    const itemId = parseInt(btn.dataset.id);
    if (btn.classList.contains('quantity-btn')) {
      const change = parseInt(btn.dataset.change);
      updateQuantity(itemId, change);
    } else if (btn.classList.contains('remove-btn')) {
      let cart = getCart();
      cart = cart.filter(i => i.id !== itemId);
      saveCart(cart);
      renderCart();
    }
  });
  placeOrderBtn.addEventListener('click', handlePlaceOrder);
  renderCart();
});