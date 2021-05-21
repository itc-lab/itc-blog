// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../static-tweet/lib/fetchTweet... Remove this comment to see the full error message
import fetchTweetAst from "../static-tweet/lib/fetchTweetAst";
export default async function getTweets(ids: any) {
    const tweetsData = await Promise.all(ids.map(async (id: any) => {
        const ast = await fetchTweetAst(id);
        return { id, ast };
    }));
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    const tweets = tweetsData.reduce((result, { id, ast }) => {
        if (ast)
            (result as any)[id] = ast;
        return result;
    }, {});
    return tweets;
}
