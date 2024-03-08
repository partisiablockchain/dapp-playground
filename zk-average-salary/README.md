# Zero Knowledge average salary

Simple Average Salary contract
Average salary is a common multi-party computation example, where several privacy-concious
individuals are interested in determining whether they are getting a fair salary, without
revealing the salary of any given individual.
This implementation works in following steps:
1. Initialization on the blockchain.
2. Receival of multiple secret salaries, using the real zk protocol.
3. Once enough salaries have been received, the contract owner can start the ZK computation.
4. The Zk computation sums all the given salaries together.
5. Once the zk computation is complete, the contract will publicize the the summed variable.
6. Once the summed variable is public, the contract will compute the average and store it in
   the state, such that the value can be read by all.

**NOTE**: This contract is missing several features that a production ready contract should
possess, including:
- An allowlist over salarymen.
- Check that each address only sends a single variable.