# SecureBuddy 🐱‍🏍

[Website link](#)

[Demo video link](#)

## What is SecureBuddy ? 🤔

* SecureBuddy is your partner in open-source journey. 🚀

* SecureBuddy helps you to find if any repository is 🟢safe or 🔴unsafe. 

* This project is made under Flipkart GRiD 4.0 - Information Security Challenge. 

## Problem Statement / What problem we are trying to solve? 🧐

* We all know how open source important and integral part of every tech product. We all use open-source software, and many of us also love contributing to it.

* But as good things, there are bad things also. Not all the open-source repositories may be well maintained and harm-free. Whereas, some of the open-source repositories could be created by attackers themselves to trick the users.

* To solve this problem we need a tool that can perform vulnerability and health checks on the repository and tell us if that repo is genuine or not.

## Our Solution: SecureBuddy: ✨

* SecureBuddy first scans the repository with the help of free software ‘snyk’. Which gives the list of vulnerabilities that are present in the source code. From that,  SecureBuddy will find the vulnerability score.

* We have defined a formula, which generates a repo score using the vulnerability score, no of stars, and forks that the repository contains. This repo score will help to find the genuineness of the repository.

* For finding the genuineness of the author, ScoreBuddy uses a trust score. Trust score is the average repo score of all repositories our application has scanned of that author.

* At last, SecureBuddy will give the conclusion based on the repo score of the repository. 

## Technologies used: 👩🏻‍💻⚙
* Front-end: HTML, CSS
* Back-end: NodeJS, Express, Github API, Snyk CLI
* Database: Postgresql 

## Future Planes of Project SecureBuddy: 🔮
* Will be able to use SecureBuddy for all kinds of open-source platforms. 
* SecureBuddy will support all languages.
* A very less response time.

