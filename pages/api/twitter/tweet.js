import Twitter from 'twitter-lite';
import { getSession } from 'next-auth/client'
import { getToken } from 'next-auth/jwt';

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const { status } = body;

  const session = await getSession({ req });
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  const client = new Twitter({
    subdomain: 'api',
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: token.twitter.accessToken,
    access_token_secret: token.twitter.refreshToken
  });

  try {
    const results = await client.post('statuses/update', {
      status
    });
    return res.status(200).json({
      status: 'Ok'
    });
  } catch(e) {
    return res.status(400).json({
      status: e.message
    });
  }
}