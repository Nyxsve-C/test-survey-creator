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

  // Seeded from default_checks.md (flat list per element type, numbering dropped, typos fixed)
  ELEMENT_TEMPLATES: {
    'Text field': [
      'The field allows to enter characters',
      'The field accepts a valid number of characters',
      'The field accepts different data formats',
      'The field accepts tags and scripts input without executing them',
      'The field accepts SQL injections without executing them',
      'The field accepts input of special characters',
      'The field is in focus if it is the first field in a form when the form is opened',
      'The text is correctly distributed by lines',
      'The field allows copy-paste (Ctrl+C / Ctrl+V)',
      'The form cannot be submitted if required fields are empty',
      'The field checks the uniqueness of data',
      'Input value with spaces only is treated by the system as an empty field',
      'Spaces at the beginning and at the end of the line should be truncated after saving',
      'Spaces within a text fragment should not be truncated',
      'The Tab key moves focus to other fields',
      'Using the Tab key to move focus skips disabled fields'
    ],
    'Link': [
      'Link redirects to appropriate page',
      'Hovering the mouse pointer over the link displays a tooltip',
      'Link and prefix formats',
      'Link is triggered only when clicking on the link itself, and not on the empty area around it'
    ],
    'Button': [
      'Clicking a button invokes the action or event associated with it',
      'Clicking the button quickly several times in a row doesn\'t invoke the same action several times',
      'The button is disabled if the action associated with it is not available',
      'Clicking the space between closely located buttons does not invoke any actions',
      'Clicking the space around the button does not invoke any actions'
    ],
    'Checkbox': [
      'The checkbox can be selected and unselected',
      'The presence of an additional checkbox that selects / unselects all checkboxes when there are more than 10 checkboxes',
      'When moving to the next page and returning back, the selected checkbox should not be reset',
      'There shouldn\'t be table sorting by a column that contains only checkboxes'
    ],
    'Radio button': [
      'The radio button can be selected and unselected',
      'Minimum radio button options available - 2',
      'One radio button option is preselected by default',
      'Only 1 radio button option can be selected at a time',
      'Navigating to the next page and back does not unselect the button'
    ],
    'Dropdown': [
      'Ability to select a value from the list with the mouse pointer or keyboard arrows',
      'Selecting a list item by pressing the corresponding first letter on the keyboard',
      'Ability to select multiple values for a combo box if expected by requirements',
      'Ability to enter values manually if expected by requirements',
      'Sorting should be done alphabetically or by function',
      'Displaying a default value',
      'Interaction with other fields and lists'
    ],
    'Other': []
  },

  // Seeded from mobile_default_module.md for Mobile App Testing projects
  MOBILE_DEFAULT_MODULE: {
    name: 'General mobile checks',
    submodules: [
      {
        name: 'The app\'s life cycle',
        functionalities: [
          {
            name: 'App installation',
            checks: [
              'Correct description in the store (application description, marketing materials, privacy policy, owner contacts).',
              'The installation of the application starts after tapping the button confirming the installation.',
              'Reinstalling the application after uninstalling it.',
              'Installing an application using a mobile network/wireless connection.',
              'Checking the list of used permissions after installing the application.',
              'Checking the app icon and name after installation.',
              'Installing the application in case of insufficient of free space in the device memory.',
              'Installing the app on an unsupported version of Android/iOS.',
              'Application installs without errors when the device meets the system requirements',
              'Installing the application with / without SD card.',
              'Application profile is displayed in the device settings after installation.',
              'Transferring the application to the SD card and back to the device memory.'
            ]
          },
          {
            name: 'Application launching and work',
            checks: [
              'The time the application was first launched (additional checks will depend on the type of connection).',
              'Display loading indicator when the application starts, the display time does not exceed the value from the specification (if any).',
              'Launching the application after minimizing to the system tray.',
              'Launching an application after a forced shutdown.',
              'Application running in the background (less consumption of CPU, RAM, battery).',
              'Checking the speed of the application.',
              'How an application works after launching another application.',
              'How applications work when the device memory is full.',
              'Application works correctly on various supported devices and OS.'
            ]
          },
          {
            name: 'Application uninstallation',
            checks: [
              'The absence of any application data on the device (folders, files, shortcuts) after deleting the application from the system',
              'Deleting user data (data reset, clearing cache).',
              'Checking the correct operation of the device after uninstalling the application.',
              'If the application uses user data (contact list, storage, etc.) deleting the app will not affect the user\'s data on the device.'
            ]
          },
          {
            name: 'Application update',
            checks: [
              'Support update/auto update function.',
              'Saving user data and settings after updating the application.',
              'Launching and checking the correct work of the application after the update.',
              'After the update, the app\'s version number has been updated.',
              'Checking the application\'s work during/after updating a third-party application.'
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
              'Portrait (application functionality in portrait orientation must be fully accessible).',
              'Landscape (application functionality in landscape orientation must be fully accessible).',
              'Change the screen orientation by 90° (at startup, in open and background states).',
              'Change the screen orientation by 180° (at startup, in open and background states).'
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
              'Application works without an Internet connection.',
              'Application works with an unstable Internet connection.',
              'Application works when using EDGE (slow connection speed).',
              'Application works when using 3G/LTE (fast connection speed).',
              'Application works when using Wi-Fi (slow connection speed).',
              'Application works when using Wi-Fi (fast connection speed).',
              'Application works when using Wi-Fi requires authentication.',
              'Application works when turning on/off airplane mode.',
              'Application works when the access hotspot is enabled.',
              'Application works with enabled/disabled GPS.',
              'Application works with enabled/disabled Bluetooth.',
              'Application works when changing connection type (Wi-Fi | EDGE | 3G | LTE | Wi-Fi).'
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
              'Change the time zone on the device.',
              'Change the language and region on the device.',
              'Change the date on the device.',
              'Application work with Don\'t keep activities enabled (for Android).',
              'Application work with Background process limit enabled (for Android).',
              'Application work when using WebView implementation (for Android).',
              'Application work when changing the time format on the device.'
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
              'Check redirection from application to web-resource.',
              'Check redirection from web-resource to application.',
              'Check redirection from application to another application.',
              'Check redirection with 500 internal server error response.',
              'Check redirection with 404 not found response.',
              'Check smart link redirection based on device/user status (iOS/Android/WEB/new user/etc).'
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
              'Application work when sending and receiving SMS/MMS.',
              'Application work when sending and receiving email.',
              'Application work when receiving notifications from other applications.',
              'Application work when entering / exiting the standby mode.',
              'Application work when locking / unlocking the screen (default unlock, password entry, Touch / Face ID).',
              'Application work when receiving notifications about low battery, updates available.',
              'Application work after incoming/outgoing call.'
            ]
          },
          {
            name: 'External influence',
            checks: [
              'Removing / inserting a SIM card.',
              'Connecting / disconnecting the charger.',
              'Application work, user data safety after the device is completely discharged.',
              'Application work with antivirus enabled (for Android).',
              'Application work when connected/disconnected to another device via USB.',
              'Removing / inserting a memory card.'
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
              'The app\'s GUI complies with the Apple Human Interface Guidelines for iOS and the Google Material Design System for Android.',
              'Display notifications in the application.',
              'Scrolling lists, pages (correct display at high scrolling speed, when the end / beginning of the list is reached).',
              'Visual quality (buttons size; content placement; uniformity of elements that perform the same function in the application, etc.).',
              'Availability of loading indicators if the content comes to the application from third-party systems.',
              'Correct display of application content on devices of different models and different screen sizes.',
              'There are no spelling errors in the application.',
              'Checking application content when zooming in/out.',
              'The ability to return or cancel the action in case of tapping the wrong button in the application.',
              'Checking the optimal font size in the application.',
              'Checking that short sentences/paragraphs are readable by the user.',
              'Checking if there is a manual in the application that will help the user to use the application effectively.',
              'Checking the possibility of changing / saving application settings by the user.',
              'Application work when using the hardware buttons of the device.',
              'Checking the application performance when using dark/light themes.',
              'Checking of WebView work in the application (if added during implementation).',
              'Checking for placeholders in search fields.',
              'Availability of animation when transitioning between elements / screens of the application (pop-up messages, windows, animation duration, etc.).',
              'Highlighting inactive elements with a color different from active ones (for example: a gray "Sign In" button in case with empty username/password fields on the login screen).',
              'Checking that the application supports basic gestures when running.'
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
              'The functionality of the application remains unchanged when changing the language.',
              'There are no grammatical errors when changing language.',
              'All elements are translated into the appropriate language.',
              'Correct display of date formats (yyyy-mm-dd, dd-mm-yyyy).',
              'Correct display of international characters, units of measurement, telephone numbers, addresses, etc.'
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
              'The power consumption of the device while using the application is within the normal range.',
              'Application loading time.',
              'Request processing time in the application.',
              'Checking cached application data.',
              'Application multitasking and impact on other device functions.',
              'Checking the application performance during prolonged use.',
              'Check application performance under stressful conditions (changes in database size, large number of users, etc.).',
              'Restoring the application after a heavy load (the functionality of the application remains unchanged after a forced shutdown by the system).',
              'Application status/User status (the application should not leave any processes running in the background, unless required by the requirements).',
              'The speed and stability of the application (no freezes, crashes, delays, etc.).',
              'Application work in the absence of functions supported by the application on the device (LTE, SD card, etc.).',
              'Checking shared resources (if several applications use the same database, the data must be correctly synchronized in all applications).'
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
              'Application work when playing audio on the device, as well as playing the sound of the application itself.',
              'Play video and check device performance.',
              'Play audio via Bluetooth/headset when connected.',
              'Checking the functionality of turning on / off the sound.',
              'Audio/video playback when connected to third party devices.',
              'The function of controlling sound / video using the hardware buttons of the device / headset / connected devices.'
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
              'Checking the notification about sending notifications by the application after installation (for iOS).',
              'Check that notifications are received for each configured event when the application is active.',
              'Check that notifications are received for each configured event when the application is minimized to the system tray.',
              'Check that notifications are received for each configured event when the application is closed.',
              'Check that notifications can be turned on/off in the app settings.',
              'Check that notifications appear in the Notification center.',
              'Check that tapping notification redirects the user to the app to the appropriate page.',
              'Check that after opening a notification, it is not displayed in the Notification Center.'
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
              'Check the main functionality of the application (all specific functions of the application related to the operation of algorithms, calculations, measurements, calculations, etc. must be implemented correctly).',
              'Verify that the required fields work correctly and have the mandatory designation.',
              'If there is paid functionality, check that the application supports payment transactions through various systems (Visa, Mastercard, PayPal, etc.).',
              'When integrating with social networks, check how the main options work (share, publish, etc.).',
              'Check navigation between main modules of the application.',
              'The application uses time from the server, not from the device to work (requirements may vary, depending on the requirements of the application).',
              'Check error messages (network error, operation error, etc.).'
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
              'Saving game/session state.',
              'Delete app data in Settings.',
              'Clear cache in Settings.',
              'Saving user data in the application (documents, photos, etc.).',
              'Multiple format input handling.',
              'Multiple display format handling.',
              'Option to delete user account (for iOS).'
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
              'Data encryption (passwords, mail, etc. are not transmitted in clear text in application logs).',
              'Logins, passwords, bank card numbers are protected from network attacks and cannot be found by brute force.',
              'Access to personal content is not possible without authentication.',
              'The application requires a strong password for the user account.',
              'Checking the validity period of application SSL certificates.',
              'When adding permissions in the new version of the application that did not exist before, check that they will be disabled in the application settings after the update.',
              'The timeout of the session/operations in the application corresponds to the set time frame.'
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
              'Privacy policy and guarantees for the preservation of user information (what personal information and for what purpose the application collects).',
              'The presence of an application category and age restrictions.',
              'The absence of invalid advertising in the social. networks and ads.'
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
              'Application work when the battery is low.',
              'Application work when the power-saving enabled/disabled.',
              'Application work with active Doze Mode (for Android).',
              'Application work with active App Standby (for Android).',
              'Application work with active Background restrictions (for Android 9+).',
              'Application work with active Battery saver improvements (for Android 9+).'
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
              'Authorization in the application when the native application of the social. network is installed on the device (the user is logged in/not logged in to the app).',
              'Authorization in the application when the native application of the social. network is not installed on the device (the user is logged in / not logged in to the social network site).',
              'Access to social account network is permitted only according to described permissions and actions.',
              'The correct data is imported from the social network account (name, date of birth, etc.).',
              'Sign in to the application with Google account.',
              'Sign in to the application with Apple ID.'
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
              'Application work with connected input devices (mouse, keyboard, etc.). (checking the input of information - numbers, letters, special characters, emoji).',
              'Application work with connected Bluetooth-headset/headphones.',
              'Application work with connected wired headsets/headphones.',
              'Application work when connecting smart devices (watches, bracelets, etc.).'
            ]
          }
        ]
      }
    ]
  }
};
