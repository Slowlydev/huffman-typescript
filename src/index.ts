import { stdin as input, stdout as output } from "process";
import * as readline from "readline";
import * as path from "path";
import * as fs from "fs";


function askUser(question: string): Promise<String> {
	return new Promise(resolve => {
		const rl = readline.createInterface({ input, output });
		rl.question(question, (answer) => {
			resolve(answer);
			rl.close();
		});
	});
}


const filePath = await askUser("Enter the path to the file (I would suggest u use drag and drop)");

const file = fs.readFileSync(filePath, "utf-8");
