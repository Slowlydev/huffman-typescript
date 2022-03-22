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





// create a root node
let root = null;
q.sort(function (a, b) { return a.data - b.data; });

while (q.length > 1) {

	let x = q[0];
	q.shift();

	let y = q[0];
	q.shift();

	let f = new HuffmanNode();

	f.data = x.data + y.data;
	f.c = '-';

	// first extracted node as left child.
	f.left = x;

	// second extracted node as the right child.
	f.right = y;

	// marking the f node as the root node.
	root = f;

	// add this node to the priority-queue.
	q.push(f);
	q.sort(function (a, b) { return a.data - b.data; });
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

	for (const node of tree) {

	}
}

start();
