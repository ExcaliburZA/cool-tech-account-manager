# Cool Tech account manager
## A full stack web-based credential management application for fictitious company, Cool Tech

To register an account simply enter a username and password and click Register. Please note that usernames must be unique.

To log in enter your account information in the fields provided and select Login
![Login page](login.PNG)

From here you can select an organisational unit to view the divisions for. Please note that you will only have access to organisational units that have your username whitelisted.
![Organisational unit selection](ou_selection.PNG)

From here you can select a division to view the credentials repository for. The same access restrictions are applied here as to the organisational units.

![Division selection](div_selection.PNG)

NOTE: admin users have access to all divisions and organisational units

Once a division has been selected the credentials repository will be displayed along with a series of controls that can be used to perform various update operations. These controls are dependent on the role of the currently logged in user account. Current permission level is displayed at the bottom of the page.

The repository view pages for normal, manager, and admin users are shown below.

NORMAL

![Normal user](reg_user.PNG)


MANAGER

![Manager user](manager_user.PNG)


ADMIN

![Admin user](admin_user.PNG)

To add a new account to the repository enter it's information in the top most input fields above and click the 'Add credentials to repo' button. All accounts belonging to the division are able to do this.

To update an account in the repository enter its username in the field above the 'Update credentials' button and click the 'Update credentials' button. From there you will be prompted to enter the updated information for the account.

To add or remove a user from an organisational unit or division simply enter their username in the bottom most input field above the 'Update role' button and select one of the appropriately labelled buttons below depending on the type of update you wish to perform.

To edit a user's role as an admin simply enter their username in the bottom most input field above the 'Update role' button and click the 'Update role' button. From there you will be prompted to enter a new role for the user. Please select either 'normal' , 'manager' , or 'admin'.

To delete a user simply enter their username in the bottom most input field above the 'Update role' button and click the 'Delete user' button.
