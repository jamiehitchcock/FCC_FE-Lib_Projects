let quoteField = $("#text")[0];
let authorBox = $("#author")[0];
var quoteBtn = $("#new-quote")[0];
let tweetBtn = $("#tweet-quote")[0];

function generateQuotes(){
    // gerate random number in quote range
    let randomQuoteNumber = Math.floor(Math.random()*quoteArray.length);

    // extract random quote from Array
    let randomQuote = quoteArray[randomQuoteNumber];

    // set quote and author into relevant fields
    quoteField.textContent = randomQuote.quote;
    authorBox.textContent = randomQuote.author;

    var tweetBase = "https://twitter.com/intent/tweet?text=";
    var tweetContent = tweetBase + randomQuote.quote + randomQuote.author;
    
    $(tweetBtn).attr("href", tweetContent);
}

// trigger when page loads
$(document).ready(
 generateQuotes()
)

// trigger function on button click
$(quoteBtn).on("click", function() {
    // Call the generateQuotes function here
    generateQuotes();
  });