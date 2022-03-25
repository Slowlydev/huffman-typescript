const readline = require("readline");
const fs = require("fs");

interface CharWithCount {
	char: string,
	count: number,
}

class HuffmanNode {
	data: number;
	c: null | string;
	left: null | HuffmanNode;
	right: null | HuffmanNode;

	constructor() {
		this.data = 0;
		this.c = '';
		this.left = null;
		this.right = null;
	}
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

async function start() {
	const filePath = await askUserforPath("Enter the path to the file (I would suggest u use drag and drop)");
	const formatedFilePath = filePath.replaceAll("'", "");

	console.time("reading file");
	const file = fs.readFileSync(formatedFilePath, "utf-8");
	const fileDataString: string = file.toString();
	console.timeEnd("reading file");

	console.time("counting chars");
	const charAndCount: CharWithCount[] = [];
	const chars = fileDataString.split("");
	chars.forEach(char => {
		const found = charAndCount.find((resObjB) => resObjB.char === char);

		if (found) {
			found.count = found.count + 1;
		} else {
			charAndCount.push({ char, count: 1 });
		}
	});
	console.timeEnd("counting chars");

	console.time("initializing algorythm");
	const original: CharWithCount[] = charAndCount.sort((a, b) => a.count - b.count);

	let charArray = original.map((charAndCountToChar: CharWithCount) => charAndCountToChar.char);
	let charfreq = original.map((charAndCountToFreq: CharWithCount) => charAndCountToFreq.count);

	let queue: HuffmanNode[] = [];
	let rainbowTable: { char: string, translation: string }[] = [];

	function printCode(root: HuffmanNode | null, s: string) {
		if (root !== null) {
			if (root.left == null
				&& root.right == null
				&& root.c !== null) {

				rainbowTable.push({ char: root.c, translation: s })

				return;
			}

			printCode(root.left, s + "0");
			printCode(root.right, s + "1");
		}
	}
	console.timeEnd("initializing algorythm");

	console.time("creating nodes");
	for (let i = 0; i < original.length; i++) {

		let mewHuffmanNode = new HuffmanNode();

		mewHuffmanNode.c = charArray[i];
		mewHuffmanNode.data = charfreq[i];

		mewHuffmanNode.left = null;
		mewHuffmanNode.right = null;

		queue.push(mewHuffmanNode);
	}

	let root: HuffmanNode | null = null;
	queue.sort((a, b) => a.data - b.data);
	console.timeEnd("creating nodes");

	console.time("assigning nodes");
	while (queue.length > 1) {

		let x = queue[0];
		queue.shift();

		let y = queue[0];
		queue.shift();

		let newHuffmanNode = new HuffmanNode();

		newHuffmanNode.data = x.data + y.data;
		newHuffmanNode.c = null;

		newHuffmanNode.left = x;
		newHuffmanNode.right = y;

		root = newHuffmanNode;

		queue.push(newHuffmanNode);
		queue.sort((a, b) => a.data - b.data);
	}
	console.timeEnd("assigning nodes");

	console.time("couting paths");
	printCode(root, "");
	console.timeEnd("couting paths");

	console.time("translating");
	const endMessaageArray: string[] = []
	for (const charToReplace of fileDataString.split("")) {
		const foundTranslation = rainbowTable.find((translationToFind) => translationToFind.char === charToReplace);
		if (foundTranslation) {
			endMessaageArray.push(foundTranslation.translation);
		}
	}
	console.timeEnd("translating");

	console.log(endMessaageArray.join(""));
}

start();
