// API Base URL - Use current domain for compatibility with localtunnel
const API_BASE_URL = window.location.origin;

// Debug logging
console.log('API Base URL:', API_BASE_URL);

// DOM Elements
const productForm = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const refreshBtn = document.getElementById('refresh-btn');
const productsContainer = document.getElementById('products-container');
const productsList = document.getElementById('products-list');
const loadingDiv = document.getElementById('loading');
const noProductsDiv = document.getElementById('no-products');
const messageDiv = document.getElementById('message');

// State
let isEditing = false;
let editingProductId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    productForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
    refreshBtn.addEventListener('click', loadProducts);
}

// Load all products
async function loadProducts() {
    showLoading(true);
    try {
        console.log('Fetching products from:', `${API_BASE_URL}/products`);
        const response = await fetch(`${API_BASE_URL}/products`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        console.log('Products loaded:', products);
        displayProducts(products);
        showMessage('Products loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading products:', error);
        showMessage(`Error loading products: ${error.message}`, 'error');
        displayProducts([]);
    } finally {
        showLoading(false);
    }
}

// Display products in the UI
function displayProducts(products) {
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        noProductsDiv.style.display = 'block';
        return;
    }
    
    noProductsDiv.style.display = 'none';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsList.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-header">
            <div class="product-info">
                <h3>${escapeHtml(product.name)}</h3>
                <div class="product-id">ID: ${product.id}</div>
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
        </div>
        <div class="product-actions">
            <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id}, '${escapeHtml(product.name)}', ${product.price})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id}, '${escapeHtml(product.name)}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    return card;
}

// Handle form submission (Add/Update)
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    
    if (!name || isNaN(price) || price < 0) {
        showMessage('Please enter valid product name and price.', 'error');
        return;
    }
    
    const productData = { name, price };
    
    try {
        if (isEditing) {
            await updateProduct(editingProductId, productData);
        } else {
            await addProduct(productData);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Error saving product. Please try again.', 'error');
    }
}

// Add new product
async function addProduct(productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/addProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newProduct = await response.json();
        showMessage(`Product "${newProduct.name}" added successfully!`, 'success');
        resetForm();
        loadProducts();
    } catch (error) {
        throw error;
    }
}

// Update existing product
async function updateProduct(id, productData) {
    try {
        const updateData = { id, ...productData };
        const response = await fetch(`${API_BASE_URL}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedProduct = await response.json();
        showMessage(`Product "${updatedProduct.name}" updated successfully!`, 'success');
        cancelEdit();
        loadProducts();
    } catch (error) {
        throw error;
    }
}

// Edit product
function editProduct(id, name, price) {
    isEditing = true;
    editingProductId = id;
    
    productIdInput.value = id;
    productNameInput.value = name;
    productPriceInput.value = price;
    
    formTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Product';
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Product';
    cancelBtn.style.display = 'inline-flex';
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit
function cancelEdit() {
    isEditing = false;
    editingProductId = null;
    resetForm();
}

// Reset form
function resetForm() {
    productForm.reset();
    productIdInput.value = '';
    formTitle.innerHTML = '<i class="fas fa-plus"></i> Add New Product';
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Product';
    cancelBtn.style.display = 'none';
    isEditing = false;
    editingProductId = null;
}

// Delete product
async function deleteProduct(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        showMessage(`Product "${name}" deleted successfully!`, 'success');
        loadProducts();
        
        // If we're editing the deleted product, cancel edit
        if (isEditing && editingProductId === id) {
            cancelEdit();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showMessage('Error deleting product. Please try again.', 'error');
    }
}

// Show loading state
function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
    productsList.style.display = show ? 'none' : 'block';
    noProductsDiv.style.display = 'none';
}

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.add('show');
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
