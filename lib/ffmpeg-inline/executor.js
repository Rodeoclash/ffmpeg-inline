const _ = require('lodash')

const embedAttributes = {
  //name:          'ffmpeg',
  //id:            'ffmpeg',
  path:          '/',
  src:           '/manifest.nmf',
  type:          'application/x-pnacl',
  ps_stdout:     'dev/tty',
  ps_stderr:     'dev/tty',
  ps_tty_prefix: '',
}

const messageDataContains = ['frame', 'fps', 'time', 'bitrate', 'speed']

/**
 * dataIsProgress
 *
 * Given a data string (returned from ffmpeg) determine if it's a progress
 * type.
 *
 * @param data
 * @returns {Boolean}
 */
function dataIsProgress(data) {
  return _.every(messageDataContains, testString => _.includes(data, testString))
}

/**
 * dataToProgress
 *
 * Given a progress data string, transform it into an object.
 *
 * @param data
 * @returns {obj}
 */
function dataToProgress(data) {
  const argsGroups = _.trim(data.replace(/=\s+/g, '=')).split(' ')
  return _.reduce(argsGroups, function(obj, argGroup) {
    const [k, v] = argGroup.split('=')
    obj[k] = v
    return obj
  }, {})
}

/**
 * argumentsToMap
 *
 * Given a string argument list, create an object with each argument
 * keyed by its order. This object is suitable for adding as params
 * to the <embed> tag that executes the pnacl.
 *
 * @param args
 * @returns {obj}
 */
function argumentsToMap(args) {
  const argsArray = args.split(' ')
  return _.reduce(argsArray, function(r, arg, i) {
    r[`arg${i}`] = arg
    return r
  }, {})
}

function createContainer() {
  return new Promise(function(resolve, reject) {
    window.onload = function() {
      const el = document.createElement('div')
      el.style.top = '0px'
      el.style.left = '0px'
      el.style.height = '0px'
      el.style.width = '0px'
      el.style.position = '0px'
      el.style.overflow = 'hidden'
      document.body.appendChild(el)
      resolve(el)
    }
  })
}

/**
 * addAttributes
 *
 * Given an element and map of attributes, return the element with the attr map
 * added to the element.
 *
 * @param el Element
 * @param attrs Object key/values of attributes to apply
 * @returns {Element} The updated element
 */
function addAttributes(el, attrs) {
  _.each(attrs, (v, k) => el.setAttribute(k, v))
  return el
}

function run(container, args, cbs) {
  return new Promise(function(resolve, reject) {
    const el = document.createElement('embed')
    const argsMap = argumentsToMap(args)

    function handleMessage(event) {
      const { data } = event
      if (dataIsProgress(data)) {
        const progress = dataToProgress(data)
        return cbs.onProgress(progress)
      }
    }

    function handleCrash(event) {
      el.removeEventListener('message', handleMessage)
      el.removeEventListener('crash', handleCrash)
      resolve()
    }

    addAttributes(el, embedAttributes)
    addAttributes(el, argsMap)

    el.addEventListener('message', handleMessage)
    el.addEventListener('crash', handleCrash)

    container.appendChild(el)
  })
}

module.exports = {
  addAttributes,
  argumentsToMap,
  createContainer,
  dataIsProgress,
  dataToProgress,
  run,
}
