// Default element types, test types, locked GUI rule, and seeded default checks from default_checks.md
window.Defaults = {
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
  }
};
