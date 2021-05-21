import fetchTweetAst from "../static-tweet/lib/fetchTweetAst";
export default async function getTweets(ids: any) {
    const tweetsData = await Promise.all(ids.map(async (id: any) => {
        const ast = await fetchTweetAst(id);
        return { id, ast };
    }));
    const tweets = tweetsData.reduce((result, { id, ast }) => {
        if (ast)
            (result as any)[id] = ast;
        return result;
    }, {});
    return tweets;
}
