module.exports =  function mailOptions(activationToken){
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Storagehotel Account Activation',
        text: 'Follow this link to finish creating your account ' 
        + `http://localhost:4200/activate/${activationToken}`,
    }
}
