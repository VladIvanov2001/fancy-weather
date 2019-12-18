export default async function loadFromAPITo(responseObj, URL){
    const resObj = responseObj;
    const promise = fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            resObj.response = data;
        });

    await promise;
}
