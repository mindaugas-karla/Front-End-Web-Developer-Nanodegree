// Import the js file to test
import { checkInput } from "../src/client/js/base"

describe("Testing if input is not empty", () => {
    // The test() function has two arguments - a string description, and an actual test as a callback function.  
    test("Testing the checkInput() function", () => {
        const input = ""
        const output = false;
        expect(checkInput(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = "www.udacity.com"
        const output = true;
        expect(checkInput(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = null
        const output = false;
        expect(checkInput(input)).toEqual(output);
    })
});