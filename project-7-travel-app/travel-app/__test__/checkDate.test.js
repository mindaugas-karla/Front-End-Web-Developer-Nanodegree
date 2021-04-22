// Import the js file to test
import { checkDate } from "../src/client/js/helper"

describe("Testing if date is correct", () => {
    // The checkDate() function has one argument - a string that should be parsed as date.  
    test("Testing the checkDate() function", () => {
        const input = "2021/05/20";
        const output = true;
        expect(checkDate(input)).toEqual(output);
    }),
    test("Testing the checkDate() function", () => {
        const input = "2021/05/27";
        const output = true;
        expect(checkDate(input)).toEqual(output);
    }),
    test("Testing the checkDate() function", () => {
        const input = "asdasdad"
        const output = false;
        expect(checkDate(input)).toEqual(output);
    }),
    test("Testing the checkDate() function", () => {
        const input = null
        const output = false;
        expect(checkDate(input)).toEqual(output);
    })
});