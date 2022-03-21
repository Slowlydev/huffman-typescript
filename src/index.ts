const readline = require("readline");
const fs = require("fs");

interface CharWithCount {
	char: string,
	count: number
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

	console.log(charAndCount);

	const sortedCarWithCount: CharWithCount[] = charAndCount.sort((a, b) => { return a.count - b.count });

	console.log(sortedCarWithCount)

	console.log(Math.min(...sortedCarWithCount.map((temp) => temp.count)));

}

start();
