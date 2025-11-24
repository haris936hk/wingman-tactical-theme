import {setCountryCookie} from '~/lib/i18n';

/**
 * API route to handle country/currency switching
 * Sets a cookie and redirects back to the referring page
 */

/**
 * @param {Route.ActionArgs} args
 */
export async function action({request}) {
  const formData = await request.formData();
  const country = formData.get('country');
  const redirectTo = formData.get('redirectTo') || '/';

  if (!country || typeof country !== 'string') {
    return new Response('Invalid country', {status: 400});
  }

  // Set country cookie and redirect
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': setCountryCookie(country),
      Location: redirectTo,
    },
  });
}

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader() {
  return new Response('Method not allowed', {status: 405});
}

/** @typedef {import('react-router').LoaderFunctionArgs} Route.LoaderArgs */
/** @typedef {import('react-router').ActionFunctionArgs} Route.ActionArgs */
