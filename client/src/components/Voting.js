import React, { useContext } from 'react';
import { ContractContext } from '../utils/ContractContext';

const Voting = () => {
  const { proposalsList, setProposalsList, contract, accounts, isVoter, hasVoted } = useContext(ContractContext);
  
  const setVote = async (proposalId) => {
    await contract.methods.setVote(proposalId).send({from: accounts[0]});
    alert('Your vote has been sent, you should see the transaction in your wallet shortly');
  };

  return (
         <>
            <div className="card">
              <h2>Voting session</h2>
              {(isVoter && !hasVoted) && 
                    <table className="table">
                      <thead className="table__thead">
                        <tr className="cart-table-range-label">
                          <td>description</td>
                          <td>vote for</td>
                        </tr >       
                        {proposalsList.map((proposal)=> (
                        <tr className="cart-table-range" key={proposal.Id}>
                          <td>{proposal.Description}</td>
                          <td>
                            <div id={proposal.Id} className="icon" onClick={() => { if (window.confirm("Your vote is about to be sent. You can vote only once")) {setVote(proposal.Id)}}}>
                              <i className="far fa-heart"></i>
                              <i className="fas fa-heart"></i>
                            </div>
                          </td>
                        </tr>))}
                      </thead>
                    </table>}
                {(isVoter && hasVoted) && 
                  <p>You have already voted for your favorite dish.</p>}
                {!isVoter &&
                  <p>Sorry, you must be a registered voter to vote for your favorite dish.</p>}
                </div>                          
         </>
    );
};

export default Voting;