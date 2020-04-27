$(document).ready(function () {

    var _url = "https://my-json-server.typicode.com/AchmadZeinFeroza/pwa/products"
    var results = ''
    var catResults = ""
    var categories = []

    function renderPage(data) {

        $.each(data, function (key, items) {

            _cat = items.country

            results += "<div>"
                +
                "<h3>" + items.city + "</h3>"
                +
                "<p>" + items.country + "</p>"
                +

                "</div>";

            if ($.inArray(_cat, categories) == -1) {
                categories.push(_cat)
                catResults += "<option value=" + items.country + "> " + items.country + " </option> "
            }
        })

        $("#kota").html(results)
        $("#pilihan").html("<option value='semua'> Semua </option>" + catResults)

        $("#pilihan").on('change', function () {
            kategori($(this).val())
        })

    }

    var networkReceived = false
    
    // fresh update
    
    var networkUpdate =  fetch(_url).then(function(response){
        return response.json()
    }).then(function(data){
        networkReceived = true
        renderPage(data)
    })

    caches.match(_url).then(function(response){
        if(!response){
            throw Error('no data in cache')
        }else{
            return response.json()
        }
    }).then(function(data){
        if(!networkReceived){
            return renderPage(data)
        }
    }).catch(function(){
        if(networkReceived){
            return networkUpdate
        }
    })

    function kategori(cat) {

        var results = ''
        var _newUrl = _url

        if (cat != 'semua') {
            _newUrl = _url + "?country=" + cat
        }
        console.log(_newUrl)
        $.get(_newUrl, function (data) {

            $.each(data, function (key, items) {

                _cat = items.country

                results += "<div>"
                    +
                    "<h3>" + items.city + "</h3>"
                    +
                    "<p>" + items.country + "</p>"
                    +

                    "</div>";
            })

            $("#kota").html(results)
        })

    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}