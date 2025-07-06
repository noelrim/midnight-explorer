// Import the necessary classes from the @midnight/ledger package
import { Transaction, Input, NetworkId } from '@midnight-ntwrk/ledger';

// Function to deserialize a transaction from a raw string
function deserializeTransaction(rawString, networkId = NetworkId.TestNet) {
  try {
    // Convert the string to Uint8Array (assuming it's a hex string)
    const rawBytes = hexStringToUint8Array(rawString);
    
    // Use the static deserialize method from the Transaction class
    const transaction = Transaction.deserialize(rawBytes, networkId);
    
    return parseStandardTransaction(transaction.toString());
  } catch (error) {
    console.error("Error deserializing transaction:", error);
    return null;
  }
}

// Helper function to convert hex string to Uint8Array
function hexStringToUint8Array(hexString) {
  // Remove '0x' prefix if present
  hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  
  // Ensure even length
  if (hexString.length % 2 !== 0) {
    hexString = '0' + hexString;
  }
  
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  
  return bytes;
}

function parseStandardTransaction(rawString) {
  const result = {
    inputs: [],
    outputs: [],
    deltas: []
  };

  // Match inputs: label + type + value
  const inputRegex = /<([^>]+ input) (\w+)\(([^)]+)\)>/g;
  let inputMatch;
  while ((inputMatch = inputRegex.exec(rawString)) !== null) {
    result.inputs.push({
      label: inputMatch[1],    // e.g., "shielded input"
      type: inputMatch[2],     // e.g., "Nullifier"
      value: inputMatch[3]     // e.g., hash
    });
  }

  // Match outputs: label + type + value
  const outputRegex = /<([^>]+ output) (\w+)\(([^)]+)\)>/g;
  let outputMatch;
  while ((outputMatch = outputRegex.exec(rawString)) !== null) {
    result.outputs.push({
      label: outputMatch[1],   // e.g., "shielded output"
      type: outputMatch[2],    // e.g., "Commitment"
      value: outputMatch[3]    // e.g., hash
    });
  }

  // Match deltas: TokenType and numeric value
  const deltaRegex = /TokenType\(([^)]+)\)\s*->\s*([0-9]+)/g;
  let deltaMatch;
  while ((deltaMatch = deltaRegex.exec(rawString)) !== null) {
    result.deltas.push({
      TokenType: deltaMatch[1],
      value: deltaMatch[2]
    });
  }

  return result;
}

export default deserializeTransaction;
