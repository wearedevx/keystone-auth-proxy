const https = require("https");
const url = require("url");

const { URL } = url;

const API_DOMAIN = process.env.API_DOMAIN

if (API_DOMAIN === "") {
  console.error("API_DOMAIN cannot be empty");
  process.exit(1);
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.redirect = async (req, res) => {
  const { code, state } = req.query;
  let version;

  try {
    version = getVersion(state);
  } catch (err) {
    console.error(err);

    res.status(400);
    res.send(err.message);

    return;
  }
  
  const url = buildUrl(version, state, code);
  console.log("Calling", url);

  https.get(url, (response) => {
    console.log('Response with', response.statusCode);
    const { statusCode } = response;
    res.status(statusCode);

    try {
      res.setHeader('content-type', response.getHeader('content-type'));
    } catch (_) {
      // this error does not really matter
    }

    let body = '';
    response
      .on('data', (chunk) => body += chunk)
      .on('ed', () => {
        if (body.length > 0) {
          res.setHeader('content-length', body.length);
        }
        
        res.send(body);
      });
  });
};

function buildUrl(version, state, code) {
  let v = formatVersion(version)

  const u = new URL(`https://${v}---${API_DOMAIN}/auth-redirect/`);
  u.searchParams.set('state', state);
  u.searchParams.set('code', code);

  return u.toString()
};

function getVersion(stateString) {
  const str = Buffer.from(stateString, 'base64').toString('ascii');
  const { version } = JSON.parse(str);

  return version;
}

function formatVersion(version) {
  if (version === "develop") return version;

  const dashed = version.split('.').join('-');

  return `v${dashed}`;
}

