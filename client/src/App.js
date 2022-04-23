import React, { useState, useEffect } from "react";
import { ContractContext } from './utils/ContractContext';
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Registration from './components/Registration';
import Proposals from './components/Proposals';
import Voting from './components/Voting';
import WorkflowButton from "./components/WorkflowButton";
import Winner from "./components/Winner";

import "./styles/main.css";

const App = () => {
  const [workflowStatus, setworkflowStatus] = useState('');
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isVoter, setIsVoter] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votersList, setVotersList] = useState([]);
  const [proposalsList, setProposalsList] = useState([]);
  
  useEffect(() => {
    const runInit = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        const instance = new web3.eth.Contract(
          VotingContract.abi,
          deployedNetwork && deployedNetwork.address,
          );
          // Set web3, accounts, and contract to the state
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);

        //function to set workflowStatus state  
        const setWorkflowStatus = async (statusIndex) => {
            switch(statusIndex) {
              case "0" : setworkflowStatus(...workflowStatus, "Registering voters");
              break;
              case "1" : setworkflowStatus(...workflowStatus, "Registering proposals");
              break; 
              case "2" : setworkflowStatus(...workflowStatus, "Proposals registration ended");
              break;
              case "3" : setworkflowStatus(...workflowStatus,"Voting session started");
              break;
              case "4" : setworkflowStatus(...workflowStatus,"Voting session ended");
              break;
              case "5" : setworkflowStatus(...workflowStatus,"Votes Tallied");
              break;
              default: setworkflowStatus(...workflowStatus, "Unknown workflow status");
            };
          };
          
          //get contract workflowstatus
          let statusIndex = await instance.methods.workflowStatus().call();
          setWorkflowStatus(statusIndex);

          //check if user is owner
          const owner = await instance.methods.owner().call();
          if (accounts[0] === owner) {
              setIsOwner(true);
            }

          //check if user is registered voter
          const user = await instance.methods.getVoter(accounts[0]).call({from: accounts[0]});
          if (user.isRegistered === true) {
           setIsVoter(true);
          };  

          //check if user has voted
          const voted = await instance.methods.getVoter(accounts[0]).call({from: accounts[0]});
          if (voted.hasVoted === true) {
           setHasVoted(true);
          };  

          //retrieve WorkflowStatusChange events
          await instance.events.WorkflowStatusChange()   
          .on('data', event => setWorkflowStatus(event.returnValues._newStatus))
          .on('changed', changed => console.log(changed))
          //.on('error', err => throw err)
          .on('connected', str => console.log(str))
 
          //subscription to VoterRegistered event
          await instance.events.VoterRegistered()   
          .on('data', event => setVotersList(votersList => [event.returnValues._voterAddress, ...votersList]))
          .on('changed', changed => console.log(changed))
          //.on('error', err => throw err)
          .on('connected', str => console.log(str))
          
          //subscription to ProposalRegistered event
          await instance.events.ProposalRegistered()   
          .on('data', async (event) => {
            let id = event.returnValues._proposalId;
            //let from = web3.eth.accounts.recoverTransaction(event.signature);
            let description = await instance.methods.getOneProposal(id).call({from: accounts[0]});
            let Proposal = {Id: id, Description: description.description};
            setProposalsList(proposalsList => [...proposalsList, Proposal]);
            })
          //setProposalsList(proposalsList => [event.returnValues.proposalId, ...proposalsList]);
          .on('changed', changed => console.log(changed))
          //.on('error', err => throw err)
          .on('connected', str => console.log(str))
      
          //subscription to Voted event
          await instance.events.Voted()   
          .on('data', event => {
            console.log(event.returnValues._voterAddress);
            setHasVoted(true); })
          .on('changed', changed => console.log(changed))
          //.on('error', err => throw err)
          .on('connected', str => console.log(str))

        } catch (error) {
          // Catch any errors for any of the above operations.
            console.error(error);
          }
        };
       runInit();
      }, []);

  return (
    
    <div className="body-container">
      <ContractContext.Provider value={{ workflowStatus, setworkflowStatus, web3, setWeb3, accounts, setAccounts, contract, setContract, votersList, setVotersList, isOwner, isVoter, setIsVoter, hasVoted, setHasVoted, proposalsList, setProposalsList }}>
          <div className="header">
            <h1>Vote for your canteen Menu</h1>
            <div>connected wallet: {accounts[0]}</div>
          </div>
        {web3 ? 
          (<div className="container">
            <div className="dashboard">
                  <h2>Current status: {workflowStatus}</h2>
                  {workflowStatus === "Proposals registration ended" && <p>Voting session will start shortly</p>}
                  {workflowStatus === "Voting session ended" && <p>Votes will be tallied soon</p>}     
                  {workflowStatus === "Unknown workflow status" && <p>Oups, there is a problem with the session status, please try again</p>}     
                  {isOwner === true && <WorkflowButton />}
            </div>
            {workflowStatus === "Registering voters" && <Registration/>}
            {workflowStatus === "Registering proposals" && <Proposals />}
            {workflowStatus === "Voting session started" && <Voting />}
            {workflowStatus === "Votes Tallied" && <Winner />}
          </div>
          ) :
          (<div className="container">
            <div className="card">
              <h2>Sorry, no web3 connexion.</h2>
              <p><strong>Please try again, by updating or reconnecting you wallet.</strong></p>
              <div className="animated-icon">
                <i className="fa-solid fa-browser fa-beat-fade"></i>
              </div>
            </div>
          </div>
          )}
      </ContractContext.Provider>
    </div>
    
  );

}

export default App;
