// Product Data
const products = [
    {
        id: 1,
        name: "Classic Black Elegance",
        description: "Not in stock because Anikin always steals from the warehouse",
        price: 28.99,
        image: "images/black_wig.png",
        outOfStock: true
    },
    {
        id: 13,
        name: "Rainbow Explosion",
        description: "A vibrant rainbow afro that'll make you the life of any party!",
        price: 29.99,
        image: "images/rainbow_wig.png",
        outOfStock: true
    },
    {
        id: 2,
        name: "The Unicorn Mane",
        description: "Magical pastel flowing locks that'll make you feel like a mythical creature!",
        price: 34.99,
        image: "images/unicorn_wig.png",
        outOfStock: true
    },
    {
        id: 3,
        name: "Einstein's Genius",
        description: "Wild white scientist hair - intelligence not included!",
        price: 27.99,
        image: "images/einstein_wig.png",
        outOfStock: true
    },
    {
        id: 4,
        name: "Disco Fever",
        description: "Shimmering silver disco wig that'll transport you back to the 70s!",
        price: 32.99,
        image: "images/disco_wig.png",
        outOfStock: true
    },
    {
        id: 5,
        name: "Anikin's Hair Strand",
        description: "A strand of Ani's hair. It is said to be one of the only ten strands of hair Anikin had since birth.",
        price: 999.99,
        image: "images/hair_strand.png",
        outOfStock: true
    },
    {
        id: 6,
        name: "Neon Pink Punk Rock",
        description: "Hot pink mohawk that screams rebellion! Perfect for concerts or annoying your parents.",
        price: 31.99,
        image: "images/neon_pink_punk.png",
        outOfStock: true
    },
    {
        id: 7,
        name: "Mermaid Ocean Waves",
        description: "Flowing teal and aqua locks straight from Atlantis. Fish not included!",
        price: 38.99,
        image: "images/mermaid_ocean.png",
        outOfStock: true
    },
    {
        id: 8,
        name: "Clown Chaos",
        description: "Bright orange curly madness! Warning: May cause uncontrollable laughter or terror.",
        price: 24.99,
        image: "images/clown_chaos.png",
        outOfStock: true
    },
    {
        id: 9,
        name: "Galactic Purple Haze",
        description: "Deep space purple with cosmic shimmer. NASA approved for moon parties!",
        price: 35.99,
        image: "images/galactic_purple.png",
        outOfStock: true
    },
    {
        id: 10,
        name: "Toxic Waste Green",
        description: "Radioactive lime green that glows in the dark. Geiger counter sold separately!",
        price: 33.99,
        image: "images/toxic_green.png",
        outOfStock: true
    },
    {
        id: 11,
        name: "Cotton Candy Dreams",
        description: "Pink and blue swirled perfection. Tastes terrible, looks amazing!",
        price: 36.99,
        image: "images/cotton_candy.png",
        outOfStock: true
    },
    {
        id: 12,
        name: "80s Metal Madness",
        description: "Long platinum blonde rocker hair. Air guitar skills not included but highly recommended!",
        price: 39.99,
        image: "images/metal_madness.png",
        outOfStock: true
    },
    {
        id: 14,
        name: "Sunshine Yellow",
        description: "Bright and cheerful yellow wig that radiates positivity. Be the sunshine!",
        price: 29.99,
        image: "images/yellow_wig.png",
        outOfStock: true
    },
    {
        id: 15,
        name: "Chocolate Brown",
        description: "Rich chocolate brown wig with natural shine. Sweet as can be!",
        price: 27.99,
        image: "images/brown_wig.png",
        outOfStock: true
    },
    {
        id: 16,
        name: "Fiery Red",
        description: "Bold and vibrant red wig that turns heads. Unleash your inner fire!",
        price: 30.99,
        image: "images/red_wig.png",
        outOfStock: true
    },
    {
        id: 17,
        name: "Bald cap",
        // description: "A wig but not a wig. Use this to impersonate anikin on Halloween.",
        description: "Um we are already bald",
        price: 1.99,
        image: "images/bald_cap.webp",
        outOfStock: false
    }
];

// Cart State
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
    updateCartUI();
    setupEventListeners();
    startCounter();
    setupCyborgTakeover();
});

