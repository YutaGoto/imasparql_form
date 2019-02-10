(function () {
    function buildQuery(select, where) {
        return [
            "PREFIX schema: <http://schema.org/>",
            "PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>",
            "SELECT (", select, ")",
            "WHERE {", where, "}",
        ].join('');
    }
    function getRequest(url, targetOutputId) {
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
            document.getElementById(targetOutputId).innerHTML = idolArray.join(', ');
        });
        request.send();
    }
    function to2Length(str) {
        if (str.length === 1) {
            return '0' + str;
        }
        else {
            return str;
        }
    }
    function searchBirthdayIdols(birthDate) {
        birthDate['month'] = to2Length(birthDate['month']);
        birthDate['day'] = to2Length(birthDate['day']);
        const dateQuery = birthDate['month'] + '-' + birthDate['day'];
        const Query = buildQuery("sample(?n) as ?name", "?sub schema:birthDate ?o; schema:name|schema:alternateName ?n;FILTER(regex(str(?o), '" + dateQuery + "' )).") + "group by(?n)";
        const url = 'https://sparql.crssnky.xyz/spql/imas/query?query=' + encodeURIComponent(Query);
        getRequest(url, 'birthdayIdols');
    }
    document.getElementById('birthdaySearch').addEventListener('click', (e) => {
        const monthElement = document.getElementById('month');
        const dayElement = document.getElementById('day');
        const searchDate = {
            month: monthElement.value,
            day: dayElement.value
        };
        searchBirthdayIdols(searchDate);
    }, false);
    function searchNameIdols(nameLike) {
        if (nameLike === "") {
            nameLike = "　　";
        }
        const Query = buildQuery("sample(?n) as ?name", "?s schema:name|imas:nameKana ?on; schema:name ?n; FILTER(CONTAINS(str(?on), '" + nameLike + "')).") + "group by(?n)";
        const url = 'https://sparql.crssnky.xyz/spql/imas/query?query=' + encodeURIComponent(Query);
        getRequest(url, 'nameLikeIdols');
    }
    document.getElementById('likeSearch').addEventListener('click', (e) => {
        const nameLikeElement = document.getElementById('nameLike');
        const nameLike = nameLikeElement.value;
        searchNameIdols(nameLike);
    }, false);
})();
//# sourceMappingURL=index.js.map