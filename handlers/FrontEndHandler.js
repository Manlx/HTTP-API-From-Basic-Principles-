/** @import {
 *  HandlerFunction
 * } from "../types.js" */

import path from "path";
import { Handle404, LogCustom } from "../utils.js";
import fs from "fs"

const lookUpPath = path.join(import.meta.dirname, '../FrontEnd')

const fileExtensionToContentType = {
  'js': 'text/javascript',
  'html': 'text/html',
  'css': 'text/css'
}

/**  @type {HandlerFunction}  */
export const HandleFrontend = async (
  req,
  res,
  route
) => {

  console.log(req.url)

  if (!req.url){

    Handle404(req,res, 'No file was specified in front end request')

    return;
  }

  const completePath = `${lookUpPath}/${req.url.replace('/ui/','')}`

  LogCustom.Info(completePath)


  if (!fs.existsSync(completePath)){

    Handle404(req,res, 'Requested resource does not exists.')
  }

  const subPaths = req.url.split('/')

  const fileType = subPaths[subPaths.length - 1].split('.')[1] || 'html'

  res.writeHead(
    200,
    {
      "content-type": fileExtensionToContentType[fileType]
    }
  );

  res.end(fs.readFileSync(completePath))

  return;
}