// 1. Get references to important DOM elements
const orderForm = document.getElementById('orderForm');
const customerNameInput = document.getElementById('customerName');
const orderDescriptionInput = document.getElementById('orderDescription');
const quantityInput = document.getElementById('quantity');
const statusSelect = document.getElementById('status');
const ordersTableBody = document.querySelector('#ordersTable tbody');

// Array to store all our orders
let orders = [];

// 2. Local Storage Functions
// Function to save orders to local storage
function saveOrders() {
    localStorage.setItem('stickerOrders', JSON.stringify(orders));
}

// Function to load orders from local storage
function loadOrders() {
    const storedOrders = localStorage.getItem('stickerOrders');
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    }
}

// 3. Order Management Functions

// Function to add a new order
function addOrder(event) {
    event.preventDefault(); // Prevent default form submission and page reload

    // Create a unique ID for the new order
    // Using Date.now() is simple for unique IDs in small client-side apps
    const newId = Date.now().toString();

    const newOrder = {
        id: newId,
        customerName: customerNameInput.value.trim(),
        orderDescription: orderDescriptionInput.value.trim(),
        quantity: parseInt(quantityInput.value, 10), // Parse quantity as an integer
        status: statusSelect.value
    };

    // Add the new order to our orders array
    orders.push(newOrder);

    // Save the updated orders array to local storage
    saveOrders();

    // Re-display all orders to show the new one
    displayOrders();

    // Clear the form fields after adding the order
    orderForm.reset();
    customerNameInput.focus(); // Set focus back to customer name for convenience
}

// Function to display all orders in the table
function displayOrders() {
    // Clear existing table rows first
    ordersTableBody.innerHTML = '';

    // Loop through each order and create a table row for it
    orders.forEach(order => {
        const row = ordersTableBody.insertRow(); // Create a new table row

        // Insert cells for each piece of order data
        row.insertCell().textContent = order.customerName;
        row.insertCell().textContent = order.orderDescription;
        row.insertCell().textContent = order.quantity;

        // Status cell with a dropdown for updating
        const statusCell = row.insertCell();
        const statusDropdown = document.createElement('select');
        statusDropdown.className = 'status-dropdown';
        statusDropdown.dataset.id = order.id; // Store order ID as a data attribute

        // Populate status dropdown options
        const statuses = ["Pending", "In Progress", "Completed", "Ready for Pickup", "Archived"];
        statuses.forEach(statusOption => {
            const option = document.createElement('option');
            option.value = statusOption;
            option.textContent = statusOption;
            if (statusOption === order.status) {
                option.selected = true; // Select the current status
            }
            statusDropdown.appendChild(option);
        });
        // Add a class to the cell itself based on status for styling
        statusCell.className = `status-${order.status.replace(/\s/g, '')}`; // Remove spaces for class name
        statusCell.appendChild(statusDropdown);

        // Actions cell (Delete button)
        const actionsCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.dataset.id = order.id; // Store order ID for deletion
        actionsCell.appendChild(deleteButton);
    });
}

// Function to update an order's status
function updateOrderStatus(id, newStatus) {
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrders();
        displayOrders(); // Re-display to update UI and status styling
    }
}

// Function to delete an order
function deleteOrder(id) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(order => order.id !== id); // Filter out the order to be deleted
        saveOrders();
        displayOrders(); // Re-display to update the table
    }
}

// 4. Event Listeners

// Listen for form submission to add a new order
orderForm.addEventListener('submit', addOrder);

// Use event delegation for status changes and delete buttons on the table
ordersTableBody.addEventListener('change', (event) => {
    if (event.target.classList.contains('status-dropdown')) {
        const orderId = event.target.dataset.id;
        const newStatus = event.target.value;
        updateOrderStatus(orderId, newStatus);
    }
});

ordersTableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const orderId = event.target.dataset.id;
        deleteOrder(orderId);
    }
});

// 5. Initial Load: Load orders and display them when the page first loads
loadOrders();
displayOrders();