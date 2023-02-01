const { deterministicPartitionKey, getHash } = require("../index");

describe("deterministicPartitionKey", () => {
    it("returns TRIVIAL_PARTITION_KEY when no events is sent", () => {
        expect(deterministicPartitionKey(null)).toBe("0");
        expect(deterministicPartitionKey(undefined)).toBe("0");
    });

    it("returns partitionKey if present in event as a string and is less than MAX_PARTITION_KEY_LENGTH", () => {
        expect(deterministicPartitionKey({ partitionKey: "key" })).toBe("key");
    });

    it("returns JSON stringify of partitionKey if present in event as a non string and is less than MAX_PARTITION_KEY_LENGTH", () => {
        expect(deterministicPartitionKey({ partitionKey: 1 })).toBe("1");
    });

    it("returns hashed values of JSON stringify  of event if event has no partitionKey and its JSON stringify is not longer than MAX_PARTITION_KEY_LENGTH", () => {
        const event = { short: "value" };
        expect(deterministicPartitionKey(event)).not.toBe(JSON.stringify(event));
        expect(deterministicPartitionKey(event)).toBe(getHash(JSON.stringify(event)));
    });

    it("returns hashed string if event has no partitionKey and its JSON stringify is longer than MAX_PARTITION_KEY_LENGTH", () => {
        const event = { long: "value".repeat(100) };
        const hash = deterministicPartitionKey(event);
        expect(hash).not.toBe(JSON.stringify(event));
        expect(hash.length).toBe(128);
    });

    it("returns hashed string if event has partitionKey which is longer than MAX_PARTITION_KEY_LENGTH", () => {
        const partitionKey = "value".repeat(100)
        const event = { partitionKey: partitionKey };
        const hash = deterministicPartitionKey(event);
        expect(hash).not.toBe(partitionKey);
        expect(hash.length).toBe(128);
    });

});
