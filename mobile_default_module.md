# The app's life cycle
## App installation
- Correct description in the store (application description, marketing materials, privacy policy, owner contacts).
- The installation of the application starts after tapping the button confirming the installation.
- Reinstalling the application after uninstalling it.
- Installing an application using a mobile network/wireless connection.
- Checking the list of used permissions after installing the application.
- Checking the app icon and name after installation.
- Installing the application in case of insufficient of free space in the device memory.
- Installing the app on an unsupported version of Android/iOS.
- Application installs without errors when the device meets the system requirements
- Installing the application with / without SD card.
- Application profile is displayed in the device settings after installation.
- Transferring the application to the SD card and back to the device memory.
## Application launching and work
- The time the application was first launched (additional checks will depend on the type of connection).
- Display loading indicator when the application starts, the display time does not exceed the value from the specification (if any).
- Launching the application after minimizing to the system tray.
- Launching an application after a forced shutdown.
- Application running in the background (less consumption of CPU, RAM, battery).
- Checking the speed of the application.
- How an application works after launching another application.
- How applications work when the device memory is full.
- Application works correctly on various supported devices and OS.
## Application uninstallation
- The absence of any application data on the device (folders, files, shortcuts) after deleting the application from the system
- Deleting user data (data reset, clearing cache).
- Checking the correct operation of the device after uninstalling the application.
- If the application uses user data (contact list, storage, etc.) deleting the app will not affect the user's data on the device.
## Application update
- Support update/auto update function.
- Saving user data and settings after updating the application.
- Launching and checking the correct work of the application after the update.
- After the update, the app's version number has been updated.
- Checking the application's work during/after updating a third-party application.
# Screen orientation
## Application functionality in a specific screen orientation
- Portrait (application functionality in portrait orientation must be fully accessible).
- Landscape (application functionality in landscape orientation must be fully accessible).
- Change the screen orientation by 90° (at startup, in open and background states).
- Change the screen orientation by 180° (at startup, in open and background states).
# Connection
## Working with different connection types
- Application works without an Internet connection.
- Application works with an unstable Internet connection.
- Application works when using EDGE (slow connection speed).
- Application works when using 3G/LTE (fast connection speed).
- Application works when using Wi-Fi (slow connection speed).
- Application works when using Wi-Fi (fast connection speed).
- Application works when using Wi-Fi requires authentication.
- Application works when turning on/off airplane mode.
- Application works when the access hotspot is enabled.
- Application works with enabled/disabled GPS.
- Application works with enabled/disabled Bluetooth.
- Application works when changing connection type (Wi-Fi | EDGE | 3G | LTE | Wi-Fi).
# Device settings
## Checking that the main functionality of the application does not depend on device settings
- Change the time zone on the device.
- Change the language and region on the device.
- Change the date on the device.
- Application work with Don't keep activities enabled (for Android).
- Application work with Background process limit enabled (for Android).
- Application work when using WebView implementation (for Android).
- Application work when changing the time format on the device.
# Redirection
## Check the redirect from an app or web-resource
- Check redirection from application to web-resource.
- Check redirection from web-resource to application.
- Check redirection from application to another application.
- Check redirection with 500 internal server error response.
- Check redirection with 404 not found response.
- Check smart link redirection based on device/user status (iOS/Android/WEB/new user/etc).
# Interruptions
## Messages, calls, notifications, sleep mode, screen lock
- Application work when sending and receiving SMS/MMS.
- Application work when sending and receiving email.
- Application work when receiving notifications from other applications.
- Application work when entering / exiting the standby mode.
- Application work when locking / unlocking the screen (default unlock, password entry, Touch / Face ID).
- Application work when receiving notifications about low battery, updates available.
- Application work after incoming/outgoing call.
## External influence
- Removing / inserting a SIM card.
- Connecting / disconnecting the charger.
- Application work, user data safety after the device is completely discharged.
- Application work with antivirus enabled (for Android).
- Application work when connected/disconnected to another device via USB.
- Removing / inserting a memory card.
# User interface
## Graphical user interface, navigation and usability
- The app's GUI complies with the Apple Human Interface Guidelines for iOS and the Google Material Design System for Android.
- Display notifications in the application.
- Scrolling lists, pages (correct display at high scrolling speed, when the end / beginning of the list is reached).
- Visual quality (buttons size; content placement; uniformity of elements that perform the same function in the application, etc.).
- Availability of loading indicators if the content comes to the application from third-party systems.
- Correct display of application content on devices of different models and different screen sizes.
- There are no spelling errors in the application.
- Checking application content when zooming in/out.
- The ability to return or cancel the action in case of tapping the wrong button in the application.
- Checking the optimal font size in the application.
- Checking that short sentences/paragraphs are readable by the user.
- Checking if there is a manual in the application that will help the user to use the application effectively.
- Checking the possibility of changing / saving application settings by the user.
- Application work when using the hardware buttons of the device.
- Checking the application performance when using dark/light themes.
- Checking of WebView work in the application (if added during implementation).
- Checking for placeholders in search fields.
- Availability of animation when transitioning between elements / screens of the application (pop-up messages, windows, animation duration, etc.).
- Highlighting inactive elements with a color different from active ones (for example: a gray "Sign In" button in case with empty username/password fields on the login screen).
- Checking that the application supports basic gestures when running.
# Language
## Language settings and localization
- The functionality of the application remains unchanged when changing the language.
- There are no grammatical errors when changing language.
- All elements are translated into the appropriate language.
- Correct display of date formats (yyyy-mm-dd, dd-mm-yyyy).
- Correct display of international characters, units of measurement, telephone numbers, addresses, etc.
# Performance
## Application speed and performance
- The power consumption of the device while using the application is within the normal range.
- Application loading time.
- Request processing time in the application.
- Checking cached application data.
- Application multitasking and impact on other device functions.
- Checking the application performance during prolonged use.
- Check application performance under stressful conditions (changes in database size, large number of users, etc.).
- Restoring the application after a heavy load (the functionality of the application remains unchanged after a forced shutdown by the system).
- Application status/User status (the application should not leave any processes running in the background, unless required by the requirements).
- The speed and stability of the application (no freezes, crashes, delays, etc.).
- Application work in the absence of functions supported by the application on the device (LTE, SD card, etc.).
- Checking shared resources (if several applications use the same database, the data must be correctly synchronized in all applications).
# Media
## Work media and audio
- Application work when playing audio on the device, as well as playing the sound of the application itself.
- Play video and check device performance.
- Play audio via Bluetooth/headset when connected.
- Checking the functionality of turning on / off the sound.
- Audio/video playback when connected to third party devices.
- The function of controlling sound / video using the hardware buttons of the device / headset / connected devices.
# Notifications
## Checking the functionality of notifications in the app
- Checking the notification about sending notifications by the application after installation (for iOS).
- Check that notifications are received for each configured event when the application is active.
- Check that notifications are received for each configured event when the application is minimized to the system tray.
- Check that notifications are received for each configured event when the application is closed.
- Check that notifications can be turned on/off in the app settings.
- Check that notifications appear in the Notification center.
- Check that tapping notification redirects the user to the app to the appropriate page.
- Check that after opening a notification, it is not displayed in the Notification Center.
# Functionality
## Functionality
- Check the main functionality of the application (all specific functions of the application related to the operation of algorithms, calculations, measurements, calculations, etc. must be implemented correctly).
- Verify that the required fields work correctly and have the mandatory designation.
- If there is paid functionality, check that the application supports payment transactions through various systems (Visa, Mastercard, PayPal, etc.).
- When integrating with social networks, check how the main options work (share, publish, etc.).
- Check navigation between main modules of the application.
- The application uses time from the server, not from the device to work (requirements may vary, depending on the requirements of the application).
- Check error messages (network error, operation error, etc.).
# Data handling
## Data control (saving, using, deleting)
- Saving game/session state.
- Delete app data in Settings.
- Clear cache in Settings.
- Saving user data in the application (documents, photos, etc.).
- Multiple format input handling.
- Multiple display format handling.
- Option to delete user account (for iOS).
# Security
## The app is security compliant
- Data encryption (passwords, mail, etc. are not transmitted in clear text in application logs).
- Logins, passwords, bank card numbers are protected from network attacks and cannot be found by brute force.
- Access to personal content is not possible without authentication.
- The application requires a strong password for the user account.
- Checking the validity period of application SSL certificates.
- When adding permissions in the new version of the application that did not exist before, check that they will be disabled in the application settings after the update.
- The timeout of the session/operations in the application corresponds to the set time frame.
# Privacy, Content & Policies
## The application contains information about its policy & user rights
- Privacy policy and guarantees for the preservation of user information (what personal information and for what purpose the application collects).
- The presence of an application category and age restrictions.
- The absence of invalid advertising in the social. networks and ads.
# Power-saving mode
## Application running in the power-saving mode
- Application work when the battery is low.
- Application work when the power-saving enabled/disabled.
- Application work with active Doze Mode (for Android).
- Application work with active App Standby (for Android).
- Application work with active Background restrictions (for Android 9+).
- Application work with active Battery saver improvements (for Android 9+).
# Authorization using social networks
## Authorization and operation of the application when using an account of a third-party social networks/accounts
- Authorization in the application when the native application of the social. network is installed on the device (the user is logged in/not logged in to the app).
- Authorization in the application when the native application of the social. network is not installed on the device (the user is logged in / not logged in to the social network site).
- Access to social account network is permitted only according to described permissions and actions.
- The correct data is imported from the social network account (name, date of birth, etc.).
- Sign in to the application with Google account.
- Sign in to the application with Apple ID.
# Hardware
## Check the application with connected external devices
- Application work with connected input devices (mouse, keyboard, etc.). (checking the input of information - numbers, letters, special characters, emoji).
- Application work with connected Bluetooth-headset/headphones.
- Application work with connected wired headsets/headphones.
- Application work when connecting smart devices (watches, bracelets, etc.).