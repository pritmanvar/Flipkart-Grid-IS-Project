//checks if author is present in the database and return the details of author if present
function isAuthorPresent(authorName, pool) {
    return new Promise((resolve, reject) => {

        //variables to store author details and return it to parent
        let authorId = -1;
        let trustScore;
        let numberOfRepos;
        let authorPresent = false;

        pool.query('SELECT * FROM authorDetails WHERE author=$1', [authorName], (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            //convert to JSON object
            const dataJSON = JSON.stringify(data);
            Jsonobj = JSON.parse(dataJSON);

            //extract the fields from JSON object
            let author_Present = Jsonobj["rowCount"] > 0 ? true : false;

            if (author_Present) {

                authorPresent = author_Present;
                authorId = Jsonobj["rows"][0]["author_id"];
                trustScore = Jsonobj["rows"][0]["trust_score"];
                numberOfRepos = Jsonobj["rowCount"]
            }

            let output_object = {
                authorPresent: authorPresent,
                authorId: authorId,
                trustScore: trustScore,
                numberOfRepos: numberOfRepos
            }

            resolve(output_object);
        })
    });

}
module.exports = isAuthorPresent;
