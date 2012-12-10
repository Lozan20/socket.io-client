
/**
 * Module dependencies.
 */

var url = require('url')
  , debug = require('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = parse;

/**
 * URL parser.
 *
 * @param {String} url
 * @api public
 */

function parse(uri){
  var obj = uri;

  if ('string' == typeof uri) {
    if ('/' == uri.charAt(0)) {
      if ('undefined' != typeof location) {
        uri = location.hostname + uri;
      }
    }

    // allow for `localhost:3000`
    if (/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' != typeof location) {
        uri = location.protocol + '//' + uri;
      } else {
        uri = 'https://' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = url.parse(uri);

    // get namespace from path but avoid collision with engine.io path
    obj.nsp = obj.pathname;
    delete obj.path;
    delete obj.pathname;
  }

  // in absence of `protocol`
  if (!obj.protocol) obj.protocol = obj.secure ? 'wss' : 'ws';

  // in absence of `hostname`
  if (!obj.hostname) {
    var pieces = obj.host.split(':');
    obj.hostname = pieces.shift();
    obj.port = pieces.pop();
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if ((/(http|ws):/.test(obj.protocol) && 80 == obj.port) ||
     (/(http|ws)s:/.test(obj.protocol) && 443 == obj.port)) {
    delete obj.port;
  }

  // define unique id
  obj.id = obj.protocol + obj.hostname + (obj.port ? (':' + obj.port) : '');

  return obj;
}