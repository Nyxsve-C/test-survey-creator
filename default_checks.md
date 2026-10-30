# Text field
1. Functionality
1.1 The field allows to enter characters
1.2 The field accepts a valid number of characters
1.3 The field accepts different data formats
1.4 The field accepts tags and scripts input without executing them
1.5 The field accepts SQL injections without executing them
1.6 The field accepts input of special characters
1.7 The field is in focus if it is the first field in a form when the form is opened
1.8 The text is correctly distributed by lines
1.9 The field allows copy-paste (Ctrl+C / Ctrl+V)
2. Validation
2.1 The form cannot be submitted if required fields are empty.
2.2 The field checks the uniqueness of data
3. Spaces usage
3.1 Input value with spaces only is treated by the system as an empty field
3.2 Spaces at the beginning and at the end of the line should be truncated after saving
3.3 Spaces within a text fragment should not be truncated.
4. Tabulation
4.1 The Tab key moves focus to other fields
4.2 Using the Tab key to move focus skips disabled fields

# Link
1.1 Link redirects to appropriate page
1.2 Hovering the mouse pointer over the link displayes a tooltip
1.3 Link and prefix formats
1.4 Link is triggered only when clicking on the link itself, and not on the empty area around it

# Button
1.1 Clicking a button invokes the action or event associated with it
1.2 Clicking the button quickly several times in a row doesn't invoke the same action several times
1.3 The button is disabled if the action assotiated with it is not available
1.4 Clicking the space between closely located buttons does not invoke any actions
1.5 Clicking the space around the button does not invoke any actions

# Checkbox
1.1 The checkbox can be selectd and unselected
1.2 The presence of an additional checkbox that selects / unselects all checkboxes when there are more than 10 checkboxes
1.3 When moving to the next page and returning back, the selected checkbox should not be reset
1.4 There shouldn't be table sorting by a column that contains only checkboxes

# Radio button
1.1 The radio button can be selected and unselected
1.2 Minimum radio button options available - 2
1.3 One radio button option is preselected by default
1.4 Only 1 radio button option can be selected at a time
1.5 Navigating to the next page and back does not unselect the button

# Dropdown
1.1 Ability to select a value from the list with the mouse pointer or keyboard arrows
1.2 Selecting a list item by pressing the corresponding first letter on the keyboard
1.3 Ability to select multiple values ​​for a combo box if expected by requirements
1.4 Ability to enter values ​​manually if expected by requirements
1.5 Sorting should be done alphabetically or by function.
1.6 Displaying a default value
1.7 Interaction with other fields and lists
