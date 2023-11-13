# Interact with a contract

## The structure of the Average salary smart contract

To view the structure of the Average salary contract, run the task "Show the ABI for a contract", 
and choose the average salary option.

## Deploy an Average salary contract 

Run the task "Deploy an Average salary contract (ZK contract)", the task will prompt to choose the
account to deploy with.

## Zk input

To send secret inputs to a deployed average salary contract run the task 
"Send a salary as a secret input to an average salary contract". The task will prompt to choose the
sender of the input, the contract to send to and the input salary.

## Compute average salary

To start the computation of the average salary, call the public action start_computation. 
The action can only be called by the owner of the contract, i.e.
the call must be signed by the account that deployed the contract.
There must also be at least 3 inputs added to the contract to compute.
The task will prompt to choose the sender and the address of the deployed contract.

### Use web client to view state and interact with the contract

Run the task "Start client for contract" and choose average-salary-client from the prompt. This will start a
web client able to talk to an average salary contract. Input the address and click "Connect to contract".
If the address corresponds to an average salary contract you should see the administrator in the state section.
To add salary to the contract you need to sign in with an account that has gas. Copy your private key 
(A.pk, B.pk or C.pk) into the form and click login using private key. You can now add salary.
If you have logged as the administrator you can also start the computation by clicking the compute button.
You might have to update the state to see the result of the computation. You can do this by clicking the connect to 
contract button again.

## Secret types


## Secret Struct



