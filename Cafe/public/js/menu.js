document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.getElementById('menu-container');
  async function fetchMenu() {
    try {
      const response = await fetch(`${API_URL}/api/menu`);
      if (!response.ok) throw new Error('Network response was not ok');
      const items = await response.json();
      renderMenu(items);
    } catch (error) {
      menuContainer.innerHTML = `<p class="text-red-500">Error loading menu: ${error.message}</p>`;
    }
  }
  function renderMenu(items) {
    menuContainer.innerHTML = ''; 
    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105';
      itemEl.innerHTML = `
        <img src="${item.image_url}" alt="${item.name}" class="w-full h-48 object-cover">
        <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900">${item.name}</h3>
            <p class="text-gray-700 font-bold mt-1">₹${item.price}</p>
            <button class="add-to-cart-btn w-full mt-4 bg-yellow-800 hover:bg-yellow-900 text-white font-medium py-2 px-4 rounded-lg transition duration-300" data-item-id="${item.item_id}">
                Add to Cart
            </button>
        </div>
      `;
      itemEl.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        const fullItem = items.find(i => i.item_id === item.item_id);
        addToCart(fullItem);
      });
      menuContainer.appendChild(itemEl);
    });
  }
  fetchMenu();
  updateCartBadge();
});