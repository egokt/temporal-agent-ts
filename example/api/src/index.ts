import express from 'express';
import { actionWoAuth, addActionRoute } from 'exprest-server';

type Response = {
  message: string;
};

// TODO: fix this linter issue in exprest-server :)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const respondAction = actionWoAuth<Response, {}, { userMessage: string }, {}>({
  contextCreateFunction: () => ({}),
  sanitizeHeadersFunction: () => [null, {}],
  sanitizeParamsFunction: ({ unsanitizedParams }: { unsanitizedParams: { userMessage?: unknown } }) => [
    null,
    { userMessage: (unsanitizedParams.userMessage as string) ?? '' },
  ],
  sanitizeBodyFunction: () => [null, {}],
  actionFunction: ({ params }) => {
    return {
      status: 200,
      isSuccessful: true,
      actionResponseContent: {
        message: `Your message: "${params.userMessage}"`,
      },
    };
  },
});

// Add to router
const router = express.Router();
addActionRoute(router, '/respond', respondAction);

const app = express();
app.use('/api', router);
app.listen(3000);

// eslint-disable-next-line no-console
console.log('API listening on http://localhost:3000');
