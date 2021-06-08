import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
    Mutation: {
        uploadPhoto: protectedResolver(
            async(_, {file, caption}, {loggedInUser}) => {
                let hashtagObj = null;
                //parse caption
                if (caption) {
                    const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
                    hashtagObj = processHashtags(caption);
                    console.log(hashtagObj)
                }
        
                return client.photo.create({
                    data: {
                        file,
                        caption,
                        user: {
                            connect: {
                                id: loggedInUser.id,
                            },
                        },
                         //get or create Hashtags
                        ...(hashtagObj.length > 0 && {
                            hashtags: {
                                connectOrCreate: hashtagObj,
                        },
                        }),
                    },
                });
            // save the photo with the parsed hashtags
            // add the photo to the hashtags
            }
        ),
    },
};