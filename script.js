

const products = [
  {id: 1, name: 'Rose', price: 5, image: 'images/rose.jpg'},
  {id: 2, name: 'Lily', price: 10, image: 'images/lily.jpg'},
  {id: 3, name: 'Orchid', price: 15, image: 'images/orchid.jpg'},
  {id: 4, name: 'Sunflower', price: 20, image: 'images/sunflower.jpg'},
  {id: 5, name: 'Tulip', price: 15, image: 'images/tulip.jpg'}
];



// get product by id
function findProductById(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }
  return null;
}

// Wishlist Functions 


// display products on shop page
function displayProducts() {
  const container = document.querySelector('.products-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    
    let card = '<div class="product-card">' +
                 '<button type="button" class="wishlist-heart" onclick="addToWishlist(event, ' + product.id + ')">' +
                   '<i class="fa fa-heart"></i>' +
                 '</button>' +
                 '<img src="' + product.image + '" alt="' + product.name + '">' +
                 '<h3>' + product.name + '</h3>' +
                 '<p class="price">' + product.price + ' SAR</p>' +
                 '<button type="button" class="btn" onclick="addToCart(' + product.id + ')">Buy Now</button>' +
               '</div>';
    
    container.innerHTML += card;
  }
}

// add product to wishlist
function addToWishlist(event, productId) {
  event.preventDefault();
  
  let product = findProductById(productId);
  if (!product) return;
  
  let wishlist = localStorage.getItem('wishlist');
  wishlist = wishlist ? JSON.parse(wishlist) : [];
  
  let alreadyExists = false;
  for (let i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id === productId) {
      alreadyExists = true;
      break;
    }
  }
  
  if (alreadyExists) {
    alert('Already in Wishlist!');
    return;
  }
  
  wishlist.push(product);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  alert('Added to Wishlist!');
}

// display wishlist items
function displayWishlist() {
  let wishlist = localStorage.getItem('wishlist');
  wishlist = wishlist ? JSON.parse(wishlist) : [];
  
  let container = document.getElementById('wishlist-items-container');
  let emptyMessage = document.getElementById('wishlist-empty');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  if (wishlist.length === 0) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    container.style.display = 'none';
    return;
  }
  
  if (emptyMessage) emptyMessage.style.display = 'none';
  container.style.display = 'grid';
  
  for (let i = 0; i < wishlist.length; i++) {
    let item = wishlist[i];
    
    let card = '<div class="wishlist-card">' +
                 '<button type="button" class="remove-wishlist-btn" onclick="removeFromWishlist(' + item.id + ')">' +
                   '<i class="fa fa-times"></i>' +
                 '</button>' +
                 '<img src="' + item.image + '" alt="' + item.name + '">' +
                 '<h3>' + item.name + '</h3>' +
                 '<p class="price">' + item.price + ' SAR</p>' +
                 '<button type="button" class="btn" onclick="addToCart(' + item.id + ')">Add to Cart</button>' +
               '</div>';
    
    container.innerHTML += card;
  }
}

// remove product from wishlist
function removeFromWishlist(id) {
  let cards = document.querySelectorAll('.wishlist-card');
  for (let i = 0; i < cards.length; i++) {
    let btn = cards[i].querySelector('.remove-wishlist-btn');
    if (btn && btn.getAttribute('onclick').includes('removeFromWishlist(' + id + ')')) {
      cards[i].classList.add('removing');
      break;
    }
  }
  
  setTimeout(function() {
    let wishlist = localStorage.getItem('wishlist');
    wishlist = wishlist ? JSON.parse(wishlist) : [];
    
    let newWishlist = [];
    for (let i = 0; i < wishlist.length; i++) {
      if (wishlist[i].id !== id) {
        newWishlist.push(wishlist[i]);
      }
    }
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    displayWishlist();
  }, 400);
}


//  Cart and Checkout Functions 


// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Calculate totals
function calculateTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 20;
  const tax = subtotal * 0.15;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

