/**
 * Asynchronously reads user input from the command line.
 *
 * @param {string} question - The prompt displayed to the user.
 * @param {string[]} validAnswers - An optional array of valid answers.
 * @returns {Promise<string>} A promise that resolves with the user's input as a string.
 */
export declare const KeyboardLine: (question: string, validAnswers?: string[]) => Promise<string>;
/**
 * Asynchronous function that captures a single keyboard input and resolves with a valid key.
 *
 * @param {string} [question] - The optional question to display before capturing input.
 * @param {string[] | function} [validKeys] - The optional valid keys that can be pressed. Either an array of strings or a function that takes a key and returns a boolean.
 * @returns {Promise<string>} - A promise that resolves with the valid key that was pressed.
 */
export declare const KeyboardKey: (question?: string, validKeys?: string[] | ((key: string) => boolean)) => Promise<string>;
