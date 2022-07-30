//update the trust score if the author is already present in database and new repo of same author is being scanned
function updateTrustScore(authorName, trustScore, pool) {
        return new Promise((resolve, reject) => {

                pool.query('UPDATE authorDetails SET trust_score=$1 WHERE author=$2', [trustScore, authorName], (err, data) => {
                        if (err) {
                                console.log(err);
                                reject(err);
                        }

                        resolve("trust score updated");
                })

        });

}

module.exports = updateTrustScore;