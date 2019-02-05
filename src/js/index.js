(function () {
    function to2Length(str) {
        if (str.length === 1) {
            return '0' + str;
        }
        else {
            return str;
        }
    }
    function searchIdol(birthDate) {
        birthDate['month'] = to2Length(birthDate['month']);
        birthDate['day'] = to2Length(birthDate['day']);
        const dateQuery = birthDate['month'] + '-' + birthDate['day'];
        const Query = "PREFIX schema: <http://schema.org/>SELECT (sample(?n) as ?name) WHERE { ?sub schema:birthDate ?o; schema:name|schema:alternateName ?n;FILTER(regex(str(?o), '" + dateQuery + "' )).}group by(?n)order by(?name)";
        const url = 'https://sparql.crssnky.xyz/spql/imas/query?query=' + encodeURIComponent(Query);
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.addEventListener("load", (event) => {
            const response = JSON.parse(event.target['response']);
            const idolArray = response['results']['bindings'].map(function (e) {
                if (Object.keys(e).length) {
                    return e['name']['value'];
                }
                else {
                    return 'いません';
                }
            });
            document.getElementById('idols').innerHTML = idolArray.join(', ');
        });
        request.send();
    }
    document.getElementById('search').addEventListener('click', (e) => {
        const monthElement = document.getElementById('month');
        const dayElement = document.getElementById('day');
        const searchDate = {
            month: monthElement.value,
            day: dayElement.value
        };
        searchIdol(searchDate);
    }, false);
})();
//# sourceMappingURL=index.js.map