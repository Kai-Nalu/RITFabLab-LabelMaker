const fs = require("fs");
const deskpro_key_path = "./deskpro/deskproAPIToken.txt";

function updateApiKey(key, type) {
	return new Promise (resolve => {
		if (type = "deskpro") {
			fs.writeFile(deskpro_key_path, decodeURIComponent(key), err => {
				if (err) {
					console.error(err);
					resolve(false);
				} else {
					resolve(true);
				}
			});
		}
	});
}

module.exports = { updateApiKey };