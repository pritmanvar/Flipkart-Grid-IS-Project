
//used to insert new row in author table
//call this function before inserting the details in repo table
function insertAuhtor(authorName, trustScore, pool) {
        return new Promise((resolve, reject) => {

                pool.query('INSERT INTO authorDetails (author, trust_score) VALUES ($1, $2)', [authorName, trustScore], (err, data) => {
                        if (err) {
                                console.log(err);
                                reject(err);
                        }

                        resolve("Repo inserted successfully")
                })


        });
}
module.exports = insertAuhtor;