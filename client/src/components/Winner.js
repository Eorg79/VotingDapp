import React, { useState, useEffect, useContext } from 'react';
import { ContractContext } from '../utils/ContractContext';
import buffet from '../buffet.jpg';

const Winner = () => {
    const {contract, accounts, isVoter, isOwner } = useContext(ContractContext);
    const [winnerID, setWinnerID] = useState(null);
    const [winner, setWinner] = useState({
        id: null,
        description: '',
        voteCount: null
    });

    useEffect(() => {
    const getWinner = async () => {
       const winnerId = await contract.methods.winningProposalID().call();
          if (winnerId) {
            setWinnerID(winnerId);
            const winnerData = await contract.methods.getOneProposal(winnerId).call({from: accounts[0]}); 
            setWinner({...winner, id: winnerId, description: winnerData.description, voteCount: winnerData.voteCount});
            }
           else {
                console.log('no winning proposal')
           } 
     };
    getWinner();
    }, [winner, accounts, contract]);

    return (
            <div className="card">
                { (isVoter || isOwner) &&
                <>
                <h2>and the winning proposal is...</h2>
                <p>Voting session has ended, votes has been tallied and the winning proposal is <strong>"{winner.description}"</strong>.</p>
                <p>Your canteen will offer this delicious dish shortly...</p>
                <div className="img-wrapper">
                    <img className="img" src={buffet} alt="buffet"/>
                </div>
                </> }
                { (!isVoter) &&
                <>
                <h2>and the winning proposal is...</h2>
                <p>Too bad, you have not paticipated. Voting session has ended, votes has been tallied and the proposal number <strong>"{winnerID}"</strong> is the winner.</p>
                <p>Please contact the admin if you want the details of this proposal.</p>
                </> }
            </div>
                   )
};

export default Winner;