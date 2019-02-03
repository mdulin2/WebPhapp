# WebPhapp  
[![Build Status](https://travis-ci.org/Pharmachain/WebPhapp.svg?branch=master)](https://travis-ci.org/Pharmachain/WebPhapp/)  

The Pharmachain web app!

## Unit Testing  
Run all tests before changing any files, opening a PR, updating a PR, and reviewing a PR.  

Back end tests:  
```
cd WebPhapp/backend/
npm install
npm run test
```  

Front end tests:  
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
