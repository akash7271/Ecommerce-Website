const productContrainer=document.querySelector(".product-list");
const isProductDetailPage=document.querySelector(".product-detail");
const isCartPage= document.querySelector(".cart");

if(productContrainer){
    displayProducts();
}
else if(isProductDetailPage){
    displayProductDetail();
}
else if(isCartPage){
    displayCart();

}
 
function displayProducts(){
    products.forEach(product =>{
        const productCard=document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML=`
        <div class="img-box">
        <img src="${product.colors[0].mainImage}">
        </div>
        <h2 class="title">${product.title}</h2>
        <span class="price">${product.price}</span>
        `;
        productContrainer.appendChild(productCard);
        
        const imgBox=productCard.querySelector(".img-box");
        imgBox.addEventListener("click", () => {
            sessionStorage.setItem("selectedProduct",JSON.stringify(product));
            window.location.href="product-detail.html";
        });
    });
}
function displayProductDetail(){
    const productData =JSON.parse(sessionStorage.getItem("selectedProduct"));

    const titleE1=document.querySelector(".title");
    const priceE1=document.querySelector(".price");
    const descriptionE1=document.querySelector(".description");
    const mainImageContainer=document.querySelector(".main-img");
    const thumbnailContainer=document.querySelector(".thumbnail-list");
    const colorContainer=document.querySelector(".color-options");
    const sizeContainer=document.querySelector(".size-options");
    const addToCartBtn=document.querySelector("#add-cart-btn");
   let selectedColor=productData.colors[0];
   let selectedSize=selectedColor.sizes[0];

    function updateProductDisplay(colorData){
        if(!colorData.sizes.includes(selectedSize)){
            selectedSize=colorData.sizes[0];
        }

        mainImageContainer.innerHTML=`<img src="${colorData.mainImage}">`;
        thumbnailContainer.innerHTML="";
        const allThumbnails=[colorData.mainImage].concat(colorData.thumbnails.slice(0,3));
        allThumbnails.forEach(thumb=>{
            const img=document.createElement("img");
            img.src=thumb;
            thumbnailContainer.appendChild(img);
            img.addEventListener("click",()=>{
                mainImageContainer.innerHTML=`<img src="${thumb}">`;
            });
        });
        colorContainer.innerHTML="";
        productData.colors.forEach(color =>{
            const img=document.createElement("img");
            img.src=color.mainImage;
            if(color.name=== colorData.name) img.classList.add("selected");
            
            colorContainer.appendChild(img);
            img.addEventListener("click",()=>{
                selectedColor=color;
                updateProductDisplay(color);
            });
        });
        sizeContainer.innerHTML="";
        colorData.sizes.forEach(size =>{
            const btn=document.createElement("button");
            btn.textContent=size;
            if(size===selectedSize) btn.classList.add("selected");
            sizeContainer.appendChild(btn);
            btn.addEventListener("click",() =>{
                document.querySelectorAll(".size-options button").forEach(e1 =>e1.classList.remove("selected"));
                btn.classList.add("selected");
                selectedSize=size;
            });
        });
    }

        titleE1.textContent=productData.title;
        priceE1.textContent=productData.price;
        descriptionE1.textContent=productData.description;
        updateProductDisplay(selectedColor);

        addToCartBtn.addEventListener("click",()=>{
            addToCart(productData, selectedColor, selectedSize);
        });

}

function addToCart(product, color, size){
    let cart=JSON.parse(sessionStorage.getItem("cart"))||[];
    const existingItem=cart.find(item => item.id===product.id && item.color=== color.name && item.size === size);
    if(existingItem){
        existingItem.quantity +=1;
    }
    else{
        cart.push({
            id: product.id,
            title: product.title,
            price: color.price,
            image: color.mainImage,
            color: color.name,
            size: size,
            quantity:1
        });
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));

}

function displayCart(){
    const cart= JSON.parse(sessionStorage.getItem("cart"))|| [];
    const cartItemsContainer= document.querySelector(".cart-items");
    const subtotalEl= document.querySelector(".subtotal");
    const grandTotalEl= document.querySelector(".grand-total");

    cartItemsContainer.innerHTML="";
    if(cart.length === 0){
        cartItemsContainer.innerHTML="<p>Your cart is empty.</p>";
        subtotalEl.textContent="$0";
        grandTotalEl.textContent="$0";
        return;
    }
    let subtotal = 0;
    cart.forEach((item, index) =>{
        const itemTotal= parseFloat(item.price.replace("$", "")) * item.quantity;
        subtotal+=itemTotal;

         const cartItem =document.createElement("div");
         cartItem.classList.add("cart-item");
         cartItem.innerHTML=`
         <div class="product">
                    <img src="${item.image}">
                    <div class="item-detail">
                        <p>${item.title}</p>
                        <div class="size-color-box">
                            <span class="size">${item.size}</span>
                            <span class="color">${item.color}</span>

                        </div>
                    </div>
                </div>
                <span class="price">${item.price}</span>
                <div class="quantity"><input type="number" value="${item.quantity}" min="1" data-index="${index}"></div>
                <span class="total-price">$${itemTotal}</span>
                <button class="remove" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
         `;
         cartItemsContainer.appendChild(cartItem);
    });
    subtotalEl.textContent=`$${subtotal.toFixed(2)}`;
    grandTotalEl.textContent=`$${subtotal.toFixed(2)}`;

    removeCartItem();
    updateCartQuantity();
}
function removeCartItem(){
    document.querySelectorAll(".remove").forEach(button =>{
        button.addEventListener("click", function (){
            let cart =JSON .parse(sessionStorage.getItem("cart"))|| [];
            const index =this.getAttribute("data-index");
            cart.splice(index,1);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
        });
    });
}
function updateCartQuantity(){
    document.querySelectorAll(".quantity input").forEach(input => {
        input.addEventListener("change", function() {
            let cart=JSON.parse(sessionStorage.getItem("cart"))|| [];
            const index=this.getAttribute("data-index");
            cart[index].quantity = parseInt(this.value);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
        } );
    });
}