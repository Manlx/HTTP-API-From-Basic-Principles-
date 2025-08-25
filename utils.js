/** @import http from "http" */

/**
 * @param {http.IncomingMessage} req 
 * @param {string} templatePath
 * @returns {boolean}
 */
export function MatchUrl(req, templatePath){

  const incomingPath = GetUrlPath(req);

  const incomingSubPaths = incomingPath.split('/').map(subPath => subPath.trim()).filter( subPath => !!subPath)

  const templateSubPaths = templatePath.split('/').map(subPath => subPath.trim()).filter( subPath => !!subPath)

  if (incomingSubPaths.length !== templateSubPaths.length){
  
    return false;
  }

  for (let i = 0; i < templateSubPaths.length; i++) {

    const templateSubPath = templateSubPaths[i];

    if (templateSubPath.includes(':') || templateSubPath.includes('{') < templateSubPath.includes('}')){
    
      continue;
    }

    if (templateSubPath.toLowerCase() !== incomingSubPaths[i].toLowerCase()){
      
      return false
    }
  }

  return true;
}

/**
 * Extracts the Url Path from the request object
 * @param {http.IncomingMessage} req 
 * @returns {string}
 */
export function GetUrlPath(req){

  return (req.url || '').split('?')[0]
}

/**
 * Extracts the queryParams and returns a map of the value keys
 * @param {http.IncomingMessage} req 
 * @returns {Map<string, string>}
 */
export function QueryParams(req){

  const queryParams = new Map();

  const url = req.url;

  if (!url || !url.includes('?')){

    return queryParams;
  }

  console.log(url)

  const [,rawParams] = url.split('?');

  const paramKeyValueArr = rawParams.split('&');

  paramKeyValueArr.forEach(paramKeyValue => {

    const [key,value] = paramKeyValue.split('=');

    if (!key || !value){

      return;
    }

    queryParams.set(key,value)
  })

  return queryParams
}

/**
 * @param {http.IncomingMessage} req 
 * @param {string} templatePath
 * @returns {Map<string, string>}
 */
export function GetPathParams(req, templatePath){

  const pathParams = new Map();

  const incomingPath = GetUrlPath(req);

  const incomingSubPaths = incomingPath.split('/').map(subPath => subPath.trim()).filter( subPath => !!subPath)

  const templateSubPaths = templatePath.split('/').map(subPath => subPath.trim()).filter( subPath => !!subPath)

  if (incomingSubPaths.length !== templateSubPaths.length){
  
    return pathParams;
  }

  templateSubPaths.forEach((subPath, index)=> {

    if (subPath.startsWith(':')){

      pathParams.set(subPath.replaceAll(':',''), incomingSubPaths[index])

      return;
    }

    if (subPath.startsWith('{') && subPath.endsWith('}')){

      pathParams.set(subPath.replace('{','').replace('}',''), incomingSubPaths[index])

      return;
    }
  })

  return pathParams;
}