import fetchTweetAst from "../static-tweet/lib/fetchTweetAst";

export default async function getTweets(ids) {

  const tweetsData = await Promise.all(
    ids.map(async id => {
      const ast = await fetchTweetAst(id);
      return { id, ast };
    })
  );
  const tweets = tweetsData.reduce((result, { id, ast }) => {
    if (ast) result[id] = ast;
    return result;
  }, {});

  return tweets;
}