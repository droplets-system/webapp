// Contract row sizes
export const sizeDropRow = 277;
export const sizeDropRowPurchase = sizeDropRow + 2;
export const sizeAccountRow = 124;
export const sizeStatRow = 412;

// The maximum number of Drops to generate in a single transaction
export const maximumBatchSize = 5000;

// max safe integer for debugging
// export const maximumBatchSize = 9007199254740991;

// The actions considered safe enough for a Session Key
export const safeActions = ['bind', 'claim', 'generate', 'open', 'unbind', 'destroy'];

// Extra amount of RAM to purchase on all buyram/buyrambytes transactions
export const ramPurchaseBuffer = 5;
