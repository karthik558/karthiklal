const generateQuote = () => {
    let url = "https://type.fit/api/quotes";
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let randNum = Math.floor(Math.random() * 1500 + 1);
            let randomQuote = data[randNum];
            document.getElementById("quote").innerHTML = `"${randomQuote.text}"`;
            document.getElementById("author").innerHTML = `- ${randomQuote.author ? randomQuote.author : ""
                } `;
        });
};

setTimeout(function () {
    $(".loader_bg").fadeToggle();
}, 900);

    // Get the text to copy and the copy button
const quote = document.getElementById("quote");
const copyButton = document.getElementById("copy-button");

    // Add a click event listener to the copy button
copyButton.addEventListener("click", () => {
    // Create a hidden textarea element
    const textarea = document.createElement("textarea");
    textarea.value = quote.textContent;
    document.body.appendChild(textarea);
    textarea.select();

    // Copy the text
    document.execCommand("copy");

    // Remove the textarea element
    document.body.removeChild(textarea);

    // Show a message to the user
    // alert("Quote copied to clipboard!"); // Disabled for now !

    // Show a copied message after clicking the button
    copyButton.innerHTML = "Copied!";
    setTimeout(() => {
        copyButton.innerHTML = "Copy";
    }, 2000);
});

const year = document.querySelector("#current-year")
year.innerHTML = new Date().getFullYear()