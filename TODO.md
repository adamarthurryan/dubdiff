
 - create production mode build and serve settings: `webpack.js` and `src/server/babel.index.js`


## State changes

main page edits input documents
compare page views compare documents

compare button:

- generate id
- post input documents to server
- input documents copied to compare documents
- input documents cleared
- go to compare route

edit button:

- compare documents copied to input documents
- compare documents cleared
- go to main route

client start:

- load input documents from localStore

server start:

- load compare documents from database


* client actually never needs to query server for compare documents... huh!