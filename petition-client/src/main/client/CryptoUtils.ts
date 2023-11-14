import { Cipher, createCipheriv } from "crypto";
import { ec as Elliptic } from "elliptic";
import { sha256 } from "hash.js";
import BN from "bn.js";

const ec = new Elliptic("secp256k1");

/**
 * Generates a new key pair.
 *
 * @return the generated key pair.
 */
function generateKeyPair(): Elliptic.KeyPair {
  return ec.genKeyPair();
}

/**
 * Create a shared secret from a private and a public key.
 * @param keyPair the private key.
 * @param publicKey the public key.
 * @return the shared secret.
 */
function createSharedKey(keyPair: Elliptic.KeyPair, publicKey: Buffer): Buffer {
  const pairFromBuffer = ec.keyFromPublic(publicKey);
  const sharedRandom: BN = keyPair.derive(pairFromBuffer.getPublic());

  let sharedBuffer = sharedRandom.toArrayLike(Buffer, "be");
  if (sharedRandom.bitLength() % 8 === 0) {
    // Ensure that a sign bit is present in the byte encoding
    sharedBuffer = Buffer.concat([Buffer.alloc(1), sharedBuffer]);
  }
  return hashBuffer(sharedBuffer);
}

/**
 * Create an aes cipher from a private key and the public key of the receiver of the encrypted message.
 *
 * @param keyPair the private key.
 * @param publicKey the public key of the receiver.
 */
function createAesForParty(keyPair: Elliptic.KeyPair, publicKey: Buffer): Cipher {
  const sharedKey = createSharedKey(keyPair, publicKey);
  const iv = sharedKey.slice(0, 16);
  const secretKey = sharedKey.slice(16, 32);
  return createCipheriv("aes-128-cbc", secretKey, iv);
}

/**
 * Serializes a signature into byte.
 *
 * @param signature the signature.
 * @return the bytes.
 */
function signatureToBuffer(signature: Elliptic.Signature): Buffer {
  if (signature.recoveryParam == null) {
    throw new Error("Recovery parameter is null");
  }
  return Buffer.concat([
    Buffer.from([signature.recoveryParam]),
    signature.r.toArrayLike(Buffer, "be", 32),
    signature.s.toArrayLike(Buffer, "be", 32),
  ]);
}

/**
 * Computes the account address based on a key pair.
 *
 * @param keyPair the keypair of the account.
 * @return the address of the account.
 */
function keyPairToAccountAddress(keyPair: Elliptic.KeyPair): string {
  const publicKey = keyPair.getPublic(false, "array");
  const hash = sha256();
  hash.update(publicKey);
  return "00" + hash.digest("hex").substring(24);
}

/**
 * Creates a keypair based on the private key.
 *
 * @param privateKey the private key as a hex string.
 * @return the keypair.
 */
function privateKeyToKeypair(privateKey: string): Elliptic.KeyPair {
  return ec.keyFromPrivate(privateKey, "hex");
}

/**
 * Computes the public key from a private key.
 *
 * @param privateKey the private key.
 * @return the public key.
 */
function privateKeyToPublicKey(privateKey: string): Buffer {
  const keyPair = privateKeyToKeypair(privateKey);
  return Buffer.from(keyPair.getPublic(true, "array"));
}

/**
 * Computes the account address based on a private key.
 *
 * @param privateKey the private key.
 * @return the account address.
 */
function privateKeyToAccountAddress(privateKey: string): string {
  return keyPairToAccountAddress(privateKeyToKeypair(privateKey));
}

/**
 * Computes the account address based on a public key.
 *
 * @param publicKey the public key.
 * @return the account address.
 */
function publicKeyToAccountAddress(publicKey: Buffer): string {
  return keyPairToAccountAddress(ec.keyFromPublic(publicKey));
}

/**
 * Hashes the buffers.
 *
 * @param buffers the buffers to be hashed.
 * @return the hash.
 */
function hashBuffers(buffers: Buffer[]): Buffer {
  const hash = sha256();

  for (const buffer of buffers) {
    hash.update(buffer);
  }

  return Buffer.from(hash.digest());
}

/**
 * Hashes the buffer.
 *
 * @param buffer the buffer to be hashed.
 * @return the hash.
 */
function hashBuffer(buffer: Buffer): Buffer {
  return hashBuffers([buffer]);
}

/** A collection of useful crypto functions. */
export const CryptoUtils = {
  generateKeyPair,
  createSharedKey,
  createAesForParty,
  signatureToBuffer,
  keyPairToAccountAddress,
  privateKeyToKeypair,
  privateKeyToPublicKey,
  privateKeyToAccountAddress,
  publicKeyToAccountAddress,
  hashBuffers,
  hashBuffer,
};
