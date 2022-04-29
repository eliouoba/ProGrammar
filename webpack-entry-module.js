var entryModule = document.querySelector('script').getAttribute('webpack-entry');

switch(entryModule) {
    case 'home':
        require('./src/scripts/home-script.js'); 
        break;
    case 'topics': 
        window.selectLevel = require('./src/scripts/topics-script.js').selectLevel;
        break;
    case 'lesson': 
        require('./src/scripts/lesson-driver.js'); 
        require('./src/scripts/keyboard-visual-script.js'); 
        break;
    case 'tugowar':
        require('./src/scripts/tugowar-driver.js');
        break;
    case 'user': 
        require('./src/scripts/user-script.js'); 
        break;
    case 'custom-lesson': 
        require('./src/scripts/custom-lesson-driver.js');
        require('./src/scripts/keyboard-visual-script.js'); 
        break;
    case 'settings':  
        window.chooseTheme = require('./src/scripts/theme').chooseTheme;
        break;
    case 'leader':
        require('./src/scripts/leader.js'); 
        break;
    case 'account':
        require('./src/scripts/account-script.js'); 
        break;
    case 'race-page':
        require('./src/scripts/race-page-script.js');
        break;
    case 'race':
        require('./src/scripts/race.js');
        break;
    case 'lobby':
        require('./src/scripts/race-lobby-script.js');
        break;
}