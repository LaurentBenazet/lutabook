const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
  {
    serverUrl:  'http://localhost:9000',
    options : {
      'sonar.sources':  'server/src',
      'sonar.tests':  'server/src/test',
      'sonar.inclusions'  :  '**', // Entry point of your code
      'sonar.test.inclusions':  'src/**/*.spec.js,src/**/*.spec.jsx,server/src/test/*.test.js,src/**/*.test.jsx',
      'sonar.javascript.lcov.reportPaths':  'server/coverage/lcov.info',
      'sonar.testExecutionReportPaths':  'server/coverage/test-reporter.xml'
    }
  }, () => {});