// Counter for notification banner
function startCounter() {
    // Start date: January 2, 2002 at 06:07:00
    const startDate = new Date('2002-01-02T06:07:00');

    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;

        // Calculate time components
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Calculate years and remaining days
        let years = 0;
        let months = 0;
        let remainingDays = days;

        // Calculate years
        let tempDate = new Date(startDate);
        while (tempDate.setFullYear(tempDate.getFullYear() + 1) <= now) {
            years++;
        }

        // Reset to start date plus years
        tempDate = new Date(startDate);
        tempDate.setFullYear(tempDate.getFullYear() + years);

        // Calculate months
        while (tempDate.setMonth(tempDate.getMonth() + 1) <= now) {
            months++;
        }

        // Reset to start date plus years and months
        tempDate = new Date(startDate);
        tempDate.setFullYear(tempDate.getFullYear() + years);
        tempDate.setMonth(tempDate.getMonth() + months);

        // Calculate remaining days
        remainingDays = Math.floor((now - tempDate) / (1000 * 60 * 60 * 24));

        // Calculate remaining hours, minutes, seconds
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

        // Update DOM elements
        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = remainingDays;
        document.getElementById('hours').textContent = remainingHours;
        document.getElementById('minutes').textContent = remainingMinutes;
        document.getElementById('seconds').textContent = remainingSeconds;
    }

    // Update immediately and then every second
    updateCounter();
    setInterval(updateCounter, 1000);
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <article class="product-card ${product.outOfStock ? 'out-of-stock' : ''}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            ${product.outOfStock ? '<div class="out-of-stock-badge">Out of Stock</div>' : ''}
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${product.outOfStock ? 'disabled' : ''}>
                    ${product.outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </article>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    // Limit Anikin's Hair Strand (ID 5) to quantity of 1
    if (productId === 5 && existingItem && existingItem.quantity >= 1) {
        alert("Only one of Anikin's Hair Strand is available per customer!");
        return;
    }

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showCartNotification();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update Quantity
function updateQuantity(productId, change, event) {
    if (event) {
        event.stopPropagation();
    }
    const item = cart.find(item => item.id === productId);
    if (item) {
        // Limit Anikin's Hair Strand (ID 5) to quantity of 1
        if (productId === 5 && item.quantity >= 1 && change > 0) {
            alert("Only one of Anikin's Hair Strand is available per customer!");
            return;
        }

        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => {
            // Disable plus button for Anikin's Hair Strand (ID 5) when quantity is 1
            const isPlusDisabled = item.id === 5 && item.quantity >= 1;
            return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1, event)">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1, event)" ${isPlusDisabled ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove item">×</button>
            </div>
        `;
        }).join('');
        checkoutBtn.disabled = false;
    }
}

// Show Cart Notification
function showCartNotification() {
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.animation = 'none';
    setTimeout(() => {
        cartBtn.style.animation = 'pulse 0.5s ease';
    }, 10);
}

// Generate Checkout Message
function generateCheckoutMessage() {
    const itemsList = cart.map(item =>
        `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return `I want the following things:\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}`;
}

// Setup Event Listeners
function setupEventListeners() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeModal = document.getElementById('closeModal');
    const copyBtn = document.getElementById('copyBtn');

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    checkoutBtn.addEventListener('click', () => {
        const message = generateCheckoutMessage();
        document.getElementById('checkoutMessage').textContent = message;
        checkoutModal.classList.add('open');
        cartSidebar.classList.remove('open');
    });

    closeModal.addEventListener('click', () => {
        checkoutModal.classList.remove('open');
    });

    copyBtn.addEventListener('click', async () => {
        const message = document.getElementById('checkoutMessage').textContent;
        try {
            await navigator.clipboard.writeText(message);
            copyBtn.textContent = '✓ Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy Message';
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = message;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            copyBtn.textContent = '✓ Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy Message';
                copyBtn.classList.remove('copied');
            }, 2000);
        }
    });

    // Close modal when clicking outside
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('open');
        }
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove('open');
        }
    });
}

// LocalStorage Functions
function saveCart() {
    localStorage.setItem('wigikin_cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('wigikin_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Add pulse animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
    }
`;
document.head.appendChild(style);

// Load and Display Leaderboard
async function loadLeaderboard() {
    const container = document.getElementById('leaderboardContainer');

    // Fallback data in case fetch fails (for local file:// usage)
    const fallbackData = [
        { "name": "Larry the G.O.A.T", "moneySpent": 999.99 },
        { "name": "Just_SKY", "moneySpent": 220 },
        { "name": "pawwwtressssss", "moneySpent": 134 },
        { "name": "memeindemonttv", "moneySpent": 80 },
        { "name": "Staxed", "moneySpent": 78 },
        { "name": "tejbedara", "moneySpent": 72 },
        { "name": "aurio_lul", "moneySpent": 71 },
        { "name": "Ennods", "moneySpent": 60 },
        { "name": "TioSmalls", "moneySpent": 57 },
        { "name": "hakaiknows", "moneySpent": 26 },
        { "name": "RainbowLover", "moneySpent": 1432.78 },
        { "name": "AnikinFan#1", "moneySpent": 1299.99 },
        { "name": "DiscoKing", "moneySpent": 987.65 },
        { "name": "UnicornDreamer", "moneySpent": 845.50 },
        { "name": "PunkRockQueen", "moneySpent": 723.44 },
        { "name": "MermaidVibes", "moneySpent": 654.21 },
        { "name": "CottonCandyFan", "moneySpent": 589.99 }
    ];

    let leaderboardData = fallbackData;

    try {
        const response = await fetch('./leaderboard.json');
        if (response.ok) {
            leaderboardData = await response.json();
        }
    } catch (error) {
        console.log('Using fallback leaderboard data (fetch failed, likely due to CORS)');
    }

    // Sort by money spent (descending)
    leaderboardData.sort((a, b) => b.moneySpent - a.moneySpent);

    // Generate medal emojis for top 3
    const getMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    // Render leaderboard
    const leaderboardHTML = `
        <div class="leaderboard-list">
            ${leaderboardData.map((entry, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        return `
                    <div class="leaderboard-item ${rankClass}">
                        <div class="leaderboard-rank">${getMedal(rank)}</div>
                        <div class="leaderboard-name">${entry.name}</div>
                        <div class="leaderboard-amount">$${entry.moneySpent.toFixed(2)}</div>
                    </div>
                `;
    }).join('')}
        </div>
    `;

    container.innerHTML = leaderboardHTML;
}

// Cyborg Takeover Setup
function setupCyborgTakeover() {
    const cyborgTakeover = document.getElementById('cyborgTakeover');
    const cyborgClose = document.getElementById('cyborgClose');

    if (cyborgClose && cyborgTakeover) {
        cyborgClose.addEventListener('click', () => {
            cyborgTakeover.classList.add('hidden');
        });
    }
}
