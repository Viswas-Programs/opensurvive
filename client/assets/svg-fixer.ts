import * as fs from "fs";
import * as path from "path";

function fixDir(relPath: string) {
	fs.readdir(relPath, (err, files) => {
		if (err) return console.error(err);
		for (const file of files) {
			const filePath = path.join(relPath, file);
			fs.stat(filePath, (err, stats) => {
				if (err) return console.error(err);
				if (stats.isDirectory()) fixDir(filePath);
				else if (file.endsWith(".svg")) {
					fs.readFile(filePath, { encoding: "utf8" }, (err, content) => {
						const lines = content.split("\n");
						const ii = lines.findIndex((line) => line.startsWith("<svg"));
						if (!/width="\d+(\.\d+)?"/g.test(lines[ii]) && !/height="\d+(\.\d+)?"/g.test(lines[ii])) {
							const match = lines[ii].match(/viewBox="(?<x>\d+(\.\d+)?) +(?<y>\d+(\.\d+)?) +(?<w>\d+(\.\d+)?) +(?<h>\d+(\.\d+)?)"/);
							if (match?.groups) {
								const width = Number(match.groups.w) - Number(match.groups.x);
								const height = Number(match.groups.h) - Number(match.groups.y);
								lines[ii] = `<svg width="${width}" height="${height}"${lines[ii].split("<svg").pop()}`;
								fs.writeFile(filePath, lines.join("\n"), console.error);
							}
						}
					});
				}
			});
		}
	});
}

fixDir(path.join(__dirname));