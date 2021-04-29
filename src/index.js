import Web3 from 'web3';
import app from './app.js';
import env from './configs/index.js';
import truffle_connect from './connection/app.js';

app.listen(env.PORT, env.HOST, err => {
  if (err) {
    console.error(err);
  }
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider(env.ETHNetwork));
  console.log(`server is running on ${env.HOST}:${env.PORT}`);
  console.log(`NODE_ENV is ${env.NODE_ENV}`);
});
