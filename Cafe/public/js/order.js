document.addEventListener('DOMContentLoaded', () => {
  const orderDetailsContainer = document.getElementById('order-details-container');
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');
  if (!orderId) {
    orderDetailsContainer.innerHTML = '<h2 class="text-2xl font-bold text-red-600">Error: No Order ID Found</h2><p class="text-gray-600 mt-2">Please go back to the menu and place an order.</p>';
    return;
  }
  async function fetchOrderDetails() {
    try {
      const response = await fetch(`${API_URL}/api/order/${orderId}`);
      if (!response.ok) {
        throw new Error('Order not found.');
      }
      const { order, items } = await response.json();
      renderOrderDetails(order, items);
    } catch (error) {
      orderDetailsContainer.innerHTML = `<h2 class="text-2xl font-bold text-red-600">Error</h2><p class="text-gray-600 mt-2">${error.message}</p>`;
    }
  }
  function renderOrderDetails(order, items) {
    const orderDate = new Date(order.created_at).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    const statusColor = order.status === 'Pending' ? 'text-orange-500' : 'text-green-600';
    let itemsHtml = items.map(item => `
      <li class="flex justify-between items-center py-3 border-b">
        <div>
          <p class="font-semibold">${item.name}</p>
          <p class="text-sm text-gray-500">Quantity: ${item.quantity}</p>
        </div>
        <p class="font-medium">₹${item.price * item.quantity}</p>
      </li>
    `).join('');
    orderDetailsContainer.innerHTML = `
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
      <p class="text-lg text-gray-600 mb-6">Thank you for your purchase.</p>
      <div class="border rounded-lg p-4 mb-6">
        <div class="flex justify-between items-center">
            <div>
                <p class="text-sm text-gray-500">Order ID</p>
                <p class="font-semibold">#${String(order.order_id).padStart(6, '0')}</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Order Placed</p>
                <p class="font-semibold">${orderDate}</p>
            </div>
            <div class="text-right">
                <p class="text-sm text-gray-500">Status</p>
                <p class="font-bold text-xl ${statusColor}">${order.status}</p>
            </div>
        </div>
      </div>
      <h2 class="text-2xl font-bold mb-4">Order Summary</h2>
      <ul class="mb-4">
        ${itemsHtml}
      </ul>
      <div class="flex justify-between items-center text-2xl font-bold pt-4 border-t-2">
          <span>Total:</span>
          <span class="text-yellow-900">₹${order.total_price}</span>
      </div>
    `;
  }
  fetchOrderDetails();
});