// Update cart totals on cart/checkout pages
function updateTotals() {
  const cart = getCart();
  const { subtotal, shipping, tax, total } = calculateTotals(cart);

  if (document.getElementById('subtotal')) {
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
    document.getElementById('shipping').textContent = `${shipping.toFixed(2)} SAR`;
    document.getElementById('tax').textContent = `${tax.toFixed(2)} SAR`;
    document.getElementById('total').textContent = `${total.toFixed(2)} SAR`;
  }

  if (document.getElementById('checkout-subtotal')) {
    document.getElementById('checkout-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
    document.getElementById('checkout-shipping').textContent = `${shipping.toFixed(2)} SAR`;
    document.getElementById('checkout-tax').textContent = `${tax.toFixed(2)} SAR`;
    document.getElementById('checkout-total').textContent = `${total.toFixed(2)} SAR`;
  }
  
  if (document.getElementById('payment-subtotal')) {
    document.getElementById('payment-subtotal').textContent = `${subtotal.toFixed(2)} SAR`;
    document.getElementById('payment-shipping').textContent = `${shipping.toFixed(2)} SAR`;
    document.getElementById('payment-tax').textContent = `${tax.toFixed(2)} SAR`;
    document.getElementById('payment-total').textContent = `${total.toFixed(2)} SAR`;
  }
}

// Add product to cart
function addToCart(productId) {
  const cart = getCart();
  const product = findProductById(productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(`${product.name} added to cart!`);
}

// Update item quantity in cart
function updateQuantity(productId, newQuantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item && newQuantity > 0) {
    item.quantity = newQuantity;
  } else if (item && newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  renderCart();
  updateTotals();
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  updateTotals();
}

// Render cart items on cart.html
function renderCart() {
  const container = document.getElementById('cart-items-container');
  const cartContainer = document.querySelector('.cart-container');
  const emptyMsg = document.getElementById('cart-empty');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    if (cartContainer) cartContainer.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'block';
    updateTotals(); 
    return;
  }

  if (cartContainer) cartContainer.style.display = 'grid'; 
  if (emptyMsg) emptyMsg.style.display = 'none';

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-price">${item.price.toFixed(2)} SAR each</p>
      </div>
      <div class="item-quantity">
        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <span class="qty">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <div class="item-total">${(item.price * item.quantity).toFixed(2)} SAR</div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fa fa-times"></i></button>
    `;
    container.appendChild(itemDiv);
  });
  updateTotals(); 
}

// Render checkout items on checkout.html
function renderCheckout() {
  const container = document.getElementById('checkout-items-container');
  if (!container) return;

  const cart = getCart();
  container.innerHTML = '';

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'checkout-item';
    itemDiv.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <strong>${(item.price * item.quantity).toFixed(2)} SAR</strong>
    `;
    container.appendChild(itemDiv);
  });
  
  // Also render for payment page
  const paymentContainer = document.getElementById('payment-items-container');
  if (paymentContainer) {
    paymentContainer.innerHTML = '';
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'summary-item';
      itemDiv.innerHTML = `
        <span>${item.name} (x${item.quantity})</span>
        <strong>${(item.price * item.quantity).toFixed(2)} SAR</strong>
      `;
      paymentContainer.appendChild(itemDiv);
    });
  }
}

// Handle payment form submission
function handlePaymentSubmission(event) {
  event.preventDefault();

  alert('Payment processed successfully! (This is a demo)');
  saveCart([]);
  window.location.href = "home.html";
}

// Handle payment method change
function handlePaymentMethodChange() {
  const cardDetails = document.getElementById('card-details');
  const codDetails = document.getElementById('cod-details');
  const applePayDetails = document.getElementById('applepay-details');
  
  if (document.querySelector('input[name="payment"][value="card"]').checked) {
    cardDetails.style.display = 'block';
    codDetails.style.display = 'none';
    applePayDetails.style.display = 'none';
  } else if (document.querySelector('input[name="payment"][value="cod"]').checked) {
    cardDetails.style.display = 'none';
    codDetails.style.display = 'block';
    applePayDetails.style.display = 'none';
  } else if (document.querySelector('input[name="payment"][value="applepay"]').checked) {
    cardDetails.style.display = 'none';
    codDetails.style.display = 'none';
    applePayDetails.style.display = 'block';
  }
}


