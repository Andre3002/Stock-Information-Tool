'use strict';

const apiKey = "bt07fnf48v6ouqftnfc0";

function getStockProfile(stock) {
    fetch('https://finnhub.io/api/v1/stock/profile2?symbol=' + stock + '&token=' + apiKey)
        .then(response => response.json())
        .then(responseJson => displayProfile(responseJson))
        .catch(error => alert('Something went wrong. Try again later.'));
}

function getStockPeers(stock) {
    fetch('https://finnhub.io/api/v1/stock/peers?symbol=' + stock + '&token=' + apiKey)
        .then(response => response.json())
        // .then(responseJson2 => console.log(responseJson2)) 
        .then(responseJson2 => displayPeers(responseJson2))
        .catch(error => alert('Something went wrong. Try again later.'));
}

function getStockNews(stock) {
    fetch('https://finnhub.io/api/v1/company-news?symbol=' + stock + '&from=2020-05-01&to=2020-05-02' + '&token=' + apiKey)
        .then(response => response.json())
        // .then(responseJson3 => console.log(responseJson3))
        .then(responseJson3 => displayNews(responseJson3))
        .catch(error => alert('Something went wrong. Try again later.'));
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

function displayProfile(responseJson) {

    const name = responseJson.name; // e.g. Amazon, Inc
    const ticker = responseJson.ticker; // e.g. AMZN
    const marketCap = formatter.format(responseJson.marketCapitalization);// Change to integer and format with fewer zeros

    $("#overview-ul").empty();
    $("#overview-ul").append(`<li> Company Name: ${name} </li>`);
    $("#overview-ul").append(`<li> Ticker Symbol: ${ticker} </li>`);
    $("#overview-ul").append(`<li> Market Cap: ${marketCap} (MM) </li>`);

    $('#results').removeClass('hidden');
}

// Creating test values for valuation function
let responseJson4Test = 5000;
let marketCapTest = 150000;
// Valuation function
function valuation(responseJson4Test, marketCapTest) {
    //console.log(responseJson4Test);
    //console.log(marketCapTest);
    $("p").empty();
    $("p").append(`This is the valuation.  Compared to market cap ...`);




}

function displayPeers(responseJson2) {

    //$("#peers-ul").append(`<li> Test Peers <br> </li>`);
    console.log(responseJson2);
    //$("#peers-ul").append(`<li> ${responseJson2[0]} <br> </li>`);  //Doenst work bc the output of promise is nothing for console logs!!!  Need to comment out console logs.
 

    $("#peers-ul").empty();
    if (responseJson2.code == 404) {
        $("#peers-ul").append(`<h2> Stock symbol is not found. Please try again. </h2>`)
    } else {
        for (let i = 1; i < 7; i++) {
            $("#peers-ul").append(`<li> ${responseJson2[i]} <br> </li>`)
        }
    }
}


function displayNews(responseJson3) {
    console.log(responseJson3);
    
    $("#news-ul").empty();
    if (responseJson3.code == 404) {
        $("#news-ul").append(`<h2> Stock symbol is not found. Please try again. </h2>`)
    } else {
        for (let i = 0; i < 5; i++) {
            $("#news-ul").append(`<li> ${responseJson3[i].headline} --> ${responseJson3[i].url} <br> </li>`)
        }
    }

}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const stock = $('#js-stock').val();
        const responseJson = getStockProfile(stock);
        const responseJson2 = getStockPeers(stock);
        const responseJson3 = getStockNews(stock); //Need to enable to test/use function
        valuation(responseJson4Test, marketCapTest); //To test valuation function
    });
}

$(function () {
    console.log('App loaded! Waiting for submit!');
    watchForm();
});