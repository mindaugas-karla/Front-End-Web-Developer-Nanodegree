// Import the js file to test
import { checkInput } from "../src/client/js/helper"

describe("Testing if value is not empty ant not null", () => {
    // The checkInput() function has one argument - a string that should be valid and not empty.  
    test("Testing the checkInput() function", () => {
        const input = "Mindaugas";
        const output = true;
        expect(checkInput(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = "";
        const output = false;
        expect(checkInput(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = null
        const output = false;
        expect(checkInput(input)).toEqual(output);
    }),
    test("Testing the checkInput() function", () => {
        const input = "asdasd"
        const output = true;
        expect(checkInput(input)).toEqual(output);
    })
});