const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    const value = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if(text.includes(value)){

            card.style.display="block";

        }

        else{

            card.style.display="none";

        }

    });

});
const productForm = document.getElementById("productForm");

if(productForm){

productForm.addEventListener("submit",function(e){

    e.preventDefault();

    alert("Product Added Successfully!");

    productForm.reset();

});

}