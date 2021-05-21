import { createContext, useContext } from "react";
// Saves the tweets returned as props to the page
export const Tweets = createContext({});
// Used by the server to get the list of tweets to fetch
// @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
export const TweetsMap = createContext();
export function useTweet(id: any) {
    const tweets = useContext(Tweets);
    const addTweet = useContext(TweetsMap);
    if (addTweet) {
        (addTweet as any)(id);
        return { ignore: true };
    }
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return { ast: tweets ? tweets[id] : undefined };
}
