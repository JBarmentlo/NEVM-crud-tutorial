const db	 	= require("../db/sql.conn");
var bcrypt 		= require("bcryptjs");



exports.signup = async (req, res) => {
	let username        = req.body.username;
	let firstName       = req.body.firstName;
	let lastName        = req.body.lastName;
	let mail            = req.body.mail;
	let password        = bcrypt.hashSync(req.body.password, 8);
	// let password        = req.body.password;
	let zipCode        	= req.body.zipCode;
	let city       		= req.body.city;
	let latitude        = req.body.latitude;
	let longitude       = req.body.longitude;

	conn = await db.conn
	console.log("CONN: ", conn)
	try {
		let [rows, fields] = await db.query(
			'INSERT INTO USERS (username, mail, firstName, lastName, password, zipCode, longitude, latitude, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[username, mail, firstName, lastName, password, zipCode, longitude, latitude, city]
			)
	}
	catch (e) {
		if (e.code == 'ER_DUP_ENTRY') {
			res.status(200).send({message: e.sqlMessage})
		}
		else {
			console.log("signup error:\n", e, "\nend signup error")
		}
	}
		
};
