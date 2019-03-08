import bcrypt from "react-native-bcrypt";
import isaac from "isaac";

bcrypt.setRandomFallback((len) => {
	const buf = new Uint8Array(len);
	return buf.map(() => Math.floor(isaac.random() * 256));
});

export default bcrypt;