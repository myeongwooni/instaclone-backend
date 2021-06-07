import client from "../../client";

export default {
    Query: {
        searchUsers: async(_, {keyword}) => 
            client.user.findMany({
                where: {
                    username: {
                        mode: "insensitive",
                        startsWith: keyword,
                    },
                },
        }),
    },
};