// Import the js file to test
import { validURL } from "../src/client/js/base";

describe("Testing if URL or TEXT", () => {
    test("Testing the validURL() function", () => {
        const input = "www.aa";
        const output = false;
        expect(validURL(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = "www.udacity.com";
        const output = true;
        expect(validURL(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = null;
        const output = false;
        expect(validURL(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = "https://lo";
        const output = false;
        expect(validURL(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = "https://adilera.lt";
        const output = true;
        expect(validURL(input)).toEqual(output);
    })
});