//  check Functions & Page Initializer 


//login form haya
window.addEventListener("DOMContentLoaded", function() {

  // Page Initializers 
  const path = window.location.pathname;

  if (path.includes('shop.html')) {
    displayProducts();
  } 
  else if (path.includes('wishlist.html')) {
    displayWishlist();
  }
  else if (path.includes('cart.html')) {
    renderCart();
    updateTotals();
  } 
  else if (path.includes('checkout.html')) {
    renderCheckout();
    updateTotals();
  } 
  else if (path.includes('payment.html')) {
    renderCheckout(); 
    updateTotals(); 
    
    const paymentForm = document.querySelector('.payment-form');
    if (paymentForm) {
      paymentForm.addEventListener('submit', handlePaymentSubmission);
    }
    
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(radio => {
      radio.addEventListener('change', handlePaymentMethodChange);
    });
  }

  // check Functions 
  checkLoginStatus();
/*
  var loginForm = document.getElementById("login-form");

  if (loginForm) {
    var loginUsername = document.getElementById("login-username");
    var loginPassword = document.getElementById("login-password");
    var loginError = document.getElementById("login-error");

    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      var username = loginUsername.value;
      var password = loginPassword.value;
      
      if (username === "user" && password === "password") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        alert("Login successful! Welcome, " + username);
        window.location.href = "home.html";
      } else {
        showError(loginError, "Username or password is incorrect");
        return;
      }
    });
  }

//sign up 
  var signupForm = document.getElementById("signup-form");

  if (signupForm) {
    var signupPassword = document.getElementById("signup-password");
    var signupConfirm = document.getElementById("signup-confirm-password");
    var signupError = document.getElementById("signup-error");

    signupForm.addEventListener("submit", function(event) {
      event.preventDefault();
      
      var password = signupPassword.value;
      var confirmPass = signupConfirm.value;

      if (password !== confirmPass) {
        showError(signupError, "Passwords do not match.");
        return;
      }

      showError(signupError, "");
      alert("Sign up successful! Please log in.");
      window.location.href = "login.html";
    });
  }
*/
var forgotForm = document.getElementById("forgot-form");
var resetForm = document.getElementById("reset-form");

if (forgotForm && resetForm) {
  var forgotEmail = document.getElementById("forgot-email");
  var forgotError = document.getElementById("forgot-error");

  forgotForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var email = forgotEmail.value;

    if (email === "") {
      showError(forgotError, "Please enter your email.");
      return;
    }

    var hiddenEmail = document.getElementById("hidden-email");
    if (hiddenEmail) {
      hiddenEmail.value = email;
    }

    showError(forgotError, "");
    forgotForm.style.display = "none";
    resetForm.style.display = "block";
  });
}
  
  var checkoutCard = document.querySelector(".checkout-card");

  if (checkoutCard) {
    var isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      alert("You must be logged in to proceed to checkout.");
      window.location.href = "login.html";
    }
  }
});


function checkLoginStatus() {
  var isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    var username = localStorage.getItem("username");
    var userLink = document.getElementById("user-link");

    if (userLink) {
      userLink.href = "#";
      userLink.innerHTML = '<i class="fa fa-sign-out-alt"></i> Logout';
      
      userLink.onclick = function() {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        alert("You have been logged out.");
        window.location.href = "login.html";
      };
    }
  }
}

function showError(errorElement, message) {
  if (message === "") {
    errorElement.style.visibility = "hidden";
    errorElement.textContent = "";
  } else {
    errorElement.style.visibility = "visible";
    errorElement.textContent = message;
  }
}
 