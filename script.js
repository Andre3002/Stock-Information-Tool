'use strict';

const apiKey = "bt07fnf48v6ouqftnfc0";
const revenueMultiple = 3.16; // Industry average per Damodoran 1/2020 http://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/psdata.html

function getStockProfile(stock) {
    fetch('https://finnhub.io/api/v1/stock/profile2?symbol=' + stock + '&token=' + apiKey)
        .then(response => response.json())
        .then(responseJson => displayProfile(responseJson))
        .catch(error => alert('Something went wrong. Try again later.'));
}

function getStockPeers(stock) {
    fetch('https://finnhub.io/api/v1/stock/peers?symbol=' + stock + '&token=' + apiKey)
        .then(response => response.json())
        .then(responseJson2 => displayPeers(responseJson2))
        .catch(error => alert('Something went wrong. Try again later.'));
}

function getStockNews(stock) {
    fetch('https://finnhub.io/api/v1/company-news?symbol=' + stock + '&from=2020-08-01&to=2020-08-30' + '&token=' + apiKey)
        .then(response => response.json())
        .then(responseJson3 => displayNews(responseJson3))
        .catch(error => alert('Something went wrong. Try again later.'));
}

function getStockFinancials(stock) {
    fetch('https://finnhub.io/api/v1/stock/financials-reported?symbol=' + stock + '&token=' + apiKey)
        .then(response => response.json())
        .then(responseJson4 => displayValuation(responseJson4, revenueMultiple))
        .catch(error => alert('Something went wrong. Try again later.'));
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

// function to display stock's profile information
function displayProfile(responseJson) {

    const name = responseJson.name; // e.g. Amazon, Inc
    const ticker = responseJson.ticker; // e.g. AMZN
    const marketCap = formatter.format(responseJson.marketCapitalization);// Change to integer and format with fewer zeros
    const exchange = responseJson.exchange;
    const industry = responseJson.finnhubIndustry;
    const url = responseJson.weburl;

    if (name === undefined) {
        $("div#greeting").html(`<h2> Stock symbol is not found. Please try again. </h2>`)
        $("div#greeting").removeClass('hidden');
        $('#results').addClass('hidden');
    } else {
        $("div#greeting").html(`<h2> Your results are below</h2>`);
        $("#overview-ul").empty();
        $("#overview-ul").append(`<li> Company Name: ${name} </li>`);
        $("#overview-ul").append(`<li> Ticker Symbol: ${ticker} </li>`);
        $("#overview-ul").append(`<li> Market Cap: ${marketCap} (MM) </li>`);
        $("#overview-ul").append(`<li> Exchange: ${exchange} </li>`);
        $("#overview-ul").append(`<li> Industry: ${industry} </li>`);
        $("#overview-ul").append(`<li> Website: ${url} </li>`);
        $('#results').removeClass('hidden');
    }
}

// function to display stock's peers
function displayPeers(responseJson2) {
    $("#peers-ul").empty();
    for (let i = 1; i < 7; i++) {
        $("#peers-ul").append(`<li> ${responseJson2[i]} <br> </li>`)
    }
}

// function to display news articles
function displayNews(responseJson3) {
    $("#news-ul").empty(); // change empty and appends to jquery .html
    for (let i = 0; i < 5; i++) {
        $("#news-ul").append(`<li> ${responseJson3[i].headline} --> ${responseJson3[i].url} <br> </li>`)
    }
}

// function to display valuation
function displayValuation(responseJson4, revenueMultiple) {

    // This section obtains the most recent years revenue from the object
    // ***************************FIX THIS:  Need to pull out revenue value from complex JSON and replace test value below ******************************
    const revenue = 24578000000; // Tesla's 2019 revenue as test value

    // This section calculates the valuation
    let value = revenue * revenueMultiple / 1000000; // Note - we divide by 1MM to make value have same format as Market Cap
    value = formatter.format(value);// Makes format with fewer zeros - same format as market cap value in profile section

    // This section displays our value and advice to the user
    $("div#valuation").append(`<p> Based on the industry average revenue multiple of 3.16x, the company should be worth ${value} (MM).  If ${value} (MM) is lower than the market cap shown above, we believe the company is overvalued and you should not buy.  If ${value} (MM) is larger than the market cap, the stock is a good deal and you should consider purchasing it.  If ${value} (MM) is very close to the same value as the market cap, you should not buy or sell the stock at this time. </p>`);
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const stock = $('#js-stock').val();
        const responseJson = getStockProfile(stock);
        const responseJson2 = getStockPeers(stock);
        const responseJson3 = getStockNews(stock);
        const responseJson4 = getStockFinancials(stock);
    });
}

$(function () {
    console.log('App loaded! Waiting for submit!');
    watchForm();
});