// TODO Why do I have to keep copying this file?  Need a better way to do libraries.
/**
 * This is a wrapper around setTimeout() that works with await.
 *
 * `await sleep(100)`;
 * @param ms How long in milliseconds to sleep.
 * @returns A promise that you can wait on.
 */
export function sleep(ms) {
    // https://stackoverflow.com/a/39914235/971955
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Check if the input is a valid XML file.
 * @param xmlStr The input to be parsed.
 * @returns If the input valid, return the XML document.  If the input is invalid, this returns an HTMLElement explaining the problem.
 */
export function testXml(xmlStr) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(xmlStr, "application/xml");
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString
    // says that parseFromString() will throw an error if the input is invalid.
    //
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
    // says dom.documentElement.nodeName == "parsererror" will be true of the input
    // is invalid.
    //
    // Neither of those is true when I tested it in Chrome.  Nothing is thrown.
    // If the input is "" I get:
    // dom.documentElement.nodeName returns "html",
    // doc.documentElement.firstElementChild.nodeName returns "body" and
    // doc.documentElement.firstElementChild.firstElementChild.nodeName = "parsererror".
    // It seems that the <parsererror> can move around.  It looks like it's trying to
    // create as much of the XML tree as it can, then it inserts <parsererror> whenever
    // and wherever it gets stuck.  It sometimes generates additional XML after the
    // parsererror, so .lastElementChild might not find the problem.
    //
    // In case of an error the <parsererror> element will be an instance of
    // HTMLElement.  A valid XML document can include an element with name name
    // "parsererror", however it will NOT be an instance of HTMLElement.
    //
    // getElementsByTagName('parsererror') might be faster than querySelectorAll().
    for (const element of Array.from(dom.querySelectorAll("parsererror"))) {
        if (element instanceof HTMLElement) {
            // Found the error.
            return { error: element };
        }
    }
    // No errors found.
    return { parsed: dom };
}
/**
 * Pick any arbitrary element from the set.
 * @param set
 * @returns An item in the set.  Unless the set is empty, then it returns undefined.
 */
export function pickAny(set) {
    const first = set.values().next();
    if (first.done) {
        return undefined;
    }
    else {
        return first.value;
    }
}
/**
 *
 * @param array Pick from here.
 * @returns A randomly selected element of the array.
 * @throws An error if the array is empty.
 */
export function pick(array) {
    return array[(Math.random() * array.length) | 0];
}
