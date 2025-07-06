# Midnight Explorer


## Available Scripts
- `npm install` for dependencies
- `vercel dev` will spin up both APIs and the REACT APP (what you should run)
- `npm run start` will just run the react app

- The server side APIs perform calls to a firestore instance where indexer and chain activity metrics are aggregated over time.
	- A local backup of the firestore data can be downloaded [here](https://github.com/noelrim/midnight-explorer/blob/main/firestore-export.zip)
  	- To run the app with the static data, setup a local firestore instance by installing firebase firestore emulator
  	- After installation, run firestore with the following command:  `firebase emulators:start --import=./firestore-export --only firestore`
  	- Make sure you fill in the necessary variables in your dev `.env` see `.env.example`, for instance:
  	```
  		FIREBASE_USE_EMULATOR=true
		FIREBASE_CONFIG={"apiKey":"","authDomain":"localhost","projectId":"midnight-explorer","storageBucket":"","messagingSenderId":"","appId":""}
	```
## Screenshots
![image](https://github.com/noelrim/midnight-explorer/blob/main/public/img/sc-1.png?raw=true)
![image](https://github.com/noelrim/midnight-explorer/blob/main/public/img/sc-2.png?raw=true)
![image](https://github.com/noelrim/midnight-explorer/blob/main/public/img/sc-3.png?raw=true)
![image](https://github.com/noelrim/midnight-explorer/blob/main/public/img/sc-4.png?raw=true)
