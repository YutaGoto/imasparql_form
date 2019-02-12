(function (){
  interface BirthDate {
    month: string,
    day: string,
  }

  function buildQuery(select: string, where: string) {
    return [
      "PREFIX schema: <http://schema.org/>",
      "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>",
      "PREFIX imas: <https://sparql.crssnky.xyz/imasrdf/URIs/imas-schema.ttl#>",
      "SELECT (", select, ")",
      "WHERE {", where, "}",
    ].join('');
  }

  function getRequest(url: string, targetOutputId: string) {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.addEventListener("load", (event) => {
      const response =  JSON.parse(event.target['response']);
      const idolArray = response['results']['bindings'].map(function(e) {
        if (Object.keys(e).length){
          return e['name']['value'];
        } else {
          return 'いません';
        }
      });
      document.getElementById(targetOutputId).innerHTML = idolArray.join(', ');
    });
    request.send();
  }

  function to2Length(str: string) {
    if (str.length === 1) {
     return '0' + str;
    } else {
      return str;
    }
  }

  function searchBirthdayIdols(birthDate: BirthDate) {
    birthDate['month'] = to2Length(birthDate['month']);
    birthDate['day'] = to2Length(birthDate['day']);
    const dateQuery = birthDate['month'] + '-' + birthDate['day'];
    const Query = buildQuery(
      "sample(?n) as ?name",
      "?sub schema:birthDate ?o; schema:name ?n;FILTER(regex(str(?o), '" + dateQuery + "' ))."
    ) + "group by(?n)";
    const url = 'https://sparql.crssnky.xyz/spql/imas/query?query=' + encodeURIComponent(Query);
    getRequest(url, 'birthdayIdols');
  }

  document.getElementById('birthdaySearch').addEventListener('click', (e) => {
    const monthElement: HTMLInputElement =<HTMLInputElement>document.getElementById('month');
    const dayElement: HTMLInputElement =<HTMLInputElement>document.getElementById('day');
    const searchDate = {
      month: monthElement.value,
      day: dayElement.value
    };

    searchBirthdayIdols(searchDate);
  }, false);

  function searchNameIdols(nameLike: string) {
    if (nameLike === "") {
      nameLike = "　　";
    }
    const Query = buildQuery(
      "sample(?n) as ?name",
      "?s rdf:type imas:Idol; schema:name|imas:nameKana ?on; schema:name ?n; FILTER(CONTAINS(str(?on), '" + nameLike + "'))."
    ) + "group by(?n)";
    const url = 'https://sparql.crssnky.xyz/spql/imas/query?query=' + encodeURIComponent(Query);
    getRequest(url, 'nameLikeIdols');
  }

  document.getElementById('likeSearch').addEventListener('click', (e) => {
    const nameLikeElement: HTMLInputElement =<HTMLInputElement>document.getElementById('nameLike');
    const nameLike = nameLikeElement.value;
    searchNameIdols(nameLike);
  }, false);

})();
