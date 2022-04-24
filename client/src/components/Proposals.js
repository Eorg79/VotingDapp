import React, { useContext } from 'react';
import { ContractContext } from '../utils/ContractContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Proposals = () => {
  const { contract, accounts, proposalsList, setProposalsList, isVoter } = useContext(ContractContext);
  
    const initialValues = {
      proposal: ''
    };

    const onSubmit =  async (values, onSubmitProps) => {
            console.log(formik.values.proposal);
            const Proposal = formik.values.proposal;
            await contract.methods.addProposal(Proposal).send({from: accounts[0]});
            alert('Your proposal has been sent, you should see the transaction in your wallet shortly');
            onSubmitProps.resetForm();
    };

    const validationSchema = Yup.object({
        proposal: Yup.string().min(3, '3 caractères minimum').max(80, '80 caractères maximum').required('ce champ doit être complété'),
    }); 

    const formik = useFormik({ initialValues, onSubmit, validationSchema });

      return (
         <>
         {isVoter ? ( 
              <>
                <div className="card">
                    <h2>Propose a dish</h2>
                      <form onSubmit={formik.handleSubmit}>
                        <div className="form-control">
                          <label htmlFor="proposal">your dish</label>
                          <input type="text" id="proposal" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.proposal} />
                          {formik.touched.proposal && formik.errors.proposal ? (<div className="error">{formik.errors.proposal}</div>) : (null)}
                          </div>
                          <button className="btn" type="submit">add proposal</button>
                      </form>  
                </div>
                
                <div className="card">
                    <h2>list of proposed dishes</h2>   
                    <ul>
                      {proposalsList.map((proposal)=> (
                        <li key={proposal.Id}>
                          {proposal.Description}</li>
                          ))}               
                      </ul>
                </div>
              </>)
              
              : (<div className="card">
                <p>Sorry, you must be a registered voter to submit proposals.</p>
                </div>
                )}
         </>
      );
};

export default Proposals;