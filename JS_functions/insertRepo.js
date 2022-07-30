
//insert new row in repo table
function insertRepo(repoName, repoScore, authorId, dateScanned, pool) {

        return new Promise((resolve, reject) => {
                pool.query('INSERT INTO repoDetails (repo, repo_score, author_id, datescanned ) VALUES ($1, $2, $3, $4)', [repoName, repoScore, authorId, dateScanned], (err, data) => {
                        if (err) {
                                console.log(err);
                                reject(err);
                        }


                        resolve("Repo inserted successfully")
                })
        });
}
module.exports = insertRepo;