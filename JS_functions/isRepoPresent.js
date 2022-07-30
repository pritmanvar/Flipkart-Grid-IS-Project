//checks if repo is present in database already scanned and return the deatils of repo if present
function isRepoPresent(authorID, repoName, pool, res) {
        return new Promise((resolve, reject) => {

                let output_repo = {
                        repoPresent: false,
                        last_updated: 0,
                        repo_score: 0
                }

                pool.query('SELECT * FROM repoDetails WHERE author_id=$1 AND repo=$2', [authorID, repoName], (err, data) => {
                        if (err) {
                                console.log(err);
                                reject(err);
                        }

                        const dataJSON = JSON.stringify(data);
                        Jsonobj = JSON.parse(dataJSON);

                        //find if repo is present
                        output_repo["repoPresent"] = Jsonobj["rowCount"] > 0 ? true : false;

                        //if repo is present
                        if (output_repo["repoPresent"] == true) {
                                output_repo["last_updated"] = Jsonobj["rows"][0]["datescanned"];
                                output_repo["repo_score"] = Jsonobj["rows"][0]["repo_score"];
                        }

                        resolve(output_repo);
                })

        });
}
module.exports = isRepoPresent;