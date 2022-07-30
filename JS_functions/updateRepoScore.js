//update the repo score if the repo is already present in database and scanned before it was updated in github
function updateRepoScore(authorId, updated_repo_score, repo, pool) {
        return new Promise((resolve, reject) => {

                pool.query('UPDATE repodetails SET repo_score=$1 WHERE author_id=$2 AND repo=$3', [updated_repo_score, authorId, repo], (err, data) => {
                        if (err) {
                                console.log(err);
                                reject(err);
                        }

                        resolve("repo score updated")
                })
        });

}

module.exports = updateRepoScore;