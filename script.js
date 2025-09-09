const cartData = [];

const updateCartUI = () => {
    const cartContainer = document.getElementById("cart-container");
    const cartTotal = document.getElementById("cart-total");
    cartContainer.innerHTML = "";

    let total = 0;

    cartData.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-green-50 p-3 rounded-md";
        div.innerHTML = `
            <div>
                <p class="font-medium">${item.name}</p>
                <p class="text-sm text-gray-600">৳${item.price} x ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="text-gray-500 hover:text-red-600 text-lg font-bold">×</button>
        `;

        cartContainer.appendChild(div);
    });

    cartTotal.textContent = `৳${total}`;
};

const addToCart = (item) => {
    const existingItem = cartData.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartData.push({...item, quantity: 1});
    }

    updateCartUI();

    alert(`${item.name} has been added to the cart`);
};

const removeFromCart = (index) => {
    cartData.splice(index, 1);
    updateCartUI();
};

const loadtrees = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(json => dislplaytrees(json.categories))
}

const manageSpinner = (status) => {
    if(status == true)
    {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("all-trees-card").classList.add("hidden");    
    }
    else
    {
        document.getElementById("all-trees-card").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

const removeActive = () => {
    const categorybtn = document.querySelectorAll(".category-btn");
    categorybtn.forEach(btn => btn.classList.remove("active"));
}

const handleAllPlants = () => {
    removeActive();
    document.getElementById("all-plants-btn").classList.add("active");
    loadAllTreesCard();
};


const loadTreesByCategory = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/category/${id}`;
    fetch(url)
    .then(res => res.json())
    .then((json) => {
        removeActive();
        const clickBtn = document.getElementById(`tree-btn-${id}`);
        clickBtn.classList.add("active");
        displayTreesByCategory(json.plants)
    });
}

const loadCardDetails = async(id) => {
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayCardsDetails(details.plants);
}

const displayCardsDetails = (details) => {
    const modalBox = document.getElementById("details-container");
    modalBox.innerHTML = `
    <h3 class = "text-xl font-bold">${details.name}</h3>
                    <img class = "w-full h-100 object-cover" src="${details.image}" alt="">
                    <p><span class="font-bold">Category</span>: ${details.category}</p>
                    <p><span class="font-bold">Price</span>: ${details.price}</p>
                    <p><span class="font-bold">Description</span>: ${details.description}</p>
    `;
    document.getElementById("tree_modal").showModal();
}

const displayTreesByCategory = (categories) => {
    const TreesByCategory = document.getElementById("all-trees-card");
    TreesByCategory.innerHTML = "";

    for(const category of categories)
    {
        const divCategories = document.createElement("div");
        divCategories.innerHTML = `
        <div class="space-y-3 p-5 bg-white rounded-xl max-w-[340px] h-full flex flex-col justify-between">
                    <div>
                        <img class="w-full h-80 object-cover rounded-lg" src="${category.image}" alt="">
                    </div>
                    <h2 onclick="loadCardDetails(${category.id})" class="text-lg font-medium">${category.name}</h2>
                    <p class="text-sm font-light">${category.description}</p>
                    <div class="flex justify-between">
                        <p class="text-sm font-medium px-3 py-1 rounded-2xl bg-[#DCFCE7] text-[#15803D]">${category.category}</p>
                        <p class="font-bold">৳<span>${category.price}</span></p>
                    </div>
                    <button onclick='addToCart({id: ${category.id}, name: "${category.name}", price: ${category.price}})' id = "add-to-cart-btn" class="btn bg-[#15803D] text-white rounded-4xl border-0 font-light w-full">Add to Cart</button>
                </div>
        `;

        TreesByCategory.append(divCategories);
        manageSpinner(false);
    }
}

const dislplaytrees = (trees) => {
    const treesContainer = document.getElementById("trees-container");
    treesContainer.innerHTML = "";

    for(let tree of trees)
    {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id = "tree-btn-${tree.id}" onclick = "loadTreesByCategory('${tree.id}')" class="text-left mb-2 w-full py-1 px-3 rounded-md text-sm cursor-pointer hover:bg-[#23e26c] after:bg-[#15803D] hover:text-white category-btn">${tree.category_name}</button>
        `;

        treesContainer.append(btnDiv);
    }
}

loadtrees();

const loadAllTreesCard = () => {
    fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(json => displayCards(json.plants))
}

const displayCards = (cards) => {
    const allTreesCard = document.getElementById("all-trees-card");
    allTreesCard.innerHTML = "";

    for(let card of cards)
    {
        const divCard = document.createElement("div");
        divCard.innerHTML = `
        <div class="space-y-3 p-5 bg-white rounded-xl max-w-[340px] h-full flex flex-col justify-between">
                    <div>
                        <img class="w-full h-80 object-cover rounded-lg" src="${card.image}" alt="">
                    </div>
                    <h2 onclick="loadCardDetails(${card.id})" class="text-lg font-medium">${card.name}</h2>
                    <p class="text-sm font-light">${card.description}</p>
                    <div class="flex justify-between">
                        <p class="text-sm font-medium px-3 py-1 rounded-2xl bg-[#DCFCE7] text-[#15803D]">${card.category}</p>
                        <p class="font-bold">৳<span>${card.price}</span></p>
                    </div>
                    <button onclick='addToCart({id: ${card.id}, name: "${card.name}", price: ${card.price}})' class="btn bg-[#15803d] text-white rounded-4xl border-0 font-light w-full">Add to Cart</button>
                </div>
        `;

        allTreesCard.append(divCard);
    }
}

loadAllTreesCard();
