(function () {
    let prefectures = [
        { "value": "北海道", "name": "北海道" },
        { "value": "青森", "name": "青森" },
        { "value": "岩手", "name": "岩手" },
        { "value": "宮城", "name": "宮城" },
        { "value": "秋田", "name": "秋田" },
        { "value": "山形", "name": "山形" },
        { "value": "福島", "name": "福島" },
        { "value": "茨城", "name": "茨城" },
        { "value": "栃木", "name": "栃木" },
        { "value": "群馬", "name": "群馬" },
        { "value": "埼玉", "name": "埼玉" },
        { "value": "千葉", "name": "千葉" },
        { "value": "東京", "name": "東京" },
        { "value": "神奈川", "name": "神奈川" },
        { "value": "新潟", "name": "新潟" },
        { "value": "富山", "name": "富山" },
        { "value": "石川", "name": "石川" },
        { "value": "福井", "name": "福井" },
        { "value": "山梨", "name": "山梨" },
        { "value": "長野", "name": "長野" },
        { "value": "岐阜", "name": "岐阜" },
        { "value": "静岡", "name": "静岡" },
        { "value": "愛知", "name": "愛知" },
        { "value": "三重", "name": "三重" },
        { "value": "滋賀", "name": "滋賀" },
        { "value": "京都", "name": "京都" },
        { "value": "大阪", "name": "大阪" },
        { "value": "兵庫", "name": "兵庫" },
        { "value": "奈良", "name": "奈良" },
        { "value": "和歌山", "name": "和歌山" },
        { "value": "鳥取", "name": "鳥取" },
        { "value": "島根", "name": "島根" },
        { "value": "岡山", "name": "岡山" },
        { "value": "広島", "name": "広島" },
        { "value": "山口", "name": "山口" },
        { "value": "徳島", "name": "徳島" },
        { "value": "香川", "name": "香川" },
        { "value": "愛媛", "name": "愛媛" },
        { "value": "高知", "name": "高知" },
        { "value": "福岡", "name": "福岡" },
        { "value": "佐賀", "name": "佐賀" },
        { "value": "長崎", "name": "長崎" },
        { "value": "熊本", "name": "熊本" },
        { "value": "大分", "name": "大分" },
        { "value": "宮崎", "name": "宮崎" },
        { "value": "鹿児島", "name": "鹿児島" },
        { "value": "沖縄", "name": "沖縄" }
    ];
    class SparqlForm {
        buildQuery(select, where) {
            return [
                "PREFIX schema: <http://schema.org/>",
                "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>",
                "PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>",
                "SELECT (", select, ")",
                "WHERE {", where, "}",
            ].join('');
        }
        sparqlSearch(query, htmlId) {
            const url = 'https://sparql.crssnky.xyz/spql/imas/query?query=' + encodeURIComponent(query);
            this.getRequest(url, htmlId);
        }
        getRequest(url, targetOutputId) {
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
    }
    function to2Length(str) {
        if (str.length === 1) {
            return '0' + str;
        }
        else {
            return str;
        }
    }
    let sparqlForm = new SparqlForm();
    function searchBirthdayIdols(birthDate) {
        birthDate['month'] = to2Length(birthDate['month']);
        birthDate['day'] = to2Length(birthDate['day']);
        const dateQuery = birthDate['month'] + '-' + birthDate['day'];
        const Query = sparqlForm.buildQuery("sample(?n) as ?name", "?sub schema:birthDate ?o; schema:name ?n;FILTER(regex(str(?o), '" + dateQuery + "' )).") + "group by(?n)";
        sparqlForm.sparqlSearch(Query, 'birthdayIdols');
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
        const Query = sparqlForm.buildQuery("sample(?n) as ?name", "?s rdf:type imas:Idol; schema:name|imas:nameKana ?on; schema:name ?n; FILTER(CONTAINS(str(?on), '" + nameLike + "')).") + "group by(?n)";
        sparqlForm.sparqlSearch(Query, 'nameLikeIdols');
    }
    document.getElementById('likeSearch').addEventListener('click', (e) => {
        const nameLikeElement = document.getElementById('nameLike');
        const nameLike = nameLikeElement.value;
        searchNameIdols(nameLike);
    }, false);
    function searchBirthPlace(prefecture) {
        if (prefecture === "") {
            prefecture = "　";
        }
        const Query = sparqlForm.buildQuery("sample(?n) as ?name", "?s rdf:type imas:Idol; schema:birthPlace ?bp; schema:name ?n; FILTER(CONTAINS(str(?bp), '" + prefecture + "')).") + "group by(?n)";
        sparqlForm.sparqlSearch(Query, 'birthPlaceIdols');
    }
    document.getElementById('prefectureSearch').addEventListener('click', (e) => {
        const prefectureElement = document.getElementById('prefecture');
        const prefecture = prefectureElement.value;
        searchBirthPlace(prefecture);
    }, false);
    function buildPrefecturesSelect(prefectures) {
        const prefectureElement = document.getElementById('prefecture');
        let selectHtml = "";
        prefectures.forEach(function (prefecture) {
            selectHtml += '<option value="' + prefecture.value + '">' + prefecture.name + '</option>';
        });
        prefectureElement.innerHTML = selectHtml;
    }
    buildPrefecturesSelect(prefectures);
})();
//# sourceMappingURL=index.js.map