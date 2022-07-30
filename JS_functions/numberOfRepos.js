//finds the number of repos present of the particular author 
function numberOfRepo(authorId, pool) {
        return new Promise((resolve, reject) => {

                let number_of_repos;

                pool.query('SELECT * FROM repodetails WHERE author_id=$1', [authorId], (err, data) => {
                        if (err) {
                                console.log(err);
                                reject(err);
                        }
                        const dataJSON = JSON.stringify(data);
                        Jsonobj = JSON.parse(dataJSON)

                        number_of_repos = Jsonobj["rowCount"];

                        resolve(number_of_repos);
                })

        });
}

module.exports = numberOfRepo;