const readline = require("readline");
const fs = require("fs");

interface CharWithCount {
	char: string,
	count: number,
}

interface Node {
	uid: string,
	count: number,
	chars: CharWithCount[],
	left: Node | null,
	right: Node | null,
}

function askUserforPath(question: string): Promise<string> {
	return new Promise(resolve => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		rl.question(question, (answer: any) => {
			resolve(answer);
			rl.close();
		});
	});
}

function create_UUID(): string {
	var dt = new Date().getTime();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}

function getLowestCount(array: CharWithCount[]): number {
	return Math.min(...array.map((temp) => temp.count));
}

function removeChars(chars: CharWithCount[], array: CharWithCount[]) {
	return array.filter((objFromA) => {
		return !chars.find((objFromB) => {
			return objFromA.char === objFromB.char
		})
	})
}

function getLowestChars(array: CharWithCount[]) {
	return [...array.filter((charToCheck) => charToCheck.count === getLowestCount(array))]
}

function createNewNode(chars: CharWithCount[]): Node {
	return {
		uid: create_UUID(),
		chars,
		count: chars.map((char) => char.count).reduce((prevValue, currentValue) => prevValue + currentValue, 0),
		left: null,
		right: null,
	}
}

function printCode(root: Node | undefined, s?: string) {
	if (root !== null && root !== undefined) {
		if (root.left == null && root.right == null && (root.chars[0].char).toLowerCase() != (root?.chars[0].char).toUpperCase()) {

			console.log(root?.chars[0].char + ":" + s)

			return;
		}

		printCode(root.left, s + "0");
		printCode(root.right, s + "1");
	}
}

async function start() {
	const tree: Node[] = [];
	const filePath = await askUserforPath("Enter the path to the file (I would suggest u use drag and drop)"); 	// ask for file path
	const formatedFilePath = filePath.replaceAll("'", ""); // replace all single quotes if there are any

	const file = fs.readFileSync(formatedFilePath, "utf-8"); // read the file
	const fileDataString: string = file.toString(); // make sure that the file content is a string

	const charAndCount: CharWithCount[] = []; // setup an empty array
	const chars = fileDataString.split(""); // split the text of the file into characters
	chars.forEach(char => {
		const found = charAndCount.find((resObjB) => resObjB.char === char); // try to find the char in the charAndCount array

		if (found) { // if found then add 1 to count
			found.count = found.count + 1;
		} else { // else add the non indexed character
			charAndCount.push({ char, count: 1 });
		}
	});

	const original: CharWithCount[] = charAndCount.sort((a, b) => { return a.count - b.count }); // sort by word count
	let modifiable: CharWithCount[] = original;

	while (modifiable.length !== 0) {
		tree.push(createNewNode(getLowestChars(modifiable)));
		modifiable = removeChars(getLowestChars(modifiable), modifiable);
	}

	console.log(JSON.stringify(tree), modifiable);
	let root;

	while (tree.length > 1) {
		let x = tree[0];
		tree.shift();

		let y = tree[0];
		tree.shift();

		let newNode: Node = {
			uid: create_UUID(),
			count: x.count + y.count,
			chars: [...x.chars, ...y.chars],
			left: x,
			right: y,
		}

		root = newNode;
		tree.push(newNode);
		tree.sort((a, b) => { return a.count - b.count });
	}

	console.log(root)
	printCode(root, "");
}

start();
