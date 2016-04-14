var parseString = require('xml2js').parseString;
var request = require('request');
var _ = require('lodash');
var semver = require('semver');

module.exports = function (baseUrl, product, version, callback) {
  request(baseUrl + '?delimiter=/&prefix=' + product + '/', function (error, response, xml) {
    if (!error && response.statusCode == 200) {
      parseString(xml, function (err, result) {
          getVersions(result.ListBucketResult.CommonPrefixes, product, function(versions){
            // console.log("versions: " + versions)
            return callback(getLatest(baseUrl, versions, product, version))
          })
      });
    } else {
      console.log(error);
      return {
        "statusCode": 500,
        "content": error
      }
    }
  })
}

function getVersions(obj, product, callback) {
    callback(_.map(obj, function(v) {
      return v.Prefix[0].substring(product.length + 1, v.Prefix[0].length - 1)
    }))
}

function getLatest(baseUrl, versions, product, version) {
  if (versions.sort(semver.rcompare)[0] != version) {
    // product is NOT up-to-date | new content
    return {
      "statusCode": 200,
      "content": {
        "url": baseUrl + "/" + product + "/" + version + "/" + product + "-darwin-x64.zip",
        "name": product.capitalizeFirstLetter(),
      }
    }
  } else {
    // product is up-to-date | no new content
    return {
      "statusCode": 204,
      "content": {}
    }
  }
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
