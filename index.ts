const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;
const HASH_ALGORITHM = "sha3-512";

export const getHash = (value: string): string => {
    return crypto.createHash(HASH_ALGORITHM).update(value).digest("hex");
}

const convertToString = (candidate) => typeof candidate === "string" ? candidate : JSON.stringify(candidate);

const getCandidate = (event?: any): string => {
    // Return TRIVIAL_PARTITION_KEY when no event is present
    if (!event) return TRIVIAL_PARTITION_KEY;
    // If event.partitionKey is present return it if its string, else stringify and return it
    if (event.partitionKey) return convertToString(event.partitionKey)
    // If event is present without partition key, return with getHashed value of stringify event
    return getHash(JSON.stringify(event));
};

export const deterministicPartitionKey = (event?: any): string => {
    let candidate = getCandidate(event);
    return candidate.length > MAX_PARTITION_KEY_LENGTH
        ? getHash(candidate)
        : candidate;
};

const candidate = deterministicPartitionKey({partitionKey: 1})
console.log(typeof candidate)
