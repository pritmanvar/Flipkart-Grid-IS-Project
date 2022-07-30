const { Pool } = require('pg');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var https = require('https');


//import statements
const isAuthorPresent = require("./JS_functions/isAuthorPresent.js");
const isRepoPresent = require("./JS_functions/isRepoPresent.js");
const insertAuhtor = require("./JS_functions/insertAuhtor.js");
const insertRepo = require("./JS_functions/insertRepo.js");
const updateTrustScore = require("./JS_functions/updateTrustScore.js");
const vulnerabilityScan = require('./JS_functions/vulnerabilityScan.js');
const updateDateScan = require('./JS_functions/updateDateScan.js');
const updateRepoScore = require('./JS_functions/updateRepoScore.js');
const numberOfRepo = require('./JS_functions/numberOfRepos.js');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

//function to get the range of stars
const get_range_of_stars = (stars) => {
    if (stars <= 100) {
        return 1;
    } else if (stars <= 1000) {
        return 2;
    } else if (stars <= 10000) {
        return 3;
    } else if (stars <= 100000) {
        return 4;
    } else {
        return 5;
    }
}

//function to get the value according to range it belongs
const get_range_of_forks = (forks) => {
    if (forks <= 100) {
        return 1;
    } else if (forks <= 1000) {
        return 2;
    } else if (forks <= 10000) {
        return 3;
    } else if (forks <= 100000) {
        return 4;
    } else {
        return 5;
    }
}

app.post("/", async function (req, res) {



    let fork; //to store number of forks from the github api call
    let lastUpdate;//to store the time stamp of last updated from the github api call
    let stars;//to store number of stars from the github api call

    const url = req.body.repoUrl;
    const match = url.match(
        /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
    );
    const owner = match.groups.owner;
    const repoN = match.groups.name;




    //for repo information 

    const reponame = repoN;
    const option = {
        hostname: 'api.github.com',
        path: '/repos/' + owner + '/' + repoN,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36'
        },
        OAUth: process.env.GITHUB_ACCESS_TOKEN
    }

    https.get(option, (response) => {
        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        //map the values from api call to variables
        response.on("end", () => {
            try {
                let json = JSON.parse(body);
               
                fork = json.forks_count;
                repoName = json.name;
                repoFullName = json.full_name;
                lastUpdate = json.updated_at;
                license = json.license;
                stars = json.stargazers_count;


            } catch (error) {
                console.error(error.message);
            };
        });

    }).on("error", (error) => {
        console.error(error.message);
    });

    //create connection to databse
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });


    let author = owner; //the author of the repo
    let new_trust_score = 0; //trust score of the author
    let repo = reponame; //name of the repo
    let new_repo_score = 0; //repo score of the repo
    let time = new Date().getTime(); //current time when the repo is scanned
    let n = 0; //to store the number of repo of the author


    let author_output = {};
    //check author is present in database
    author_output = await isAuthorPresent(author, pool);

    let repo_output = {};
    //author is present
    if (author_output["authorId"] != -1) {

        //get the number of repos of author from database
        n = await numberOfRepo(author_output.authorId, pool);

        //check if repo is present in database already scanned before
        repo_output = await isRepoPresent(author_output["authorId"], repo, pool, res);

        //repo is not present in database
        if (repo_output["repoPresent"] == false) {
            //calculate vulnerability score of the repo using snyk cli
            let vulnerabilityScore = await vulnerabilityScan(url);

            //calculate repo score and trust score
            new_repo_score = (10 - vulnerabilityScore) * 9 + get_range_of_stars(stars) + get_range_of_forks(fork);
            new_trust_score = (n * author_output["trustScore"] + new_repo_score) / (n + 1) // update n

            //insert repo with repo score in databse for future use
            await insertRepo(repo, new_repo_score, author_output.authorId, time, pool);

            //update trust score of author
            await updateTrustScore(author, new_trust_score, pool);

        } else {
            // repo is present
            // check last date of scan
            // if it is updated -> scan again
            let last_date_scanned = parseInt(repo_output["last_updated"]);

            //it is not updated so render the result
            if ((last_date_scanned) > new Date(lastUpdate).getTime()) {
                new_repo_score = repo_output["repo_score"];
                new_trust_score = author_output["trustScore"];

                return res.render('result', { repoUrl: url, repoScore: new_repo_score, trustScore: new_trust_score });

            } else {
                // scan repo again
                // update repo
                let vulnerabilityScore = await vulnerabilityScan(url);

                new_repo_score = (10 - vulnerabilityScore) * 9 + get_range_of_stars(stars) + get_range_of_forks(fork);
                new_trust_score = (n * author_output["trustScore"] - repo_output["repo_score"] + new_repo_score) / n // n = number of repos of author

                //update repo score and date scan and trust score
                await updateRepoScore(author_output.authorId, new_repo_score, repo, pool);
                await updateDateScan(author_output.authorId, time, repo, pool);
                await updateTrustScore(author, new_trust_score, pool);

            }
        }
    } else {
        //author is not present in database
        let vulnerabilityScore = await vulnerabilityScan(url);

        //calculate repo score how much repo is good
        new_repo_score = (10 - vulnerabilityScore) * 9 + get_range_of_stars(stars) + get_range_of_forks(fork);
        //how much author is trustworthy
        new_trust_score = new_repo_score;

        //insert the author
        await insertAuhtor(author, new_trust_score, pool);

        //get the author id 
        author_output = await isAuthorPresent(author, pool);

        //insert the repo details and attach it with author id fetched above
        await insertRepo(repo, new_repo_score, author_output.authorId, time, pool);
    }

    //render the result
    return res.render('result', { repoUrl: url, repoScore: new_repo_score, trustScore: new_trust_score });

});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is runnning on port 3000");
});
