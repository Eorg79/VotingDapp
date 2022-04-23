import React, { useContext } from 'react';
import { ContractContext } from '../utils/ContractContext';

const WorkflowButton = () => {
    const { workflowStatus, contract, accounts } = useContext(ContractContext);
    
    const startProposalsRegistering = async () => {
        window.confirm('This will definitively end the voters registration stage');
        await contract.methods.startProposalsRegistering().send({from: accounts[0]});;
      };
    const endProposalsRegistering = async () => {
        window.confirm('This will definitively end the proposal registration stage');
        await contract.methods.endProposalsRegistering().send({from: accounts[0]});;  
      };  
    const startVotingSession = async () => {
        window.confirm('This will start the voting session');
        await contract.methods.startVotingSession().send({from: accounts[0]});; 
      };
    const endVotingSession = async () => {
        window.confirm('This will definitively end the voting session');
        await contract.methods.endVotingSession().send({from: accounts[0]});;    
      };
    const tallyVotes = async () => {
        window.confirm('This will definitively tally votes');
        await contract.methods.tallyVotes().send({from: accounts[0]});;    
      };

    return (
      <> 
        {workflowStatus === "Registering voters" && <button className='btn' onClick={startProposalsRegistering}>open proposals</button>}
        {workflowStatus === "Registering proposals" && <button className='btn' onClick={endProposalsRegistering}>close proposals</button>}
        {workflowStatus === "Proposals registration ended" && <button className='btn' onClick={startVotingSession}>start voting</button>}
        {workflowStatus === "Voting session started" && <button className='btn' onClick={endVotingSession}>end voting</button>}
        {workflowStatus === "Voting session ended" && <button className='btn' onClick={tallyVotes}>tally votes</button>}
      </> 
    )

};

export default WorkflowButton; 