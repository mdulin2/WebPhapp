# WebPhapp  
[![Build Status](https://travis-ci.org/Pharmachain/WebPhapp.svg?branch=master)](https://travis-ci.org/Pharmachain/WebPhapp/)  

The Pharmachain web app!

## MySQL DB Connection  
In the directory `Webphapp/Webphapp/backend/` is the file `connections.js`. This file holds the connection strings for the database. To have any database functionality, you need to insert proper credentials to this file. You can find the working `connections.js` file in the GDrive folder. If connection strings are not provided, the backend falls back on filling in dummy data. When you commit future changes, make sure not to push the connection strings. This should be a hard mistake to make because the file is listed in `.gitignore`.


## Unit Testing  
Run all tests before changing any files, opening a PR, updating a PR, and reviewing a PR.  

All tests can be ran together by calling `./testRunner.sh`. This automatically wil call `npm install` for both the frontend and backend. To skip this step, call `./testRunner.sh -n` instead.  

Back end tests individually:  
```
cd WebPhapp/backend/
npm install
npm run test
```  

Front end tests individually:  
```
cd WebPhapp/client/
npm install
npm run test
```

Blockchain test development is in progress.  

### Troubleshooting

**Inotify Listener Error**
- Both the front and backend unit tests are run using npm. There is a potential error message you may get that looks like this:  
`npm ERR! No Space left on device`  

- This does not mean your machine ran out of disc space. It has something to do with inotify listeners.
To fix the issue, run this in your console:  
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`  

- To read about why this is the case:  
https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers  
