import React, { useContext, useEffect } from 'react';
import { ContractContext } from '../utils/ContractContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Registration = () => {
    const {contract, accounts, votersList, setVotersList, isOwner, isVoter } = useContext(ContractContext);
    
    const initialValues = {
      VoterAddress: ''
    };

      const onSubmit =  async (values, onSubmitProps) => {
            const address= formik.values.VoterAddress;
            await contract.methods.addVoter(address).send({from: accounts[0]});
            alert('Voter has been registered');
            onSubmitProps.resetForm();
      };
    
      const EthAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      const validationSchema = Yup.object().shape({
      VoterAddress: Yup.string().matches(EthAddressRegex, 'invalid address format').required('this field must be filled'),
      });

      const formik = useFormik({ initialValues, onSubmit, validationSchema });

    useEffect(() => {
      const getExistingVoters = async () => {
        await contract.getPastEvents('VoterRegistered', {
          filter: {
              value: []    
          },
          fromBlock: 0,             
          toBlock: 'latest'},
         (err, events) => {
              events.map( async (voter) => {
              let Voter = voter.returnValues._voterAddress;
              setVotersList(votersList => [...votersList, Voter]);
            });
          });
        };
      getExistingVoters();
      }, []);

    return (
         <>      
                {isOwner &&   
                <div className="card">
                    <h2>Register voters</h2>
                      <form onSubmit={formik.handleSubmit}>
                        <div className="form-control">
                          <label htmlFor="VoterAddress">Address</label>
                          <input type="text" id="VoterAddress" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.VoterAddress} />
                          {formik.touched.VoterAddress && formik.errors.VoterAddress ? (<div className="error">{formik.errors.VoterAddress}</div>) : (null)}
                          </div>
                          <button className="btn" type="submit">add Voter</button>
                      </form>                     
                </div>
                  }
                {isVoter ? (
                <div className="card">
                    <h2>list of registered voters</h2>
                    <ul className="voters-list">
                      {votersList.map((voter) => (
                        <li key={voter}>{voter}</li>
                      ))}
                    </ul>   
                </div>)
                : (
                <div className="card">
                <p>You must be a registered voter to see list of voters.</p>
                </div>
                )}
                  
         </>
      );
};

export default Registration;