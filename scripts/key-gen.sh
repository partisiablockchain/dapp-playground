#!/bin/bash

generate_keys() {
  declare key_pair=($(cargo partisia-contract cli account create))
  address=${key_pair[1]}
  private_key=${key_pair[4]}

  echo "$address"
  echo "$private_key" > $1

  fill_with_gas $address
  fill_with_gas "00d2a34b0417dd0d0f3afd6e972327b04b2ae64252"

}

fill_with_gas() {
  cargo partisia-contract cli -q tx mintgas --privatekey ./scripts/ide.pk --gas 20000 $1
}

generate_keys Account-A.pk
generate_keys Account-B.pk
generate_keys Account-C.pk