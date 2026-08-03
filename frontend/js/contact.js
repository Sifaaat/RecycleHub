const contactForm = document.getElementById("contactForm");

if(contactForm){

contactForm.addEventListener("submit",function(e){

    e.preventDefault();

    alert("Message Sent Successfully!");

    contactForm.reset();

});

}