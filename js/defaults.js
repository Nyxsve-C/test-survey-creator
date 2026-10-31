// Default project types, element types, test types, locked GUI rule, element templates, and General mobile checks module
window.Defaults = {
  PROJECT_TYPES: [
    'Web App Testing',
    'Mobile App Testing'
  ],

  TEST_TYPES: [
    'Smoke Test',
    'MAT',
    'AT'
  ],

  ELEMENT_TYPES: [
    'Text field',
    'Button',
    'Link',
    'Checkbox',
    'Radio button',
    'Dropdown',
    'Other'
  ],

  GUI_CHECK: {
    testType: 'AT',
    description: 'Verify the GUI satisfies the requirements',
    expectedResult: '',
    locked: true
  },

  // Helper to ensure every check starts with "Verify " and has no trailing period
  formatCheckText(rawText) {
    if (!rawText) return '';
    let s = String(rawText).trim().replace(/\.+$/, '').trim();
    if (!s) return '';
    if (/^verify\b/i.test(s)) {
      return 'Verify' + s.slice(6);
    }
    const firstChar = s.charAt(0);
    const secondChar = s.charAt(1);
    // Lowercase first letter unless it is an acronym/proper noun (e.g. SQL, iOS, SSL)
    const shouldLower = firstChar === firstChar.toUpperCase() &&
      secondChar && secondChar === secondChar.toLowerCase();
    const rest = shouldLower ? firstChar.toLowerCase() + s.slice(1) : s;
    return 'Verify ' + rest;
  },

  // Seeded from default_checks.md (with "Verify " at the beginning and no final periods)
  ELEMENT_TEMPLATES: {
    'Text field': [
      'Verify the field allows to enter characters',
      'Verify the field accepts a valid number of characters',
      'Verify the field accepts different data formats',
      'Verify the field accepts tags and scripts input without executing them',
      'Verify the field accepts SQL injections without executing them',
      'Verify the field accepts input of special characters',
      'Verify the field is in focus if it is the first field in a form when the form is opened',
      'Verify the text is correctly distributed by lines',
      'Verify the field allows copy-paste (Ctrl+C / Ctrl+V)',
      'Verify the form cannot be submitted if required fields are empty',
      'Verify the field checks the uniqueness of data',
      'Verify input value with spaces only is treated by the system as an empty field',
      'Verify spaces at the beginning and at the end of the line are truncated after saving',
      'Verify spaces within a text fragment are not truncated',
      'Verify the Tab key moves focus to other fields',
      'Verify using the Tab key to move focus skips disabled fields'
    ],
    'Link': [
      'Verify link redirects to appropriate page',
      'Verify hovering the mouse pointer over the link displays a tooltip',
      'Verify link and prefix formats',
      'Verify link is triggered only when clicking on the link itself, and not on the empty area around it'
    ],
    'Button': [
      'Verify clicking a button invokes the action or event associated with it',
      'Verify clicking the button quickly several times in a row doesn\'t invoke the same action several times',
      'Verify the button is disabled if the action associated with it is not available',
      'Verify clicking the space between closely located buttons does not invoke any actions',
      'Verify clicking the space around the button does not invoke any actions'
    ],
    'Checkbox': [
      'Verify the checkbox can be selected and unselected',
      'Verify the presence of an additional checkbox that selects / unselects all checkboxes when there are more than 10 checkboxes',
      'Verify moving to the next page and returning does not reset the selection',
      'Verify there isn\'t table sorting by a column that contains only checkboxes'
    ],
    'Radio button': [
      'Verify the radio button can be selected and unselected',
      'Verify there is a minimum of two radio buttons in the group',
      'Verify one radio button option is preselected by default',
      'Verify only 1 radio button option can be selected at a time',
      'Verify navigating to the next page and back does not unselect the button'
    ],
    'Dropdown': [
      'Verify ability to select a value from the list with the mouse pointer or keyboard arrows',
      'Verify selecting a list item by pressing the corresponding first letter on the keyboard is possible',
      'Verify ability to select multiple values for a combo box if expected by requirements',
      'Verify ability to enter values manually if expected by requirements',
      'Verify list is sorted alphabetically or by function',
      'Verify a default value is displayed',
      'Verify interaction with other fields and lists'
    ],
    'Other': []
  },

  // Seeded from mobile_default_module.md (with "Verify " at the beginning and no final periods)
  MOBILE_DEFAULT_MODULE: {
    name: 'General mobile checks',
    submodules: [
      {
        name: 'The app\'s life cycle',
        functionalities: [
          {
            name: 'App installation',
            checks: [
              'Verify correct description in the store (application description, marketing materials, privacy policy, owner contacts)',
              'Verify the installation of the application starts after tapping the button confirming the installation',
              'Verify reinstalling the application after uninstalling it',
              'Verify installing an application using a mobile network/wireless connection',
              'Verify checking the list of used permissions after installing the application',
              'Verify checking the app icon and name after installation',
              'Verify installing the application in case of insufficient of free space in the device memory',
              'Verify installing the app on an unsupported version of Android/iOS',
              'Verify application installs without errors when the device meets the system requirements',
              'Verify installing the application with / without SD card',
              'Verify application profile is displayed in the device settings after installation',
              'Verify transferring the application to the SD card and back to the device memory'
            ]
          },
          {
            name: 'Application launching and work',
            checks: [
              'Verify the time the application was first launched (additional checks will depend on the type of connection)',
              'Verify display loading indicator when the application starts, the display time does not exceed the value from the specification (if any)',
              'Verify launching the application after minimizing to the system tray',
              'Verify launching an application after a forced shutdown',
              'Verify application running in the background (less consumption of CPU, RAM, battery)',
              'Verify checking the speed of the application',
              'Verify how an application works after launching another application',
              'Verify how applications work when the device memory is full',
              'Verify application works correctly on various supported devices and OS'
            ]
          },
          {
            name: 'Application uninstallation',
            checks: [
              'Verify the absence of any application data on the device (folders, files, shortcuts) after deleting the application from the system',
              'Verify deleting user data (data reset, clearing cache)',
              'Verify checking the correct operation of the device after uninstalling the application',
              'Verify if the application uses user data (contact list, storage, etc.) deleting the app will not affect the user\'s data on the device'
            ]
          },
          {
            name: 'Application update',
            checks: [
              'Verify support update/auto update function',
              'Verify saving user data and settings after updating the application',
              'Verify launching and checking the correct work of the application after the update',
              'Verify after the update, the app\'s version number has been updated',
              'Verify checking the application\'s work during/after updating a third-party application'
            ]
          }
        ]
      },
      {
        name: 'Screen orientation',
        functionalities: [
          {
            name: 'Application functionality in a specific screen orientation',
            checks: [
              'Verify portrait (application functionality in portrait orientation must be fully accessible)',
              'Verify landscape (application functionality in landscape orientation must be fully accessible)',
              'Verify change the screen orientation by 90° (at startup, in open and background states)',
              'Verify change the screen orientation by 180° (at startup, in open and background states)'
            ]
          }
        ]
      },
      {
        name: 'Connection',
        functionalities: [
          {
            name: 'Working with different connection types',
            checks: [
              'Verify application works without an Internet connection',
              'Verify application works with an unstable Internet connection',
              'Verify application works when using EDGE (slow connection speed)',
              'Verify application works when using 3G/LTE (fast connection speed)',
              'Verify application works when using Wi-Fi (slow connection speed)',
              'Verify application works when using Wi-Fi (fast connection speed)',
              'Verify application works when using Wi-Fi requires authentication',
              'Verify application works when turning on/off airplane mode',
              'Verify application works when the access hotspot is enabled',
              'Verify application works with enabled/disabled GPS',
              'Verify application works with enabled/disabled Bluetooth',
              'Verify application works when changing connection type (Wi-Fi | EDGE | 3G | LTE | Wi-Fi)'
            ]
          }
        ]
      },
      {
        name: 'Device settings',
        functionalities: [
          {
            name: 'Checking that the main functionality of the application does not depend on device settings',
            checks: [
              'Verify change the time zone on the device',
              'Verify change the language and region on the device',
              'Verify change the date on the device',
              'Verify application work with Don\'t keep activities enabled (for Android)',
              'Verify application work with Background process limit enabled (for Android)',
              'Verify application work when using WebView implementation (for Android)',
              'Verify application work when changing the time format on the device'
            ]
          }
        ]
      },
      {
        name: 'Redirection',
        functionalities: [
          {
            name: 'Check the redirect from an app or web-resource',
            checks: [
              'Verify check redirection from application to web-resource',
              'Verify check redirection from web-resource to application',
              'Verify check redirection from application to another application',
              'Verify check redirection with 500 internal server error response',
              'Verify check redirection with 404 not found response',
              'Verify check smart link redirection based on device/user status (iOS/Android/WEB/new user/etc)'
            ]
          }
        ]
      },
      {
        name: 'Interruptions',
        functionalities: [
          {
            name: 'Messages, calls, notifications, sleep mode, screen lock',
            checks: [
              'Verify application work when sending and receiving SMS/MMS',
              'Verify application work when sending and receiving email',
              'Verify application work when receiving notifications from other applications',
              'Verify application work when entering / exiting the standby mode',
              'Verify application work when locking / unlocking the screen (default unlock, password entry, Touch / Face ID)',
              'Verify application work when receiving notifications about low battery, updates available',
              'Verify application work after incoming/outgoing call'
            ]
          },
          {
            name: 'External influence',
            checks: [
              'Verify removing / inserting a SIM card',
              'Verify connecting / disconnecting the charger',
              'Verify application work, user data safety after the device is completely discharged',
              'Verify application work with antivirus enabled (for Android)',
              'Verify application work when connected/disconnected to another device via USB',
              'Verify removing / inserting a memory card'
            ]
          }
        ]
      },
      {
        name: 'User interface',
        functionalities: [
          {
            name: 'Graphical user interface, navigation and usability',
            checks: [
              'Verify the app\'s GUI complies with the Apple Human Interface Guidelines for iOS and the Google Material Design System for Android',
              'Verify display notifications in the application',
              'Verify scrolling lists, pages (correct display at high scrolling speed, when the end / beginning of the list is reached)',
              'Verify visual quality (buttons size; content placement; uniformity of elements that perform the same function in the application, etc.)',
              'Verify availability of loading indicators if the content comes to the application from third-party systems',
              'Verify correct display of application content on devices of different models and different screen sizes',
              'Verify there are no spelling errors in the application',
              'Verify checking application content when zooming in/out',
              'Verify the ability to return or cancel the action in case of tapping the wrong button in the application',
              'Verify checking the optimal font size in the application',
              'Verify checking that short sentences/paragraphs are readable by the user',
              'Verify checking if there is a manual in the application that will help the user to use the application effectively',
              'Verify checking the possibility of changing / saving application settings by the user',
              'Verify application work when using the hardware buttons of the device',
              'Verify checking the application performance when using dark/light themes',
              'Verify checking of WebView work in the application (if added during implementation)',
              'Verify checking for placeholders in search fields',
              'Verify availability of animation when transitioning between elements / screens of the application (pop-up messages, windows, animation duration, etc.)',
              'Verify highlighting inactive elements with a color different from active ones (for example: a gray "Sign In" button in case with empty username/password fields on the login screen)',
              'Verify checking that the application supports basic gestures when running'
            ]
          }
        ]
      },
      {
        name: 'Language',
        functionalities: [
          {
            name: 'Language settings and localization',
            checks: [
              'Verify the functionality of the application remains unchanged when changing the language',
              'Verify there are no grammatical errors when changing language',
              'Verify all elements are translated into the appropriate language',
              'Verify correct display of date formats (yyyy-mm-dd, dd-mm-yyyy)',
              'Verify correct display of international characters, units of measurement, telephone numbers, addresses, etc'
            ]
          }
        ]
      },
      {
        name: 'Performance',
        functionalities: [
          {
            name: 'Application speed and performance',
            checks: [
              'Verify the power consumption of the device while using the application is within the normal range',
              'Verify application loading time',
              'Verify request processing time in the application',
              'Verify checking cached application data',
              'Verify application multitasking and impact on other device functions',
              'Verify checking the application performance during prolonged use',
              'Verify check application performance under stressful conditions (changes in database size, large number of users, etc.)',
              'Verify restoring the application after a heavy load (the functionality of the application remains unchanged after a forced shutdown by the system)',
              'Verify application status/User status (the application should not leave any processes running in the background, unless required by the requirements)',
              'Verify the speed and stability of the application (no freezes, crashes, delays, etc.)',
              'Verify application work in the absence of functions supported by the application on the device (LTE, SD card, etc.)',
              'Verify checking shared resources (if several applications use the same database, the data must be correctly synchronized in all applications)'
            ]
          }
        ]
      },
      {
        name: 'Media',
        functionalities: [
          {
            name: 'Work media and audio',
            checks: [
              'Verify application work when playing audio on the device, as well as playing the sound of the application itself',
              'Verify play video and check device performance',
              'Verify play audio via Bluetooth/headset when connected',
              'Verify checking the functionality of turning on / off the sound',
              'Verify audio/video playback when connected to third party devices',
              'Verify the function of controlling sound / video using the hardware buttons of the device / headset / connected devices'
            ]
          }
        ]
      },
      {
        name: 'Notifications',
        functionalities: [
          {
            name: 'Checking the functionality of notifications in the app',
            checks: [
              'Verify checking the notification about sending notifications by the application after installation (for iOS)',
              'Verify check that notifications are received for each configured event when the application is active',
              'Verify check that notifications are received for each configured event when the application is minimized to the system tray',
              'Verify check that notifications are received for each configured event when the application is closed',
              'Verify check that notifications can be turned on/off in the app settings',
              'Verify check that notifications appear in the Notification center',
              'Verify check that tapping notification redirects the user to the app to the appropriate page',
              'Verify check that after opening a notification, it is not displayed in the Notification Center'
            ]
          }
        ]
      },
      {
        name: 'Functionality',
        functionalities: [
          {
            name: 'Functionality',
            checks: [
              'Verify check the main functionality of the application (all specific functions of the application related to the operation of algorithms, calculations, measurements, calculations, etc. must be implemented correctly)',
              'Verify that the required fields work correctly and have the mandatory designation',
              'Verify if there is paid functionality, check that the application supports payment transactions through various systems (Visa, Mastercard, PayPal, etc.)',
              'Verify when integrating with social networks, check how the main options work (share, publish, etc.)',
              'Verify check navigation between main modules of the application',
              'Verify the application uses time from the server, not from the device to work (requirements may vary, depending on the requirements of the application)',
              'Verify check error messages (network error, operation error, etc.)'
            ]
          }
        ]
      },
      {
        name: 'Data handling',
        functionalities: [
          {
            name: 'Data control (saving, using, deleting)',
            checks: [
              'Verify saving game/session state',
              'Verify delete app data in Settings',
              'Verify clear cache in Settings',
              'Verify saving user data in the application (documents, photos, etc.)',
              'Verify multiple format input handling',
              'Verify multiple display format handling',
              'Verify option to delete user account (for iOS)'
            ]
          }
        ]
      },
      {
        name: 'Security',
        functionalities: [
          {
            name: 'The app is security compliant',
            checks: [
              'Verify data encryption (passwords, mail, etc. are not transmitted in clear text in application logs)',
              'Verify logins, passwords, bank card numbers are protected from network attacks and cannot be found by brute force',
              'Verify access to personal content is not possible without authentication',
              'Verify the application requires a strong password for the user account',
              'Verify checking the validity period of application SSL certificates',
              'Verify when adding permissions in the new version of the application that did not exist before, check that they will be disabled in the application settings after the update',
              'Verify the timeout of the session/operations in the application corresponds to the set time frame'
            ]
          }
        ]
      },
      {
        name: 'Privacy, Content & Policies',
        functionalities: [
          {
            name: 'The application contains information about its policy & user rights',
            checks: [
              'Verify privacy policy and guarantees for the preservation of user information (what personal information and for what purpose the application collects)',
              'Verify the presence of an application category and age restrictions',
              'Verify the absence of invalid advertising in the social. networks and ads'
            ]
          }
        ]
      },
      {
        name: 'Power-saving mode',
        functionalities: [
          {
            name: 'Application running in the power-saving mode',
            checks: [
              'Verify application work when the battery is low',
              'Verify application work when the power-saving enabled/disabled',
              'Verify application work with active Doze Mode (for Android)',
              'Verify application work with active App Standby (for Android)',
              'Verify application work with active Background restrictions (for Android 9+)',
              'Verify application work with active Battery saver improvements (for Android 9+)'
            ]
          }
        ]
      },
      {
        name: 'Authorization using social networks',
        functionalities: [
          {
            name: 'Authorization and operation of the application when using an account of a third-party social networks/accounts',
            checks: [
              'Verify authorization in the application when the native application of the social. network is installed on the device (the user is logged in/not logged in to the app)',
              'Verify authorization in the application when the native application of the social. network is not installed on the device (the user is logged in / not logged in to the social network site)',
              'Verify access to social account network is permitted only according to described permissions and actions',
              'Verify the correct data is imported from the social network account (name, date of birth, etc.)',
              'Verify sign in to the application with Google account',
              'Verify sign in to the application with Apple ID'
            ]
          }
        ]
      },
      {
        name: 'Hardware',
        functionalities: [
          {
            name: 'Check the application with connected external devices',
            checks: [
              'Verify application work with connected input devices (mouse, keyboard, etc.). (checking the input of information - numbers, letters, special characters, emoji)',
              'Verify application work with connected Bluetooth-headset/headphones',
              'Verify application work with connected wired headsets/headphones',
              'Verify application work when connecting smart devices (watches, bracelets, etc.)'
            ]
          }
        ]
      }
    ]
  }
};
