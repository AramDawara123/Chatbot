document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-list');
    let productsFromLocalStorage = JSON.parse(localStorage.getItem('products')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderProducts() {
        productContainer.innerHTML = '';

        productsFromLocalStorage.forEach((product, index) => {
            const productDiv = createProductElement(product, index);
            productContainer.appendChild(productDiv);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });

        updateCartDisplay();

        document.querySelector('.close').addEventListener('click', (event) => {
            event.preventDefault();
            document.body.classList.remove('showCart');
        });

        const popup = document.getElementById('order-popup');
        const closePopup = document.querySelector('.close-popup');

        document.querySelector('.checkout').addEventListener('click', (event) => {
            event.preventDefault();

            let orders = JSON.parse(localStorage.getItem('orders')) || [];

            const newOrder = {
                items: cart,
                date: new Date().toISOString(),
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            orders.push(newOrder);

            localStorage.setItem('orders', JSON.stringify(orders));

            cart = [];
            updateCartDisplay();
            saveCartToLocalStorage();

            popup.style.display = 'block';
        });
        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });
    }

    function createProductElement(product, index) {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.imgUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} €</p>
            <button class="add-to-cart" data-id="${index}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>`;

        return productDiv;
    }

    function addToCart(event) {
        event.preventDefault();
        const button = event.target;
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCartDisplay();
        saveCartToLocalStorage();

        document.body.classList.add('showCart');
    }

    function updateCartDisplay() {
        const listCart = document.querySelector('.listCart');
        listCart.innerHTML = '';

        let totalPrice = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'item';

            if (productsFromLocalStorage[item.id]) {
                cartItem.innerHTML = `
                    <img src="${productsFromLocalStorage[item.id].imgUrl}" alt="${item.name}" style="width: 70px; height: auto;">
                    <div>${item.name}</div>
                    <div>${item.price.toFixed(2)} €</div>
                    <div class="quantity">
                        <span class="decrease" data-id="${item.id}">-</span>
                        <span>${item.quantity}</span>
                        <span class="increase" data-id="${item.id}">+</span>
                    </div>`;
            } else {
                cartItem.innerHTML = `<div>Product not found</div>`;
            }

            listCart.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        const totalElement = document.createElement('div');
        totalElement.className = 'total';
        totalElement.innerHTML = `Total: <strong>${totalPrice.toFixed(2)} €</strong>`;
        listCart.appendChild(totalElement);

        updateCartCount();

        if (cart.length > 0) {
            document.body.classList.add('showCart');
        } else {
            document.body.classList.remove('showCart');
        }

        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });

        document.querySelector('.cartTab .listCart').addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }


    function increaseQuantity(event) {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity++;
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }

    function decreaseQuantity(event) {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
        const item = cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
            item.quantity--;
            updateCartDisplay();
            saveCartToLocalStorage();
        } else if (item && item.quantity === 1) {
            cart = cart.filter(item => item.id !== id);
            updateCartDisplay();
            saveCartToLocalStorage();
        }
    }

    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    document.querySelector('.shopping-cart').addEventListener('click', (event) => {
        event.preventDefault();
        document.body.classList.add('showCart');
    });

    renderProducts();
});


jQuery(document).ready(function($) {
	// Show the chatbot subject field on icon click
	$(document).on('click', '.iconInner', function() {
		$(this).closest('.botIcon').addClass('showBotSubject');
		$("[name='msg']").focus();
	});

	// Close the chatbot on close icon click
	$(document).on('click', '.closeBtn, .chat_close_icon', function() {
		$(this).closest('.botIcon').removeClass('showBotSubject showMessenger');
	});

	// Show the messenger after submitting the bot subject form
	$(document).on('submit', '#botSubject', function(e) {
		e.preventDefault();
		$(this).closest('.botIcon').toggleClass('showBotSubject showMessenger');
	});

	// Chatbot message handling
	$(document).on("submit", "#messenger", function(e) {
		e.preventDefault();
		let userInput = $("[name=msg]").val().toLowerCase();
		let mainInput = $("[name=msg]").val();
		let userName = '';
		let currentTime = new Date().getHours();

		const userMsg = (msg) => {
			$('.Messages_list').append(
				`<div class="msg user"><span class="avtr"><figure style="background-image: url('avatar_url')"></figure></span><span class="responsText">${msg}</span></div>`
			);
		};
		
		const botMsg = (msg) => {
			$('.Messages_list').append(
				`<div class="msg"><span class="avtr"><figure style="background-image: url('avatar_url')"></figure></span><span class="responsText">${msg}</span></div>`
			);
			$("[name='msg']").val("");
		};

		userMsg(mainInput);
		if (/hello|hi|good (morning|afternoon|evening|night)/.test(userInput)) {
			if (currentTime >= 12 && currentTime < 16) botMsg("Good afternoon");
			else if (currentTime >= 10 && currentTime < 12) botMsg("Hi");
			else if (currentTime < 10) botMsg("Good morning");
			else botMsg("Good evening");

			botMsg("What's your name?");
		} else if (userInput.includes("problem with")) {
			if (/girlfriend|gf/.test(userInput)) {
				botMsg("Take your girlfriend out for dinner or a movie.");
				botMsg("Was this helpful? (yes/no)");
			} else if (/boyfriend|bf/.test(userInput)) {
				botMsg("Buy something nice for him.");
				botMsg("Was this helpful? (yes/no)");
			} else {
				botMsg("Sorry, I didn't understand. Could you ask something else?");
			}
		} else if (userInput.includes("yes")) {
			botMsg("I'm glad I could help!");
			sayGoodbye();
		} else if (userInput.includes("no")) {
			botMsg("Sorry I couldn't help. Please try again later.");
			sayGoodbye();
		} else if (/my name is|i am|i'm/.test(userInput)) {
			userName = userInput.replace(/my name is |i am |i'm /, '');
			botMsg(`Hi ${userName}, how can I help you?`);
		} else {
			botMsg("I'm not sure what you mean. Could you rephrase?");
		}

		const sayGoodbye = () => {
			if (currentTime < 10) botMsg("Have a nice day! :)");
			else if (currentTime <= 20) botMsg("Bye!");
			else botMsg("Good night!");
		};

		$('.Messages').animate({ scrollTop: $('.Messages_list').find('.msg').last().offset().top }, 'slow');
	});
});

// chatbot
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = chatWindow.style.display === 'none' || chatWindow.style.display === '' ? 'flex' : 'none';
}

function sendMessage(event) {
    if (event.key === 'Enter') {
        sendUserMessage();
    }
}

function sendUserMessage() {
    const userInput = document.getElementById('userInput');
    const userMessage = userInput.value.trim();
    
    if (userMessage !== '') {
        displayMessage(userMessage, 'user-message');
        userInput.value = '';
        setTimeout(() => {
            displayMessage('Thank you for your message! How can I further assist?', 'bot-message');
        }, 1000);
    }
}

function displayMessage(text, className) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerText = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
