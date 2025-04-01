const { Wallets, Gateway } = require("fabric-network");
const fs = require('fs');
async function pushDataToBlockchain(idSignature, signature, ) {
    const ccpPath = '/home/dunq/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const wallet = await Wallets.newInMemoryWallet();
    await wallet.put(idSignature, signature);

    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: idSignature, discovery: {enabled: true, asLocalhost: true}});

    const channel = await gateway.getNetwork('mychannel');  

    const chaincode = await channel.getContract('fabcar');

    await chaincode.submitTransaction('createCustomer', fullName, email, phoneNumber, password, address, dateOfBirth, image);

}

module.exports = {
    pushDataToBlockchain
}