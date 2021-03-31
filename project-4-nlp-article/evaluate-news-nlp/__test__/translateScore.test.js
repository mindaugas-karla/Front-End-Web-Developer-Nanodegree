// Import the js file to test
import { translateScore } from "../src/client/js/base"

describe("Testing score transalation", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.  
    test("Testing the translateScore() function", () => {
        const input = "P+";
        const output = "strong positive".toUpperCase();
        expect(translateScore(input)).toEqual(output);
    }),
    test("Testing the translateScore() function", () => {
        const input = "P";
        const output = "positive".toUpperCase();
        expect(translateScore(input)).toEqual(output);
    }),
    test("Testing the translateScore() function", () => {
        const input = "NEW";
        const output = "neutral".toUpperCase();
        expect(translateScore(input)).toEqual(output);
    }),
    test("Testing the translateScore() function", () => {
        const input = "N";
        const output = "negative".toUpperCase();
        expect(translateScore(input)).toEqual(output);
    }),
    test("Testing the translateScore() function", () => {
        const input = "N+";
        const output = "strong negative".toUpperCase();
        expect(translateScore(input)).toEqual(output);
    }),
    test("Testing the translateScore() function", () => {
        const input = "NONE";
        const output = "without sentiment".toUpperCase();
        expect(translateScore(input)).toEqual(output);
    }),
    test("Testing the translateScore() function", () => {
        const input = "adadasdasd";
        const output = "unknown".toUpperCase();
        expect(translateScore(input)).toEqual(output);
    })
});

