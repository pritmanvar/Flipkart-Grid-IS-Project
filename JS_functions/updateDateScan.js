//update the date of scan if the repo is already present in database and scanned before it was updated in github
function updateDateScan(authorId, updated_date, repo, pool) {
        return new Promise((resolve, reject) => {

                pool.query('UPDATE repodetails SET datescanned=$1 WHERE author_id=$2 AND repo=$3', [updated_date, authorId, repo], (err, data) => {
                        if (err) {
                                console.log(err);
                                reject(err);
                        }

                        resolve("datescanned updated")
                })
        });

}


module.exports = updateDateScan;