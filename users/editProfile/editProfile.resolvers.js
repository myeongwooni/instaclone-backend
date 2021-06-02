import {createWriteStream} from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import {protectedResolver } from "../users.utils";

console.log(process.cwd());

const resolverFn =  async (
    _,
    { firstName, lastName, username, email, password: newPassword, bio, avatar },
    { loggedInUser }
) => {
   
   let avatarURL = null;
   if(avatar){
        const {filename, createReadStream} = await avatar;
        const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`
        const readStream = createReadStream();
        const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
        readStream.pipe(writeStream);
        avatarURL = `http://localhost:4000/static/${newFilename}`;
   }

    let uglyPassword = null;
    if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await client.user.update({
        where: {
            id: loggedInUser.id,
        },
        data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(uglyPassword && { password: uglyPassword }),
            ...(avatarURL && {avatar : avatarURL}),
        },
    });
    if (updatedUser.id) {
        return {
            ok: true,
        };
    } else {
        return {
            ok: false,
            error: "Could not update profile.",
        };
    }
};

export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn),
    },
};