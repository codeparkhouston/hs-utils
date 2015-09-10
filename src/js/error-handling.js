window.isMissingParameters = isMissingParameters;

/**
 * ## Error Handling functions
 */
function isMissingParameters(parameters, functionName){

  var checkDirection = _.flow(_.indexOf.bind(this, ['left','right','up','down']), _.partialRight(_.gt, -1));
  var expectedParameters = {
    move: [{
        name: 'direction',
        test: checkDirection
      },{
        name: 'distance',
        test: _.isNumber
    }],
    moveTo: [{
        name: 'x',
        test: _.isNumber
      },{
        name: 'y',
        test: _.isNumber
    }],
    change: [{
      name: 'the image url',
      test: _.isString
    }],
    name: [{
      name: 'the name',
      test: _.isString
    }],
    setBody: [{
      name: 'the robot\' HTML element',
      test: _.isElement
    }]
  };


  var examples = {
    move: 'robot.move("left", 100)',
    moveTo: 'robot.moveTo(300, 500)',
    change: 'robot.change("http://www.clipartlord.com/wp-content/uploads/2014/04/robot20.png")',
    name: 'robot.name("Leo")',
    setBody: 'var robot = new Robot(document.getElementById("robot"))'
  };

  try {
    checkParameters.call(this, parameters, expectedParameters[functionName], examples[functionName]);
  } catch(error){
    console.error(error.message);
    return true;
  }

  return false;
}

function checkParameters(parameters, expectedParameters, example){

  var missingParameters = _.reject(expectedParameters, function(expectedParameter, iteration){
    return expectedParameter.test(parameters[iteration]);
  });

  if(missingParameters.length){
    throw new MissingInformationError(_.pluck(missingParameters, 'name'), example);
  }
}

function MissingInformationError(parameters, example){
  this.name = 'MissingInformationError'
  this.message = 'This function needs information about ' + parameters.join(', ') + '. For example, try: ' + example;
}

MissingInformationError.prototype = Object.create(Error.prototype);
MissingInformationError.prototype.constructor = MissingInformationError;